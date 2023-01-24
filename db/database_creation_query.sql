CREATE DATABASE practice_sid70;


CREATE TABLE registration_form(
	sl_no int(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name varchar(40),
    email varchar(40),
    phnumber varchar(12),
    gender ENUM('Male','Female'),
    password varchar(20)   
);

INSERT INTO `registration_form`(`name`, `email`, `phnumber`, `gender`, `password`) VALUES ('[value-2]','[value-3]','[value-4]','[value-5]','[value-6]');