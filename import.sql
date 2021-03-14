CREATE DATABASE  IF NOT EXISTS `zwap_dh_db` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `zwap_dh_db`;
-- MySQL dump 10.13  Distrib 8.0.16, for Win64 (x86_64)
--
-- Host: localhost    Database: zwap_final
-- ------------------------------------------------------
-- Server version	5.7.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `default_orders`
--

DROP TABLE IF EXISTS `default_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `default_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(70) NOT NULL,
  `price` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `default_orders`
--

LOCK TABLES `default_orders` WRITE;
/*!40000 ALTER TABLE `default_orders` DISABLE KEYS */;
INSERT INTO `default_orders` VALUES (1,'Cut the Grass',100),(2,'Clean the windows',120),(3,'Take the dog for a walk',30),(4,'Fix the fence',80),(5,'Babysit the child',150);
/*!40000 ALTER TABLE `default_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offers`
--

DROP TABLE IF EXISTS `offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `offers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `description` varchar(70) NOT NULL,
  `message_company` varchar(70) DEFAULT NULL,
  `state` varchar(45) NOT NULL,
  `price` int(11) DEFAULT NULL,
  `requested_date` date NOT NULL,
  `answered_date` date DEFAULT NULL,
  `acc_rej_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offers`
--

LOCK TABLES `offers` WRITE;
/*!40000 ALTER TABLE `offers` DISABLE KEYS */;
INSERT INTO `offers` VALUES (7,2,'Clean the floor','','ACCEPTED',40,'2019-06-12','2019-06-12','2019-06-12'),(8,4,'Clean the bedroom','','ANSWERED',40,'2019-06-12','2019-06-16',NULL),(9,2,'Wash my car','','ACCEPTED',65,'2019-06-14','2019-06-14','2019-06-14'),(10,5,'Clean the garage','Monday at 10AM','ANSWERED',50,'2019-06-16','2019-06-16',NULL),(12,4,'Clean the 1st floor','I will come at 2PM','REQUESTED',45,'2019-06-16',NULL,NULL),(14,11,'Wash the dishes','At 11 AM','REJECTED',30,'2019-06-17','2019-06-17','2019-06-17'),(15,11,'Clean the 3rd floor','','ACCEPTED',40,'2019-06-17','2019-06-17','2019-06-17'),(16,5,'Fix the car','','ANSWERED',250,'2019-06-17','2019-06-17',NULL);
/*!40000 ALTER TABLE `offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `default_orders_id` int(11) DEFAULT NULL,
  `description` varchar(70) NOT NULL,
  `state` varchar(45) NOT NULL,
  `comment` varchar(70) DEFAULT NULL,
  `ordered_date` date NOT NULL,
  `started_date` date DEFAULT NULL,
  `ready_date` date DEFAULT NULL,
  `acc_rej_date` date DEFAULT NULL,
  `price` int(11) NOT NULL,
  `orderscol` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=latin1 COMMENT='	';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (23,2,2,'Clean the windows','STARTED','','2019-06-11','2019-06-11',NULL,NULL,120,NULL),(30,2,5,'Babysit the child','STARTED','Ohhh boy... Have fun!','2019-06-12','2019-06-16',NULL,NULL,130,NULL),(31,2,NULL,'Wash the dishes','ACCEPTED','','2019-06-12','2019-06-12','2019-06-12','2019-06-12',120,NULL),(33,5,3,'Take the dog for a walk','ACCEPTED','At 8AM','2019-06-13','2019-06-13','2019-06-13','2019-06-13',50,NULL),(34,2,4,'Fix the fence','REJECTED','Behind the house','2019-06-13','2019-06-13','2019-06-13','2019-06-13',60,NULL),(42,10,3,'Take the dog for a walk','ORDERED','It\'s a big dog!','2019-06-13',NULL,NULL,NULL,30,NULL),(43,2,2,'Clean the windows','READY','I have 13 windows','2019-06-14','2019-06-17','2019-06-17',NULL,120,NULL),(45,5,4,'Fix the fence','ORDERED','The fence behind the house','2019-06-16',NULL,NULL,NULL,80,NULL),(46,4,2,'Clean the windows','ORDERED','','2019-06-16',NULL,NULL,NULL,120,NULL),(47,4,4,'Fix the fence','ORDERED','','2019-06-16',NULL,NULL,NULL,80,NULL),(48,11,4,'Fix the fence','ORDERED','','2019-06-17',NULL,NULL,NULL,80,NULL),(49,11,5,'Babysit the child','REJECTED','Have fun!','2019-06-17','2019-06-17','2019-06-17','2019-06-17',150,NULL),(50,11,1,'Cut the Grass','ACCEPTED','At 10AM please','2019-06-17','2019-06-17','2019-06-17','2019-06-17',100,NULL),(52,11,NULL,'Clean the 3rd floor','ORDERED',NULL,'2019-06-17',NULL,NULL,NULL,40,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `admin_value` tinyint(4) NOT NULL DEFAULT '0',
  `name` varchar(45) NOT NULL,
  `address` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','password','admin@zwap.com',1,'',''),(2,'user1','password1','user1@gmail.com',0,'David','Salzburg'),(4,'user2','password2','user2@gmail.com',0,'Matt','Regensburg'),(5,'user3','password3','user3@gmail.com',0,'Dan','Amberg'),(10,'user5','password5','user5@gmail.com',0,'John','Zürich'),(11,'user6','password6','user6@gmail.com',0,'Daniel','Frankfurt');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-17 23:56:54
