/**
 * Created by riku_maehara on 2016/10/04.
 */
var　mysql=require('mysql');

var connection=mysql.createConnection({
    host: 'localhost',
    user: 'tweetdbuser',
    password: 'now_playing',
    database: 'now_playing'
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

module.exports = connection;