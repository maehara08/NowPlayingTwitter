/**
 * Created by riku_maehara on 2016/09/19.
 */
var express = require('express');
var Twit = require('twit');
var request = require('request');
var co = require('co');
var CronJob = require('cron').CronJob;
var moment = require('moment');

var router = express.Router();
var io = require('../bin/www');
var connection = require('../util/mysql_util');
require('dotenv').config();
var T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000  // optional HTTP request timeout to apply to all requests.
});


// JavaScriptに関するつぶやきを表示する ---- (※2)
var stream = T.stream('statuses/filter', {track: 'なうぷれ,nowplaying'});
// つぶやきがあったときに呼ばれるイベントを設定 --- (※3)
stream.on('tweet', function (tw) {
    var text = tw.text;
    var user_name = tw.user.name;
    io.io.sockets.emit('msg', text);
    // console.log(user_name + "> " + text);
});

/**
 * last fm username
 */

router.get('/post', function (req, res) {
    var userName = req.session.passport.user.username;
    console.log(userName);
    connection.query(`select * from users where twitter_user_name = "${userName}"`,
        function (err, result, fields) {
            console.log(`select * from users where twitter_user_name = "${userName}"`);
            if (err) {
                console.error('error connecting: ' + err.stack);
                res.sendStatus(401);
            } else if (result.length == 0) {
                res.sendStatus(401)
            }
            else {
                // res.sendStatus(200);
                console.log("result=", result);
                console.log("fields= ", fields);
                res.redirect('/');
            }
        }
    );
});

/* GET now playing page. */
router.get('/', function (req, res, next) {
    // res.render('now-playing');
    // res.render('index', { title: 'Express' });

    // var www=require('../bin/www');
    // var io=www.io;

    console.log("get nowplaying " + req.session.passport);
    res.render('now-playing', {
        title: 'login demo',
        session: req.session.passport //passportでログイン後は、このオブジェクトに情報が格納されます。
    });
});

function selectFromDb() {
    var query = "select * from users";
    connection.query(query, function (err, result) {
        if (err) {
            console.error('error connecting: ' + err.stack);
        } else if (result.length == 0) {
            console.log("oh no!!!");
        }
        else {
            // console.log("result=", result);
            // console.log("0= ",result[0].id);
            result.forEach(function (value) {
                var last_fm_user_name = value.last_fm_user_name;
                if (last_fm_user_name == null) {
                    return;
                }
                // var twitter_user_name=value.twitter_user_name;
                var access_token = value.access_token;
                var access_token_secret = value.access_token_secret;
                postLastFm(last_fm_user_name, access_token, access_token_secret);
            });
        }
    });
}

function postLastFm(lastFmUserName, at, ats) {
    var baseUrl1 = `http://ws.audioscrobbler.com/2.0/?method=user.getweeklyalbumchart&user=rj&api_key=${process.env.LAST_FM_API_KEY}&format=json`;
    //ヘッダーを定義
    var headers = {
        'Content-Type': 'application/json'
    };

//オプションを定義
    var options = {
        headers: headers,
        json: true,
        form: {"user": `${lastFmUserName}`}
    };
    request.post(baseUrl1, options, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            var albums = body.weeklyalbumchart.album;
            tweetLastFm(at, ats, albums);
        } else {
            console.error(err);
        }
    });
}

function tweetLastFm(at, ats, albums) {
    var Tw = new Twit({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token: at,
        access_token_secret: ats,
        timeout_ms: 60 * 1000  // optional HTTP request timeout to apply to all requests.
    });
    console.log('Tweet?');
    var albumChart = "";
    for (var i = 0; i < 3; i++) {
        var  temp=albumChart;
        albumChart += (i + 1) + "." + "Album:" + albums[i].name + "-" + albums[i].artist['#text'] + " ";
        if (albumChart.length>=111){
            albumChart=temp;
        }
    }

    albumChart = "WeeklyBestAlbum♫ " + albumChart + "#TwitterScrobble";
    console.log(albumChart);
    Tw.post('statuses/update', {status:albumChart}, function (err, data, response) {
        if (err){
            console.error(err);
            return;
        }
        // console.log(response);
    });
}

var cronTime = '0 0 * * 0';
new CronJob({
    cronTime: cronTime,
    onTick: function () {
        selectFromDb();
    }, start: true
});

module.exports = router;
