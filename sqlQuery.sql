create database now_playing;

grant all on now_playing.* to tweetdbuser@localhost identified by 'now_playing';

create table users(
id int not null auto_increment primary key,
twitter_user_name varchar(255) unique,
twitter_display_name varchar(255),
last_fm_user_name varchar(255),
access_token varchar(255),
access_token_secret varchar(255),
created_at timestamp not null default current_timestamp
);

insert into users(twitter_user_name,twitter_display_name,access_token,access_token_secret) values();