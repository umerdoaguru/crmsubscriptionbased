-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 21, 2025 at 04:07 PM
-- Server version: 10.6.19-MariaDB-cll-lve
-- PHP Version: 8.4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dentalgu_crm_generalize`
--

-- --------------------------------------------------------

--
-- Table structure for table `employee_sold_units`
--

CREATE TABLE `employee_sold_units` (
  `esu_id` int(100) NOT NULL,
  `esu_lead_id` varchar(100) NOT NULL,
  `esu_staff_id` int(100) NOT NULL,
  `esu_unit_id` int(100) NOT NULL,
  `esu_owner_id` int(100) NOT NULL,
  `esu_sale_price` int(100) NOT NULL,
  `esu_token_amount` int(100) DEFAULT NULL,
  `esu_token_paid_status` enum('unpaid','paid') NOT NULL DEFAULT 'unpaid',
  `esu_status` enum('booked','registry_done','sold') DEFAULT NULL,
  `esu_booking_date` varchar(100) DEFAULT NULL,
  `esu_final_date` varchar(100) DEFAULT NULL,
  `registry_name` varchar(100) DEFAULT NULL,
  `registry_date` varchar(100) DEFAULT NULL,
  `registry_document_url` varchar(100) DEFAULT NULL,
  `esu_payment_method` enum('Cash','Bank Transfer','Cheque','UPI','Online','EMI','Credit/Debit Card') DEFAULT NULL,
  `esu_project_id` int(100) NOT NULL,
  `esu_sold_date` varchar(100) NOT NULL,
  `esu_notes` varchar(100) DEFAULT NULL,
  `remaining_amount` int(100) DEFAULT NULL,
  `esu_created_at` varchar(100) DEFAULT NULL,
  `esu_updated_at` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_sold_units`
--

INSERT INTO `employee_sold_units` (`esu_id`, `esu_lead_id`, `esu_staff_id`, `esu_unit_id`, `esu_owner_id`, `esu_sale_price`, `esu_token_amount`, `esu_token_paid_status`, `esu_status`, `esu_booking_date`, `esu_final_date`, `registry_name`, `registry_date`, `registry_document_url`, `esu_payment_method`, `esu_project_id`, `esu_sold_date`, `esu_notes`, `remaining_amount`, `esu_created_at`, `esu_updated_at`) VALUES
(1, '24949804364624783', 3, 3, 1, 10000, 1000, 'paid', NULL, '2025-10-15', '2025-10-15', 'lala', '2025-10-15', NULL, 'Cash', 7, '2025-10-15', 'Test', 0, '2025-10-15 17:24:17', '2025-10-17 12:43:00'),
(4, '2259113621271744', 3, 3, 5, 190000, 10000, 'paid', NULL, '2025-10-17', '2025-10-17', 'Shubham', '2025-10-17', NULL, 'EMI', 7, '2025-10-17', 'Test', 190000, '2025-10-17 13:33:45', NULL),
(5, '801377935608186', 3, 3, 6, 190000, 10000, 'paid', NULL, '2025-10-17', '2025-10-17', 'Shailendra Dohaiya', '2025-10-17', NULL, 'EMI', 7, '2025-10-17', 'test', 190000, '2025-10-17 20:20:08', NULL),
(6, '1529366424735573', 3, 3, 7, 150000, 50000, 'paid', NULL, '2025-10-17', '2025-10-17', NULL, NULL, NULL, 'EMI', 7, '2025-10-17', 'test', 150000, '2025-10-17 21:09:08', NULL),
(7, '761968603317171', 3, 3, 8, 190000, 10000, 'paid', NULL, '2025-10-17', '2025-10-17', 'g_n_g_i_d_i', '2025-10-17', NULL, 'Cash', 7, '2025-10-17', 'Tests', 140000, '2025-10-17 21:13:37', '2025-10-18 13:05:08'),
(9, '1', 3, 3, 11, 180000, 20000, 'paid', NULL, '2025-10-18', '2025-10-18', 'Kaajajjnj', '2025-10-18', NULL, 'EMI', 7, '2025-10-18', 'Test again', 180000, '2025-10-18 15:41:42', '2025-10-18 16:45:31'),
(10, '3', 14, 7, 12, 4000000, 400000, 'paid', NULL, '2025-10-21', '2025-11-01', 'Denesh Sharma', '2025-10-21', NULL, 'Cash', 8, '2025-10-21', 'Token amount 4 lakhs is paid, and 36 lakhs is pending', 4000000, '2025-10-21 14:23:22', NULL),
(11, '871144049407040', 3, 5, 13, 1900000, 100000, 'paid', NULL, '2025-11-01', '2025-11-05', 'tarak mehta', '2025-11-05', NULL, 'Cash', 1, '2025-10-30', 'Test', NULL, '2025-10-30 14:48:51', NULL),
(15, '791043806903486', 3, 3, 19, 190000, 10000, 'paid', NULL, '2025-10-31', '2025-10-31', 'Dharmendra Pandey', '2025-10-31', NULL, 'Cash', 7, '2025-10-30', 'Test', NULL, '2025-10-30 19:36:21', NULL),
(17, '25', 14, 11, 21, 300000, 100000, 'paid', NULL, '2025-11-03', '2025-11-20', 'Sharma', '2025-11-03', NULL, 'Cheque', 9, '2025-11-03', 'Test notes', 0, '2025-11-03 17:13:45', '2025-11-04 18:15:25'),
(18, '678742701520498', 2, 5, 22, 190000, 10000, 'paid', NULL, '2025-11-03', '2025-11-03', 'Sumit Tiwari', '2025-11-04', NULL, 'Cash', 1, '2025-11-03', 'Test', NULL, '2025-11-03 17:15:50', NULL),
(19, '24', 14, 7, 23, 4000000, 100000, 'paid', NULL, '2025-11-06', '2025-11-14', 'Gurudayal', '2025-11-06', NULL, 'Cash', 8, '2025-11-06', 'Test Note', NULL, '2025-11-06 17:20:35', NULL),
(21, '6', 2, 6, 25, 190000, 10000, 'paid', NULL, '2025-11-15', '2025-11-25', 'satnam', '2025-11-30', NULL, 'Cash', 1, '2025-11-15', 'Test', 190000, '2025-11-15 18:42:32', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `employee_sold_units`
--
ALTER TABLE `employee_sold_units`
  ADD PRIMARY KEY (`esu_id`),
  ADD UNIQUE KEY `esu_lead_id` (`esu_lead_id`,`esu_staff_id`,`esu_unit_id`,`esu_project_id`),
  ADD KEY `esu_project_id` (`esu_project_id`),
  ADD KEY `esu_staff_id` (`esu_staff_id`),
  ADD KEY `esu_unit_id` (`esu_unit_id`),
  ADD KEY `esu_owner_id` (`esu_owner_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `employee_sold_units`
--
ALTER TABLE `employee_sold_units`
  MODIFY `esu_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `employee_sold_units`
--
ALTER TABLE `employee_sold_units`
  ADD CONSTRAINT `employee_sold_units_ibfk_2` FOREIGN KEY (`esu_project_id`) REFERENCES `projects` (`project_id`),
  ADD CONSTRAINT `employee_sold_units_ibfk_3` FOREIGN KEY (`esu_staff_id`) REFERENCES `company_staff` (`staff_id`),
  ADD CONSTRAINT `employee_sold_units_ibfk_4` FOREIGN KEY (`esu_unit_id`) REFERENCES `units` (`unit_id`),
  ADD CONSTRAINT `employee_sold_units_ibfk_5` FOREIGN KEY (`esu_owner_id`) REFERENCES `owner` (`owner_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
