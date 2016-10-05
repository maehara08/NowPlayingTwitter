/**
 * Created by riku_maehara on 2016/10/04.
 */
module.exports = {

    development: {
        client: 'mysql',
        connection: {
            database: 'nowPlayingTwitter',
            user:     'nowplaying',
            password: '123abc'
        },
        migrations: {
            directory:'./db/migrations',
            tableName: 'knex_migrations'
        }
    }
};