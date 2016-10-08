/**
 * Created by riku_maehara on 2016/09/19.
 */
var express = require('express');
var router = express.Router();
var io = require('../bin/www');
var Twit = require('twit');
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


// T.get('search/tweets', {q: '山手線', count: 30}, function (err, data) {
//     console.log(data);
//     var statuses = data['statuses'];
//     if (err) {
//         console.error("Twitter,Now Playing Error!")
//         console.error(err);
//     }
//     else {
//         for (var i = statuses.length - 1; i >= 0; i--) {
//             var user_name = statuses[i].user.name;
//             var text = statuses[i].text;
//             console.log(i + ' : ' + user_name + ' > ' + text);
//         }
//     }
// });

router.get('/post', function (req, res) {
    var userName=req.session.passport.user.username;
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
                console.log("result=" ,result);
                console.log("fields= ",fields);
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

module.exports = router;
