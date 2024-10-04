-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema myTubeDB
DROP DATABASE IF EXISTS `myTubeDB`;
CREATE DATABASE IF NOT EXISTS `myTubeDB`;
USE `myTubeDB`;
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `users` ;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(128) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `username` VARCHAR(64) NOT NULL,
  `avatar` MEDIUMTEXT DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT current_timestamp,
  `updatedAt` DATETIME NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `posts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `posts` ;

CREATE TABLE IF NOT EXISTS `posts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(256) NOT NULL,
  `description` MEDIUMTEXT NOT NULL,
  `video` LONGBLOB NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT current_timestamp,
  `updatedAt` DATETIME NOT NULL DEFAULT current_timestamp,
  `thumbnail` LONGBLOB NOT NULL,
  `fk_userId` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_postAuthor_idx` (`fk_userId` ASC) VISIBLE,
  CONSTRAINT `fk_postAuthor`
    FOREIGN KEY (`fk_userId`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `comments`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `comments` ;

CREATE TABLE IF NOT EXISTS `comments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `createdAt` DATETIME NOT NULL DEFAULT current_timestamp,
  `test` TEXT NOT NULL,
  `fk_authorId` INT UNSIGNED NOT NULL,
  `updatedAt` DATETIME NOT NULL DEFAULT current_timestamp,
  `fk_postId` INT UNSIGNED NOT NULL,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  PRIMARY KEY (`id`),
  INDEX `fk_comment_author_idx` (`fk_authorId` ASC) VISIBLE,
  INDEX `fk_postId_idx` (`fk_postId` ASC) VISIBLE,
  CONSTRAINT `fk_comment_author`
    FOREIGN KEY (`fk_authorId`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_postId`
    FOREIGN KEY (`fk_postId`)
    REFERENCES `posts` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
