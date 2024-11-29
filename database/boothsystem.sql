-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: database:3306
-- Generation Time: Nov 29, 2024 at 05:39 PM
-- Server version: 8.0.40
-- PHP Version: 8.2.8

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

CREATE TABLE `booth` (
  `BoothID` int NOT NULL,
  `Title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `Schedules` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `Location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BoothIcon` blob,
  `Status` enum('open','not') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `OrgID` int DEFAULT NULL,
  `Image` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booth`
--

INSERT INTO `booth` (`BoothID`, `Title`, `Description`, `Schedules`, `Location`, `BoothIcon`, `Status`, `OrgID`, `Image`) VALUES
(13, 'Tech Booth', 'Booth for selling electronics', 'Mon-Fri 9am-5pm', 'Hall A', NULL, 'open', 1, NULL),
(14, 'Journalism Info', 'Booth for Journalism Club info', 'Mon-Wed 10am-4pm', 'Hall B', NULL, 'open', 2, NULL),
(15, 'RPG Art Show', 'Booth showcasing arts and music', 'Tue-Thu 11am-5pm', 'Hall C', NULL, 'open', 3, NULL),
(16, 'Varsity Signup', 'Booth for sports team registration', 'Mon-Fri 12pm-6pm', 'Field House', NULL, 'open', 4, NULL),
(17, 'Political Debate', 'Discussion booth for politics', 'Wed-Fri 1pm-4pm', 'Hall D', NULL, 'not', 5, NULL),
(18, 'Tech Product Demo', 'Demonstration of tech products', 'Mon-Fri 9am-5pm', 'Hall A', NULL, 'not', 1, NULL),
(19, 'Journalism Archives', 'Display of old journalism archives', 'Tue-Thu 10am-4pm', 'Library Hall', NULL, 'open', 2, NULL),
(20, 'RPG Performance', 'Live performance of dance and acting', 'Sat-Sun 2pm-6pm', 'Main Stage', NULL, 'open', 3, NULL),
(21, 'Varsity Practice', 'Booth for sports practice schedules', 'Mon-Fri 10am-2pm', 'Field House', NULL, 'not', 4, NULL),
(22, 'Political Awareness', 'Booth for political club recruitment', 'Mon-Wed 10am-3pm', 'Hall D', NULL, 'open', 5, NULL),
(23, 'Tech Support', 'Booth offering tech support services', 'Mon-Fri 9am-5pm', 'Hall A', NULL, 'open', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `booth_members`
--

CREATE TABLE `booth_members` (
  `BoothID` int NOT NULL,
  `VendorID` int NOT NULL
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
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `CustomerID` int NOT NULL,
  `UserID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE `inventory` (
  `InventoryID` int NOT NULL,
  `ProductID` int NOT NULL,
  `Date` datetime NOT NULL,
  `Type` enum('in','out') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Quantity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE `order` (
  `OrderID` int NOT NULL,
  `BoothID` int NOT NULL,
  `Status` enum('Pending','Complete','','') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `DateOrdered` datetime DEFAULT NULL,
  `DatePaid` datetime DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`OrderID`, `BoothID`, `Status`, `DateOrdered`, `DatePaid`, `Price`) VALUES
(1, 13, 'Pending', '2024-11-19 10:31:54', NULL, 120.00),
(2, 13, 'Pending', '2024-11-19 10:31:54', NULL, 209.89),
(3, 14, 'Pending', '2024-11-19 10:31:54', NULL, 2405.50),
(4, 14, 'Pending', '2024-11-19 10:31:54', NULL, 599.94),
(5, 15, 'Pending', '2024-11-19 10:31:54', NULL, 80.00),
(6, 15, 'Pending', '2024-11-19 10:31:54', NULL, 290.00),
(7, 15, 'Pending', '2024-11-19 10:31:54', NULL, 115.00),
(8, 13, 'Complete', '2024-11-19 10:31:54', NULL, 479.20),
(9, 15, 'Complete', '2024-11-19 10:31:54', NULL, 198.00);

-- --------------------------------------------------------

--
-- Table structure for table `order_products`
--

CREATE TABLE `order_products` (
  `ProductID` int NOT NULL,
  `OrderID` int NOT NULL,
  `Quantity` int DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_products`
--

INSERT INTO `order_products` (`ProductID`, `OrderID`, `Quantity`, `Total`) VALUES
(1, 2, 1, 59.90),
(1, 8, 8, 59.90),
(107, 3, 2, 1200.00),
(108, 7, 3, 30.00),
(118, 9, 20, 9.90),
(128, 1, 1, 120.00),
(129, 3, 1, 5.50),
(130, 5, 10, 8.00),
(130, 6, 5, 8.00),
(139, 2, 1, 149.99),
(141, 4, 6, 99.99),
(152, 7, 1, 25.00),
(153, 6, 5, 50.00);

-- --------------------------------------------------------

--
-- Table structure for table `organization`
--

CREATE TABLE `organization` (
  `OrgID` int NOT NULL,
  `OrgName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE `product` (
  `ProductID` int NOT NULL,
  `BoothID` int NOT NULL,
  `StocksRemaining` int NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Image` blob
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`ProductID`, `BoothID`, `StocksRemaining`, `Price`, `name`, `status`, `Image`) VALUES
(1, 13, 101, 59.90, 'Burger', 'active', NULL),
(107, 14, 50, 1200.00, 'Laptop', 'active', NULL),
(108, 15, 150, 30.00, 'Art Supplies', 'active', NULL),
(109, 16, 200, 45.50, 'Basketball', 'active', NULL),
(110, 17, 75, 15.00, 'Skincare Kit', 'active', NULL),
(111, 18, 60, 99.90, 'Smartphone', 'active', NULL),
(112, 19, 40, 200.00, 'Magazine Collection', 'active', NULL),
(113, 20, 85, 25.00, 'Graphic T-Shirt', 'active', NULL),
(114, 21, 90, 75.00, 'Tennis Racket', 'active', NULL),
(115, 22, 100, 10.00, 'Chair', 'active', NULL),
(116, 23, 45, 300.00, 'Tablet', 'active', NULL),
(117, 13, 120, 7.50, 'Phone Charger', 'active', NULL),
(118, 14, 110, 9.90, 'Doll Set', 'active', NULL),
(119, 15, 250, 15.00, 'Desk Organizer', 'active', NULL),
(120, 16, 190, 20.00, 'Notebooks', 'active', NULL),
(121, 17, 60, 500.00, 'Novel', 'active', NULL),
(122, 18, 100, 12.00, 'Hoodie', 'active', NULL),
(123, 19, 80, 40.00, 'Pizza', 'active', NULL),
(124, 20, 90, 9.90, 'Pencil Set', 'active', NULL),
(125, 21, 75, 250.00, 'Soccer Ball', 'active', NULL),
(126, 22, 55, 25.00, 'Hair Dryer', 'active', NULL),
(127, 23, 45, 45.00, 'Beauty Cream', 'active', NULL),
(128, 13, 95, 120.00, 'Bookshelf', 'active', NULL),
(129, 14, 70, 5.50, 'Notepad', 'active', NULL),
(130, 15, 130, 8.00, 'Hotdog', 'active', NULL),
(131, 16, 60, 180.00, 'Comic Book', 'active', NULL),
(132, 17, 85, 60.00, 'Sweater', 'active', NULL),
(133, 18, 120, 399.00, 'Volleyball', 'active', NULL),
(134, 19, 45, 55.90, 'Highlighter Pack', 'active', NULL),
(135, 20, 150, 29.90, 'Puzzle Set', 'active', NULL),
(136, 21, 100, 75.50, 'Office Chair', 'active', NULL),
(137, 22, 60, 399.90, 'Wireless Earbuds', 'active', NULL),
(138, 23, 95, 500.00, 'Poetry Book', 'active', NULL),
(139, 13, 50, 149.99, 'Phone Diagnostics', 'active', NULL),
(140, 13, 30, 199.99, 'Laptop Repair', 'active', NULL),
(141, 14, 40, 99.99, 'Health Consultation', 'active', NULL),
(142, 15, 20, 59.99, 'Art Workshop', 'active', NULL),
(143, 16, 35, 75.00, 'Sports Training', 'active', NULL),
(144, 17, 25, 40.00, 'Public Speaking Workshop', 'active', NULL),
(145, 18, 60, 149.99, 'Device Setup Assistance', 'active', NULL),
(146, 19, 45, 69.99, 'Writing Workshop', 'active', NULL),
(147, 20, 100, 20.00, 'Fashion Consultation', 'active', NULL),
(148, 21, 15, 120.00, 'Sports Coaching', 'active', NULL),
(149, 22, 10, 150.00, 'Furniture Assembly Service', 'active', NULL),
(150, 23, 50, 89.99, 'Tech Support Service', 'active', NULL),
(151, 13, 30, 30.00, 'Catering Service', 'active', NULL),
(152, 14, 20, 25.00, 'Event Planning', 'active', NULL),
(153, 15, 40, 50.00, 'Toy Customization', 'active', NULL),
(154, 16, 35, 30.00, 'Stationery Design Service', 'active', NULL),
(155, 17, 15, 60.00, 'Makeup Session', 'active', NULL),
(156, 18, 100, 10.00, 'Computer Cleaning Service', 'active', NULL),
(157, 19, 25, 100.00, 'Book Binding', 'active', NULL),
(158, 20, 50, 200.00, 'Personal Styling Service', 'active', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

CREATE TABLE `service` (
  `ProductID` int NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
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

CREATE TABLE `users` (
  `UserID` int NOT NULL,
  `FirstName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `LastName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `SchoolEmail` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Image` blob
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `FirstName`, `LastName`, `SchoolEmail`, `Password`, `Image`) VALUES
(1, 'John', 'Doe', 'jdoe@school.com', 'jdoe', NULL),
(2, 'Jane', 'Smith', 'jane.smith@school.edu', 'jane', NULL),
(3, 'Alice', 'Brown', 'alice.brown@school.edu', 'alice', NULL),
(4, 'Bob', 'Johnson', 'bob.johnson@school.edu', 'bob', NULL),
(5, 'Chris', 'Evans', 'chris.evans@school.edu', 'chris', NULL),
(6, 'Diana', 'Prince', 'diana.prince@school.edu', 'diana', NULL),
(7, 'Peter', 'Parker', 'peter.parker@school.edu', 'peter', NULL),
(8, 'Bruce', 'Wayne', 'bruce.wayne@school.edu', 'bruce', NULL),
(9, 'Clark', 'Kent', 'clark.kent@school.edu', 'clark', NULL),
(10, 'Natasha', 'Romanoff', 'natasha.romanoff@school.edu', 'natasha', NULL),
(11, 'Steve', 'Rogers', 'steve.rogers@school.edu', 'steve', NULL),
(12, 'Emily', 'Clark', 'emily.clark@school.edu', 'emily\r\n', NULL),
(13, 'Michael', 'Green', 'michael.green@school.edu', 'michael', NULL),
(14, 'Sarah', 'Adams', 'sarah.adams@school.edu', 'sarah', NULL),
(15, 'David', 'Wilson', 'david.wilson@school.edu', 'david', NULL),
(16, 'Olivia', 'Taylor', 'olivia.taylor@school.edu', 'olivia', NULL),
(17, 'James', 'Brown', 'james.brown@school.edu', 'james', NULL),
(18, 'Sophia', 'Miller', 'sophia.miller@school.edu', 'sophia', NULL),
(19, 'Liam', 'Davis', 'liam.davis@school.edu', 'liam', NULL),
(20, 'Ava', 'Martinez', 'ava.martinez@school.edu', 'ava', NULL),
(21, 'Noah', 'Garcia', 'noah.garcia@school.edu', 'noah', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `vendor`
--

CREATE TABLE `vendor` (
  `VendorID` int NOT NULL,
  `UserID` int NOT NULL,
  `OrgID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Indexes for dumped tables
--

--
-- Indexes for table `booth`
--
ALTER TABLE `booth`
  ADD PRIMARY KEY (`BoothID`),
  ADD KEY `fk_org` (`OrgID`);

--
-- Indexes for table `booth_members`
--
ALTER TABLE `booth_members`
  ADD PRIMARY KEY (`BoothID`,`VendorID`),
  ADD KEY `VendorID` (`VendorID`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`CustomerID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`InventoryID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`OrderID`),
  ADD KEY `fk_booth` (`BoothID`);

--
-- Indexes for table `order_products`
--
ALTER TABLE `order_products`
  ADD PRIMARY KEY (`ProductID`,`OrderID`),
  ADD KEY `fk_order` (`OrderID`);

--
-- Indexes for table `organization`
--
ALTER TABLE `organization`
  ADD PRIMARY KEY (`OrgID`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`ProductID`),
  ADD KEY `BoothID` (`BoothID`);

--
-- Indexes for table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`ProductID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `SchoolEmail` (`SchoolEmail`);

--
-- Indexes for table `vendor`
--
ALTER TABLE `vendor`
  ADD PRIMARY KEY (`VendorID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `fk_organization` (`OrgID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booth`
--
ALTER TABLE `booth`
  MODIFY `BoothID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `CustomerID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `InventoryID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `OrderID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `organization`
--
ALTER TABLE `organization`
  MODIFY `OrgID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `ProductID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=161;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `vendor`
--
ALTER TABLE `vendor`
  MODIFY `VendorID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`BoothID`) REFERENCES `booth` (`BoothID`) ON UPDATE CASCADE;

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
