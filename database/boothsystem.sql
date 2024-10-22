-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 19, 2024 at 03:14 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

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
  `BoothID` int(11) NOT NULL,
  `Title` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  `Schedules` text DEFAULT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `BoothIcon` blob DEFAULT NULL,
  `Status` enum('open','not') NOT NULL,
  `OrgID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE `booth_members` (
  `BoothID` int(11) NOT NULL,
  `VendorID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booth_members`
--

INSERT INTO `booth_members` (`BoothID`, `VendorID`) VALUES
(13, 1),
(13, 6),
(13, 7),
(13, 8),
(14, 2),
(14, 9),
(15, 3),
(15, 10),
(16, 4),
(16, 11),
(17, 5),
(17, 12),
(18, 1),
(18, 6),
(18, 7),
(18, 8),
(19, 2),
(19, 9),
(20, 3),
(20, 10),
(21, 4),
(21, 11),
(22, 5),
(22, 12),
(23, 1),
(23, 6),
(23, 7),
(23, 8);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `CategoryID` int(11) NOT NULL,
  `CategoryName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE `customer` (
  `CustomerID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL
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
  `InventoryID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `Date` datetime NOT NULL,
  `Type` enum('in','out') NOT NULL,
  `Quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `OrderID` int(11) NOT NULL,
  `BoothID` int(11) NOT NULL,
  `Status` varchar(50) DEFAULT NULL,
  `DateOrdered` datetime DEFAULT NULL,
  `DatePaid` datetime DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_products`
--

CREATE TABLE `order_products` (
  `ProductID` int(11) NOT NULL,
  `OrderID` int(11) NOT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organization`
--

CREATE TABLE `organization` (
  `OrgID` int(11) NOT NULL,
  `OrgName` varchar(255) NOT NULL
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
  `ProductID` int(11) NOT NULL,
  `BoothID` int(11) NOT NULL,
  `StocksRemaining` int(11) NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  `CategoryID` int(11) NOT NULL,
  `isReservable` tinyint(1) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reserve_rules`
--

CREATE TABLE `reserve_rules` (
  `ReserveID` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Duration` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

CREATE TABLE `service` (
  `ProductID` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `SchoolEmail` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `FirstName`, `LastName`, `SchoolEmail`, `Password`) VALUES
(1, 'John', 'Doe', 'jdoe@school.com', 'password123'),
(2, 'Jane', 'Smith', 'jane.smith@school.edu', 'securePass456'),
(3, 'Alice', 'Brown', 'alice.brown@school.edu', 'alicePwd789'),
(4, 'Bob', 'Johnson', 'bob.johnson@school.edu', 'bobPassword321'),
(5, 'Chris', 'Evans', 'chris.evans@school.edu', 'chrisSecure012'),
(6, 'Diana', 'Prince', 'diana.prince@school.edu', 'wonderWoman789'),
(7, 'Peter', 'Parker', 'peter.parker@school.edu', 'spiderWeb321'),
(8, 'Bruce', 'Wayne', 'bruce.wayne@school.edu', 'batman123'),
(9, 'Clark', 'Kent', 'clark.kent@school.edu', 'superman987'),
(10, 'Natasha', 'Romanoff', 'natasha.romanoff@school.edu', 'blackWidow456'),
(11, 'Steve', 'Rogers', 'steve.rogers@school.edu', 'captainAmerica654'),
(12, 'Emily', 'Clark', 'emily.clark@school.edu', 'emilyPass456'),
(13, 'Michael', 'Green', 'michael.green@school.edu', 'mikeSecure789'),
(14, 'Sarah', 'Adams', 'sarah.adams@school.edu', 'sarahPass321'),
(15, 'David', 'Wilson', 'david.wilson@school.edu', 'davidPwd654'),
(16, 'Olivia', 'Taylor', 'olivia.taylor@school.edu', 'oliviaPass987'),
(17, 'James', 'Brown', 'james.brown@school.edu', 'jamesSecure123'),
(18, 'Sophia', 'Miller', 'sophia.miller@school.edu', 'sophiaPwd456'),
(19, 'Liam', 'Davis', 'liam.davis@school.edu', 'liamSecure789'),
(20, 'Ava', 'Martinez', 'ava.martinez@school.edu', 'avaPass321'),
(21, 'Noah', 'Garcia', 'noah.garcia@school.edu', 'noahSecure654');

-- --------------------------------------------------------

--
-- Table structure for table `vendor`
--

CREATE TABLE `vendor` (
  `VendorID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `OrgID` int(11) NOT NULL
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
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`CategoryID`);

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
  ADD KEY `BoothID` (`BoothID`),
  ADD KEY `CategoryID` (`CategoryID`);

--
-- Indexes for table `reserve_rules`
--
ALTER TABLE `reserve_rules`
  ADD PRIMARY KEY (`ReserveID`);

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
  MODIFY `BoothID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `CustomerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `InventoryID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `OrderID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `organization`
--
ALTER TABLE `organization`
  MODIFY `OrgID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `ProductID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reserve_rules`
--
ALTER TABLE `reserve_rules`
  MODIFY `ReserveID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `vendor`
--
ALTER TABLE `vendor`
  MODIFY `VendorID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `product` (`productID`) ON UPDATE CASCADE;

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
  ADD CONSTRAINT `fk_product` FOREIGN KEY (`ProductID`) REFERENCES `product` (`productID`) ON UPDATE CASCADE;

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
  ADD CONSTRAINT `service_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `product` (`productID`) ON UPDATE CASCADE;

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
