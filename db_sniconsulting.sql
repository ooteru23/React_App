-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 13, 2025 at 09:12 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_sniconsulting`
--

-- --------------------------------------------------------

--
-- Table structure for table `bonuses`
--

CREATE TABLE `bonuses` (
  `id` int NOT NULL,
  `employee_name` varchar(255) NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `month` varchar(255) NOT NULL,
  `work_status` varchar(255) NOT NULL,
  `net_value` varchar(255) NOT NULL,
  `disbursement_bonus` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `pic` varchar(255) NOT NULL,
  `telephone` varchar(255) NOT NULL,
  `service` varchar(255) NOT NULL,
  `contract_value` varchar(255) NOT NULL,
  `client_status` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `controls`
--

CREATE TABLE `controls` (
  `id` int NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `employee1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `employee2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `net_value1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `net_value2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `month_jan` varchar(255) NOT NULL DEFAULT 'ON PROCESS',
  `month_feb` varchar(255) NOT NULL DEFAULT 'ON PROCESS',
  `month_mar` varchar(255) NOT NULL DEFAULT 'ON PROCESS',
  `month_apr` varchar(255) NOT NULL DEFAULT 'ON PROCESS',
  `month_may` varchar(255) NOT NULL DEFAULT 'ON PROCESS',
  `month_jun` varchar(255) NOT NULL DEFAULT 'ON PROCESS',
  `month_jul` varchar(255) NOT NULL DEFAULT 'ON PROCESS',
  `month_aug` varchar(255) NOT NULL DEFAULT 'ON PROCESS',
  `month_sep` varchar(255) NOT NULL DEFAULT 'ON PROCESS',
  `month_oct` varchar(255) NOT NULL DEFAULT 'ON PROCESS',
  `month_nov` varchar(255) NOT NULL DEFAULT 'ON PROCESS',
  `month_dec` varchar(255) NOT NULL DEFAULT 'ON PROCESS',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `job_title` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `salary` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `offers`
--

CREATE TABLE `offers` (
  `id` int NOT NULL,
  `creator_name` varchar(255) NOT NULL,
  `client_candidate` varchar(255) NOT NULL,
  `marketing_name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `valid_date` varchar(255) NOT NULL,
  `pic` varchar(255) NOT NULL,
  `telephone` varchar(255) NOT NULL,
  `service` varchar(255) NOT NULL,
  `period_time` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `information` varchar(255) NOT NULL,
  `offer_status` varchar(255) NOT NULL DEFAULT 'ON PROCESS',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int NOT NULL,
  `employee_name` varchar(255) NOT NULL,
  `month` varchar(255) NOT NULL,
  `salary_deduction` varchar(255) NOT NULL,
  `month_ontime` varchar(255) NOT NULL,
  `month_late` varchar(255) NOT NULL,
  `bonus_component` varchar(255) NOT NULL,
  `percent_ontime` varchar(255) NOT NULL,
  `percent_late` varchar(255) NOT NULL,
  `total_ontime` varchar(255) NOT NULL,
  `total_late` varchar(255) NOT NULL,
  `bonus_ontime` varchar(255) NOT NULL,
  `bonus_late` varchar(255) NOT NULL,
  `total` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20241104041437-Control.js'),
('20250106155109-client.js');

-- --------------------------------------------------------

--
-- Table structure for table `setups`
--

CREATE TABLE `setups` (
  `id` int NOT NULL,
  `client_candidate` varchar(255) NOT NULL,
  `contract_value` varchar(255) NOT NULL,
  `commission_price` varchar(255) NOT NULL,
  `software_price` varchar(255) NOT NULL,
  `employee1` varchar(255) NOT NULL,
  `employee2` varchar(255) NOT NULL,
  `percent1` varchar(255) NOT NULL,
  `percent2` varchar(255) NOT NULL,
  `net_value1` varchar(255) NOT NULL,
  `net_value2` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bonuses`
--
ALTER TABLE `bonuses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `controls`
--
ALTER TABLE `controls`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `controls_client_name` (`client_name`),
  ADD UNIQUE KEY `controls_client_name_employee1_employee2` (`client_name`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `setups`
--
ALTER TABLE `setups`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bonuses`
--
ALTER TABLE `bonuses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=187;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `controls`
--
ALTER TABLE `controls`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=135;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=171;

--
-- AUTO_INCREMENT for table `setups`
--
ALTER TABLE `setups`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
