-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 06, 2024 at 07:21 AM
-- Server version: 8.2.0
-- PHP Version: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `boothsystem`
--

-- --------------------------------------------------------

--
-- Table structure for table `booth`
--

DROP TABLE IF EXISTS `booth`;
CREATE TABLE IF NOT EXISTS `booth` (
  `BoothID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `Description` text COLLATE utf8mb4_general_ci,
  `Schedules` text COLLATE utf8mb4_general_ci,
  `Location` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BoothIcon` blob,
  `Status` enum('open','not') COLLATE utf8mb4_general_ci NOT NULL,
  `OrgID` int DEFAULT NULL,
  PRIMARY KEY (`BoothID`),
  KEY `fk_org` (`OrgID`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booth`
--

INSERT INTO `booth` (`BoothID`, `Title`, `Description`, `Schedules`, `Location`, `BoothIcon`, `Status`, `OrgID`) VALUES
(13, 'Tech Booth', 'Booth for selling electronics', 'Mon-Fri 9am-5pm', 'Hall A', NULL, 'open', 1),
(14, 'Journalism Info', 'Booth for Journalism Club info', 'Mon-Wed 10am-4pm', 'Hall B', NULL, 'open', 2),
(15, 'RPG Art Show', 'Booth showcasing arts and music', 'Tue-Thu 11am-5pm', 'Hall C', NULL, 'open', 3),
(16, 'Varsity Signup', 'Booth for sports team registration', 'Mon-Fri 12pm-6pm', 'Field House', NULL, 'open', 4),
(17, 'Political Debate', 'Discussion booth for politics', 'Wed-Fri 1pm-4pm', 'Hall D', NULL, 'not', 5),
(18, 'Tech Product Demo', 'Demonstration of tech products', 'Mon-Fri 9am-5pm', 'Hall A', NULL, 'not', 1),
(19, 'Journalism Archives', 'Display of old journalism archives', 'Tue-Thu 10am-4pm', 'Library Hall', NULL, 'open', 2),
(20, 'RPG Performance', 'Live performance of dance and acting', 'Sat-Sun 2pm-6pm', 'Main Stage', NULL, 'open', 3),
(21, 'Varsity Practice', 'Booth for sports practice schedules', 'Mon-Fri 10am-2pm', 'Field House', NULL, 'not', 4),
(22, 'Political Awareness', 'Booth for political club recruitment', 'Mon-Wed 10am-3pm', 'Hall D', NULL, 'open', 5),
(23, 'Tech Support', 'Booth offering tech support services', 'Mon-Fri 9am-5pm', 'Hall A', NULL, 'open', 1);

-- --------------------------------------------------------

--
-- Table structure for table `booth_members`
--

DROP TABLE IF EXISTS `booth_members`;
CREATE TABLE IF NOT EXISTS `booth_members` (
  `BoothID` int NOT NULL,
  `VendorID` int NOT NULL,
  PRIMARY KEY (`BoothID`,`VendorID`),
  KEY `VendorID` (`VendorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booth_members`
--

INSERT INTO `booth_members` (`BoothID`, `VendorID`) VALUES
(13, 1),
(18, 1),
(23, 1),
(14, 2),
(19, 2),
(15, 3),
(20, 3),
(16, 4),
(21, 4),
(17, 5),
(22, 5),
(13, 6),
(18, 6),
(23, 6),
(13, 7),
(18, 7),
(23, 7),
(13, 8),
(18, 8),
(23, 8),
(14, 9),
(19, 9),
(15, 10),
(20, 10),
(16, 11),
(21, 11),
(17, 12),
(22, 12);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `CategoryID` int NOT NULL AUTO_INCREMENT,
  `CategoryName` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`CategoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`CategoryID`, `CategoryName`) VALUES
(1, 'Electronics'),
(2, 'Furniture'),
(3, 'Food'),
(4, 'School Supplies'),
(5, 'Clothing'),
(6, 'Books'),
(7, 'Stationery'),
(8, 'Toys'),
(9, 'Sports Equipment'),
(10, 'Health & Beauty');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
CREATE TABLE IF NOT EXISTS `customer` (
  `CustomerID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  PRIMARY KEY (`CustomerID`),
  KEY `UserID` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`CustomerID`, `UserID`) VALUES
(1, 7),
(2, 8),
(3, 9),
(4, 10),
(5, 11),
(6, 18),
(10, 19),
(11, 20),
(12, 21);

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
CREATE TABLE IF NOT EXISTS `inventory` (
  `InventoryID` int NOT NULL AUTO_INCREMENT,
  `ProductID` int NOT NULL,
  `Date` datetime NOT NULL,
  `Type` enum('in','out') COLLATE utf8mb4_general_ci NOT NULL,
  `Quantity` int NOT NULL,
  PRIMARY KEY (`InventoryID`),
  KEY `ProductID` (`ProductID`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`InventoryID`, `ProductID`, `Date`, `Type`, `Quantity`) VALUES
(2, 1, '2024-11-04 11:27:00', 'in', 100),
(3, 107, '2024-11-04 11:27:00', 'in', 50),
(4, 108, '2024-11-04 11:27:00', 'in', 150),
(5, 109, '2024-11-04 11:27:00', 'in', 200),
(6, 110, '2024-11-04 11:27:00', 'in', 75),
(7, 111, '2024-11-04 11:27:00', 'in', 60),
(8, 112, '2024-11-04 11:27:00', 'in', 40),
(9, 113, '2024-11-04 11:27:00', 'in', 85),
(10, 114, '2024-11-04 11:27:00', 'in', 90),
(11, 115, '2024-11-04 11:27:00', 'in', 100),
(12, 116, '2024-11-04 11:27:00', 'in', 45),
(13, 117, '2024-11-04 11:27:00', 'in', 120),
(14, 118, '2024-11-04 11:27:00', 'in', 110),
(15, 119, '2024-11-04 11:27:00', 'in', 250),
(16, 120, '2024-11-04 11:27:00', 'in', 190),
(17, 121, '2024-11-04 11:27:00', 'in', 60),
(18, 122, '2024-11-04 11:27:00', 'in', 100),
(19, 123, '2024-11-04 11:27:00', 'in', 80),
(20, 124, '2024-11-04 11:27:00', 'in', 90),
(21, 125, '2024-11-04 11:27:00', 'in', 75),
(22, 126, '2024-11-04 11:27:00', 'in', 55),
(23, 127, '2024-11-04 11:27:00', 'in', 45),
(24, 128, '2024-11-04 11:27:00', 'in', 95),
(25, 129, '2024-11-04 11:27:00', 'in', 70),
(26, 130, '2024-11-04 11:27:00', 'in', 130),
(27, 131, '2024-11-04 11:27:00', 'in', 60),
(28, 132, '2024-11-04 11:27:00', 'in', 85),
(29, 133, '2024-11-04 11:27:00', 'in', 120),
(30, 134, '2024-11-04 11:27:00', 'in', 45),
(31, 135, '2024-11-04 11:27:00', 'in', 150),
(32, 136, '2024-11-04 11:27:00', 'in', 100),
(33, 137, '2024-11-04 11:27:00', 'in', 60),
(34, 138, '2024-11-04 11:27:00', 'in', 95),
(35, 139, '2024-11-04 11:27:00', 'in', 50),
(36, 140, '2024-11-04 11:27:00', 'in', 30),
(37, 141, '2024-11-04 11:27:00', 'in', 40),
(38, 142, '2024-11-04 11:27:00', 'in', 20),
(39, 143, '2024-11-04 11:27:00', 'in', 35),
(40, 144, '2024-11-04 11:27:00', 'in', 25),
(41, 145, '2024-11-04 11:27:00', 'in', 60),
(42, 146, '2024-11-04 11:27:00', 'in', 45),
(43, 147, '2024-11-04 11:27:00', 'in', 100),
(44, 148, '2024-11-04 11:27:00', 'in', 15),
(45, 149, '2024-11-04 11:27:00', 'in', 10),
(46, 150, '2024-11-04 11:27:00', 'in', 50),
(47, 151, '2024-11-04 11:27:00', 'in', 30),
(48, 152, '2024-11-04 11:27:00', 'in', 20),
(49, 153, '2024-11-04 11:27:00', 'in', 40),
(50, 154, '2024-11-04 11:27:00', 'in', 35),
(51, 155, '2024-11-04 11:27:00', 'in', 15),
(52, 156, '2024-11-04 11:27:00', 'in', 100),
(53, 157, '2024-11-04 11:27:00', 'in', 25),
(54, 158, '2024-11-04 11:27:00', 'in', 50);

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
CREATE TABLE IF NOT EXISTS `order` (
  `OrderID` int NOT NULL AUTO_INCREMENT,
  `BoothID` int NOT NULL,
  `Status` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `DateOrdered` datetime DEFAULT NULL,
  `DatePaid` datetime DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`OrderID`),
  KEY `fk_booth` (`BoothID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_products`
--

DROP TABLE IF EXISTS `order_products`;
CREATE TABLE IF NOT EXISTS `order_products` (
  `ProductID` int NOT NULL,
  `OrderID` int NOT NULL,
  `Quantity` int DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`ProductID`,`OrderID`),
  KEY `fk_order` (`OrderID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organization`
--

DROP TABLE IF EXISTS `organization`;
CREATE TABLE IF NOT EXISTS `organization` (
  `OrgID` int NOT NULL AUTO_INCREMENT,
  `OrgName` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`OrgID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organization`
--

INSERT INTO `organization` (`OrgID`, `OrgName`) VALUES
(1, 'icon'),
(2, 'schema'),
(3, 'rpg'),
(4, 'varsity'),
(5, 'rights');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `ProductID` int NOT NULL AUTO_INCREMENT,
  `BoothID` int NOT NULL,
  `StocksRemaining` int NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  `CategoryID` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`ProductID`),
  KEY `BoothID` (`BoothID`),
  KEY `CategoryID` (`CategoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=159 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`ProductID`, `BoothID`, `StocksRemaining`, `Price`, `CategoryID`, `name`, `status`) VALUES
(1, 13, 100, 59.90, 3, 'Burger', 'active'),
(107, 14, 50, 1200.00, 1, 'Laptop', 'active'),
(108, 15, 150, 30.00, 7, 'Art Supplies', 'active'),
(109, 16, 200, 45.50, 9, 'Basketball', 'active'),
(110, 17, 75, 15.00, 10, 'Skincare Kit', 'active'),
(111, 18, 60, 99.90, 1, 'Smartphone', 'active'),
(112, 19, 40, 200.00, 6, 'Magazine Collection', 'active'),
(113, 20, 85, 25.00, 5, 'Graphic T-Shirt', 'active'),
(114, 21, 90, 75.00, 9, 'Tennis Racket', 'active'),
(115, 22, 100, 10.00, 2, 'Chair', 'active'),
(116, 23, 45, 300.00, 1, 'Tablet', 'active'),
(117, 13, 120, 7.50, 8, 'Phone Charger', 'active'),
(118, 14, 110, 9.90, 8, 'Doll Set', 'active'),
(119, 15, 250, 15.00, 2, 'Desk Organizer', 'active'),
(120, 16, 190, 20.00, 4, 'Notebooks', 'active'),
(121, 17, 60, 500.00, 6, 'Novel', 'active'),
(122, 18, 100, 12.00, 5, 'Hoodie', 'active'),
(123, 19, 80, 40.00, 3, 'Pizza', 'active'),
(124, 20, 90, 9.90, 7, 'Pencil Set', 'active'),
(125, 21, 75, 250.00, 9, 'Soccer Ball', 'active'),
(126, 22, 55, 25.00, 10, 'Hair Dryer', 'active'),
(127, 23, 45, 45.00, 10, 'Beauty Cream', 'active'),
(128, 13, 95, 120.00, 2, 'Bookshelf', 'active'),
(129, 14, 70, 5.50, 7, 'Notepad', 'active'),
(130, 15, 130, 8.00, 3, 'Hotdog', 'active'),
(131, 16, 60, 180.00, 6, 'Comic Book', 'active'),
(132, 17, 85, 60.00, 5, 'Sweater', 'active'),
(133, 18, 120, 399.00, 9, 'Volleyball', 'active'),
(134, 19, 45, 55.90, 4, 'Highlighter Pack', 'active'),
(135, 20, 150, 29.90, 8, 'Puzzle Set', 'active'),
(136, 21, 100, 75.50, 2, 'Office Chair', 'active'),
(137, 22, 60, 399.90, 1, 'Wireless Earbuds', 'active'),
(138, 23, 95, 500.00, 6, 'Poetry Book', 'active'),
(139, 13, 50, 149.99, 1, 'Phone Diagnostics', 'active'),
(140, 13, 30, 199.99, 1, 'Laptop Repair', 'active'),
(141, 14, 40, 99.99, 10, 'Health Consultation', 'active'),
(142, 15, 20, 59.99, 7, 'Art Workshop', 'active'),
(143, 16, 35, 75.00, 9, 'Sports Training', 'active'),
(144, 17, 25, 40.00, 10, 'Public Speaking Workshop', 'active'),
(145, 18, 60, 149.99, 1, 'Device Setup Assistance', 'active'),
(146, 19, 45, 69.99, 6, 'Writing Workshop', 'active'),
(147, 20, 100, 20.00, 5, 'Fashion Consultation', 'active'),
(148, 21, 15, 120.00, 9, 'Sports Coaching', 'active'),
(149, 22, 10, 150.00, 2, 'Furniture Assembly Service', 'active'),
(150, 23, 50, 89.99, 1, 'Tech Support Service', 'active'),
(151, 13, 30, 30.00, 3, 'Catering Service', 'active'),
(152, 14, 20, 25.00, 7, 'Event Planning', 'active'),
(153, 15, 40, 50.00, 8, 'Toy Customization', 'active'),
(154, 16, 35, 30.00, 4, 'Stationery Design Service', 'active'),
(155, 17, 15, 60.00, 10, 'Makeup Session', 'active'),
(156, 18, 100, 10.00, 1, 'Computer Cleaning Service', 'active'),
(157, 19, 25, 100.00, 6, 'Book Binding', 'active'),
(158, 20, 50, 200.00, 5, 'Personal Styling Service', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

DROP TABLE IF EXISTS `service`;
CREATE TABLE IF NOT EXISTS `service` (
  `ProductID` int NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service`
--

INSERT INTO `service` (`ProductID`, `description`) VALUES
(139, 'Diagnostics for phone issues and performance problems'),
(140, 'Repair services for laptops including hardware and software'),
(141, 'Health consultations for wellness and fitness advice'),
(142, 'Creative art workshops to enhance artistic skills'),
(143, 'We help our customers to further enhance their skills in sports'),
(144, 'Public speaking workshops to build confidence and presentation skills'),
(145, 'Assistance with setting up devices and software configurations'),
(146, 'Workshops focused on improving writing skills and techniques'),
(147, 'Consultations for fashion advice and wardrobe management'),
(148, 'Coaching sessions to improve sports performance'),
(149, 'Assembly services for furniture purchases and setups'),
(150, 'Technical support services for various devices and software'),
(151, 'Catering services for events and gatherings'),
(152, 'Planning services for events, including logistics and management'),
(153, 'Customization services for toys, including personal touches'),
(154, 'Design services for stationery items to meet customer needs'),
(155, 'Makeup sessions for personal grooming and events'),
(156, 'Cleaning services for computers to enhance performance'),
(157, 'Binding services for books and documents'),
(158, 'Personal styling services to improve overall appearance');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `LastName` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `SchoolEmail` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `Password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `SchoolEmail` (`SchoolEmail`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `FirstName`, `LastName`, `SchoolEmail`, `Password`) VALUES
(1, 'John', 'Doe', 'jdoe@school.com', '41b8b7a48c3de54b3f5f5128da80541c'),
(2, 'Jane', 'Smith', 'jane.smith@school.edu', '2b8a0b1e3e63f1b8d3f083650b7a276d'),
(3, 'Alice', 'Brown', 'alice.brown@school.edu', '8faaf8fa92f06f41c1e9281e0bdf2c96'),
(4, 'Bob', 'Johnson', 'bob.johnson@school.edu', '0fbad15f90f1d270d7a9adca9f7f1c8c'),
(5, 'Chris', 'Evans', 'chris.evans@school.edu', '3c62e7c1098a12713b54c8b2d8d00b0f'),
(6, 'Diana', 'Prince', 'diana.prince@school.edu', '9263c14e4551139161d0d159d8ba44a1'),
(7, 'Peter', 'Parker', 'peter.parker@school.edu', 'f9a0374f3a7c97b5e2011df17b7fa2e0'),
(8, 'Bruce', 'Wayne', 'bruce.wayne@school.edu', '2b0b0d55c3deed69512567f06fe7c86a'),
(9, 'Clark', 'Kent', 'clark.kent@school.edu', '3a429f80b85f4b09723b3201f8f2f00c'),
(10, 'Natasha', 'Romanoff', 'natasha.romanoff@school.edu', '3255be53b1a4824d7f65edc75df6a219'),
(11, 'Steve', 'Rogers', 'steve.rogers@school.edu', 'f60f579cb5afc7b5e7df6ff28952955a'),
(12, 'Emily', 'Clark', 'emily.clark@school.edu', '58cb31b9c8f5f35a70acb72b60e217bb'),
(13, 'Michael', 'Green', 'michael.green@school.edu', 'e74f00d2fbc084e7e86f953f7a43d6dc'),
(14, 'Sarah', 'Adams', 'sarah.adams@school.edu', '54f5e6e1e7ed3a20e9f6a3d9927efdae'),
(15, 'David', 'Wilson', 'david.wilson@school.edu', '3bafe73c5155e3d42a2ad0d1b5ef3c37'),
(16, 'Olivia', 'Taylor', 'olivia.taylor@school.edu', '2d4a439107b6bdfa587a7f75a30e94b3'),
(17, 'James', 'Brown', 'james.brown@school.edu', '1f3870be274f6c49b3e31a0c6728957f'),
(18, 'Sophia', 'Miller', 'sophia.miller@school.edu', 'd8578edf8458ce06fbc5bb76a58c5ca4'),
(19, 'Liam', 'Davis', 'liam.davis@school.edu', '5f4dcc3b5aa765d61d8327deb882cf99'),
(20, 'Ava', 'Martinez', 'ava.martinez@school.edu', '098f6bcd4621d373cade4e832627b4f6'),
(21, 'Noah', 'Garcia', 'noah.garcia@school.edu', '25d55ad283aa400af464c76d713c07ad');

-- --------------------------------------------------------

--
-- Table structure for table `vendor`
--

DROP TABLE IF EXISTS `vendor`;
CREATE TABLE IF NOT EXISTS `vendor` (
  `VendorID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `OrgID` int NOT NULL,
  PRIMARY KEY (`VendorID`),
  KEY `UserID` (`UserID`),
  KEY `fk_organization` (`OrgID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vendor`
--

INSERT INTO `vendor` (`VendorID`, `UserID`, `OrgID`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5),
(6, 6, 1),
(7, 12, 1),
(8, 13, 1),
(9, 14, 2),
(10, 15, 3),
(11, 16, 4),
(12, 17, 5);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booth`
--
ALTER TABLE `booth`
  ADD CONSTRAINT `fk_org` FOREIGN KEY (`OrgID`) REFERENCES `organization` (`OrgID`);

--
-- Constraints for table `booth_members`
--
ALTER TABLE `booth_members`
  ADD CONSTRAINT `booth_members_ibfk_1` FOREIGN KEY (`BoothID`) REFERENCES `booth` (`BoothID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `booth_members_ibfk_2` FOREIGN KEY (`VendorID`) REFERENCES `vendor` (`VendorID`) ON UPDATE CASCADE;

--
-- Constraints for table `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON UPDATE CASCADE;

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`) ON UPDATE CASCADE;

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `fk_booth` FOREIGN KEY (`BoothID`) REFERENCES `booth` (`BoothID`) ON UPDATE CASCADE;

--
-- Constraints for table `order_products`
--
ALTER TABLE `order_products`
  ADD CONSTRAINT `fk_order` FOREIGN KEY (`OrderID`) REFERENCES `order` (`OrderID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_product` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`) ON UPDATE CASCADE;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`BoothID`) REFERENCES `booth` (`BoothID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `product_ibfk_2` FOREIGN KEY (`CategoryID`) REFERENCES `category` (`CategoryID`) ON UPDATE CASCADE;

--
-- Constraints for table `service`
--
ALTER TABLE `service`
  ADD CONSTRAINT `service_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`) ON UPDATE CASCADE;

--
-- Constraints for table `vendor`
--
ALTER TABLE `vendor`
  ADD CONSTRAINT `fk_organization` FOREIGN KEY (`OrgID`) REFERENCES `organization` (`OrgID`),
  ADD CONSTRAINT `vendor_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
