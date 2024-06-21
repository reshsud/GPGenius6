create database gpa_login;
use gpa_login;


CREATE TABLE gpa_data (
    instance INT NOT NULL,
    EMAIL varchar(100) NOT NULL,
    class_name VARCHAR(255) NOT NULL,
    grade VARCHAR(2) NOT NULL,
    course_type VARCHAR(50) NOT NULL,
    unweighted_gpa FLOAT NOT NULL,
    weighted_gpa FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table users(
ID int auto_increment primary key,
NAME varchar(100),
EMAIL varchar(100),
PASS varchar(200)
);

show tables;

select * from users;
select * from gpa_data;
