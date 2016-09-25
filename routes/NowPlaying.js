/**
 * Created by riku_maehara on 2016/09/19.
 */
var express = require('express');
var router = express.Router();
var io=require('../bin/www');
var Twit = require('twit');


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
    io.io.sockets.emit('msg',text);
    // console.log(user_name + "> " + text);
});

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


/* GET now playing page. */
router.get('/', function (req, res, next) {
    // res.render('now-playing');
    // res.render('index', { title: 'Express' });

    // var www=require('../bin/www');
    // var io=www.io;

    res.render('now-playing', {
        title: 'login demo',
        session: req.session.passport //passportでログイン後は、このオブジェクトに情報が格納されます。
    });
});

module.exports = router;
