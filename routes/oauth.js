/**
 * Created by riku_maehara on 2016/09/19.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');


// /oauthにアクセスした時
router.get('/', passport.authenticate('twitter'),
    function (req, res, next) {
        console.log(req, res, next);
    }
);

// /oauth/callbackにアクセスした時（Twitterログイン後）
router.get('/callback',
    passport.authenticate('twitter', {failureRedirect: '/login'}), function (req, res) {
        res.redirect('/nowplaying'); //indexへリダイレクトさせる
    });

module.exports = router;