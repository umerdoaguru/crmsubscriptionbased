-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 24, 2025 at 07:27 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dumycrm`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `salary` decimal(10,2) NOT NULL,
  `roles` varchar(255) NOT NULL DEFAULT 'Admin',
  `createdTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_id`, `name`, `email`, `password`, `position`, `phone`, `salary`, `roles`, `createdTime`) VALUES
(29, 'Doaguru Organization', 'doaguruinfosystems@gmail.com', 'Doaguru@2024', 'Admin', '8888888888', 150005.00, 'Admin', '2024-10-16 05:47:03');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `client_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`client_id`, `name`, `email`, `created_at`) VALUES
(1, 'John Doe', 'johndoe@example.com', '2024-09-02 09:53:49'),
(2, 'Helina shrivas', 'Helina@example.com', '2024-09-02 10:31:32');

-- --------------------------------------------------------

--
-- Table structure for table `company_profile`
--

CREATE TABLE `company_profile` (
  `id` int(11) NOT NULL,
  `header_img` varchar(255) NOT NULL,
  `footer_img` varchar(255) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `company_name_account_name` varchar(255) NOT NULL,
  `company_name_account_ifsc` varchar(255) NOT NULL,
  `company_name_account_number` varchar(255) NOT NULL,
  `bank` varchar(255) NOT NULL,
  `company_address` varchar(255) NOT NULL,
  `moblie_no` varchar(255) NOT NULL,
  `gst_no` varchar(255) DEFAULT NULL,
  `pan_no` varchar(255) DEFAULT NULL,
  `email_id` varchar(255) NOT NULL,
  `logo` varchar(255) NOT NULL,
  `digital_sign` varchar(255) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_profile`
--

INSERT INTO `company_profile` (`id`, `header_img`, `footer_img`, `company_name`, `company_name_account_name`, `company_name_account_ifsc`, `company_name_account_number`, `bank`, `company_address`, `moblie_no`, `gst_no`, `pan_no`, `email_id`, `logo`, `digital_sign`, `created_date`) VALUES
(5, 'https://crmdemo.vimubds5.a2hosted.com/uploads/header_img-17268272035332.png', 'https://crmdemo.vimubds5.a2hosted.com/uploads/footer_img-1726827203538last.png', 'Doaguru Infosystems', ' DOAGuru InfoSystems', 'SBIN0004677', ' 38666325192', 'SBI Bank , Jabalpur', '1815 Wright Town, Jabalpur, Madhya pradesh INDIA 482002', '+91-7477253424', ' 23AGLPP2890G1Z7 sdsd', '', 'info@doaguru.com', 'https://crmdemo.vimubds5.a2hosted.com/uploads/logo-1726827203543infosysytems-removebg-preview.png', 'https://crmdemo.vimubds5.a2hosted.com/uploads/digital_sign-1726827203545DOAGURU Infosystyem.png', '2024-10-01 10:12:57'),
(19, 'https://crmdemo.vimubds5.a2hosted.com/uploads/header_img-1727437172123YAG-capsulotomy.jpg', 'https://crmdemo.vimubds5.a2hosted.com/uploads/footer_img-1727437172124YAG-capsulotomy.jpg', 'dhariya enterprices\'s', '454466456', 'dsdsfd3234', 'efsdsfsd', '334332', 'gupta colony ', '831886469164646464', '465454646645', '', 'Vinaydhariya21@gmail.com', 'https://crmdemo.vimubds5.a2hosted.com/uploads/logo-1727437172126Understanding Retinal Detachment Symptoms.jpg', 'https://crmdemo.vimubds5.a2hosted.com/uploads/digital_sign-1727437172128Understanding Retinal Detachment Symptoms.jpg', '2024-09-27 11:39:32');

-- --------------------------------------------------------

--
-- Table structure for table `contracts`
--

CREATE TABLE `contracts` (
  `contract_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contracts`
--

INSERT INTO `contracts` (`contract_id`, `client_id`, `start_date`, `end_date`, `status`, `created_at`, `updated_at`) VALUES
(3, 1, '2024-01-01', '2024-06-01', 'Active', '2024-09-02 11:06:07', '2024-09-02 11:06:07');

-- --------------------------------------------------------

--
-- Table structure for table `device_usage`
--

CREATE TABLE `device_usage` (
  `usage_id` int(11) NOT NULL,
  `device_type` enum('Mobile','Tablet','Desktop') NOT NULL,
  `usage_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `device_usage`
--

INSERT INTO `device_usage` (`usage_id`, `device_type`, `usage_count`, `created_at`) VALUES
(1, 'Mobile', 0, '2024-09-03 08:49:51'),
(2, 'Tablet', 0, '2024-09-03 08:50:03'),
(3, 'Tablet', 0, '2024-09-03 08:50:07'),
(4, 'Desktop', 0, '2024-09-03 08:50:19');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `employeeId` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `position` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `designation` varchar(30) DEFAULT NULL,
  `signature` varchar(200) DEFAULT NULL,
  `photo` varchar(200) DEFAULT NULL,
  `roles` varchar(255) NOT NULL DEFAULT 'Employee',
  `createdTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`employeeId`, `name`, `email`, `password`, `position`, `phone`, `salary`, `designation`, `signature`, `photo`, `roles`, `createdTime`) VALUES
(24, 'test', 'test@gmail.com', 'test', 'sale', '9858582253', 150007.00, NULL, '/Assets/1726383330972-208977126-imgnew1.png', '/Assets/1726383330997-469333504-lead_profile.png', 'Employee', '2024-09-15 06:55:31'),
(25, 'vinay', 'vinay@gmail.com', '', 'sale', '6260550661', 150007.00, NULL, NULL, NULL, 'Employee', '2024-10-18 11:55:43'),
(29, 'umer', 'umer@gmail.com', 'umer', 'saless', '6260550661', 150007.00, NULL, NULL, NULL, 'Employee', '2024-09-14 16:09:03');

-- --------------------------------------------------------

--
-- Table structure for table `employee_sold_units`
--

CREATE TABLE `employee_sold_units` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `lead_id` int(255) NOT NULL,
  `employee_name` varchar(255) NOT NULL,
  `employeeId` int(255) NOT NULL,
  `unit_id` int(255) NOT NULL,
  `unit_no` int(255) NOT NULL,
  `unit_status` varchar(255) NOT NULL,
  `main_project_id` int(100) NOT NULL,
  `project_name` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_sold_units`
--

INSERT INTO `employee_sold_units` (`id`, `name`, `lead_id`, `employee_name`, `employeeId`, `unit_id`, `unit_no`, `unit_status`, `main_project_id`, `project_name`, `date`) VALUES
(20, 'test of project name unit233', 155, 'umer', 29, 7, 3, 'sold', 21, 'nirvana homes exotica', '2025-02-22');

-- --------------------------------------------------------

--
-- Table structure for table `follow_up_leads`
--

CREATE TABLE `follow_up_leads` (
  `id` int(255) NOT NULL,
  `project_name` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `lead_id` int(255) NOT NULL,
  `employee_name` varchar(255) NOT NULL,
  `employeeId` int(255) NOT NULL,
  `follow_up_type` varchar(255) NOT NULL,
  `follow_up_date` varchar(255) NOT NULL,
  `report` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `follow_up_leads`
--

INSERT INTO `follow_up_leads` (`id`, `project_name`, `name`, `lead_id`, `employee_name`, `employeeId`, `follow_up_type`, `follow_up_date`, `report`) VALUES
(9, '', 'Prakash Pandey', 149, 'umer', 29, 'call', '2024-11-09', 'he said that plots is good '),
(10, '', 'Prakash Pandey', 149, 'umer', 29, 'call', '2024-11-08', 'he said that plots is good '),
(11, 'nirvana homes exotica', 'test of project name unit233', 155, 'umer', 29, 'call', '2025-02-18', 'he said that plots is good ');

-- --------------------------------------------------------

--
-- Table structure for table `formtable`
--

CREATE TABLE `formtable` (
  `id` int(11) NOT NULL,
  `form_id` varchar(255) NOT NULL,
  `form_name` varchar(255) NOT NULL,
  `project_id` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `formtable`
--

INSERT INTO `formtable` (`id`, `form_id`, `form_name`, `project_id`) VALUES
(12, '1935750583597667', 'META Ad One', 0),
(13, '1564826437399879', 'META Ad Two', 0),
(20, '1212555', '12545', 21);

-- --------------------------------------------------------

--
-- Table structure for table `invoice_company_proflie`
--

CREATE TABLE `invoice_company_proflie` (
  `id` int(11) NOT NULL,
  `logo` varchar(255) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `company_name_account_name` varchar(255) NOT NULL,
  `company_name_account_ifsc` varchar(255) NOT NULL,
  `company_name_account_number` varchar(255) NOT NULL,
  `company_address` varchar(255) NOT NULL,
  `charges` varchar(255) NOT NULL,
  `bank` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice_company_proflie`
--

INSERT INTO `invoice_company_proflie` (`id`, `logo`, `company_name`, `company_name_account_name`, `company_name_account_ifsc`, `company_name_account_number`, `company_address`, `charges`, `bank`) VALUES
(41, 'https://crmdemo.vimubds5.a2hosted.com/uploads/logo-1709650245154infosysytems-removebg-preview.png', 'Doaguru Infosystems', 'DOAGuru InfoSystems', 'SBIN0004677', '38666325192', '1815 Wright Town, Jabalpur, Madhya pradesh INDIA 482002', ' GST-18% : - 23AGLPP2890G1Z7', 'SBI Bank , Jabalpur'),
(42, 'https://crmdemo.vimubds5.a2hosted.com/uploads/logo-1709650492239serviceslogo-removebg-preview.png', 'Doaguru IT Solutions', 'For TDS Payment : DOAGuru IT Solutions', 'HDFC0000224', '50200074931981', '1815 Wright Town, Jabalpur, Madhya pradesh INDIA 482002', 'PAN:- ASTPT3654Q', 'HDFC Bank , Jabalpur'),
(45, 'https://crmdemo.vimubds5.a2hosted.com/uploads/logo-1709650245154infosysytems-removebg-preview.png', 'Doaguru Infosystems IGST', 'DOAGuru InfoSystems', 'SBIN0004677', '38666325192', '1815 Wright Town, Jabalpur, Madhya pradesh INDIA 482002', ' IGST-18% : - 23AGLPP2890G1Z7', 'SBI Bank , Jabalpur');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_data`
--

CREATE TABLE `invoice_data` (
  `invoice_id` int(11) NOT NULL,
  `invoice_no` int(11) NOT NULL,
  `invoice_name` varchar(255) NOT NULL,
  `invoice_address` varchar(255) NOT NULL,
  `payment_mode` varchar(255) NOT NULL,
  `created_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `client_gst_no` varchar(255) DEFAULT NULL,
  `client_gst_per` int(11) DEFAULT NULL,
  `client_pan_no` varchar(255) DEFAULT NULL,
  `company_type` varchar(255) NOT NULL,
  `invoice_date` date NOT NULL,
  `duration_start_date` date NOT NULL,
  `duration_end_date` date NOT NULL,
  `employeeId` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice_data`
--

INSERT INTO `invoice_data` (`invoice_id`, `invoice_no`, `invoice_name`, `invoice_address`, `payment_mode`, `created_date`, `client_gst_no`, `client_gst_per`, `client_pan_no`, `company_type`, `invoice_date`, `duration_start_date`, `duration_end_date`, `employeeId`) VALUES
(85, 58525, 'testdemo', 'jbp', 'UPI', '2024-09-19 14:07:40', '525285285285285', 12, '', 'Doaguru Infosystems', '2024-10-26', '2024-09-10', '2024-09-11', 29);

-- --------------------------------------------------------

--
-- Table structure for table `invoice_notes`
--

CREATE TABLE `invoice_notes` (
  `id` int(11) NOT NULL,
  `note_text` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `invoice_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoice_services_data`
--

CREATE TABLE `invoice_services_data` (
  `service_invoice_id` int(11) NOT NULL,
  `invoice_id` int(11) DEFAULT NULL,
  `invoice_name` varchar(255) NOT NULL,
  `service_type` varchar(255) NOT NULL,
  `service_name` varchar(255) NOT NULL,
  `actual_price` decimal(10,2) DEFAULT NULL,
  `offer_price` decimal(10,2) NOT NULL,
  `subscription_frequency` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice_services_data`
--

INSERT INTO `invoice_services_data` (`service_invoice_id`, `invoice_id`, `invoice_name`, `service_type`, `service_name`, `actual_price`, `offer_price`, `subscription_frequency`) VALUES
(111, 85, 'testdemo', 'Paid', 'Google PPC Ads', 5000.00, 4000.00, 'Half Yearly');

-- --------------------------------------------------------

--
-- Table structure for table `leads`
--

CREATE TABLE `leads` (
  `lead_id` int(11) NOT NULL,
  `lead_no` varchar(50) NOT NULL,
  `assignedTo` varchar(100) NOT NULL,
  `employeeId` int(255) NOT NULL,
  `createdTime` varchar(255) NOT NULL,
  `actual_date` varchar(255) NOT NULL,
  `assignedBy` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `leadSource` varchar(100) NOT NULL,
  `project_name` varchar(255) NOT NULL,
  `main_project_id` int(255) NOT NULL,
  `unit_type` varchar(255) NOT NULL,
  `unit_id` int(255) NOT NULL,
  `unit_number` varchar(255) NOT NULL DEFAULT 'pending',
  `unit_status` varchar(255) NOT NULL DEFAULT 'pending',
  `remark_status` varchar(255) NOT NULL DEFAULT 'pending',
  `answer_remark` varchar(255) NOT NULL DEFAULT 'pending',
  `remark_id` int(255) DEFAULT NULL,
  `meeting_status` varchar(255) NOT NULL DEFAULT 'pending',
  `lead_status` varchar(255) NOT NULL DEFAULT 'pending',
  `booking_amount` varchar(255) NOT NULL DEFAULT 'pending',
  `payment_mode` varchar(255) NOT NULL DEFAULT 'pending',
  `registry` varchar(255) NOT NULL DEFAULT 'pending',
  `address` varchar(255) NOT NULL,
  `visit` varchar(255) NOT NULL DEFAULT 'pending ',
  `visit_date` varchar(255) NOT NULL DEFAULT 'pending',
  `deal_status` varchar(255) NOT NULL DEFAULT 'pending',
  `d_closeDate` varchar(255) NOT NULL DEFAULT 'pending',
  `reason` varchar(255) NOT NULL DEFAULT 'pending',
  `follow_up_status` varchar(255) NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leads`
--

INSERT INTO `leads` (`lead_id`, `lead_no`, `assignedTo`, `employeeId`, `createdTime`, `actual_date`, `assignedBy`, `name`, `phone`, `leadSource`, `project_name`, `main_project_id`, `unit_type`, `unit_id`, `unit_number`, `unit_status`, `remark_status`, `answer_remark`, `remark_id`, `meeting_status`, `lead_status`, `booking_amount`, `payment_mode`, `registry`, `address`, `visit`, `visit_date`, `deal_status`, `d_closeDate`, `reason`, `follow_up_status`) VALUES
(124, '211', 'umer', 29, '2024-10-31', '2024-10-31', 'Admin', 'Satyam Mishra', '8770422546', '99 Acres', 'nirvana homes exotica', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'completed', '1000', 'cash', 'done', 'Jabalpur', 'fresh', 'pending', 'close', '2024-11-01', 'pending', 'pending'),
(129, '1218599669443593', 'vinay', 25, '2024-11-22', '2024-10-31', 'Admin', 'Binod kumar Swarnkar', '+919993454635', 'Facebook Campaign', '', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'pending', 'pending', 'pending', 'pending', 'Plot A-67,  jasuja city phase 3', 'pending ', 'pending', 'pending', 'pending', 'pending', 'pending'),
(130, '1601177500780293', 'sofia', 31, '2024-11-10', '2024-10-31', 'Admin', 'M.P. Singh', '9425015136', 'Facebook Campaign', '', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'pending', 'pending', 'pending', 'pending', '????????', 'pending ', 'pending', 'pending', 'pending', 'pending', 'pending'),
(131, '215', 'vinay', 25, '2024-11-30', '2024-10-31', 'Admin', 'Dr Umesh Kumar Kori', '+91-7000275146', '99 Acres', '', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'pending', 'pending', 'pending', 'pending', 'Jabalpur', 'pending ', 'pending', 'pending', 'pending', 'pending', 'pending'),
(132, '24', 'umer', 29, '2024-11-17', '2024-10-23', 'Admin', 'Test Email Integration  ', '9696969696', 'One Realty Website', '', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'active lead', 'pending', 'pending', 'pending', 'indore', 'pending ', 'pending', 'pending', 'pending', 'pending', 'pending'),
(133, '220', 'umer', 29, '2024-11-02', '2024-11-02', 'Admin', 'Mohit Verma', '+91-8269973198', '99 Acres', '', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'in progress', 'pending', 'pending', 'pending', 'Jabalpur', 'fresh', 'pending', 'pending', 'pending', 'pending', 'in progress'),
(134, '136', 'vinay', 25, '2024-11-16', '2024-11-16', 'Admin', 'Baiche', '7584838488', 'Paid Advertising', '', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'pending', 'pending', 'pending', 'pending', '2hchw', 'pending ', 'pending', 'pending', 'pending', 'pending', 'pending'),
(135, '9198900449', 'vinay', 25, '2024-11-03', '2024-11-03', 'Admin', 'ayush jaiswal', '8318864691', 'just for testing purpose ', '', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'pending', 'pending', 'pending', 'pending', 'Gorakhpur', 'pending ', 'pending', 'pending', 'pending', 'pending', 'pending'),
(136, '9198900449', 'vinay', 25, '2024-11-03', '2024-11-03', 'Admin', 'ayush jaiswal', '8318864691', 'just for testing purpose ', '', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'pending', 'pending', 'pending', 'pending', 'Gorakhpur', 'pending ', 'pending', 'pending', 'pending', 'pending', 'pending'),
(137, '9198900449', 'vinay', 25, '2024-11-07', '2024-11-07', 'Admin', 'ayush jaiswal', '8318864691', 'just for testing purpose ', '', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'pending', 'pending', 'pending', 'pending', 'Gorakhpur', 'pending ', 'pending', 'pending', 'pending', 'pending', 'pending'),
(138, '9198900449', 'test', 34, '2024-11-07', '2024-11-07', 'Admin', 'ayush jaiswal', '8318864691', 'just for testing purpose ', '', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'in progress', '500', 'cash', 'done', 'Gorakhpur', 'fresh', 'pending', 'close', '2024-11-03', 'pending', 'in progress'),
(139, '901808688556391', 'vinay', 25, '2024-11-07', '2024-11-07', 'Admin', 'Gourav Vishwakarma', '8823020013', 'Facebook Campaign', '', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'pending', 'pending', 'pending', 'pending', 'Adhartal', 'pending ', 'pending', 'pending', 'pending', 'pending', 'pending'),
(140, '519643124275656', 'test', 34, '2024-11-07', '2024-11-07', 'Admin', 'Jyoti Rohit', '8492828523', 'Facebook Campaign', '', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'in progress', 'pending', 'pending', 'pending', 'Dhanwantari nagar.', 'fresh', 'pending', 'pending', 'pending', 'pending', 'done'),
(141, '899446881796547', 'test', 34, '2024-11-07', '2024-11-07', 'Admin', 'Deepak Patwa', '9329512080', 'Facebook Campaign', '', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'pending', 'pending', 'pending', 'pending', 'trimurti nager', 'self', 'pending', 'pending', 'pending', 'pending', 'pending'),
(142, '33', 'test', 34, '2024-11-07', '2024-11-07', 'Admin', 'test for crm ', '8888888888', 'One Realty Website', '', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'pending', 'pending', 'pending', 'pending', 'Jabalpur', 'pending ', 'pending', 'pending', 'pending', 'pending', 'pending'),
(143, '235', 'test', 34, '2024-11-07', '2024-11-07', 'Admin', 'Abhishek shahi', '7987826723', '99 Acres', '', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'pending', 'pending', 'pending', 'pending', 'Jabalpur', 'pending ', 'pending', 'pending', 'pending', 'pending', 'pending'),
(144, '4545234', 'test', 34, '2024-11-07', '2024-11-07', 'Admin', 'umer', '6260550661', 'Cold Calling', '', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'pending', 'pending', 'pending', 'pending', 'Jabalpur', 'pending ', 'pending', 'pending', 'pending', 'pending', 'pending'),
(145, '4545234', 'Raveena Shivhare', 33, '2024-11-07', '2024-11-07', 'Admin', 'umer', '6260550661', 'Online Directories', '', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'pending', 'pending', 'pending', 'pending', '2bhk', 'self', 'pending', 'pending', 'pending', 'pending', 'pending'),
(146, '4545', 'Raveena Shivhare', 33, '2024-11-07', '2024-11-07', 'Admin', 'umer', '6260550661', 'Online Directories', '', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'pending', 'pending', 'pending', 'pending', 'jbp', 'self', 'pending', 'pending', 'pending', 'pending', 'pending'),
(147, '1262813061705939', 'test', 34, '2024-11-07', '2024-11-07', 'Admin', 'Sumit Kasture', '+918965850379', 'Facebook Campaign', '', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'pending', 'pending', 'pending', 'pending', '1441, Ganga Nagar, Garha, JBP', 'pending ', 'pending', 'pending', 'pending', 'pending', 'pending'),
(148, '1336161474460078', 'test', 34, '2024-11-08', '2024-11-06', 'Admin', 'Sanjay Shukla', '+919098575700', 'Facebook Campaign', '', 0, '', 0, 'pending', 'pending', 'mohit sahu ji said that he will purchase plots', 'ok i will talk you', 19, 'done by manager', 'completed', 'pending', 'pending', 'pending', 'Kundqm', 're-visit', 'pending', 'pending', 'pending', 'df', 'in progress'),
(149, '4545', 'umer', 29, '2025-02-12', '2025-02-12', 'Admin', 'Umer Doaguru', '6260550661', 'Cold Calling', 'SS construction', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'pending', 'pending', 'pending', 'pending', 'fde', 'pending ', 'pending', 'pending', 'pending', 'pending', 'pending'),
(150, '12', 'umer', 29, '2025-02-12', '2025-02-12', 'Admin', 'test', '6260550661', 'Direct Mail', 'nirvana homes exotica', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'completed', 'pending', 'pending', 'pending', 'Jabalpur', 'pending ', 'pending', 'pending', 'pending', 'pending', 'pending'),
(151, '345', 'vinay', 25, '2025-02-08', '2025-02-08', 'Admin', '345', '4545454554', 'Email Campaigns', 'nirvana homes exotica', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'pending', 'pending', 'pending', 'pending', '45', 'pending ', 'pending', 'pending', 'pending', 'pending', 'pending'),
(152, '344', 'umer', 29, '2025-02-12', '2025-02-12', 'Super Admin', '.htaccess', '6260550661', 'Direct Mail', 'nirvana homes exotica', 0, '', 0, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'pending', 'pending', 'pending', 'pending', 'jbp', 'pending ', 'pending', 'pending', 'pending', 'pending', 'pending'),
(154, '4545234', 'umer', 29, '2025-02-15', '2025-02-15', 'Admin', 'test of project name unit', '6260550661', 'Email Campaigns', 'nirvana homes exotica', 21, '2BHK', 5, 'pending', 'pending', 'pending', 'pending', NULL, 'pending', 'site visit done', 'pending', 'pending', 'pending', 'Satna', 'fresh', 'pending', 'pending', 'pending', 'pending', 'pending'),
(155, '45454545', 'umer', 29, '2025-02-18', '2025-02-18', 'Admin', 'test of project name unit233', '6260550661', 'Direct Mail', 'nirvana homes exotica', 21, '1BHK', 7, '3', 'sold', 'pending', 'pending', NULL, 'pending', 'pending', 'pending', 'pending', 'pending', 'jbp', 'pending ', 'pending', 'pending', 'pending', 'pending', 'in progress');

-- --------------------------------------------------------

--
-- Table structure for table `leadstable`
--

CREATE TABLE `leadstable` (
  `id` int(11) NOT NULL,
  `lead_id` varchar(255) NOT NULL,
  `full_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `street_address` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `form_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `leadstable`
--

INSERT INTO `leadstable` (`id`, `lead_id`, `full_name`, `phone_number`, `street_address`, `created_time`, `form_id`) VALUES
(786, '1238283060819453', 'Satyendra Tiwari', '+917999996963', 'House nu 49 Ashok Vihar colony Jabalpur', '2024-10-19 22:47:46', '1935750583597667'),
(787, '1238283060819454', 'Ravi Shukla', '+917888886964', 'Plot no 12 Shanti Nagar Bhopal', '2024-10-20 18:35:21', '1935750583597667'),
(788, '1238283060819455', 'Anjali Verma', '+917777776965', 'Flat no 8 Sunrise Apartments Indore', '2024-10-21 10:15:34', '1935750583597667'),
(789, '1238283060819456', 'Amit Kumar', '+917666666966', 'Building 5, MG Road Gwalior', '2024-10-22 14:55:07', '1935750583597667'),
(790, '1238283060819457', 'Neha Singh', '+917555556967', 'House no 25, Nehru Nagar Jabalpur', '2024-10-23 09:47:52', '1935750583597667'),
(791, '1238283060819458', 'Vikram Chauhan', '+917444446968', 'Plot 3, Industrial Area, Satna', '2024-10-24 17:03:44', '1935750583597667'),
(792, '1238283060819459', 'Sunita Patil', '+917333336969', 'House no 65, Sector B, Ujjain', '2024-10-25 13:22:11', '1935750583597667'),
(793, '1238283060819460', 'Rajesh Thakur', '+917222226970', 'Flat 10, Green Valley, Dewas', '2024-10-26 20:18:37', '1935750583597667'),
(794, '1238283060819461', 'Manoj Joshi', '+917111116971', 'House no 45, Patel Nagar, Rewa', '2024-10-27 15:40:29', '1935750583597667'),
(795, '1238283060819462', 'Priya Saxena', '+917000006972', 'Plot no 29, Shree Nagar, Sagar', '2024-10-28 11:55:18', '1935750583597667'),
(849, '905447731177547', 'Prakash Pandey', '+918770276615', 'Gorakhpur', '2024-11-08 21:57:12', '1935750583597667'),
(850, '393676367044210', 'sanyogita Shrivastava', '+919340384104', 'Jabalpur', '2024-11-08 21:09:22', '1935750583597667'),
(851, '567007272549426', 'Adv Pawan Shrivastava', '+919827236339', 'H.No.1013 Shastri Nagar Colony Near Medical College Garha jabalpur', '2024-11-08 20:45:04', '1935750583597667'),
(852, '2982149905266875', 'Abhisek', '+918109693544', '7995221', '2024-11-08 20:20:32', '1935750583597667'),
(853, '1644922746406510', 'Deepak', '7000168165', '1307 bai ka Bagicha ghamapur', '2024-11-08 19:22:54', '1935750583597667'),
(854, '1102624208137098', 'Tulika Tanu', '+916263988285', 'Chhoti omti jabalpur', '2024-11-07 20:46:08', '1935750583597667'),
(855, '1241536497090053', 'Prashant Rajak', '+919300751787', 'daya nagar', '2024-11-07 20:44:20', '1935750583597667'),
(856, '1262813061705939', 'Sumit Kasture', '+918965850379', '1441, Ganga Nagar, Garha, JBP', '2024-11-07 18:22:18', '1935750583597667'),
(857, '574825791789436', 'Ajay Soni', '+918109081039', 'rampur', '2024-11-06 20:19:03', '1935750583597667'),
(858, '3469281410047928', 'Nitesh Malviya', '+919111464771', 'Dewas naka', '2024-11-06 15:18:21', '1935750583597667'),
(859, '948847300396687', 'Naveena BADKUR', '+919399221587', 'main road kandeli narshingpur', '2024-11-06 14:17:17', '1935750583597667'),
(860, '1336161474460078', 'Sanjay Shukla', '+919098575700', 'Kundqm', '2024-11-06 12:53:37', '1935750583597667'),
(861, '456402320349143', 'Shilpi sethiya', '+919340718557', 'Katni', '2024-11-05 20:49:32', '1935750583597667'),
(862, '1344756813594775', 'Swatantra Pandey', '+919425824229', 'civil line', '2024-11-05 20:37:34', '1935750583597667'),
(863, '992984739507795', 'Nitin Bachkainya', '7987114066', 'Ganga Nagar, Garha, jabalpur', '2024-11-05 20:05:04', '1935750583597667'),
(864, '445488648575396', 'Dr-Shubh Kushwaha PT', '+919685965749', 'gwarighat', '2024-11-05 19:53:45', '1935750583597667'),
(865, '1573437423273037', 'Sanjay Soni', '+918518075283', 'mp', '2024-11-05 18:57:38', '1935750583597667'),
(866, '1699552000777846', 'ˢᵏᵗ-ᵐʸʷᵒʳˡᵈ', '+919827753865', 'Indore', '2024-11-05 17:01:49', '1935750583597667'),
(867, '909655464482601', 'Rahul Bundela', '+918871495350', 'Swiss villa', '2024-11-05 15:55:33', '1935750583597667'),
(868, '573378211850413', 'satish kumar patel', '+919522447446', 'jabalpur', '2024-11-05 14:06:14', '1935750583597667'),
(869, '475200745566059', 'Sonamamit', '+919098892952', 'Vijay nagar', '2024-11-05 13:00:27', '1935750583597667'),
(870, '1124799508986784', 'Rajesh Patel', '+919893049076', 'Jabalpur', '2024-11-04 23:41:20', '1935750583597667'),
(871, '1255326728952107', 'Radhe Shyam Shrivas', '+919977254854', '2 manth', '2024-11-04 22:55:34', '1935750583597667'),
(872, '347772928394529', 'Shailash George', '+917389210683', '800 dawarka Nagar khanchghar jabalpur', '2024-11-04 22:25:22', '1935750583597667'),
(873, '1810383329762541', 'Shivansh Tiwari', '+916267192049', 'Sagda bypass road lamheghat', '2024-11-04 22:25:20', '1935750583597667'),
(874, '393676367044210', 'sanyogita Shrivastava', '+919340384104', 'Jabalpur', '2024-11-08 21:09:22', '1935750583597667'),
(875, '567007272549426', 'Adv Pawan Shrivastava', '+919827236339', 'H.No.1013 Shastri Nagar Colony Near Medical College Garha jabalpur', '2024-11-08 20:45:04', '1935750583597667'),
(876, '2982149905266875', 'Abhisek', '+918109693544', '7995221', '2024-11-08 20:20:32', '1935750583597667'),
(877, '1644922746406510', 'Deepak', '7000168165', '1307 bai ka Bagicha ghamapur', '2024-11-08 19:22:54', '1935750583597667'),
(878, '1102624208137098', 'Tulika Tanu', '+916263988285', 'Chhoti omti jabalpur', '2024-11-07 20:46:08', '1935750583597667'),
(879, '1241536497090053', 'Prashant Rajak', '+919300751787', 'daya nagar', '2024-11-07 20:44:20', '1935750583597667'),
(880, '1262813061705939', 'Sumit Kasture', '+918965850379', '1441, Ganga Nagar, Garha, JBP', '2024-11-07 18:22:18', '1935750583597667'),
(881, '574825791789436', 'Ajay Soni', '+918109081039', 'rampur', '2024-11-06 20:19:03', '1935750583597667'),
(882, '3469281410047928', 'Nitesh Malviya', '+919111464771', 'Dewas naka', '2024-11-06 15:18:21', '1935750583597667'),
(883, '948847300396687', 'Naveena BADKUR', '+919399221587', 'main road kandeli narshingpur', '2024-11-06 14:17:17', '1935750583597667'),
(884, '1336161474460078', 'Sanjay Shukla', '+919098575700', 'Kundqm', '2024-11-06 12:53:37', '1935750583597667'),
(885, '456402320349143', 'Shilpi sethiya', '+919340718557', 'Katni', '2024-11-05 20:49:32', '1935750583597667'),
(886, '1344756813594775', 'Swatantra Pandey', '+919425824229', 'civil line', '2024-11-05 20:37:34', '1935750583597667'),
(887, '992984739507795', 'Nitin Bachkainya', '7987114066', 'Ganga Nagar, Garha, jabalpur', '2024-11-05 20:05:04', '1935750583597667'),
(888, '445488648575396', 'Dr-Shubh Kushwaha PT', '+919685965749', 'gwarighat', '2024-11-05 19:53:45', '1935750583597667'),
(889, '1573437423273037', 'Sanjay Soni', '+918518075283', 'mp', '2024-11-05 18:57:38', '1935750583597667'),
(890, '1699552000777846', 'ˢᵏᵗ-ᵐʸʷᵒʳˡᵈ', '+919827753865', 'Indore', '2024-11-05 17:01:49', '1935750583597667'),
(891, '909655464482601', 'Rahul Bundela', '+918871495350', 'Swiss villa', '2024-11-05 15:55:33', '1935750583597667'),
(892, '573378211850413', 'satish kumar patel', '+919522447446', 'jabalpur', '2024-11-05 14:06:14', '1935750583597667'),
(893, '475200745566059', 'Sonamamit', '+919098892952', 'Vijay nagar', '2024-11-05 13:00:27', '1935750583597667'),
(894, '1124799508986784', 'Rajesh Patel', '+919893049076', 'Jabalpur', '2024-11-04 23:41:20', '1935750583597667'),
(895, '1255326728952107', 'Radhe Shyam Shrivas', '+919977254854', '2 manth', '2024-11-04 22:55:34', '1935750583597667'),
(896, '347772928394529', 'Shailash George', '+917389210683', '800 dawarka Nagar khanchghar jabalpur', '2024-11-04 22:25:22', '1935750583597667'),
(897, '1810383329762541', 'Shivansh Tiwari', '+916267192049', 'Sagda bypass road lamheghat', '2024-11-04 22:25:20', '1935750583597667'),
(898, '3619593168184124', 'Deepak Kumar', '+919009555111', 'Jabalpur', '2024-11-09 15:44:04', '1935750583597667'),
(899, '1644759929414864', 'HORI LAL', '+919872727858', '112G/6 Vishnapuri', '2024-11-16 16:31:20', '1935750583597667'),
(900, '1964867277288736', 'Shakti Guppta', '+919770415141', 'Shaktiluck@gmail.com', '2024-11-15 23:33:24', '1935750583597667'),
(901, '1267028871169237', 'Amar Sen', '+919907594007', 'jabalpur', '2024-11-15 19:03:04', '1935750583597667'),
(902, '3411787582460499', 'Savita Saiyam Dhurvey', '+919340249759', 'in front Katanga tv tower  jabalpur', '2024-11-15 16:16:27', '1935750583597667'),
(903, '1694768347763403', 'Govinda Ben', '+919584200503', 'civil lines', '2024-11-13 00:28:28', '1935750583597667'),
(904, '1089231545567674', 'Vinay Kumar Singh', '+919301256870', 'katni', '2024-11-12 23:59:44', '1935750583597667'),
(905, '551658037612410', 'Hemanshu Chakravorti', '+919713861335', 'please arrange test drive', '2024-11-12 23:58:01', '1935750583597667'),
(906, '2011200129324601', 'Anil Kumar Gupta', '+919300531208', 'best possible rates', '2024-11-12 23:40:20', '1935750583597667'),
(907, '1645456593071653', 'Nishant Soni', '+918719981090', 'kanchan nagar jabalpur', '2024-11-12 23:05:18', '1935750583597667'),
(908, '1097670711719923', 'Alok Jain', '+919039381003', 'how to lone', '2024-11-12 21:39:06', '1935750583597667'),
(909, '1944050752673884', 'Najeeb Khan 72023023069', '+919223023069', 'near bilhari petrol pump', '2024-11-12 21:18:41', '1935750583597667'),
(910, '1941940196218234', 'Manju Dubey', '+919424955800', 'H.No. 2469 Madan Mahal Station Road, Near Anant Hospital, Wright Town, Jabalpur-482002 (M.P.)', '2024-11-12 20:45:40', '1935750583597667'),
(911, '471725088758145', 'Yogendra Tiwari', '+919300051262', '675/1, Bhantalliya, Badikhermai Mandir Jabalpur', '2024-11-12 19:56:03', '1935750583597667'),
(912, '912240107120228', 'Kapil Lalwani', '+919669660071', 'sr mig 289 mansarover colony madhav nagar', '2024-11-12 19:31:24', '1935750583597667'),
(913, '3725936677645921', 'Pallavi Vishwakarma', '9302519672', 'jabalpur', '2024-11-12 19:30:30', '1935750583597667'),
(914, '433261369577907', 'Deependra Singh', '+919721753775', 'call me', '2024-11-12 19:10:07', '1935750583597667'),
(915, '882436270310604', 'Shivraj Singh Chauhan', '+918109093208', 'katangi', '2024-11-12 01:50:39', '1935750583597667'),
(916, '1213047849776448', 'Ankit Jhariya', '6265060901', 'Nainpur', '2024-11-12 01:40:29', '1935750583597667'),
(917, '560523826932200', 'abhi', '8770779612', 'jabalpur', '2024-11-12 00:52:52', '1935750583597667'),
(918, '1301428374541872', 'Siddharth Agrawal Sid', '+918989418660', 'Hhh', '2024-11-12 00:51:33', '1935750583597667'),
(919, '1095840135286337', 'Shreeniwas Kumar', '+919424766887', 'jabalpur', '2024-11-12 00:51:10', '1935750583597667'),
(920, '544807238507747', 'Dr-Rajendra Singh Thakur', '+919179391442', 'qwen', '2024-11-12 00:48:48', '1935750583597667'),
(921, '1605993990354552', 'Rohit __ sigia  _ thakur', '+919691832499', 'Xxxcxxxxcccf', '2024-11-12 00:46:09', '1935750583597667'),
(922, '1885511818603191', 'Sanjay Yadav', '+919098303999', 'shastri nagar', '2024-11-12 00:42:25', '1935750583597667'),
(923, '582516087619284', 'Shravan Dubey', '+917999430225', 'damoh nsks chatria bus stand', '2024-11-12 00:24:48', '1935750583597667'),
(924, '3411787582460499', 'Savita Saiyam Dhurvey', '+919340249759', 'in front Katanga tv tower  jabalpur', '2024-11-15 16:16:27', '1935750583597667'),
(925, '1694768347763403', 'Govinda Ben', '+919584200503', 'civil lines', '2024-11-13 00:28:28', '1935750583597667'),
(926, '1089231545567674', 'Vinay Kumar Singh', '+919301256870', 'katni', '2024-11-12 23:59:44', '1935750583597667'),
(927, '551658037612410', 'Hemanshu Chakravorti', '+919713861335', 'please arrange test drive', '2024-11-12 23:58:01', '1935750583597667'),
(928, '2011200129324601', 'Anil Kumar Gupta', '+919300531208', 'best possible rates', '2024-11-12 23:40:20', '1935750583597667'),
(929, '1645456593071653', 'Nishant Soni', '+918719981090', 'kanchan nagar jabalpur', '2024-11-12 23:05:18', '1935750583597667'),
(930, '1097670711719923', 'Alok Jain', '+919039381003', 'how to lone', '2024-11-12 21:39:06', '1935750583597667'),
(931, '1944050752673884', 'Najeeb Khan 72023023069', '+919223023069', 'near bilhari petrol pump', '2024-11-12 21:18:41', '1935750583597667'),
(932, '1941940196218234', 'Manju Dubey', '+919424955800', 'H.No. 2469 Madan Mahal Station Road, Near Anant Hospital, Wright Town, Jabalpur-482002 (M.P.)', '2024-11-12 20:45:40', '1935750583597667'),
(933, '471725088758145', 'Yogendra Tiwari', '+919300051262', '675/1, Bhantalliya, Badikhermai Mandir Jabalpur', '2024-11-12 19:56:03', '1935750583597667'),
(934, '912240107120228', 'Kapil Lalwani', '+919669660071', 'sr mig 289 mansarover colony madhav nagar', '2024-11-12 19:31:24', '1935750583597667'),
(935, '3725936677645921', 'Pallavi Vishwakarma', '9302519672', 'jabalpur', '2024-11-12 19:30:30', '1935750583597667'),
(936, '433261369577907', 'Deependra Singh', '+919721753775', 'call me', '2024-11-12 19:10:07', '1935750583597667'),
(937, '882436270310604', 'Shivraj Singh Chauhan', '+918109093208', 'katangi', '2024-11-12 01:50:39', '1935750583597667'),
(938, '1213047849776448', 'Ankit Jhariya', '6265060901', 'Nainpur', '2024-11-12 01:40:29', '1935750583597667'),
(939, '560523826932200', 'abhi', '8770779612', 'jabalpur', '2024-11-12 00:52:52', '1935750583597667'),
(940, '1301428374541872', 'Siddharth Agrawal Sid', '+918989418660', 'Hhh', '2024-11-12 00:51:33', '1935750583597667'),
(941, '1095840135286337', 'Shreeniwas Kumar', '+919424766887', 'jabalpur', '2024-11-12 00:51:10', '1935750583597667'),
(942, '544807238507747', 'Dr-Rajendra Singh Thakur', '+919179391442', 'qwen', '2024-11-12 00:48:48', '1935750583597667'),
(943, '1605993990354552', 'Rohit __ sigia  _ thakur', '+919691832499', 'Xxxcxxxxcccf', '2024-11-12 00:46:09', '1935750583597667'),
(944, '1885511818603191', 'Sanjay Yadav', '+919098303999', 'shastri nagar', '2024-11-12 00:42:25', '1935750583597667'),
(945, '582516087619284', 'Shravan Dubey', '+917999430225', 'damoh nsks chatria bus stand', '2024-11-12 00:24:48', '1935750583597667'),
(946, '1688244455291242', 'Dharm Das Diwan', '+918871598876', 'jabalpur', '2024-10-14 04:12:04', '1564826437399879'),
(947, '887748256662973', 'shameem.shaikhshifa.shaikh', '9770148348', 'Satna', '2024-10-14 03:06:26', '1564826437399879'),
(948, '1019402479981029', 'Ujjwal Sharma', '9770802963', 'Mandla Madhya Pradesh', '2024-10-14 00:01:25', '1564826437399879'),
(949, '825529499485315', 'Krishan Patel', '+919981204950', 'Jabalpur', '2024-10-13 22:28:51', '1564826437399879'),
(950, '1107778027434890', 'Chandra Pillai', '+919340676562', 'GOPAL SADAN, DAMOH NAKA, JBP.', '2024-10-13 22:07:01', '1564826437399879'),
(951, '2040224759729637', 'Anup Kumar', '+918085756295', 'Bhopal', '2024-10-13 19:11:48', '1564826437399879'),
(952, '556861853409851', 'Kaushlendra', '+919990872822', 'New Resham Mill', '2024-10-13 18:23:04', '1564826437399879'),
(953, '1214895979787159', 'Mukesh Dangode', '+917999671043', 'K', '2024-10-13 17:26:52', '1564826437399879'),
(954, '889715196431622', 'baby_ doll_Garima', '+918818927611', 'Gwarighat jbp', '2024-10-12 01:48:26', '1564826437399879'),
(955, '8868239409855705', 'Manish Patel', '9200872758', 'Railway station road Indraatket', '2024-10-11 03:00:01', '1564826437399879'),
(956, '1325597994971442', 'Meenu Chadha', '+919340294171', 'Dubey colony', '2024-10-11 00:13:08', '1564826437399879'),
(957, '1230525171431353', 'Jivika Piyush Matani', '+918103642337', 'Ukhri road', '2024-10-10 20:19:56', '1564826437399879'),
(958, '1227341538515982', 'Shalini Khare', '+919981897440', 'Jabalpur', '2024-10-10 19:31:16', '1564826437399879'),
(959, '1258174752031271', 'Sonu Lalwani', '9131041167', 'Katni', '2024-10-10 18:06:42', '1564826437399879'),
(960, '1963724854127076', 'Ravi Tripathi', '+919425808444', 'Jabalpur', '2024-10-10 15:50:02', '1564826437399879'),
(961, '867046335495332', 'Dr. Afsana Ansari physiotherapist.', '7974211441', 'Hanuman tal jabalpur', '2024-10-10 12:35:59', '1564826437399879'),
(962, '2531840980342502', 'rk singh', '6267535802', 'Adhartal', '2024-10-10 09:33:57', '1564826437399879'),
(963, '1224049392147166', 'Deepak Yadav', '+919806145987', 'BILHARI', '2024-10-10 01:20:07', '1564826437399879'),
(964, '881954960547212', 'Deepak Sawlani', '+918109995629', 'NAPIER TOWN', '2024-10-10 01:19:57', '1564826437399879'),
(965, '547053201198099', 'Awdhesh Dehariya', '+919644637424', 'seoni', '2024-10-10 00:44:35', '1564826437399879'),
(966, '383412418171910', 'Munendra Dar', '+919669771234', 'Dewas , Madhya Pradesh', '2024-10-10 00:44:23', '1564826437399879'),
(967, '510512291879170', 'juned mansuri', '+918109752513', 'Khajrana', '2024-10-10 00:40:38', '1564826437399879'),
(968, '1186765509076545', 'Nitin Raja Jain', '+919827674791', 'jabalpur', '2024-10-10 00:26:51', '1564826437399879'),
(969, '1099752775049886', 'Naveen Pandey', '+919399183862', 'xyz', '2024-10-10 00:20:03', '1564826437399879'),
(970, '570915772030996', 'preeti Kumari singh', '+919691528205', 'hajipur', '2024-10-09 15:05:10', '1564826437399879');

-- --------------------------------------------------------

--
-- Table structure for table `leads_email`
--

CREATE TABLE `leads_email` (
  `id` int(11) NOT NULL,
  `lead_name` varchar(255) DEFAULT NULL,
  `status` enum('Pending','In Progress','Completed') NOT NULL,
  `due_date` date DEFAULT NULL,
  `reminder_sent` tinyint(1) DEFAULT 0,
  `last_reminder_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `id` int(11) NOT NULL,
  `quotation_id` int(11) DEFAULT NULL,
  `note_text` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notes`
--

INSERT INTO `notes` (`id`, `quotation_id`, `note_text`) VALUES
(71, 129, 'SMM Ad Budget :-\nAds budget will be decided by client, suggested ad budget 15000/-'),
(72, 129, 'Payment/plan can be stopped/changed by informing one month in advance if not satisfied with the services.'),
(73, 129, 'Payment/plan can be stopped/changed by informing one month in advance if not satisfied with the services.'),
(74, 129, 'Estimated time for keywords ranking on the first page : -\n\n\n\n\n\nLow-competition keywords take 2-3 months,\nMedium competition Keywords take 3-5 months,\nHigh-competition Keywords take 6-9 months.\n'),
(75, 129, 'Required details like credentials and other details are needed to share timely.'),
(76, 129, 'Estimated time for keywords ranking on the first page : -\n\n\n\n\n\nLow-competition keywords take 2-3 months,\nMedium competition Keywords take 3-5 months,\nHigh-competition Keywords take 6-9 months.\n'),
(77, 129, 'Required details like credentials and other details are needed to share timely.'),
(81, 135, 'One dedicated SPOC (single point of contact) is required from the client side to approve the posts/contents/videos/website changes, etc.'),
(82, 135, 'dfdffd'),
(83, 135, '3r3'),
(84, 135, 'rere'),
(85, 140, 'Payment/plan can be stopped/changed by informing one month in advance if not satisfied with the services.'),
(86, 140, 'GSTtt'),
(87, 141, 'SMM Ad Budget :-\nAds budget will be decided by client, suggested ad budget 15000/-'),
(89, 143, 'Payment will be 100% in advance and is expected till 3rd of every month.'),
(90, 143, 'ws'),
(91, 145, 'Payment will be 100% in advance and is expected till 3rd of every month.'),
(92, 145, 'One dedicated SPOC (single point of contact) is required from the client side to approve the posts/contents/videos/website changes, etc.'),
(93, 145, 'Estimated time for keywords ranking on the first page : -\n\n\n\n\n\nLow-competition keywords take 2-3 months,\nMedium competition Keywords take 3-5 months,\nHigh-competition Keywords take 6-9 months.\n'),
(94, 145, 'Suggested Ad Amount 20,000/-'),
(97, 194, 'Payment/plan can be stopped/changed by informing one month in advance if not satisfied with the services.'),
(98, 194, 'Required details like credentials and other details are needed to share timely.'),
(99, 194, 'One dedicated SPOC (single point of contact) is required from the client side to approve the posts/contents/videos/website changes, etc.'),
(126, 194, 'chai'),
(160, 230, 'Payment will be 100% in advance and is expected till 3rd of every month.'),
(161, 230, 'One dedicated SPOC (single point of contact) is required from the client side to approve the posts/contents/videos/website changes, etc.'),
(162, 230, 'Estimated time for keywords ranking on the first page : -\n\n\n\n\n\nLow-competition keywords take 2-3 months,\nMedium competition Keywords take 3-5 months,\nHigh-competition Keywords take 6-9 months.\n'),
(163, 230, 'Suggested Ad Amount 20,000/-'),
(164, 231, 'Payment will be 100% in advance and is expected till 3rdsdd of every month.'),
(165, 231, 'sadOne dedicated SPOC (single point of contact) is required from the client side to approve the posts/contents/videos/website changes, etc.'),
(166, 231, 'sdsdEstimated time for keywords ranking on the first page : -\n\n\n\nLow-competition keywords take 2-3 months,\nMedium competition Keywords take 3-5 months,\nHigh-competition Keywords take 6-9 months.\n'),
(167, 231, 'Susdggested Ad Amount 20,000/-\njhjdff'),
(168, 232, 'Payment/plan can be stopped/changed by informing one month in advance if not satisfied with the services.'),
(169, 232, 'GST'),
(170, 243, 'Payment will be 100% in advance and is expected till 3rd of every month./'),
(171, 244, 'Payment will be 100% in advance and is expected till 3rd of every month./');

-- --------------------------------------------------------

--
-- Table structure for table `notes_data`
--

CREATE TABLE `notes_data` (
  `notes_id` int(200) NOT NULL,
  `notes_text` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organization`
--

CREATE TABLE `organization` (
  `companyId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `bankDetails` varchar(255) NOT NULL,
  `signature` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `actions` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `contact` varchar(50) DEFAULT NULL,
  `email_id` varchar(255) DEFAULT NULL,
  `bankname` varchar(255) DEFAULT NULL,
  `ifsc_code` varchar(20) DEFAULT NULL,
  `acc_no` varchar(50) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organization`
--

INSERT INTO `organization` (`companyId`, `name`, `bankDetails`, `signature`, `logo`, `actions`, `createdAt`, `updatedAt`, `contact`, `email_id`, `bankname`, `ifsc_code`, `acc_no`, `type`, `zip_code`, `location`, `district`) VALUES
(37, 'Aditya Construction', '\"dvxdf123\"', '/Assets/1725442880876-419905086-pexels-jose-almeida-999955-2649841.jpg', '/Assets/1725442880907-661063677-my_Image.jpg', NULL, '2024-09-04 09:41:20', '2024-09-04 09:41:20', '1234567890', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(38, 'goku', '\"\\\"d\\\"\"', '/Assets/1725444902764-680285060-21262-01-simple-user-profile-powerpoint-template-1.webp', '/Assets/1725444902770-370990486-bb.jpg', NULL, '2024-09-04 09:50:18', '2024-09-04 10:15:02', '1233', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(40, 'sidharth', '\"\\\"\\\\\\\"sdgdhf\\\\\\\"\\\"\"', '/Assets/1725535060708-47813368-bb.jpg', '/Assets/1725535060714-51802327-21262-01-simple-user-profile-powerpoint-template-1.webp', NULL, '2024-09-04 10:40:29', '2024-09-05 11:17:40', '1234567890', 'siddhu@gmai.com', 'sanj', 'zxcxnc', '1234567890', 'scncn', '239029', 'xm mxc n', ' mxmg');

-- --------------------------------------------------------

--
-- Table structure for table `otpcollections`
--

CREATE TABLE `otpcollections` (
  `otp_id` int(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `code` int(10) DEFAULT NULL,
  `expiresIn` int(20) DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `otpcollections`
--

INSERT INTO `otpcollections` (`otp_id`, `email`, `code`, `expiresIn`, `createdAt`) VALUES
(1, 'kuldeepdoauruinfosystems@gmail.com', 224603, NULL, '2024-08-13 06:59:36.777227'),
(2, 'mohitsahu1993@gmail.com', 254910, NULL, '2024-08-22 07:31:13.481316'),
(3, 'shadab@gmail.com', 617412, NULL, '2024-09-02 07:06:14.109336'),
(4, 'kuldeepdoauruinfosystems@gmail.com', 694511, NULL, '2024-10-28 06:46:34.286922'),
(5, 'umer@gmail.com', 141174, NULL, '2024-10-28 09:38:09.772837'),
(6, 'umerqureshidoaguru@gmail.com', 284783, NULL, '2024-10-28 09:40:56.211954'),
(7, 'umerqureshi786786@gmail.com', 438900, NULL, '2024-10-28 10:06:47.009743'),
(8, 'umerqureshi786786@gmail.com', 766856, NULL, '2024-10-28 10:36:44.825756'),
(9, 'umerqureshi786786@gmail.com', 91347, NULL, '2024-10-28 10:42:44.327534'),
(10, 'umerqureshidoaguru@gmail.com', 965997, NULL, '2024-10-28 11:01:44.891003'),
(11, 'umerqureshi786786@gmail.com', 214866, NULL, '2024-10-28 11:06:44.496840'),
(12, 'umerqureshidoaguru@gmail.com', 595652, NULL, '2024-10-28 11:10:16.926784'),
(13, 'umerqureshi786786@gmail.com', 916447, NULL, '2024-10-28 11:48:37.518558'),
(14, 'umerqureshidoaguru@gmail.com', 164218, NULL, '2024-11-02 08:29:38.226751'),
(15, 'umerqureshi786786@gmail.com', 384225, NULL, '2024-11-02 08:32:31.049691'),
(16, 'umerqureshi786786@gmail.com', 49893, NULL, '2024-11-02 08:33:44.304847'),
(17, 'umerqureshi786786@gmail.com', 29892, NULL, '2024-11-02 08:43:57.239706'),
(18, 'umerqureshi786786@gmail.com', 132098, NULL, '2024-11-02 08:46:17.708877'),
(19, 'vinaydhariya21@gmail.com', 197511, NULL, '2024-11-02 10:01:02.463107'),
(20, 'shubhsoni1996th@gmail.com', 649018, NULL, '2024-11-02 12:21:31.975979'),
(21, 'vinaydhariya21@gmail.com', 52445, NULL, '2024-11-02 13:02:07.761740');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `month` varchar(10) NOT NULL,
  `received_amount` decimal(10,2) NOT NULL,
  `due_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `client_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `month`, `received_amount`, `due_amount`, `created_at`, `client_id`, `amount`) VALUES
(1, '', 1500.00, 500.00, '2024-09-02 11:23:30', 1, NULL),
(2, '', 1500.00, 500.00, '2024-07-15 03:30:00', 101, NULL),
(3, '', 2000.00, 1000.00, '2024-07-30 06:00:00', 102, NULL),
(4, '', 3000.00, 1200.00, '2024-08-25 08:45:00', 104, NULL),
(5, '', 3500.00, 700.00, '2024-09-03 02:50:00', 105, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `main_project_id` int(55) NOT NULL,
  `project_name` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `total_area` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`main_project_id`, `project_name`, `location`, `total_area`) VALUES
(21, 'nirvana homes exotica', 'JABALPUR', 500000.00),
(22, 'SS construction', 'JABALPUR', 600000.00),
(24, '454', '545', 45.00),
(26, 'test', 'crmdemo.vimubds5.a2hosted.com', 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `quotations_data`
--

CREATE TABLE `quotations_data` (
  `quotation_id` int(11) NOT NULL,
  `quotation_name` varchar(255) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `employeeId` int(255) NOT NULL,
  `lead_id` int(11) NOT NULL,
  `employee_name` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quotations_information`
--

CREATE TABLE `quotations_information` (
  `id` int(11) NOT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `contact_number` varchar(15) DEFAULT NULL,
  `alternate_number` varchar(15) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `adhaar_number` varchar(12) DEFAULT NULL,
  `pan_number` varchar(10) DEFAULT NULL,
  `project_name` varchar(255) DEFAULT NULL,
  `unit_number` varchar(50) DEFAULT NULL,
  `dimension` varchar(50) DEFAULT NULL,
  `rate` decimal(10,2) DEFAULT NULL,
  `variant` varchar(255) DEFAULT NULL,
  `total_deal` decimal(10,2) DEFAULT NULL,
  `booking_amount` decimal(10,2) DEFAULT NULL,
  `booking_amount_words` text DEFAULT NULL,
  `payment_mode` varchar(255) DEFAULT NULL,
  `finance_bank` varchar(255) DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `balance_amount` decimal(10,2) DEFAULT NULL,
  `balance_amount_words` text DEFAULT NULL,
  `payment_due_date1` date DEFAULT NULL,
  `payment_due_date2` date DEFAULT NULL,
  `payment_due_date3` date DEFAULT NULL,
  `payment_due_date4` date DEFAULT NULL,
  `registry_charges` decimal(10,2) DEFAULT NULL,
  `p1p2_charges` decimal(10,2) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Pending',
  `employeeId` int(11) NOT NULL,
  `employee_name` varchar(255) NOT NULL,
  `lead_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quotations_information`
--

INSERT INTO `quotations_information` (`id`, `customer_name`, `contact_number`, `alternate_number`, `address`, `adhaar_number`, `pan_number`, `project_name`, `unit_number`, `dimension`, `rate`, `variant`, `total_deal`, `booking_amount`, `booking_amount_words`, `payment_mode`, `finance_bank`, `duration`, `balance_amount`, `balance_amount_words`, `payment_due_date1`, `payment_due_date2`, `payment_due_date3`, `payment_due_date4`, `registry_charges`, `p1p2_charges`, `remarks`, `status`, `employeeId`, `employee_name`, `lead_id`, `created_at`) VALUES
(30, 'Prakash Pandey', '6268254252', '8888888888', 'jabalpur', '343434343453', 'QFGGF5445G', 'test', '50', '2', 34.00, '34', 34.00, 500.00, 'five hundred', '34', 'dsl;fk', '34', 10000.00, 'ten thousand', '2024-11-10', '2024-11-12', '2024-11-21', '2024-11-28', 0.00, 0.00, 'test', 'Pending', 29, 'umer', 149, '2024-11-09 06:31:24');

-- --------------------------------------------------------

--
-- Table structure for table `registered_data`
--

CREATE TABLE `registered_data` (
  `user_id` int(100) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `roles` varchar(255) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registered_data`
--

INSERT INTO `registered_data` (`user_id`, `user_name`, `email`, `password`, `roles`, `created_date`) VALUES
(29, 'Google', 'google@gmail.com', '$2b$10$MhWoNhCxpc9cUxNS9jXEJ.AUSy3Cr4JGZYoo6NWKl84WyT4XjArXO', 'Admin', '2024-08-27 10:51:26'),
(38, 'pathology', 'kuldeepdoauruinfosystems@gmail.com', '$2b$10$zIjaE78SedNQE4.QKpYCmeHMsZB/1AepaO.0MC4lRwlLE.LLip972', 'Admin', '2024-10-07 10:31:25'),
(39, 'Madan Mahal', 'shadab@gmail.com', '$2b$10$IjFSjAKDMGjAW1K93iqY.Ob3mEUMNXlsf.Ojh7Fv8Q2nKghNphTNC', 'Admin', '2024-10-07 10:33:39'),
(41, 'vinay dhariya', 'vinaydhariya21@gmail.com', '$2b$10$qtxHdyOQGDSToGsH6QWu0OXBuxzwDHOt8R97bHPb7BSH/hQnEbU5u', 'Super-Admin', '2024-10-11 12:56:40');

-- --------------------------------------------------------

--
-- Table structure for table `remark`
--

CREATE TABLE `remark` (
  `id` int(255) NOT NULL,
  `lead_id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `employee_name` varchar(255) NOT NULL,
  `employeeId` int(255) NOT NULL,
  `remark_status` varchar(255) NOT NULL,
  `answer_remark` varchar(255) NOT NULL DEFAULT 'pending',
  `date` varchar(255) NOT NULL,
  `project_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `remark`
--

INSERT INTO `remark` (`id`, `lead_id`, `name`, `employee_name`, `employeeId`, `remark_status`, `answer_remark`, `date`, `project_name`) VALUES
(17, 148, 'Sanjay Shukla', 'test', 34, 'it is said that regarding ', 'ok i will talk you', '2024-12-06', ''),
(18, 148, 'Sanjay Shukla', 'test', 34, 'test the id ', 'ok call later', '2024-12-07', ''),
(19, 148, 'Sanjay Shukla', 'test', 34, 'mohit sahu ji said that he will purchase plots', 'ok i will talk you', '2024-12-07', '');

-- --------------------------------------------------------

--
-- Table structure for table `responses_99acres`
--

CREATE TABLE `responses_99acres` (
  `id` int(11) NOT NULL,
  `query_id` varchar(255) DEFAULT NULL,
  `project_name` varchar(255) DEFAULT NULL,
  `city_name` varchar(255) DEFAULT NULL,
  `query_info` text DEFAULT NULL,
  `received_on` datetime DEFAULT NULL,
  `contact_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `responses_99acres`
--

INSERT INTO `responses_99acres` (`id`, `query_id`, `project_name`, `city_name`, `query_info`, `received_on`, `contact_name`, `email`, `phone`) VALUES
(215, '1', 'Green Meadows', 'Mumbai', 'Interested in 2BHK', '2024-11-01 00:00:00', 'Amit Shah', 'amit.shah@email.com', '9876543210'),
(216, '2', 'Blue Horizon', 'Delhi', 'Need loan assistance', '2024-11-02 00:00:00', 'Neha Verma', 'neha.verma@email.com', '9812345678'),
(217, '3', 'Lake View', 'Bangalore', 'Request for 3BHK price quote', '2024-11-03 00:00:00', 'Rakesh Iyer', 'rakesh.iyer@email.com', '9823456789'),
(218, '4', 'Sunshine Heights', 'Pune', 'Availability of 1BHK', '2024-11-04 00:00:00', 'Priya Desai', 'priya.desai@email.com', '9801234567'),
(219, '5', 'Palm Grove Villas', 'Chennai', 'Interested in site visit', '2024-11-05 00:00:00', 'Karthik Reddy', 'karthik.reddy@email.com', '9845671234'),
(220, '6', 'Ocean Breeze', 'Goa', 'Wants floor plan details', '2024-11-06 00:00:00', 'Sneha Patil', 'sneha.patil@email.com', '9876544321'),
(221, '7', 'Skyline Residency', 'Kolkata', 'Availability of penthouse', '2024-11-07 00:00:00', 'Ankit Ghosh', 'ankit.ghosh@email.com', '9812348765'),
(222, '8', 'Maple Woods', 'Hyderabad', 'Request for 4BHK price quote', '2024-11-08 00:00:00', 'Swati Singh', 'swati.singh@email.com', '9823451234'),
(223, '9', 'Golden Heights', 'Jaipur', 'Interested in down payment info', '2024-11-09 00:00:00', 'Vikas Choudhary', 'vikas.choudhary@email.com', '9856734321'),
(224, '10', 'Green Acres', 'Ahmedabad', 'Availability of 2BHK and 3BHK', '2024-11-10 00:00:00', 'Pooja Mehta', 'pooja.mehta@email.com', '9812349987');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `service_id` int(200) NOT NULL,
  `service_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`service_id`, `service_name`) VALUES
(1, 'Social Media Marketing (SMM)'),
(2, 'Social Media Optimization (SMO)'),
(3, 'Search Engine Optimization (SEO)'),
(4, 'Website Design & Development'),
(5, 'Software Development'),
(6, 'Graphic & Logo Designing'),
(7, 'Video Editing'),
(8, 'Mobile Application Development (Android & IOS)'),
(9, 'Bulk WhatsApp'),
(10, 'YouTube Optimization'),
(11, 'Google My Business Assist'),
(12, 'Google Reviews'),
(13, 'Leads Generation'),
(14, 'Facebook Paid Ads'),
(15, 'Google PPC Ads'),
(16, 'Content Writing'),
(17, 'Data Science & Engineering'),
(18, 'Cloud Computing'),
(19, 'Staffing'),
(20, 'Social Media Marketing (SMM)'),
(21, 'Search Engine Optimization (SEO)'),
(22, 'Website Design & Development'),
(27, 'Social Media Marketing');

-- --------------------------------------------------------

--
-- Table structure for table `services_data`
--

CREATE TABLE `services_data` (
  `service_id` int(11) NOT NULL,
  `quotation_id` int(11) DEFAULT NULL,
  `quotation_name` varchar(255) NOT NULL,
  `service_type` varchar(255) NOT NULL,
  `service_name` varchar(255) NOT NULL,
  `service_description` text NOT NULL,
  `actual_price` decimal(10,2) DEFAULT NULL,
  `offer_price` decimal(10,2) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `subscription_frequency` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services_data`
--

INSERT INTO `services_data` (`service_id`, `quotation_id`, `quotation_name`, `service_type`, `service_name`, `service_description`, `actual_price`, `offer_price`, `created_date`, `subscription_frequency`) VALUES
(455, 248, 'testdemo', 'Paid', 'YouTube Optimization', 'test', 8000.00, 7000.00, '2024-09-19 13:43:59', 'Half Yearly'),
(456, 249, 'testdemoo', 'Complimentary', 'Facebook Paid Ads', 'tetst', 5000.00, 0.00, '2024-09-19 13:59:20', '15 Days'),
(458, 251, 'yh', 'Paid', 'Google Reviews', 'tet', 5000.00, 4000.00, '2024-09-23 09:13:13', 'Weekly'),
(459, 252, 'Shubham soni', 'Paid', 'YouTube Optimization', 'cvvbcc', 5000.00, 4999.00, '2024-09-28 06:48:47', '16 Days'),
(460, 253, 'swaha', 'Paid', 'Cloud Computing', 'sfsd', 1000.00, 999.00, '2024-09-28 07:06:07', '10 Days'),
(461, 254, 'testdemo two', 'Complimentary', 'Social Media Marketing (SMM)', 'test ten', 0.00, 0.00, '2024-10-01 12:26:01', 'Yearly'),
(462, 255, 'Asit Jain', 'Paid', 'Leads Generation', 'services', 500.00, 400.00, '2024-10-04 07:02:56', 'Monthly'),
(463, 256, 'Asit Jain', 'Paid', 'Google PPC Ads', 'test', 500.00, 400.00, '2024-10-04 10:04:20', 'Yearly'),
(467, 260, 'Shekhar Kumar Birha', 'Paid', 'Leads Generation', 'test', 500.00, 400.00, '2024-10-05 06:42:25', 'Yearly'),
(468, 261, 'Shekhar Kumar Birha', 'Paid', 'Facebook Paid Ads', 'terst', 500.00, 500.00, '2024-10-05 06:45:06', 'Yearly'),
(469, 269, 'Dharm Das Diwan', 'Complimentary', 'Content Writing', 'testt', 5000.00, 0.00, '2024-10-16 11:53:26', 'Yearly'),
(470, 270, 'mr sufi', 'Complimentary', 'Data Science & Engineering', 'twst', 60.00, 0.00, '2024-10-19 12:47:43', 'Half Yearly');

-- --------------------------------------------------------

--
-- Table structure for table `todo_items`
--

CREATE TABLE `todo_items` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `time` time NOT NULL,
  `date` date NOT NULL,
  `status` enum('Pending','In Progress','Completed') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `todo_items`
--

INSERT INTO `todo_items` (`id`, `title`, `time`, `date`, `status`) VALUES
(1, 'Finish the report', '14:00:00', '2024-09-03', 'Pending'),
(2, 'Team meeting', '11:00:00', '2024-09-03', 'Pending'),
(3, 'Review marketing strategy', '13:00:00', '2024-09-03', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `unit_id` int(55) NOT NULL,
  `main_project_id` int(11) NOT NULL COMMENT 'Refers to the main project associated with the unit',
  `unit_size` decimal(10,2) DEFAULT NULL COMMENT 'Size of the unit',
  `total_units` int(11) DEFAULT NULL COMMENT 'Total number of units',
  `unit_type` varchar(255) NOT NULL,
  `base_price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `units`
--

INSERT INTO `units` (`unit_id`, `main_project_id`, `unit_size`, `total_units`, `unit_type`, `base_price`) VALUES
(5, 21, 500.00, 5, '2BHK', 5000000.00),
(6, 22, 500.00, 50, 'Villa', 45000000.00),
(7, 21, 300000.00, 8, '1BHK', 500000.00);

-- --------------------------------------------------------

--
-- Table structure for table `unit_data`
--

CREATE TABLE `unit_data` (
  `id` int(11) NOT NULL,
  `unit_number` int(11) NOT NULL,
  `main_project_id` int(255) NOT NULL,
  `unit_id` int(255) NOT NULL,
  `unit_type` varchar(255) DEFAULT NULL,
  `unit_size` decimal(10,2) DEFAULT NULL,
  `base_price` decimal(10,2) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `unit_data`
--

INSERT INTO `unit_data` (`id`, `unit_number`, `main_project_id`, `unit_id`, `unit_type`, `unit_size`, `base_price`, `status`) VALUES
(1617, 1, 21, 7, '1BHK', 300000.00, 500000.00, 'pending'),
(1618, 2, 21, 7, '1BHK', 300000.00, 500000.00, 'pending'),
(1619, 3, 21, 7, '1BHK', 300000.00, 500000.00, 'sold'),
(1620, 4, 21, 7, '1BHK', 300000.00, 500000.00, 'pending'),
(1621, 5, 21, 7, '1BHK', 300000.00, 500000.00, 'pending'),
(1733, 6, 21, 7, '1BHK', 300000.00, 500000.00, 'pending'),
(1734, 7, 21, 7, '1BHK', 300000.00, 500000.00, 'pending'),
(1735, 8, 21, 7, '1BHK', 300000.00, 500000.00, 'pending'),
(1738, 1, 21, 5, '2BHK', 500.00, 5000000.00, 'pending'),
(1739, 2, 21, 5, '2BHK', 500.00, 5000000.00, 'pending'),
(1740, 3, 21, 5, '2BHK', 500.00, 5000000.00, 'sold'),
(1741, 4, 21, 5, '2BHK', 500.00, 5000000.00, 'pending'),
(1742, 5, 21, 5, '2BHK', 500.00, 5000000.00, 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `user_data`
--

CREATE TABLE `user_data` (
  `user_id` int(100) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `profile_picture` blob DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `interested_in` text DEFAULT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bio` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_data`
--

INSERT INTO `user_data` (`user_id`, `user_name`, `email`, `profile_picture`, `phone`, `mobile`, `address`, `interested_in`, `created_date`, `bio`) VALUES
(3, 'Aditya sharma', 'adityasharma10102000@gmail.com', 0xffd8ffe000104a46494600010100000100010000ffdb008400060606060706070808070a0b0a0b0a0f0e0c0c0e0f1610111011101622151915151915221e241e1c1e241e362a26262a363e3432343e4c44444c5f5a5f7c7ca701060606060706070808070a0b0a0b0a0f0e0c0c0e0f1610111011101622151915151915221e241e1c1e241e362a26262a363e3432343e4c44444c5f5a5f7c7ca7ffc20011080500050003012200021101031101ffc4003000000301010101000000000000000000000102030004050601010101010100000000000000000000000001020304ffda000c03010002100310000002bcab3f2fa392f276afb6936d8169d2ca4ced64e19302a4baa40591e6b7793b9fa6002359db031d81b636dacdb636d82415b85a675a7441d5e4020d6c5423380990e8b93638db30ad94c0836d8db118abab20c2e754d86315051e24a18b2d006080a8c998917d6213805801d1e5b669cb7cd15732a0f2ac0e97539b4ece2ecc6dc83976153be7b6ca31c2b881d98adca23ce54044bcd3a4e6f561d69c6a19aebe3ebe433ce80054622f1694bd0b388865ea83755cbb7177eb327cb13ca66ab3a4ec53b42ba8a65790c08855612b4e928e469526faf0320db0591aca1537276362a95042dc4abc4fe7f5ce4db59db636d936d81b6adb0438136d8ccaca6f0e8ce97150a001d8506046c1403043b14070180ca76c10585cd8028566cf802884851500d818906cc2e62a95182b7040da693ccb45a64a2668180aee8b8cab2cad67472ac1a17007475f076e37765d9bdd2b3eb9c74eabb60479fbb866bd3574d7312a2cb20cb2c79fa79a6c76f1761e752745e8e7b489b6c6382965691ef4e3b2ebd13374735d18b9de5d5d539981c74ace92b90cac647915874429c110a089595923956fcd37d4e8f036c988365703ac9c3205655972767975c1174ebcf0dab6d8c54a6c31b6d66db1b6c6db04865d5952579ed2e5c0d86b095c11821db1b601045660c03807334abb28ea846c32f4340852d3115822b0230ceaa7393620369b4385ad4e5d80e11d31b13100604b09da54a4de09d96c678b45d6077f1f4e6f7f35298dd7b783a758471823614e43a94eb99a32ca8acb2cb9fa39e6d3b38ee733955733789e21595902c0d746974b3cfea793d56165aa3f448d969565622ad31b3374b31c412acaab2b44604428225656588f275f34df4ba3c6d82138597c95b945c2c10bc2878bd7e7ec82a9ac82ab651401d464d86a2364db10638c76565c0679bcbb0ca06c988c6db20c41b6c6d8988c1c3517c2533c10e1ab11a0ec6836694b265b44f61e7b99a51855639c451a78cd43515700e9803aa018e65ec539b5092a9a44db2a960c334b1454629785f37a6dcdd5cf76e8e3ecb95c459b6c04799d241b2694489a91352e7e884d21c1691e9e60b215c30194e8ccaf61231d7ccd93d3f2fb2773dd233b3ae6c2b9ea8f9d2a301b6d64a92b023591456585056560c248f276f0cdf5d274946d90a936274c2b72a4259e7f18f4ba3cd9df92c452bacec0a6c307026d8d61b1b6c6d88ea442e3ab106520a9b660020db641880e04d8136c0d41972e09b6d58ed18eca4ab1b328c50a9a231d3c74e93ceeee5056aed1c6e585b431d718f45496da5e60e9543072c26530602ba9975a2e511949ba81ef031dfdbc1ddcf6dd9cbd49832d9b62286050c3a5268c84f1135287442598c5ab735660db2e0404a980c055ca9933ec94ac4d9d349df5964b4ac4564cec10e606562d9488b98c088546134db699e6e6eee09d3aab0bc6db26d858d48d2cde6f7f97acad79bb36e3e1b4ac4046b3810988c1c0846c3295a3b631da36d8c46ad88948d8c4636d82300ed81b136c0cc18285536dab6da31d8cca558a38090a0620eae5a8f78525dcdd712bd1c9d6411d0056964d1c4ac55caa4d8e71dfc84c3ea04e14930431255083aa118abc75fa1e6fa9cf74eef2bd54837471d94208de7f7a10edf3fbc982126089a9c2f09a96c176c45c0ae1b008c1070ecac8d49bc5291a596bc6fac3caa964572e3a518aeb260e469bcc0e081489541d072989f37572cd1e8e4eb948213612b2b258eb3d1e67470ee3999d20291b9008b0666499b39ccc5020e06dab6d8db68db106da8e0636c171d8c0e36d976d8db601d8d8830390620db64c410e1958a91f0a2cc3126589740f2b05a0ae941a4c09d925615e8804605423c6650a41419908afae48574456d2a967c25118ebf4fcaf539ef9bd88564a4dd6c2460a3a8efcdd2888ca22b09a942fcf3531828209b322ec3041002316c190d26d1579bd97ac6fac5a568590b4ad8e8a0cb5934698a088db6a0a44a36c2b2b64bcbd3cf352eae3ed5208907055b795f29775c17cc215c4d292b361ae4ecc63b2d7a3831dbc788808b363818e818836d8db65c4136d9763a066caa4954cfa10d32ae7c22da77299d6c5cc136d8db6adb131061de65733e29b9e83b234b3acaa02a2c6950c64cf51a2e0876899c17100c580c1e45348165c49a590462a757a5e4fa58d755a15c2fb6d404132b027d3c9d62ab2a4c1135185e13525745db61b024ce0b99704363511928d361ed1a274da17d62b2acac89538e82cbb59ca4001c0520008946d8579d325e6ebe0953af8fb1693a4138671875c0197796a482b26c986d66db21c306b12bd334c52746203a2764f6c6db40c72e1b18826c5a694b19a567a4b06eabe77e753d0d2f0ef414e4dd40e61d53b39e5d33b9e70cdacc96a2c986173b6202703330b5542aaac4ed272b8e95c5e028a4d0df9cd20b48750d055b2ec7221d8460049d56d560128e96940ca2e7c3f5715b37d5af9de8635d808b9db10ec523d3e67a6d48560995925946b39a8a3aaa9d8208302141d83b60918774747af374a5ef1b6b159512ce7a2363a102962a9d60040a0e17112856512b0be5b83bf9161d1c7d4d5fceeff0022e79a753d79f386d62ec2cc46082c28ab9cfba508e63484bc9334500655db036d8db636d8c734d62f5ced295e9cef9ef67ce94d4cb3d4589ad4d497a953967d71ae54eb96b3c542d730ce2b9c5e77281b5ced898b3066e48eaa581363a413356cb541cfd3324192a8018851888e31836135542b90c965173631a61558428c683032f476f975cdfabe5b0999b23a87553c9f5195ab46c8c223acd467594d451c2a620652146c14ed90904246294911db599b5655d62872591ccd8de406c208a5070b8832b2c0042f3f4f3db34ce934f3ef0ab7d3cbd424f037679ddf9e005cec0d9b6c165233cd8739a559d05496f245d85999729db46d8a825a552cd349635ce859af9e99cbe6e70d2938a639ac9e70047022571ca9d31b3913a39ac74ea954a5d21387567bc123258e65009498b038b5e373721a69dd1aa895449cea8291a01d82eb32937aac1eaa452896515800ae8aeaf2ab68aa7524eab32d89d04cfaa6f3fd2c453b2e0711accc7423a588a44d4a559cd73875555653119462a620848213b0cca61eb3ad9d1d1cd7d73aab2d9cdb1c74cc35854eb002000832b2c0072f2f473df15e554b3ccbca8df403a67ccf37b783be303b58d8136cc297710a8aa98e2aa9a08d801b22e60a0ec16149bd42d9dbbadb3a5a97ce8383354a23e459593306adb1b062001826d989cba675c7cfd935d92c8b1b03823dfcfacc2cafac869b1554163e911b9ae1014e814eaab4ea848908b99554122baac3e0d41b3c28a258b369d965063a79c052d3054230aaea77703a1ddef7ce7d266286594ed8967497a548b99ab2cd4e549cd491c2cd59576d81b636d8c410918a34da2cf1e866bd13a6f159d12c88db1d0b14b9236a008176c6565818aaf2de17c6a92aadcf9345377d77e7b4cf97e57b5e5f5c4430de46cc808267055d54850e175312d4441b636d8c75268d43e7a16d4ce8d15f3a638ab1c7359f118864383048d615609b6cbb1d600ea4a1d73978aeea2a567534a5139077f3d71cbb13598e7c88456c4a0a4bc1d91ead6665c675836b273acc603515778e71d788359a58af4a106d0b9bc266c344632505899961c8720c0ae5731e8faf0bc800d2e3b0b2e8f225f7b97a67acc948cea53759a923cd50100db280718803e5231560b023df9bad29d7c96d73b822ce7655c746d8d8311605602ed8cac255db4bc7685f36cac973e63524df6015938b97d08ee794bd76de3ce4f456ce0d44d4c76332b831c62c234f2806d66db0d69db3d28e94cef3e6ce989d2b34ccb56065774618e284821d8d831c6d89b62981d4aaeb02750b3d404b5089cfd70b263a44be72774ace462351ab360879d8e6ba2556bcbc29db05e64bcf590558bb43aa33610ab40272fa1c95c0597580ed3b1f45ecae5d299bcd08651ed1bcd74fbff35f4999cadb1b020f2fd30bd5170ccd2929a92b24d4929255054231b40d8db631186c0c3d62d1d03745cd2dc9dbac3a556ce70171d1886b06dac0ac00088cac8b832cbc7685b37a1596e78f97bb89bebbf374c9214959c69d037026e4d4ebe3ec373e625f9f592540ed2254c70ea31b6c660f34f54a676d44a676e436744ab01b3cacc0caee8f0586b1b6631dac3b101d931c418eb006c2075940600c48ba8b4b3b08e61d515e24ea4b61d52ad9395e3715a2d834cf2c63d7397925d915e59de5acebf3b1d6dcb528d1307869a9797d5f3ae21d5c4758e95ae5e7a0c105503291fa67d19df67a1c7d398c8eb73b60a25594b7a4ab73395a33539bacd4a559acd585065cbb100c4188c16523bcda4e8b42c9dbcfbbb5869cdec82b6c740db59b6160565303a0290d653a382d2ae75d1b1b8e7e0f43ce6fa7af93a9327473a456c6ce5e5f5383525cdd3c9bcc86dac8db26db56db41c0aec597512b9d33ab4dbd1299d16db3a2c099c1959d1e5674718828c414271a0714c7115b1b063818e00602b6228728aafad40ea22d1258ad9166c4928754358af473f60195e501b109754e6b9f9bb94f2f75f1d3157b1f678d66ba43cff47cfb9f3e3d09d399e9e1ea8aa322abe5466874d6ea3dfcf7ad2ac9653ae5410ba178cb5b2ad9a359cb35612c65593535228ec5576c6041b608595872ad17a4aa96ece3ead66a8e2e798618e84836104581594db6953632ae20e169be75d6d3a5c43ccefe1bbea2b793ab9eb3646c49ad16bc8e4eee2eb84046b1b0c1db56db4665656c4cd1a0334ec1f3a6aabe74c434d038cb8870b0782cae1604620a12ad613b18e366c700ec6c7200d81b1063ac01c0b9b2a255482da534bb0160eba8de8f1f626ccc2e724d3a31c83ad238f83d89e75e15bb0eaf3f5d2cccc5a69cbc3e8f97a9cf2b437ce3d5cf719d5a116ca43a039e875f3f56362f31254df92e5d582e4784a9e9f85ee59c8acb2a2ba4d467692cd5d41b6b4065186c60c00411cab496b4e85ba79ba358be32b980a4f1d0906c208b00650022503094ab05f368af9bd34956e27e67a7e734fd5c7d83839176c19d12e7c7e4ebe5ed84046b231c61b2620cb882b4acab9d310d36d49d33aa32bcd31065c7682c0cace8e332b43329a6219090d6638a638d038a0c700ec607580e20c756c722e6c2070b29d6735356072a531d3d72bdce25acdb14d8e003a550f894efa5996c4a7592f2f9bdfcd6727374f3f4e73569d9d8f232b3cc43d90cbdfd7e6f4e6de1d7197d5e6acee00d9402b2ee8e5eab252bc654575960949ca88e968c35bb620c446c4512a4722923d15cb747374eb17956773b9afcf8e8e41b0822cca40b984aaae832b2cbe7579fa66ad58d995f3fd1f301d7c5d8d5802ce56c991a5679dc1ee787d70a08d676dab6d8db631065a511f3b774a4d1a2533a67569a2c34365695994cace9418abc160d61656b0b0298e347628762831d431c00c0db14071a18e063818a823684a9cbd7e635d30b50edacebac660531d8db636da0621702018e1393b7925e1c3a2bc8e7eae6de39d5b6b2ee521b4d17a1e665f4a9e777634ddbc3d71deb9ae261955432cb3ece3eb167492223a4d24ab26a736001b5a56f086ca4c48360467472968d13b44bb358a0dae631aa63a120d9b6d60040010646d2ae0d2f91d1279ab74737432783bf8ace7eae5e99be93cdd9711c09928a9e7f93ee787d70b88d676dacdb65db631065b3a3e76ee1f3b2e8f2bb2b4d16568c71949cf2b36231560bab2160d6660531c6c2c0d6d8a0381b6c6db1b6c841d5b6c11b26042aca9397979451b4f4bcbf62e2ac1ae71d93118db65db68db05c08976d9042e8be4f449a6bcee5ece3ebca155ebb9946dcea836a72b7cde829d78d56f2e997a595af35560aaacb2a74f1f71395f9902b2cd24a936a494406dad64d8076311a0956352770d23d095acaf71729b594475c74076adb0b300500200419664197cba4a9356e8e6e865b87bf90e4e9e4e86a9d9cf46576d61c189f81f41e7eb3e4879f5c6db59b6c6db1995e57b46f8e8e719a2ead2bb29958a128f3aca68b4971c6330618836138a6656a2cae988366d8836c6c09b601db188c876d5b6065384e5e8f1e6f0225eeee8df7ca854a36042060e002532b6d8c08976c232b05f3e5d7cf35e7f2f7f0f4c2e8d3583cd590ad895e887a99d6ec6ae2c5abc31ea6e7efd678c8228649783bd96debe1e88cca2512692568ca88f3b4022d0460ed8db68c765349d12ed2eb935b97af78b067b9e6c95cf44db1a5452556825410808cabb697cddd5c735d1d10b4cd2559d9e5df9fa5d2f49d267022e7303a8b0bc4f123ddcbd713149dc8db56db19d299b5b23e7a965795880524152afc8f5d74e368edb70997d1dc625ee3c978ab4dd5ca323321576528c54846c6231b6d603b1b026230460328034b4d79b832355efe4ee4b5f94eb9f56e744ebdc8cbd63931d639563a8f395b57958e908e020c00c161c5e8f04d73f9be9f99bcca4c7785575453b1dfebf9bea73db3abe4085a5ed956e6619454612a5a0e5e559a451d26d65592ce5445008a1b6330d0710620a97474ada3693b392c378ee68d2e79db2e763612e04d08de68ac31811036cb2f33a6535d3585a4b29173e4de6ee9d158f44cae2bac920d991d138b83d4f3b4e44efe1e98008b36d83595f3ab3038e8d965558a2dcd1a6529a616c2393a8f26aed7e078f45fce697d16f31a6bd4bf97497d57e3e8cdb349c7ca46ca43970d860ed8db6ad86930cb4516134fc2fe751a43d0281216534759d0dc253d03c4d1da78dce931a41642b5a7313b9f8ae74e956c23685e3ede69ae4f2bd8f2f53903cfa730cbd2732d44be9fadc1e873d29c02b4407571f658a8e88a19659e262f32964d1d66d255458a3a2aab0a18e363a3638c4109572b685e4bf5f1f5eb1cbd9c7d96495d26b2b05c5832b0355407191846072f97889aada1692e0adc79d44cebd1b227a11a25c29dacc8ea9cde67b1cfa2f8fed791acc811bcedb07a79baf1b72067739d16e54d28b137a4bc7bb98f357d7cbe38f579ee78d9c58ae3250c4cb5af395f43a3ccbe37e9d38a92f708e3a5a151c0c3152360536d80a5413582b726e45dcce379eae946cd9e6e9b3965da4e0deb52cf1adeb51387aae649eb121af8e75ea0bc7ba9579fa11a2b8302745387caf5bccb7876a74e51ca4ae75cebdaea9d317020742523d7c1eb541304c8e92ee6eaf117e9f87aa573ce0ae7693acd628eaaaaca62329c0870262099949d2d959eae9e4e8b8976f35ec44649a6030d2ac6aa8c88315976c25c365f343a4add10bc970c2e3ced49ba5eb1bc361ae482359019044ac6c5e0ed969e40acb7cf6da9faf9baf1d325533a93d5c9d198d4569a764795886855b639e1deb5e6cbd389e7a77ad9c67a422595a6aef0acb53068e8e8e5b2f4993a3946b18ab070c826f1963c5d5ccd46769d71f54baf5294a532155285b3a1756b1981b1b0c8482623291b031c267597105006cbc7e4fb5e3571a3cf7ce14eae7aa75737a38e9eaee6f5267cf64a4a1d1a3caf6b8efa74f1d95908cb2ee6e992f5c2cb731475ced27492ce749a85600db1b0ca5948c010b0294eff0037d44e7ebe3edb94e9e2edb9585e334c34436c29559418e850cb28042f3c67585b73f4474e0dac70c3b38a74e9bc2d0db1b920eb950c291282c846c2b87cff0073ccd679311bcdbb397af1d0e271bcc3070050cc957e7d2f5371e5ee6e0797b372bd941203cf1966aea62b862a4a84629d1cb697a5e2e51e744639ac198091b266f2cfa337cb3eae79787af9afbcf43f384eb3c333d46f25d3d57f36d6773713a761e2497d03e650ef6e5aa57211b0366c7183041b659785eff8879fd107e989a35656f4f6e7d77a5c3d6c45d96c0762769325d289728ae935b9fa20b6acab64275967488eb2ca74950565b76c0db6538682ca4674746ebe4a9d55a715c53bf9fa35994ab2ce92871949b1432195d25ca44a01cbe51d95af0b49d2f2b5cf3f9fe979937d768da5768755c48917381d6225798e5eaf37b6d79571e00b47af3e8ebe6eac74276ceb6d8c02d34f442ee69ab37cdbd78b1e8dbc7367b83c4a9ddcb6b4be5a7ad33cecc9347281da24e8b71da5eca42d1574aa33e7b901b134b4e6a2948e76b379ace559d938d9f72366c8dd3e7499f6aff366e7e9f7ce58fa01e4f49da818e587a73ce96bc3d39d5d91b5824359b6c8010abe2fb5e3af9cb4aef32efe6f471d3a39ee98d47b793aae08235818810e2742e5b808ead085965668f6d9cb365cea6acb2ce558daa08ac0836d976da09560b2b251d6d1e9799d29ac7a2674d6272759bcab685d85831999584a030957305f248aca293aa5ed2ab3cfcbd9c6dd2dcfd32c7ad1ae36c7591b115289672d1a6aa1917cce5f438379bf671f64d1d8e758328a8eb62102c2b39d9541de9c09df0580bacbd4f2f5a3c65efe25eaed6f3ae7d5e5e5f471bf3d3bb997983ce9abcf597bba78fb336d695d28d9b58018093ace58ced3cf4e797441648e40aa3532f5b6b1e48ebc717a7e6df58ede7f45e3c8af57ab67cd76fa1e4e75e95bc4efc6fb8c7a10b06d649c5303a9432cabe5fa9e6af95d5cde8d52dd298e80ad238ba21d9ac2878dc36d810e9f0d7eab87b39af345656842f3978fdcf1fd4b3911d33a44749a4956748aca0db5bb6c6c4048305d1d2b6874c8d4e7e8d4e8ae1ae6dcd78cd3cc694e33b3315029d2e184a36cbe4fa5e5f7cbc96858e8bf35d83e5fa9e5dd57a39ba73a764665b6dacedb5815d2c587473285612f173f4caea7d70e8b09c73acaf88a5a564a549eb32d4d73d7dde676e76dc5ebf9b65a15be37c9dc8873bc7dfde28968dc797c3ebf9b9e9d95f1bd3961cbe9714b275a9d3d7c9db9d5ef1ba51836b1810889449a9072b0e5efe75e5e3e8a5bc5dc31d252f71e3f5a99672eed8d504e1bc757a7cefd39b41133be797a631a1d295d67366641d8d88555612af9be979ebe57ade4fb2d75061942a94ceb86d26de3d3f3aeb798c42895667773575ca251059552693b383b49cba23124a4da923a2a2b2a8c456db0702620c174747eae5e88378745cf56c37cda568cd4f1d2ad192c0ac0019252b84a0ecbe3d679ab05792fd1cfd0cef33d3f3e8f47374677520b2d88d6710d60475b1635f3d7a66fa5e2974735d6bc2f63306ce9b132ca7753993a25acc4b1a1d08d9b5ac4ca8d6658d2a515e8facf16eec79c9e9acbe5c7d482ac3649d33cb6ece6e897aeb2ab3460759d88440caaaaeb28e6e88af0a7666b94741963ba709cbdaa9cb4ea6b396f43ac99dd9274a6452c40d9acdb6363a00205044abc1e870b5e77b3c5ded5036920e652f29c13b5186b9a839446d32d4956e51293154acd43b797a8d174273a4e6a4ae8b356551b6a07631da31d8ce8e53a39ed252aa359ef5a4b5ceb2ac954aece88a258172cb903282da154e5f1cab34ee8f16e8e5e861f8fb796a378db3bb23c59ea08fac83b5ce0454bcdf5b9d797a4aac783d2f3577446cb4747cd721a5414cb05beb38c7425021e29b3cd3b2129970f9758d9404928bc7d5cb64b12a1c525af4f3f4e6f45a37d61995ee3061481d61436592d5578d3b2535ce59668b4dd5ca3b270a58b557b9cead616528583d98ec9b1c0c4280440042af0f7716747aa57b581120e2e8e497020ec065be6ea7409d32d178bd8b9e55569515c1c9dfe4f75bd3cbe879d026e93534a4d66acaa36d5b6d076c1db19958ad25593af9fa39359f6a368eb9d6759cb3a4d669e4ca646611b650ac91b6d35e465bdbd10eef264edbc6acd79bab96c85f93af3d2c416490759d88b9c0ea55607232b4d2f07a1c36c7a39fa0aba3e76cc1a5275213549ce9d6a71cfb56b95ad9665da119d89b50d937268068a4a754596650b0696bd3cdd317bc2dac51d1f58388450c1543695436112c084fa72f0af6acd723d84a94051995ec2c1ae7366b313acc714188302000e95410abc9d71cd6a799df7550a89cc9b66b73f47257b929b6b94995a5d803ccfa2f3baeb99ca8aacb2a99525ac7a216492939a447459aba2ae20db60ed83b60956295950eb93adc7a196bae6675911c467a00ee8aaca042170225c3697c579d2dece6c64bd6174b43a2373e7f6727567a5cab32595b59d88b918ad0d81cda8167c9d9cebc3d1cdd2b679d33b779d25a5034124a0cda956b896ae27a989e7c28380aca2255164949aa061448d14e8e7e88e8bc2fac51d1ae1f03605217620d88366c88b40a81c0b9b03360138c4e4c41adb64246a3b60622002b28042a46d18f995ed9759d5dff39ef669c4f2de23274e8f46b098ea08eb2cfaf9ac8d3a258a8e93488e92f642d1b98a3a4da23a2a23a28c4181c023070216523d6362f6e7ed6075f9de86f0d3a2272d676cf40bb5826cb031d2e1828c44be23ab5aec9487e8e7b33d3375b8f33ae54cf5bb2b325a2752b81b8c08a59d2670ba3dd5e1d308f33a2175abce99dd2b2a4b5a46d0e41b09c4071063818e141005655cac040c84a749aaab284ab14e8e6ea8bde16d62af37b8381ac0e36d936c4c41303800e1736a5c74038d6db18821db5876c6d8046d0148942b2aac6b28f0889f4cf576795eb4a706e5d32b2a56d0b6b24154cacaa979590a0d605659a54af9d2fadcfe8f15cf3232cda2b2acd5d146c02363038d88090c1ace915eae6adcb77ce7be7d3a764e5d867a11b2263957630a0e51b097c5646b6cd69c9ab0b1d4a5af3e6447cf5b5274642d36a13b5c652294104c579d48c63cb706eab49d26e8e8d9b779525a3ab5c965636d8236302000850091030166e84a549285cb4cf3ac57a12e8f59d6e5d836b188203b26db18821c098ec0c750db036c6db188c63b263b5623046d18612e05572328b1ac65f9fe3e8e5eb9f4bd4e6f670f3da55c74db322fa5f3df43acf0b5a121c42c93a794f5b83af9ae72b24d3793eac97bf99a4cc51d6744475966949d0db036c6db076c16560d2748ada36b9ed83d37cea8d28d3b466cab010b2c2d26e4f60a41d2f84f37d5b5b9de4779d23a991af3f3ab1be7af43a3b246d63107591b1b27b00f3f4484652be72d26d56b379a7ac699d5a91acb564742c358c4636c400e55240a1d45574125594b38bca861a9ba79fb22b64a32d447b9a32b6b24ed660740c41b6c1230c3136c2b6d8db6303807106c536d8db6302170c230d94295161684bf3dcbd11eb8f63def1faf96a2434d1db40ebe6beb3334540195432e4e993a5935659ad0b4e5b34ab673ce929b08eb2cd1d2971060c004136d82ca46a4e914e885ae6ddbc7d3be68ce1272a4f3d0eca6d842511c9ec148da5f05e75d5a32b43563593a995ae3ceb4de6fa292ac1045cb1c359cc0dcc832ae8d3857b1783d13839fa39adbbca9355793e777ac2d2d2927866564241a3b641b636d80a72aa3a2a46f18e78565598353f6f1f6c96756b9621d1dd1ee5b63a9b1c8a184a36c6230d948761476c6db1b6c6db18ec02304106db40040010a11d2179ba39adf9ca4bd1e98ed656e1da98e646382e86cb065d642b2c6560b79b258a0895674594d12d672cd973b5579888e9680718100db076c1208d49d22b685ae7a2fcf7df3b03ae613b431d586c0d840d81880b83acbe0babeabd23e9c705b9fa64e96476397a2376a5685e528fae79a8efa8483728ac05e7e8073d10af1737a1e75b5ac6b34ef2a6776b73d65e869d218a314c358f8101d901d85040aae1671bc178c1717134fd7cdd325c87b92ead63b67b8db1b36d8c0881885db036c15b290ed90e1a8ed8db636d8db106c208d80085c3002b2ca9c5dbe759e0fbfe4fbba90229cbad3579ee5b6d29a6f3ae7d79f779fac329134636e33d24974dcf281a6b4dc4bc7eef8beb6b3e72118e81288b3574a5c418100c4076c6208d49bc5ad1b5cdefcf7df3b8cb72793bb8b3b7561341580bb69706c206597c279d355fbb86902f1ac74563573e7874f1b5d9695653b6b9ce8fac8c4581594404900f156f2bd4f3a8d24ed51d299db5a55ceacf3787208e5591b034702841000c04ccaabcdd1cabcae9431246e8e3bd9d75e6e865d95ae6ac8f7276d66d8040c1db181cab88807052414c4136c28ed8db636da36c0db006d94020505659f97e879f6799ed78feba8564cefe83c8eef3af3ae073ba79ddcf73dde7f48d6115d655c555cceb64d28b2a2ba4a3a393ace795e2a11d254465b46d80194c181b1062085d18b5e1699e8bf3f46f9d707d65224e760309531555db462ac2a90d784c8f6d1e748679d23a291ab0bc3e8f9ad77565583b1b90e8fa981d72b3aa080804932bf9de9f0545919aabcde57b46b8ddde3496a51c664618a9b0b0c1c0a61b501944e4eae59a856551c36399de0bd9d9e67733d358d358a34dd962bac20631025a153611b59b11280c018e5db64c460e182360e04c08062146c0ca440469acb9ebcd29244d63b458ab5831298ed651e74b955799810a9785502955c944963d3cdd2246b359a3a4aa8eaabb6ac0a848c6db018133062978dd9b5a16d73b526facf3d55b3b9e5a088eb2aa9d2823280c0f01d5ae9dd2b0cd6e792fd10e867795eb79ebd3479c53616329e5b29d3c7d960479dca2b15e14ee41b8ba6679af1aeb5569b4b6ac698dda9179aaba34aecb92854d8594876c9861590a4abcf782f2f471f5ad48c8bc57f3edeceef0fd14f52fcb762cd33650a321e7af2af9bd5979f7f4abc1d5ae3733a6f993b580301330976d8db106d820836d8db606c170d80a4409522420e26b1073ad88294cbacb0d86c1d1f47d0d679a6341c1e5e7eff000bdfd4e0d59415612f2fa3e5f76a8e7f43ce813a4f3b0ac80045604070c1db19958ccae52d1b336b46dac5693aeb0b2b433a9bab4d6d2a12652a41d0a085f08a9bb7ac5e4f57ce6d25ba79ba11fcdf47cdaf45276cd7db5c9ca6e588da811d513026e7e982a2b63cbd6e6d5ad25496b58533bbbca99d3d26f2bbcd876423153636010ae532e59ad2a2d7173fa10a77e0cbdbcd309b29d3d4ebf17d1c4ed3164bbce9ac92b9046db3b8de8fac66075cf6dab6c25c088c085db636d8db631c01b606d8ca4281842f3f471af37a1e67a6bccb5967441d14f4fc7f4f7cfcfacab342b364f3be87ceead679f3a4a36c4bb79dec967580acb2adb9d969cfd3ce4e749cd8564a00e00381b60ed8ccac164787b46c96bc2fbe6f785f5810b426a93b473a9b10aa330419c15d97c1646bb6a4e9250a98af4f35e669c1dfc156e8e5ea95f6d73b6361c0eb215d113155c8f001653938bd2f3b559e4eb6a45f3ab5a0f9dde90a66d4a128508e50d8c303290018400cb4a945a84ba27673a30d4158d8a59699bd3d5cfd17357e66d60b434745786a9d2dcf5b2866e870c11b2e074a0112edb1b6c6db1b6c0d81b60a3648db20bcaf1956b279bdb68c411ab1a5871160a4e889d3cf5b0abaa4c10a46051194c8cb0a0ab568da2929d273414ada0106db036c1db048267462968da4b5a35df3ada17b912acd50039de56545719554e8c0e5f076374ce8d147e9e691ba39fa61f8bbb96e57a61d8d0c0b3881638842cf41596e66aeaa9c9dd13cef4a6ca9e6fa31b38591b568f2797a1a2f8ddde4d9dd9e2f0e558632a58c028c001954a309caab14e7b2b1686b2570d4abcef1d1487466f53405cb3f154ea4c915651657a39f25adc6f5d9b9e8574d86c34a70d1b6cbb6c6d804620c30360b9708d0af3ac51925276ce8ed83810d63d362856b03a3a0a23d855e284155ce394e9ddfe6a323a4d057f3cf5f8bd6f36c823a67a2ab2d00418106db07021208595a1eb2a2745655d61ef0b6b0d3a4c8511b3d30608a180a0895710be2602e9ca3c774e3590de168bf37446e53b7ccf45adb6b91499419b58576b954755656c9c472b598359e4eb434764796948d33bad22f9dd4cccb632a4394c8e1453c67cfacf5af225cdd79dec28cb454bd92272bf54ef9af420a73d25646cb7cd4eb4e86625e60cc6cd830d4863a34a09e8b71b4bd462eb5030d8608d8c08302000a2e1944e7ac254c4e74275e55f6bccf53cbb9728f9d0eee0e8d67ab8ba79ac67468d1e95b3bfcfbcd95044d6e3ea15e879f5088acb34397a517bfcfea83314749b5045a14830d8db633290952165315ac6c96ac6bac56b2a6b0e94439e89b3d0526c8156c228d28c42f83b6bb679bc9574787a4a927429373e6fa7e67a2d536d720829b6d6118dca232abec13916d36b62125e67b3e4699e4f547469a7ac299dd590e74e55a5a84c8d17e6d6527a7bc12a6e493a565575c4b2a97d2d7a12f9d673d49c91ed8572f6af644decacf3af4cea62c9223124738b1334c194a56dc6ebe8b73d47c0870c6d81b0c2abc954ace16591a6c1b3a00e565c64041a34963a332dc2b2b0c8e2ca0392608554748b8c2c55649a54749abcc8b228f3942b2da0100db036c620870216471ed1ac5e93a5e76a4abbc5128b5cee8d8e9928b64d5f42164946217c2144ba2caf0f597a9270539fa65b3a52e3c9f47cff41ab03ae462a8c4cac63c3df62a5646560717375c6dec9b223717621e561b72ad3335569b6756ac1e6acd37ceb6d3458da1acc548de0d66e12ad286359b56b6ceb3aacd5cf309aedeef16b5ec8e1ade7d038d66bb37231d8fc1acf4471bb3d022c995c24d293411654d4463a7a393a2ca30c1c3046c0c15566d227966ab9299d36225d8ac665c36dab1c53a15e37248c50195973d1c5738159acaf32e947b39d76ce9434d7a39ed6b9f3d0acd8560aaaca6db1b6c03b1882674629685a2d4956e2eb8ef17ce2ce66518e8d86b06c00089462b2f932ac5a633a07d5f2e924fa6545e8a4e979f97e870f5cdf6cc8b818a95e5e816717a28b406081d184e4eae65395ec00e3cfe5f57c9d4ab45ed7204b5a4299d74d39e99dbe1a24945d4e6165b95c56abb9c1d5b959ae91179a760cd165335419a69ba2148a19b253232305d474986c4a28af332a81d14744e47af3f4b35b4ed65b29b0ed8ca5028663f3522460f169e8652fb9e4fade54cb0c33d1bafcdf5f58f31e749ad2acacf6f86d2d734c1b3aa70769b2b4e66b981a4e6f4e8213bb9ceb32cc33a5951157bf95ace45613698a054a9b0c623070c12304a9297e7bc5a937b8b5254d63a70dacc15d31d1d1d2c0bb2ec44aa3697c78ba35a937aa526f933a13a2d0e863cceae6e86bab0373b608db0b30dac51b19a6e2f3de24a8ad430625e6fa5c7671bc9b52a5335564d2de9cd4ceba9a6f3522d30ba38b3e853857ae55334a2c7743b7c9bbb35c4fdeabcaf569ae7dd543829d7d31e63fa55b9f3fafa5ef3e4a5f3323822259a11a999e7e7eee697968e61af1b58cc058c060aaa9a6525481e51743d0ba7ceb8b686c6c74a9693563b2620a742a52e54e03822c368ba2a3cd729128b46a052a2ab2aa7442d1ca0add202a6521061a8ec14e060e04c430d68d62ef3a5c56b1a6b3d241d6253a4f1d1d1c59218ca559170c65f1674469595aa949f4c05e9e393aba39ec9c56465ea20dced82303ac037157560e933b0b0e8e35e7f478faec91044e6e943c63dbc1d3343362c1299d6a265e8b73d71b75503d63652719671e855850656a4da6ed58d16e654a63b5500664d14a3b235cb64284031b3640f8b381c892b425923aabda2e9529ac70aa19849404c72c0f3d747a53797023346698db09a0caf5b29427646b4ebac22ed2be57b33f2fa967124e928074a95e3f76cf35574b861359f9bd7b9f2172b61580aa45836c6d80702a702164687acaa5692ab34ac6bac749075848de18e94056c4575942d1554832f8e759ae32baaaf1ac76f21d25ed1aa79bd456de8ebe2ec6258e4ce86ce6e4f492d242a152a3234ce6bc2b408c2abc6ce4e164de4b2128f265a943354af334b654c75d615ceed81cd0184d2872b3d5cd2d66cb579b2d5a26ba0ca972c54c8ec846ca51c86649199246648c059bcd653a22cee941ca14d8447e7698caa8b1e3af3ef1ea75f91eae695231be8b70776b1c446c759fa3e675eb3a3d5c8569268e5fa4f9bf777cfcf00ca6f163c8fa8f2bb6ce799d280565f3be8bccecb213da6b2e12f0fd1797d5acf023a4d28c8b970b0e1ab6c03b68381525587acab252b2a25693a5c74bc7a3788c6fcf9e940c122d82e564948225f236934870aa52548ae0d252dcf7121d1c89e852354d88d67621003a90101520d2aa11cc2887441e7f7f87aca6dba676da5669b4af972b3cc2d9e4d2f45f9db3aea793e75400e7618894956566530db1a41504d81b28f2728e8f0eea6c72a5972b91b036652b424dcc2858456907ae9546184e70f9506e1e8d52f3bdbf3bb714ebe1ef3a1bca9f3dfb0f239ae1279e9664d35d126565b6287ab96dac80ea02a42eac9a6cb2a82aa288c65651760d2510c2cdd09ab2d0565a1b6ac3636d838182558a56548a3a3a5ab1b5c5ad0aef1a178e767624d68a22b2cd1c0cbe446f26a389a6a263a376f14cbda1595b8bbf80eeacaacb653ac1464a39a69842aac304337427c8cba774ab24e4f2ed1de76db536c02469586ca4a98a8565a349e5eabf1db3bea32b636d83cd0c5b3a5624009b1255e7b1a6b3d67af46b2f4de35cda3a502c190b29b93b0b320e5b2bce6673e28b56852cb0551996630494b5bd1778e0b11d3979bd52707571eae7e8f3f47b5e97ca3c7d14797d5e7d661a3cba5590d3b06b975c8848cb4701107570ab80b342f3a5883ab8a082aa193a4e54a4d66aea22b2d61851c3070c1c09994c52b2a455e742d593de77acabbc3c3a79f3b9d11c552a345973adb65f29681ae56b7353e4a1d6b1691eb2a46e5f43cdb3d26458ed93a6b9e56163737403cceec94e3452e39455f9179f59e8e580d451b036c0c451c1a518852464243cb89ca6fcf7cebb2b25cefaa91b676cf9b3762498ae39a3d7cf515a2585f50e8a8b42b3b42b6361db5c94616462d312650c0ad46d225186a32b4617a25eb13f27d4e1e98c79137cadcbd3ccad2b465847b795119725adc953eab97c9f539746647e7d6fc7d13b3dcf1fbbce668416a9e7776af53c7ece691032cd88d5ecf4bc9ebe7400e9ae6ed83d9d3e6f4f3aa2b09a4564b360686d8db031182ca4a56168abcda3a1d1ae3a3a39afae75e7e8e79a47959a44a222065ce86d97cb4a41524f3d1de6e55d1b27a4ab1d3e777f9e9dbd1cbd030c75cc602c2a6487cee4e4eb8ed5e4d54bf193b77165efe2193020db630606d8a904e74a72d8c548f94957895eb3cd5cefbebc96cefa6dc7d39aec8656230d2b04e79752db0e89f4255e6e8c52862b909cb669b729a2f11e41a91541428d4e1944c7d60e6e63cde6e7ecebcecdc9063b02f3cbd9c3e9797436d6728bc2425497af2d65f769e3fa9c7b57632d74dd1480a702515945479cbb065a2608b866823a9485664d4ad2a32d023211829c3070c1230f685a2a55a3a5e36b8b5f9efac5f9fa2042f0be76b3a258aacb9d0db2f990b49628eba66571fab8fd993cae8e3eb8e8e2ede03a3af8fa61986d73236d677cfd7cee98c08d4db636d97104c4f49cc3b796101ca31098832921a6f2d32cb1170702394657bf3525e9af3b4d75b40e75ded0d9d75b73b960147d3635258bb44252b1165da41293892891224699258ad50a10517524ede929a9585f0bd2f9cd65a88fd39eeae427773cfaac6e0f5fce8902a6e5ebc70e74434992cf312fb7d3f3dd58d7b3b8252fa83cb335ea1f349eac461a727ce9caf3af6cbd5f25305d364642b3e8e4b151d155196cdb0a23636d8db6314686aca8b579b65d17e6bdcdedcf7d73eae7e8810a21cf469d257394ae7446cbe5cab259cfb78f4d97256fcce35a148eaf33d1e32dd7c5db069c8bae57f0e51ebcf023508d8db65db6310c1bc3b4e21db38e6dd301760620cacc0e7a138cd2a585433a6b9979b1478523a525d0b4337ceba04ed356b40e6dc291b4d56c626cb373d464529d33904b73b012bce965d4095555ec5cc149e8f4d5684409bf9a9e572a3f5e7602bace796ab2a5a48f5f23920542080f2759b384910d48d0ce80ac2e4e62e95b626656959931d0794cd7d42fcddf2f4cf2db975b725a75eff0087dfe6814ab4172d6c023118db00e5c365656a4de5ab218e8b42ecdba39efae7d52acac9ce93c75a23a5ca02b9d6db2f9bcf4953735274bb1a774687a49ce893ac92eee05d62fe2e5ebcb022cdb636d8db636d949050e046e8e5ef953946176c0c74aef3b67a0ce26f126682581c8bd71d7393abeb25a2c75185a29599cdea6e769ae84455a9930eb0a15af294eb48b9b34d1f4d0bc522754a7659b5d887a75eb951ce8c86549f39ebfceea0bc3a7a72719b503ed23ccd08d52b5ca308c0b5282a94e4b5238cd274eac20bc9949451973581b1306128cc0523147803bfa7c86cdf627e7997b74ad35350f353cf2a7c0ca3651b295254c3bcde5ab2b4b7bc2ccdedcfd5ae7d09b5938da38eb54a4ee6608cef0d8f2e4f3a9c9d3536d87e9e4e91d3a3924e95e7e0d634c6ebcb618db6976dacc0e36d8db609042361ba398af70e6c4b764a5e7c426e883e77d233e3b217d36a58ca03b1cb2f456e7cb7ea8ef9cfb38dee5eb211d2aa92f4539d8a3c543d1c940edace8d079688026932b4c8dd32c2ddbd72c3b19e407132951634e36bcbf35d7af1349d779aa1645765b18b121d3cf489276f1503b2652a21cb2da68e926a2884a8400ae55d3618231012aa31080601db04ab159f5ac71256f6c7aedc31d5b9eb3644ce74f8694952ad493cb72ad2deb1b494ede1edd62f83dcc61d11c74aa1164832cd0d84d793364d664a6f5cdb25cd1e0c97e5926b186dbc6c31b6d1b61476c6c3076c6db04826d89b6c30c547adc3dc79f0f7bc5891c65eabf276f3ee0b9c744d4cd26a6941c65c284e5e6f506b1e50f5c6b3e6c3d58a72b5a364f5e606c50cee8b696ed8e3a5d978fa3b3ae5e2ef3591598a6db598600064b3f17d0f9ed4195baf13596aec0ca84cec9992a42b2eb0f9dd5cc9976a2b8925640e14976705799ec70b56363e5c36503b218628cb8602ed8c0e4db05349522b59fa71e4dfbb96a35edf3093a19a7234d31539d334dd6cd3796f6e7b656ece3ead62f7e7e9b9846d3cef64754465946da5f221e69ebc7b69e76abacc23a01ac91b26db50db00ec0c70310623076c6db0d8301860e186c197b2f3e83d0e1b751f29baf9637a9c1d3cfb751cfcbb8ce659972b3ce442c6518e3312104a65a0b143939eae498b3272743d2cc285012d66cd99d8ea1b032b4cdcf5f3d787caa276e241b592bb6b2c0603ad1332b11bcd831bf2814a5870c08da502937295d44997e75f43c5798c54d62ad0dd1ce4f67ceab90e6a821ab3519ad1cc7bf9d53d7f2fdbc3b793a1667cae0f4fcae8386b4ae2af91f3495336cd379aad24d2dfa397ab2a7473d58ede9e6beb1395679e9360550112aec25f90db7a3cdb606c720cd521af036da867506d8db036d8d8e0620241310438e5c198472b1ddd5e7f76a6ede053bfe7fe9b9b37927e9f878dfa759df87a416d34b9f0b98899f28cc456244638c1ca2e6c2963602cc9896b15f35c838d9b6c6db001504db8c5f0db9baf342cbac3591c0e16acd099d3485528d299429d472af5f344e751644b0156d5397b0f3237253b8f3c965e6db188d4c55a28cad4fdbc9785e6e97978badef0bce1f3ae44e8a29f4fcdf464ecf03ea3e399d3e9975216c88ac54120a25e19d66433767439d5efcdd12f45e3499eae8e4ead60ce939a93a3e773040a0897e621ef27a7cbe20f42472bb30cc2d1cd2384144a50e86db1b6c6071b6c6071882670c06dd041aaaa74523b3d3e5e9d651a692ac2a935e879beef3e6f17a1e57abc7d0c49c6d4b61736149ca09c638989c0cc6c4ce4562f72ac4a024d9b1d66db26d80460b90f087c24dd7988563bc505046398c9a556bf1e4f50f314bbf3c60f27a7d91e35fd191c8be8f4dcf88dedd8f0fa3d7e73c8e0f6fc95877f3f5579f4b4978f0ca76d6174a05d18b7473347d1797eef370df95bd2f0eaabcbdd4d0ea5cea1dde57a3bc7a1f33eef8367a3c4fe8ea7969dbc94169cd4d97a259d2852da1d6bc4e8d8eb5bf3df17aabcfd11d1d1cbd5ac567694b061b3d141028225f27553d3e45a73455cf031d883a046e60752a392e3f5f98f3c3037473d432f454e0179099d0cc2a2dcc4bf32328d504caf4237b5e1fac7b9e553a23ccf4585710f23d19753a7871d3d179d7877049957134b9b0336504e0e26c04b2296d606c536c6cd884c76adb630c2329e507ceb43ae09cbbc20a025d5cbd099032acea4d49f524e8ce9b97a780f5afa59cde69517252b879fd09af50a4d3878ba385aeee1b4aa9e8f97739e749876c3be7a5c014eae4ea8e9f47cfaf3d0f33a3b25038113d35bf24bcfd5e4274cfafc9ecf8d660f1a7db90163701085253051a355e88b5a54bc2b8df55b92f9bdb5e6ecb9eb83e39c3263ae57414112fc90dbd5e5159ac77717abce715421df7f3ee742f174155af903275404c00fd5c58f4f923614554610011b1a93a1d93b24bcbd12ad4eeb73a3a3cfe74f67a3cbec3c7eee592fbc78a90be84fc3e7d7e8f66e5d14b655cd94139362456c6b1c5363acd8e4c71a18e36d930200a652af837f1f79601baf338b2093133cf9ce87ac0164735a7541d9cfd091c900cfa3cc5e89020e99b9d12ebe13a0c2424d3a4239f0dec78f42bc5e879e332d0ab1241292296e7b893e9813ebe79afadd7e03e5ed785d2a0eaf3b6a7b13f43c749d10ac1a7d3455a5193031cc07046b73d067a34a6de6f6675dfd9e7f766f6a824a56863a3a3a2aec25f91dd9c7e9f2e56c74f3747394418d5963b9fcee939eb543968984d790b883638d89173006382b7627d4bceb7e6a4cef149a49fab98c6933d2f26617e923d504879bf4bf3929fa3f94e8c75fa6d8f3da9254625066c03880ec6c7598ec62321d8046c61901e5f4fce54766edc8b322062a332b13e6f47852e9cde8944a62938393afa18e188e21f651aa52a948563bb9bb269c31c57a215e431195ab2a25f83d2f38369d8a9d8973f4738691a1721ce5cf13604c688260c7a729dac3e75a72d9ccc08356ccc066c28610086a52ca169e3d6f43e7bd5c6bd9787462cb9fa238e85195a5044bf2f3ec5f4f9787bc728ad8036c6d8836cbb6c9a93b1cb5a293520076090c0c48998280720c716af1d4f4fc9b7316eff301e82b58e3a855f62fe14ecfa3e5f3252f557cded5ebf6fe6fd2e7d3d3d9b1a18e36c4d8e0638db64c41adb1062018a8396be34bc9c0776e5aeaf7293b225192e72cbba554e5a68e2bce67d0270739ead7c427770050362671d072da56b7afa3cdab3d30c8372aa4aa7052548f49552fcf74256e7e91f6c2737540932e2f6e5b0fcdd28736a2003603a92f793d9cb428b68210d12831c23018db103060234e8baf5085a67a1eff00c776e6fd14ad1e3d906d34a085f9fe0cde8f283b1b150e385380762a03a82a888b98181c0db04ab04821c40aaca0600db619e44ca6eb06507a1d3e314ee7e3b9d9cd175162ea0953d1f67e5ef8dfd16e6e9e7ac760edab0381b6311824130c134cf2cb2f9eecf376d59dba720c1d9469d09f4cac65704929322bddca45a3d47472f5731005466560ab8338a559d193429258a32c0041882a69374e879dce3e985cd8811288412930bcd8e96930b1ba13ccc2ec0bf5f3f459c52d9757505620c36063805b46da665069bb79ae4c39258bd3f4f29cebd3eaf0fd8e5d1d48c6fe4b11e8f36d898a918a1329067954c18284744c0e0620c08310466470ed8094513100c407601389d3000996536d97118acb60f47363b69e7f71d5dfe07a19dfd3ef9cf7f1aa83a51b636d8db01b0c61949f99dfe0af02bdfb718db4ae7a23d1084ac6e51b63079264e6928071baf97acaf37471930718e03e047a2b94647b271ac1514e85041b6c37447d02148506d49986c04a0a94af289620a52342808103826e694fd33b278f69742b6c8329640480624042cb932d33eea4697350736c6c1075965a7ade2f4e75ec807877f941b7a3cd8106db1b601040292a0eac0d3702e381b600600db0c55c62080102e3850c01b61a896173a924b4c5cc019b0b8e55c407d0f3bbce0ec848f64f0f7cd7b9d5f2bece37e88db37020d813291014f190f9fef875c8e99b6b968d92915d09f4c7a21e332403e04dd09ec0a7572f58797af909156310c12094756aa3a9211b461032806c6db1d5d9cbd69c52af35bea45b228d83b616569915a4d73a12cd3686c4d99c394b47a13ca78d5ad839832a36d825140802e77eb41c8bde4e88c85122b45054b1714554e9f4fc2efe7d3c2c76f980403134accf125a4c4752581c0070818031c2e6026d82e8c3b290620008302000e2965ad2860889655886d031c286028214620f5bce3ea1e3d6bce7acbe4762fb7ebfcdd71af7c23e3446c053294f914f3ba646f4b83a735c991f25446e7e28ebe9e2ee349e02e0454a484d80fd9c9d86e4e9e510ec12ac3b6a01d4d3904846d1801808083104efb4e96717376722f5f479fe82481c6c4011d492551531033a31479ba3b2d07b4a89e5867683ec9b650859144015aecc8fc87bc12150f1e80689da4ee721db9caac0ad4a32f167517360124c70859ba08c09700831536d804e155c130c0ce8e1656062000a9b0c675b55583205602aba8ab45550c214361036103854a4dcf429e75d112e561d9581d7ec7cc74675f50bc97e7b3e6bf8ba133efebcb8bd5e0eb66b0f2125e9e4c05d89d7d13a890ac404104e9210152dd7c5da272f5728bb60d16c52849028f4ccac4e1d5026acb13db19c31db59d6ce5e3ece455f53caef1c3a26c70a944151d5515d40e8c51e7546ace83d26e9e73e754da63229543b03a85d372eeb1e26a93e540b9dbac28a85179fa6c9375196740531197cf0c146c4c4140aca223aca8c3173b1958036c1189958120ca331007461836268e95b670de760b8288180bb6303840f9661b081c4207c496a15a4c440c44bcb1e8d3c9b1dbe970cb3534eda821d73b178ba145c408192052773ad8049cd82a956151e620206eee1ed37275f312db14eb8f5a3a95ae50f15bd79ec373f5729395250362174a1d7695ace5e3eee2967d10a1e9c2a2c5c40118130ca2abaaa9386ac9d2d49d07747b9e39579a6ca920054d69f6a6e43d614331b8d4d6ecaf3c5b8dfa6b9fa701c064cd3c3e43070cbc59c0a4906380ae09a51166468bb2398100db008c10093c58208a523152af1143ab552c3503236c0cac94bb6082602301762a01c2e61031273bba89ab05a6eaac79aafad5f4bcf64eaf5bc8fa293c6e3f53cba877ee7aa435d38d1d25dd3cfd47423cc9ae1408d194a930407b787b430ac499172dd11ebb24158873f4f2ab5f9ec5e6fa382769188217563aba397a2c4e0f4b80862b2fa17e1f42c96c00a408ae82860bb6c8d49d47acad6332ccaf95e8714a50cd485ee4783b19b9e0562dd753e98ac0e9cb44512460a29b62619804e0620e6db2e38c004001c24a88b3db4568af5839490aa098e500801d82a40bb02cd3a1cec58d74aa31183b6a01949d67dc439dbba3871c26245cc055a2acd81868f429cdd1cfe92fbc9cc79eb8b97daf32cf35d2bb8cdcfd47a9e375f3b3d1cd655a7188d257a2511eabc8bc2d126ac01b032b2930406fcf52c94043aa772ddfe57ac83cde8c9c7cdd1cf74b4993ade5693939fb39966461d918e8bf2f4d94e4ebe73891d257f47ccedae85ac91548166e80c31b62356741ed2b537a5cdcccef2fab8668a975b31e74ac4616add1479e7d519ce06c94f94a660c63b074e898ec0c41c673b40ed0aaca6db110ca26d96ce8e332b2657c4d6c08ad95642a098a920bd101af0b98e285958276a3b28f3ebba78fe8d49e7f6379b2d011581118820db2c83cca34eb1cb7599f49d1c9d98d72f81d9e7685a75d64f572ac5fb78ec453d3e043cdeca9e7735196adc3e8039efce01b031000412041ab2a167526f577259e80e09c9ec793ddc4b085e36a1d8bdf97a10f37548e35b4e50f3257af8faacba9c796b68ca2d1a1ea2ad2e60195527598b885d864a5a352b69d537abe5aa79d0ece16dbb373188735404b730e909123a253a54daa41546438841d9cfd8579783da8f332da9074465e5db5a31c2aba8bb242ab20b815b3ab23b2384826c75286c287d03104f97a79977442e8d8e09cb5434907a397d44e6e52448f675af2f35248cc8ca032c623041c09d02c2fcd48e8e4e95392e96a82d24330c3e531d3217af5aa5339e0f1ed2baeef3fd0e21fb28a9387473d00c929c3191d098653526e5a92ec3a600dcb7a5e74ceee1d965cfd1054db41e8e7a1d2035734ba6243301ba39ac7664a33c5cdddc2d291a3bfabcfefb911e88ac928822b2836252f1b16a4eb6679f6478213bdae58e733858633e8a68954a1e771b16ad44e827ace9173346ede59c7a31b98f1fea3cce95f5c04c5f8d2a7a8ed8cae822ba4223a2a1c4b30742eaf40e26d8836c0c7003244635906b2a95214e9ec1c56745fce2753c7a53836ca8940a99902548fb110106db04abc73ceb25ead2e921b29356012847a4de0d1687ade8fcff00d1667c4fa74f3f562f27ae8bc2e919bcc0b829c0c647411482fd5c933d7bf93d08edd5c9638c00aeab3e7bc96619633213a6bcd7a12ba1ccb598b4939d76e6e841e5fade692044b6edf3faacec4729cd3b4d629498082b7bc3a12ae0d91f63cff423e61964d3544c6c98e89c5c0e1c0cf540f36a21b2629dc707b91e8999da16c91e77214aa1d7d3e1da6bc02374adb032b28a8e90b3798b49596ac8e8e76a2460e04c4608c0d269c2cdd5456544b32bd76bf9b933ab1bd3f2ee72d7a38c7055555940ca47746025413c30c55a372f67228ece1ec34af32198126606a4cc7474f2b0beaf97d243cfe851b66aad66f24a6c94a309495602ba08ac0ee973b1d0eae9e8f347d64f3b31a9aaf49c936cd4d1b44f101ece4e8ae9e7a742714a80e7cf35e9e8e7e943c1dfc8722b2cbaf0a1e9b73f46b292b488caf195082bd1d1cdd694c5137a9e5f51f39442d604809701250362675239434e27dc89e9ced3250f8f9beeb79fdc9e67abc55ab65841a9d1e0a52fd3422c48eb4144de7025498b59d568e8d63b2304821c0836c0180a8ca2a912e7474b5274a08f643cdeb7887484eeadba3aa67cde2f69cf0e5ece5f11bb32f23c6aaccac49696395810caf38e3ebe4e85ea8d209a769ab0688cd22b743a4b2b02391c568d2ba5e549228f31011696568caca4c126e9e6f64e22d2b2c7b7d8ce629d53cc9f3f6f22cb8fd2e7b78b8bd5d6f8cbe9f9f694cc3fa3c5ac656c4a1d683744dc32a84f273a4d065c767679ddd63a38b39a5784b365a2d7b39fa593cefccbe8f177f9273e5650e1c2548c54a660c66d83b6a3ed799eaccde24667076b38a2a014e5c5f4955af031ffc40002ffda000c030100020003000000217b4fd30903775415f71e33890514337933111783703eddce6ec13334dd48e0f5e174dd8281dc5f69b664c35a6fac949a411577590fa418da2370cfbfc6527ff2eeff00e8c69efe6805e6db227df02412e0fd4b35dd40dc4359bdfcf3e8cd93a62b7156f781c559531d5bdd43be325213ba2aece569af2f2ee359d833b7c7fea9b396aee84157d4297e275d9d2dd5e6149b64022c2ebe3d75f65ec4dd409f820ffc946100467bdc0a662de1b8759b76ec74d3d20ac72a8f07c4a46170e9544fc778e4415852db29dbeeae5423ccbd1dc46a3e37ee9d69d7afa3880b4cdbe5b510193a338c3851078186446da0461ca305cfcf3f836ff0e4c6daef280004607d38b08101d492c7ba7b37dafcc22691af7c754e60c851288130941c74c2ddef8a96215003e439b855878c148b1edacee4a21ecde4a8cdae2be50488287ef0480c0381209fdff36bf0aa80a530d0d0a6baa710eb91526cbb447bdac9820971700834c4ef12e45b35eb9ebf08bbd639f24c8f4fa6fd3b0c7baf4b1a14480009344f6feb392fa1012094700a51b78981a4f160f682a413c14f6880f321947a76201e87ad745fd7b991c6324c10816af67ca0c560cbaffea744f1a37996144cc63386fce9561c74f60cde2d02c1db56fdd8e0f2cf016ac7d7e6db7106595684bf646595a9e334df1c5a12eb31ea48605d8f27ab4a656a82d3446a64196a64881b9b4a2c9667c832f760da59cfb554d21018300ef3e65d7d7252525562bc021895b46625bf5060519cf8bf75a2f8017a4d50443a0cd4b1b23e1dad5325d011b246a8a3a220f31f5336a447a1023778c6e9b14c79154963a479d08200c517d1aca7aa5818deec5a593732a2a3a11318a3c78e00fc53493f297fb494050bf74e6cb9d1b4133388678208c6388c59805e61d4e42a34995cb800d9be98a7339318cfc6034b3cb11580e23031f8e3e6cf53cada9f99a10857c9e238889c0a85343e82c827ebd0488648041023116997b3e2f557d8ea85e5eb3f20350e4dc1c78adc269312ef947b425a11731c12eab42e835fd5eb5714d70e75e0072aa46766acc5320cf978e52ba939cbb49a1b8dd2366a94aa4ab2aa63f5c402854368e55417b15a794d4043421e21b32e49d0c737ef11eb2252c87ad65e474a2fbf1a80d94bfae11341c0044aef4bccde3ef177354c7e8aaca611c7668ee6818147a262c8611a80cbea2591d3df0ae390c56d2455b58b028cfd315e9cbc327c9487c9ec31038b0c80da4f2690269133196b33a03ab2552220123902d49568566a830fe330a1a32582ed0d0b55a4412ad73188c8b40da8c6ae16856c15b819951b534627e5f46c18e716d424a17cbf0ba53bba4ce002a1097d6f6e896c991ab56a513034dabd30bfd4311c61062d0d0b55950a27ae7929fd43a7e52c33414100f1f82c8f6a54106588bc35a147a2c603076af8386a410de2f5720260302b7ae64a111870019a7ae5d05ea6ff00dc2fd1249c2cfecddca55a1bdb2201b0b3bc388eea5527ae454086bc7536e3fc0000f9ec51f257c255ba4d9f07cb4584bb830ca65d52acb6072f94587174603b798eb1e80daabd501f61f5efed0d5c39e379a2932b1c8d4334d4c59c1000f8d6a9227b9e548090ab1a389ba2b350c7d63ec15ed6df3eb962f9eb58e08344d8f791fa3eb423015863ee9e6a98282884123a5019aca892a238c200a2ed360bcaa8fbe173e39a70d080529f0939513d56f9f3e8f511fcf18eb4885a5e0a5cd43f19c741c17fd15990408f049abb1420f7bcc97952c07e20bcca986ec79679fe9bb2d2928b18799346a4b1eb75b14fb8b02af0d20322bd46e859c2dd2dc01e23c9e530d681b91b905a6ecdd36abcacd7434b05bc75371e0e61b43e7ea51f3edbb4f4b42f13881da241597ab254864ffc2a4249283492c8afdfc60ae704f506dfc93c15033b36d1d826e4d00f573b153ceafdde685b1db098f5bb6a38520faa5ed8ad18d9304074f38709781741514b811937559d00ec385e671ca1014fdc1fc437739803edd12aef7645cfbc513d9d93c3c5562c1b3aaef43818877c17b412fbe685f8ec66198fc398e35009128272f845291c4c37a2725482af2fc083a8bcc9744209a4e804d37c84e3bf0d7c6ae616bb253565117520ac8fbd1341a88622a95b5d97a1b043b6a704f779a4106abdd05f0eba161ae118d1d523b807d20fa0fdc58e6fad9a1eccdac4a2d48409805860d31cc88163570123836ba63148ea8b506d12e62f3080f418382eccd118161b16829e41c195bcb07d148e47fa48548f2523d010a00ad3a7b0c57cf0ca772c14f42fe372d6a9ea7ccbaf59dcf9e0746300a2187f3059e1b15f80144897f0dc08bd95878139abc814e086968dcb0b2779893e91d6dbe698058b51ecab9f9471855842fae31f86b3e4e88097ddd1f6a16d580120695b0108281aba76ad5d5464ed91f8a1e1efaa63ccc8b74222dcd6efc57f9159c8439524a2b56521f5d3fd67eefa64ccbfff00483b94d2d24ae56cc50269088f269b8a9474dad52986f9b3a7f0713ab7f0463dd9f0eae7dbea118c1cf996314b0ed0dc9f28a48e98a40b681e3d3d0624235c4153e8f2b1b600619b8f963383dcd72193d604ea6065e4857d07e10b84edca0b096651cf6b789b895e0f5966f3e7be24cc85e253548f7f7b71364c0c459f25e12858c555b3ef9e01cc252e7c3a49c51abd77288ce063924a65eca7677dd5eb69aad3f826044d55ca73610352c35550721f3408cfe3f19cefbbd160e4d425df555264ae7848470564385da322cd2b71a37737f1dd343f2a4757ac8208e711b70d862c52d8c1564e38e00ac04f8504525f43b6d569f463d872d46cae4da2679f1d99e3256a19203c065ee319f2f40373482f8d4d4c86679e565e7164c50e759c68949c5e8b020c02cdf1a5b184652d07f3921b69b44051ef16d3aebf041efdd22b18d97952b25565c877a8a08e25d97aceee53ab424c71cdb8b29b7904281f66684902012ec38d43c835c0df5476df09f068a2831683408ac41af5d13408ba735e3d0748b567e9864919749530ab32833436880d332fa63ad8c7af6d2f4906ebe8ae432cdcdf8a5a5f31a0fc87287362a7f3823d071a8c613e3dfef73a60896eb71ad8c2862013a6a826c500dfff00d733a207c844da70358d33ceccf34f3839bd0d881a2625e9d1aba8d4da16b2a2413403ca81347dd8662b16e6822ffd8bf541860ae644b21d56c52c7ce263fac1b9d6ba849b78b608caf28b12981a3998d6e4056fe18f4912faa543a30d1c53cb332e32a31236f8651715a28ed4634d0a33ea77dd96bd88320cc273d2aa46e7a60089189831b9a78a46035b38fd6fbbbd46bc05cc89aa3b78810c32ce317e5aa95df129b7d069bb31ddd85a13edcb6f51c4dda96e08a18f5c8e192224e76d8b1fdde3253d66c63f3e3eff0083517015eb11ad0a161b451cd28e114b1ccf3f87a932f0346120ef1316642fc9cf0ff14af87aca309e2a81fda08ac94ff2e1d4764c25e7d40f919807aa9d763180410c325e338f3c5282b6a2975582c1f9a39f2bbb249233d90dfc4706d27742928c6fd490f8099028a4afd76dd45ef3c26536cbef6c116cea4aee8b41142d8e5331080a514b3af42b1cc70fd934787abe8283447d2fe97029ff00e2e2644f1f34a4f6957af9c9cbfcd80b8fe3c35906c2a2ad35de510d569b462ed1bf22f1c5a2010087422261ab3fbd84b4da4d803e83b40f6a12439a20bbaec3130da94cc4c66adc277821d9f650d5514745298e3b4b2dca7fac376e38aec7218792928981f41ced0df681a8f467eb403ef81227d3ef074681a14b4225cd2c39072bbb8fc7ea924d7dbfd365a608eceb8add621b5c0a9feefbe62f3020bea9c62eccfc0161f9ac05b8f28b54368399a3e9c99973784915d62eb6858a4a9e568c4a28f1176944d349b3da16d33bdddc2ad9f75c6c754465c3e8828baa4eaf580da3cc04e7baf0f730e6f4c3eda89c2b215be6cfcbaa6fd1d4b0458d7d22a8c6d09f40cc0c519a4ddea9a1a686d49d4c99c5d61ca0e3ae7a676285f33b971a24fc1ad4aee72e12956d67d2176f0a5395cb125cb334958f1a06cc2d7694137a440159f216b26021bfe9855ec6723cd9c0b0ff0064e9bebe8448920638083cdc31f32106784d692b7c0e719aa1dbfd2670d9a3f94393068d90f38db806d56ea7bba20eea28bc9699279c1c5d60ac8094e7e193a8d08d9602bc1ea55247c3c6b3acc5949812343a634858990fd2c60dd6e23b07ce04bcfbee0b6bbb23badaa42e2c5abf61a9145729e0253af37dcda631c5b2a48a4c12342b9bd079a5ce950059c607842bac90e28f3a3307537241ff004f0e29c73be144bb766276ab4e13dd99104f7f51f68bf37d385de4b6e1e7b0891a9b4843a07113adcd50588f4cdc9e205830ac1ef1fc17a223277a7f84ae4ad2f6b61b45c6aef1a2d60fd092cd6e81a44a5348dfb5002099e7e07d20ad90b122e7a68c18a2f76f6350734baf567457375eec9de9b761a6a7be1d45a3ee8b456fb1aa528e564346f1c1c0b90aca10f0c8f23c1ac86d6342c60031c9d78f7748f833bb61626fc157bd34531daf65f9015a78b82997afc146951e300c2cc3dffe157c7a1b8c86fa2f88d28e20274adeb8e993ddabb90f75e17a6e09cf59a16005bdf28e164a75d184ab8a3c947a96c1a26b9d56b3b5e30cd7798854431f2da91a9596b9c6c02b8130e9391c1013e1ede79ab8f5c1bd87f9b48c27495778f3821a84d7ee5b058e3c92f11f38bd6124ba752ef68868e649c5f5def87afef8eb05a15a1b355834c9a4dd76aa971ee16afbc16df632804f5253da41515651c69cafc55d3ea14167c84e3e3c2b95a87cc1c81462807e940f034f2773a6c6d7ba2b419e67ec34d5cfe7cb14edab7d99299d807c160ceb54417f9558144877f38c3116140a791adb7567cc75c0f94b43dcbdda72425f602c70c6afb4e62efc49ec927439397f539db8cc3d64f3adebff009363141341d2d6cf59a27696f118696bc03bd78f18b200a924ce168474693fb054be9d29c02d4501cc000444656c865910dd65e32ef482416d4cb54c1b21c34b02599d4f22aeb95364e077bff458937025c08c5d6fb57a9ab95837b80ae58b347f8fa2bbb9d52da4d4126860b55c8389df3d1a45386df31cda4c13cc361bdc1898540b44319f6fe6413131b57d2e982025b6f4f9ecb85d145bd8edb5f413b16730e4ce7ef13109c158509b4376842b15c00433bc472c2127120beec054df5cecac2376dafe99de29afac93dde19db6189ad709d9995dc754df7c80043db51156732fdba0a5d0a177d1ba4f15292938d054522850648b7420a653690c2daae7d00653812e677f387bf03ce21934e253ac48d807fb825d194137b4a9ed992dbaf9e3ecdaa775a40c1532642702eda237fd49251c6a518744db6cb78549c3b0a577a700c359ff00f1fe40783f9df25fa7be7ef1dd2bacba7784715e3b80eb2de73f204c61f72d38ef5f6d72fdc77c75c7d044a05b6fd898f617c674ea2766bc76e75f258aba37dbeba7b74529d7544b69c2e3ff008278f36d9a9af3423e8555693fbfbe41b16b0ceed795d851a740c36551d158952bd9935878e7e930481767bdcef1f9e6781bd382dd639281553b45a35cfdd3bfd8189023b628963ade4ca88c7b55b40517df9a5db55765f4d612bf3e289787b7251f6da3b7c32b79fa0aaa634a76f73456035685589b6397cc47df3b5d10f0483218c20ac65f99dfab0ce59915665071845465d45bdbdcc30cb1911443cc14c00cdf77bffa9fe26e5839c798db0bb7d73e18a516bd70beb212243dfeea107faa14d26e3d7ca7a4975d86dc1566f2ea7df2c67cd24ad2535aa1c42848fe8b23868a6c7950d0bec6524da32458dc65b4fdb4c09d4c3304d5167e2e69e6fac1c60be82abf56595cf8aaba699e1d73158363cb3b4423507d89ae000961e38a1b72780d3be23387ab24d47035ed97a2411b6872ada57bae3aa0cbdc3bd1938c2a0b23063a2fa3af2a82bfd5fb1c43bb2ca7b9288c92e1ce4e6e7c8218db5aab38ea63441ba63c6ce2a8f773ca1fa9ebe502e793eee78ab62ee2d083694e6d8a39a6a75e6a94c2caff005c70386fbe866a683ed6c6799d7dda6a7a6bc87dc8d0c123e53e1e8960da8f4c0b181484c2b6dad7fb2075dad20f7ff120efaaaaeb8ea002a063f58830a1da3328e31b7e2cfd4d298ce48ca8a059b9ba0813089bb73111a412afaf00c3e4c4c0eea9a5f84ad585da4580a4cb43ef2b2f8730528728bc702913a9ff0095ceb2d072fa90b6a40ce6ba3bf0598aab93025edffca710b54e9bec97cbf097f04e7c570b4f69e19b6522e3b6844f2e583598734d0b2a452114b75faec322f4ce05fc68d12d0fbe8b62414941e2e35f4968e5461db1ef4c0adf2e7bb066b2c354891343e07e32080e968cce2a1253354fff00f5c9f7a219379c33263ad15dbbcd075bfd4639a8795c75c02224a8021b1be296febdbdefa0221c8a836be4c5050f5f35b24722b34ee1818038cf77c3c02d03a08d0c67dadd1189089868b853595cfbea255fd3f04067c892030e849d628ffe96c18b0cc20a035293316d3ce401c13a2e87f4008010ec22cd04b08fb08f64c756d0c3c32d7ee48fe3b56e0a44ccdfbc3db0e9b8e99436e95cfcf6328ade5b79719bce601162ef99a7f7581f7f4f6ca0882884a1c10e012f2fbbfca25d676a5e6131b3d781fae05a16d663f2f090c12a7255e62e755e67fabf59aa7831b8d6f0e0cfb8be86ffc40002ffda000c03010002000300000010a5d0745b20f93e4a3b778cf1d6485edc2c80e990a3217f3903c0ec5ef6da989a2b45da0b979b68e2634b3d5181b524ddbff64a02cf4c38194fb63ada01ace88cfd11ce0b41c2df06212b77daae63d34c5fb0ca06d7ab3f3f8e0e9e5be8b7f85b68af39d81ff259afd847ec0b5d792ba89ead4821ff00ead59a500cac081052f17048b07f7ea8d77fa23b6af431a40118d0cb2e5593c06ca8219d05a891b54650ed299e5b595c1566cd1d73ac2824d861667ab77d0af2afacacbfe9831d0ae992cb5e550983a357ff00fbcb7026451b9b431217f78a984533bd7eb17009a349e22cc5155bab4b90d1f112cabf931e8946d02384da2c80e968ad8a5c0c1282910e7ebf7689dcee83f0676ec0a176e0c349fbfa50b958b90c3c5e4c1573fc1c4df27e2c8399353ff4949e68adb169541c2f4b102acfee65c76ff95dde3804df54d50dbef3d401a6f89d78ecda6ab906de09713c6cf80dba89b796396fe9eabc78df47d32821e5ed7a7092137302e39fff00a4db4d6b30a375fcb70fc7047134d86df047e37af622ed6ff7ea1f59dcbfa603bb1bd1e577ee2a89516211e0439d90705555074f5f986dfc37de70887fdadefbff00c8198f7c9cb8d9e6f7ad084c9d3bf789a6faedfae7f983efcf64050b31012bfbdfaaef13fda51764a2c4c1b1f70b6faa046d9fb7c06c5f2e447ec4d4e94c0aa22d2908dca96887decfc6a6857f3a2c40fe5847b8bc41911da1c7f3975cb7c6db9635ef6fc4e20ab1c774bbad339de35134b6ad6aeee4284ff79680f3cdc9c10c5c942048ac2fc97c1057dd296d4b6b0de8b6dd022f769a9e6f68a125be2f55a1c1008480111e4afb74d532dd6a2067860326b8978b02f41f96581c0325573c7d692304dabbc377d2d27fc35ce02135edaf4d32bbf93de321f927cef0f1937c412a97824134f41f283795b2f28398cfc2b6a7f7b6031028fbf4c24255627e8ae6b416f6da7f80229b53d886160adf76396b318b7db27a0f3ed74426f1c655cf03d0e54029796f3fefa597008ae964bab3d568141c8d989de063c56e6f060f54c2a76b29369c9f9c2c57bf9dfcff00fb84358620ff00ed2106d23e2729f0c3962e3441dde9e6923ad1068b99ff003a48afc8cc02a4efb33040b0869eb79cd3f2ce06103c02b44b2b129f75b3dda5165c89a6135a6154675cb2847c1deef326452b911c1598a865197c377b1a4d882c6055223eac1d86d850c1a48ffc89f9b30b96703770847de799276b74c89698e65da630b01e2dc0cccd3801df009dd15aca48316771de9c864a618b0ece40c4d56ed94d6d8b4cd387f8a6d0a0430937af4793af9369a62312c6bff80459fd5c01daae59f579a8a1980d9dbefc8e98e11eb9530755ddb4d59803256f349c7c8387d31c8f3c2a6583073f9e2d20b9a2fcfb7277b8de888d2657956629fc966af83fef8bc208d3ebc3a629b7877a42f89f4241670e29152fac758c75b9c03078073725839c6dcf883ab9d58091b26de1a1f0f7b7c43494fdb154b819bd7e9029578e6fcf65f0e44ac20023507ea337b3a5edd57fdd13ea370f242b2d6d1c4a22755e091a4f15e6ae93b8abf7fa629b3008e52b303b77048eb3c6efd75411f2e8f59143e05082f37c671a4d7d688e48ce581bb6fd87c367417a88f028b6bf15acd0cbd497b1f591fca09fde177cd5457f843f35913b753bd995f8cf8f069a9f33d08234b4e9bbf52c4e24b5f5a57fefb1b6fcd659f9c5fe4befedf6c9d99daa6328480f0f1435f432e96af74d9874f13bc35af5b1d96fb83ab8b747991b84eeed770acecd307829b9aa9aaa1f49cc775d9eeccb28d8f6dd4bf7c8bd37297a3860761b4e7e18782bc7e950cc3ea7dc2b97a82ca11f8ad91d99a342cfd1929d40b1a19c81e8cf001b0d98ed97ab7bdb697385ec287c5b4a3a850f6730036e4f383a0ce01cd14498b6ea9033694fe1e62156e3d31703e0817d3dfd68f59a1ef7a996d5ca75086fe169fe8b8900009055ab16cb30402dd33033d1684ea8093e6c82a860c51dd65a34144289da72dbe06b64fcc1945f01516be6871110d5a9cbf223570abe9e649645bbe953623385214a88eaa87c72ad863aea8576acb3f97354a6ac916a539dc121ec311611d6661af736bc42f5f34a5ae09ebf8678c20496fd0eb7f435a064606af2ae377ffb5e3c7fa85cf4c5538bcf744e2e8351b9e5a3131b6855f09d123aa3ab5c389a963249e00af74473996dda0a3fee37086dab7da2d06d2586d8d43f3ccce06a92a6e554d2b1c986675d3ae4b2eb6240ed3dcbc12f9ad8ac1452b69a65b9cbc03368bc681995a51c126a867dd7401afede9dd40a01bd3491d4c8f8208d2cb3751767cfb42ec5b536b0d810377709b3bc1f41f512f309b1eae8e88236371fb9b720804e5ecffc011fd2aa109513c3d2c5b944b3667fc82fe46c4409ecc6cd357c8a4e498e7c5b5a2ff2d958311e873a9e737a7ea053d2daca624c9fcb7a89f646ba54f2079dba996f15ab43f95a79ee88bf8942117952f0caf4f0d729ee1d63a7a8d1d7dca1688a386d8f34944693b9a842105d708806de20155e743d68beced58c212bd88c71a7563955893af19ed44b751e10d999d2a4747055d1cd7edbc8b1e0958f5a7cab5be945bbab3afe27e96e4fb4e87bb7f86e6e5982c727a5a7bfe29a07243731e867a8bcf6adabede33f32140be568cb7ff1dd713c05cd939b0a96b0eb42d05a36aabb1c7f86344d2c0406d5f3c6ca1b6407817845f12c728a7a017e1011348ab322e832417a3725b8fe69a79ee9e77f0f731fa45cf1b6d5221b9cc53daaa525383b5c9401920a919cb433f174c36af8b4e94dfe47a728340046f8fd5cdcddb28661a56bc9c16d9457c0c3e4f2639fd35aebaa183ae3c9104c1922af948a5a958c068fc56d25769b8eed5e8d3299aaa279102ae4b1cbe6128ed92685678328ae07d6125c5dc4fce03164f16c02db8f2db1bd7822c2c2ac548d0d4f1b3cec2ab9aa7881277d52e57e73c56a8ba0da86f76626b1a5fb0ae50723f3d1dfdcd41a13f461f97b8eb1557ebfb95df14f6806a10817a396f75ef90dfe21ff00ba449d9abee7d5f0aa91c7d0567a31288c1831616fc37a042c6daea2821ecf879591eefb6ccde4128818d174ae095a48ef7529e2db5ea883b9f95af61e6c863c7e2745958d75eed0a525c9eca0db4e9c1239e9734e9785924a71e5f090d9677cfce071980a924496b90225563297de24a1f5be01c224d447acba10acac0779d74dd4889e552532c40e36e94460b50473db794c7b109d6f2370db75cf3a66291e729cbe4c2ec85e3d6ee89fe68c2348d3bf339dd28569b05a310e30d3e43105183406a4df491b0917aaa9696fb6fa991bbe41b69d0bd965b6bc2199451566a7b9f42d50bd9107b3babd664477c66921933b17b23f37b3711e51f6ae186c0a0cd5faae2a43af9ad35dc7acbe708b644b2a9edb4f468031531c5ca45374b28de492841b6334d6047ee62a58e6236564f1ed172266f3563a4f5c4bcf893eeaff00f63adc0694de9fdd0b55b78c48b60594432fc6a2ba134618429c32acfeda90fea4fbaa938d9efa68b07e2d576f006be3e52944f92ffeaba4097182ee69a92c858bb15b0acd955e1c0567a25cedf78102e0af9b3e2ec8358df2fb03d42344c83e9b01c6c01be3d4b8b971a04daba40249d293503bd93deb8e2240e7e6ab091b98b699f77bbab4b2d05d7f08bc2ad0e1cd54f0d4f62b20a701ab1fd1b1956bcea8561c614a1c86353c1c09835f38982a9e7c62e73fce62ca774bf9468a2ce9eae61fd981ca4b7fd5ef802d382792f090fe71e6cf11c336d2cb7fa5983f5674fc9dc115ea1c1432c727dbae44f424b0cb8f05b1e7c9d9fa1c8587c5e5b3273d528bfb553b546fda4a024fdbd51bc618741d99b92445541dfd6e78de0550a8a1e30d26914ff4eaba61421477db90f9eb8bfae1b5613e985e89ae910d50078fbfdba460c52eca9f1a1f5fd00582633a6926620210331e1418c4e441883478307d64c61cd7654e39e4b215170d79c490f5367f5d28f42d41149a42ab3c928e7a59e8698bda1f1806e29f2bfdb3ce4d4841bfc459d617b9932706b4ec8d330c34746aca960fd87119d65f8726e32340da659f32d898d99a540c2f46fe3ccae19cd33ed556fa6427ce2d9210d236b856c1ff002e9c8bbf9e261fce49678565595bd5c89c0fb80ff06e270019cda292fb34e9cce8535d5bcff060dfd61b6de58a9481dcca71ceed06f5ab91e8ec64e062a9bb3729480add83598eb772bc4236a9fd77e72e02da3dcc425dc41ba160b122d1653c050fa02a9cd21dc5efd58d3be534de84fe95e2b2692697794ce8b04662ce8c79d8c1c2d44e6e2989f43b577f9cc5702f8e67b0e9cf66c9b7dd4e1851b057c72a0d9b3005df3103dc430ba7b36a7e66769445fd73e14a84deec45111e1b3dc1b72a46c0967a7adcc62aaad7bb31d027f70ff0dbbadd85ef1d2bd932567181ea9c96905de1f596488864ca884bcf46b02dd857761a1fcacd96cf51f3c6d798ea07cfd7d00ec83795dc29e13e6241b597145a46ca567e95b563ba4699809ff23bece1d8547a3c62682a25045b1a25d1225086b563078e18b6d1af23797e6181f184d5e3aca82eada38514ecc62b61a950db407850d3b125c3941785fe95298f459d3ff2d963611beb61ff00c48264f51af4758b5adf2c7e66061292bd6a5cb734565270664fc23142d4a88589102422d4188bbdad469e6249cb6ec683f96084c294767a389f4ea6ca8ff5b0ab33ae7550940ab1db2018f3fb8dc75764f3a22daaeda5d84668478cebc30873413cac15278d88858ef977b850de0563a83a9ba07ddff642ff00938fd78d6ae405cc96bbe2106c9f0fd6b9c4fea17e8a1d3e228d31626e85082f8e98a23e6edb7a46caa562756c3e3869d89ed68016d58347b15f56dc4f1cf0897a78f0285a49b6fe1de8693a150f5030aa05bdfa5f66ee9f5084003ed87c76dcae1d13e68a4c2ec50f76131a473ff62fad73a055e1e5b013d125605813bf17e8d9b52b3b5af3f84124e3cdce01d9da6b4b7aa2bc66c4bd283ffe13df2af1722c252d73b8ddae0e74c63bc5d6b1cd251e8a8794b2e3e0166b52699d1b3a4f9b57110759785f66d1191f58d0adcea7fe7382f826c0fb11c11e8039ebe370a73b0e60d8cf231efcf446a0b2fc8bd1ff003f3ce7578e4f07f87846ae5a885d09c5758a3af93bbf7dee658ff0b993495f21723a2669cdeb8f06b576afd139d07adaf1ea3dd89010330ec13f7fa0d924dee1268b00e989452d1084428157b869df1e4a760ededc2cf647b6f62b10f7618a8762cd2621266c2bcb2ca0c68f409cf60fbb0286582e16e4866f5a33a79404bd497959445e62ff00bc452e8f2a2b26e94055bcbb5d87825c413ca87ce10c17828423b1c86dbf703f7efc4d159dd1d98de67444ade2202f5d856646ecf49741ee547f3807e87687c07d58d0bb889ba7be142aebfdd2c645ccc4387abdf5b49b2fda8e6c5285120533ac97de9f38e8b6eaadfd076e048e5fe22c70bf748c6b967feb50490cab778563570c67ee9e83ae4c52f58c9df2075753312127f3f535be08b8e34f45ddbaf72def75be250603c2e962870f93c3e94ee053be44cb17cc425ffd436871dc38c6fe24e7df810213bb137965a4aa684e69164911a319c69967917572cbde72cfadb6ac8719d223b3a4b10434d9aae2e1969e9958a8f2984b6035852c2bce6d6c9ec8f9b68fcb71910c3a3bf4b2c2e84ff69aef287887ef7bdf2f33cbbe735597e9ce9b9ec73593648a8d9447e5ae1cd5c5e11ce2cadd714d3dde1aa83f6f2fabe2ef66e57c7e8270dd0fd1da4ae1d4ff00b3dfeeabf2eb4d0f001dbbb36dc83dc5d4198d98ce77e3f65bee18ebff00cdd38ff085a56e36d1fb0163125897e1d206ecfeecf4bf4dc5111b0dbd7ba22daeb0005926f8e33b314bc99b25f3af8cb68449536a082379cbae41df3212ff009185d48f7c557b73f0b51c291fe41c0b14976d6298fe32eef757269e11f5ae7858abfeebc88e595594dade8330d4bd24786e463a788aba6bc5b7159a62cc388cd094c3bf9a194f3f1b626d234e620eb8ca36afecaca2c55b134f2fb0ea8932fd0c6b3ab9c6ad8bedae6c34a35d9c0c81816e9ecae4ec1e89c1c5382c9dea8f513fa548b75bd7bceac02803a86c2714f659ae73767282b876ef65d8ebbdc8c5c536686af79f82a9f7ff006e3da3d8083e3d7a9dfd5b025abc4945e849295a97664b14c1842dfbc01d44f50432f5847ab4b8fc15568c71c6565705606ccdb42b9f9bff00aa4792591384fb731e9d86ce843919a182e23251fbde0db606fd7681db5f17976c4d28ee5b38f795b4f3ec99bf4cd2174d198fbd564b33874b04a2721f4701fb6c0f607a8e9898eac778ed6300532e33c0d229cee42166ceba748194726299e52ab33d03050f4c927f2e465f4faafb32893d3b7a7e0d36933e47181fd6886f23768ac58663d225c4b6f8b0ce9315b652bbfce264273bc8a68d008f5f8f6fa7614427493ab8e61e61aa7dd78f83e5bfff006150c76cf03fc91db41f96c7882a45fa9b273531b6b0205268cece4b6a3fa3707afb36eeab2510938bfd26b5896715a7b19718451aa8e8ca926c1ad7310046e61ae9fc193e3e76667ea8a32fbaebe4623fd057f49d306529167d16db5604e47c3b97566adfe2d72d7116a73b3d947c591264ec9eb932ec2a6ef92c4d94b81d41feba75adf99ea76493fcfee2316fe9e932cfcbadd2e4878a8eb9e1110f62debe4e9221ffc4002a11000202010402020203010101010100000001021110032021311241043022321351614071421423ffda0008010201013f0090d71983a90ddbcae08c5c8d2d2f14be8631365e6f8df4561263bc51e28f145212457250f3ec88c54d12546aae442eb29d4961e1f67f43e30f35c1ec8311223fb8f6319244ba1610b3057248d1d1afa593e19162d896ca3d0dec43c596c762659e56762ca4485c224ad1aab8121759717e562e8631f658cbcb17449724591e492e08fee3163d618c90bbc210b1a11b990e0bd8b6bc2cd2dd78f12b29f1b5f62745968ec63eceb1c5099aaad33a62eb2f2c6218d0c584ce3a2926478689bfc487ec31619e8912c7bc216144d1d3aec450be896c5b531b3deee8eca3cbd1cecb6298db6531b195c091a88d4ec875990ba4318f163daa645d8bb27fa90e18d8ba10cf4319fd8fbc21095b424a31491a6ec595bbd0fea5ba95142e18e49e123ac3e19d954cbc56c9ae0d5ecd3ccba23fa8f12ef0bbdf174c87ec4f844dd74455ec63c4a878423452724554b8210a17d4d6fb2fe8e98c95898d73679d3aa22aceb8225d7b2ef2e8784346bae4d3599223d0c63cbcd663d90ab353a2ed91547b1bc319687d8d622add1181a30a6e54479e45847922fe87f427b9e5f6478ec6d5b2b8b2d78a1738796d21b381089746ba34f2c874319efe98f643b35ba20847acbc243fd892c69c7c52fed9a7a518aff46ea8a76259e18d212625b9e1b48721ccf347f223cc5213daf0895ac7784219451ec74289584c91ae88ba96590631ef4f31ecd33545db16c788f235c9222ada34e0ae221c5b7652cd1453c5ee6c7225a944b587af23f958b52c53212762742989de2cb132d224c62e223eacf459ced4ce06f0df04d704a352d9118cf795b97640d423c362e763c40f64d1f1945cd590f1c2ef36c522cb65bcb65e1c89ea225aa4f51b1cace7084dd8a7c0e7691e5c9099659658a563191ea88ff4f1d3b3cb165967ac2c56250b90f8cc6ac633de56e8b2048f627b1e22325d10938cecd1929410b63451c96f3c0d8e687a8bfb27a9fe9398d96213c58acb232e285216a11765e2cba13b4488d125ec4db24d1c16865bc2c2c36d0eca4d12ef2bb18c7f4c7b20c9b1dd91d8f112435f8c4ae4f8d04b4e3b3c854ca28a1619264a4498e44a43c2d8b0a5e226223ab5d8a684cb47688ca9d0f81314872e87cb1ca8f22f084c721613189f3e26b46a4b354c63242fa12e48227fa9db23b1e23de25d1ecf8d3e12cb2d62cb6278b26c7224c6db63195842cac3132c4e8529742d5554c8cd0e543974c4ee9ff85d33c90a565d8df079aa253446441b78a121ab2ab0dd326db9679b18c7b68aca34dd12e6274e88ec788e2ed174cd1d4e5590d4762d5e7913b2b35625864d8d927863ca1656cb13765f23910d414d486f83cee3436c72e45a8424d8d8c765906ec8cad085b351d21728784e98fa19216e68a11a64d7e275222cf5863c446c5d144453b890a7122e68526fbc5145624c9592649bc31fd54514514323362972447e8674cf2646431ae0a23c1a72e4ae0eb2d51aced51a6df5991176890c595b1e34f946a37455b23547acbc2284b83d884c84f9ec83936259632c93244c631b1e50b6ac56687128891e2d89da634514295314d345f0589dbb34aeec8728961225d1ab223d9789322ff118c5dee63c6913e8f6c89eb2f1d088f4c6e9e62cd1ba8b165922c6c9324ec6318f098b0b72c514343e85c21bfc5221d0d1e2780e08f0699e4f0cd0b10d0bf165f249aa3508e58aa890c4f913d898c90881225fb11cd8c63447a13e49762c47b345d423b18c9a1b24c631b18f085858451cde167928922ae897643f5bd8d148a290d1a3c220f82874d9449d928d11ab650f1076890c42cde2c6c46992fd49f6210f0c649550849d92ec4223d9f1a7f80b63e8912243c3431e10b29142dec92b445d32b9175b18c589107c234ea90e452634326a56572218cd3ed921e16c586234d264bf518858631926404e897628f1847c6717010b2fa244890c6318f096c5f53e8691a2adb1ec7b245d45107faffe125d1a7fb1e893a449b1be488c7d1a689f63c2c3ef631101cbf125d884cbb1e192238976290b1a13f1645dec974498c651e04a23894788915959bcde2cb24c8bbe08fe2921e6af0f2c9ba48d169a8bff00076c8f63e8d47498e4e4256c5c2a18c83b27d8c42dcc890435f8e11786c78bb889f38908588b34e5f8084327d0f14780e07f192d21e8b3c28f12b084316db10d94452426596368f21c932d1d9431d33e3f3111d0cd76fcda1267b22ed58f0bb243c2cbd88d3637c0faac4565e126a2c5de2447b10848d29b469b4d5e755f05918b646344b08f1ff0711e9a25a68969d0f0878bcdac276461634259a6556c522ed0ca343a23d224d0df06a3b9bc334fa1e3d8fad9658de58880fa1f7851cbd9e8643b3d8908d39559a12e58fb19acc42744a6c7aacfe617c9698be4262d58ff0063927ec64a2495921169962ca2c8ab229288df259e6290e5c51c6381d0d5954723e8d1b8b475449224e931be70cd35c0c6455b25d0fe98a21d61f62587b595c0fac444211a6eb913b43359f259e437631a28a2c5a8d0b58fe51cac6f08bc2786c4c8c95a273a5427722c8b13149168f243a6705e59a4ea4425c72371aa46b3a12543588550c65d12e6287b9e604781744b8a1618c78aa912ec5d12c44584291a1a9e98cd6ecbd8cf191e2cf06c7a4cf168672763594c43245d31cb91bbaffcc78362d37fd8a0783f4cf09ff65491e629d9621e3495ca84e894d2e4d7d4727d909dc71443f6486327d11fd112c2dac641fe489097e26a10e1664379688f4345f24459ae083a91195a46bf784214474b8434cfe290a2d16e86b91a43558f1251c212289219447d11672c5164536383f68e17a1bb44e29895310b3a7fb129706a6a70c6cd1cabb4318c4bf144b11daf0bb2ee85ca26b910b0f2c647a1e22c42c3e916684ee91adde131088e9d9508929aaba14931cd42ff00a6417913d1b5689271109704a23ec8891448a3c381215918be09ea53a34dc6acfe4f21422cd4d2ab6873f44558a22cc3f644d9319a311aa6b1056c7d2197c89f04b0b6bc22247835509d8b0c78649086b81f647b10b143212f19235256c6c4c8b2143d54894ecee2d0fc948f2747c68c946d929c5b351c5c9a1c5a56465c127c12ec8f6218d09124acd3d34dab26fc5d109d9aeb82129a75669cb8a15460acd5d4be8fe372ed118452a2914318bf646a324b81a3464a286ede1705da5864656e89616d7987ec909f26af425963787843e87d91ec4473ec8aba2636590646436498f5248fe4fed0a51ffd2139f34c9db77628c7b6dd8ad5d3e048931f644431ac4872e2aced5591f28b3ce62a7e84a315c31b9490925b5e2f925cb1ae09445da2b0c5d219221d92cadf1fdd0bf6353a161b1f250c7843e87d917c8858437643b26c91626298a6398da2c4c5368f26c47036378889619450e03131310a8f22c5b1e25fb090c625c8952598ae07d8c84551aab0be8855a17764c5d0d9de1e19e84f91ae09f64488b643f6264f17b194ca121174a8b2c6cf64488c68a121c47043d25e87a72428c8562b12121218d0f125cd9152fe99255882b90dd2c313b43ec6424d346a7395be22fd512e8f6c486863c343177899122c5b23fb1327b16eb1b161e22446f751478a3c44b09658f3a51538c4f97a718a123a645b6b0cd3fd89121764b2b6bc69f2478544ba176ecb1bc3c319ecf44c8911678f11764c90c585b6f29887888b722b6ad8d8f306d46291f2adc558b10eb30ec6322ae44d7195b58cd31127c127b1e1945722e895ab2246859787d12258b45e597b10865115c8914f6acd6565e1e3d9a514e299f225e4e86ab1a51e0788318c8ba64a5c656e64088c91eb2f0c6313e098842161e3d22449656e78594448e1adab6ac318f3ecd3e34aff00c25a9cb1bb7884b8ac3170318d895acadf134c71e0970f2c7863c235088888b1db24a85cc4922486b085be3d1eb288e5adab6bcbcc1724e5e3a237798f7967a43c28fe23c2df1ecd3c4d7e7b58c64889a8444416c643a2489764b2b7c4798914561890d3c588bc5e5edd3fd91f2675151a22ae44a2e259a6ac6b1ecf43c5aa1e16f89a633517bcbcb1921135f891110db0254c92263585b2b0fb16109888b2f6bfb74dafe447cb9a6d5334a493352578d374778b13b43c41dd92c2dcc8f6698c9e5a2b0c63421f31222205e52e2c876491244c658b6b1f78b2c8bc45d16391fca88cd3c50d66f6bc3c4b81b6fb7845088f43c21b1905cb25f432269889fec218f6343e880d702ec45b217594e950bb2b824490f2b1586f3641449412e8521314ac9b46aea73491a5274ac8db286be87b279517e398ae0970c64570486412ab353e98f64046a762f7865658c88cf6210b6a76891244878584c6f088d5723d25d9054492689aa7c0ac84192892d1b7d1a5a35cb1470d0d7d4dd2134c9d5899192f0c2ec8bb44961487d8d11744edbc2dcc89022cd5cb1e58c8be4ecf6210b6c58d1344d0f0b65142b2285a7ec6951248841092a1b4e4452bb2d37963faa5d0db45b788b75584458f0863c3c2debb22f8206a742dcc68422b91088c8585d8ddb21c31a1a3510d14509e10a362836474c86995489149b29d7077438d89baaf217084f83cb0c7b9e19263ef304db29a11044b1057c9319a71b66a405f4c3a21d1abd0b2f6374f37ce1092131e116479244a24a234594536c86991d11411490ac94b9352647a1324ea479727027e86ecbbc37f4b6364526cd54908d16acd5ef1a6c9622e893b190978bb272b42daf0f10643a353f5165e112259ff00eb0b08f7b349fa1a2489c492c2469c48c783a3d8da1cb9253b3cfb22d97c6531f626d1e5c0a558e45be43c36de170ef29d0f9cfa2587d09616d78810e89f447b1ae468631318d0d5312e06bf22843237598f8d623c3b2ad58d1244e23424405d21d7a1b1ca98e4ec7e4c717426d1e7c0db6c565967917658a45b22d56de28f44f1653a161c5aac25d0e3c6172e871a4312e47a74b2b6bc40d37c12ba17ed8631901a1921745d48bb78ed11e165674a56a868689a2513d9114c523c2c7a6cf05fd1e2388e38b1485ca3c4f03c51e1638a429322f3658ab0e9c8d54ab0947c47d91ed12aa2c83e51276b8189d3439a68626d3253bc2dec8911f47532c63191243191242c216c58d274c6ac686ac9c46843629511d4747f29fcaec7a88f388fc4a5fd1e29be8504bd090d22f2d312150b624cd4a8c70eda284d9422db45623d0f08786b0848a2b2c64481e89712c58f1163633d089a229e10b287588f0c8c938a1a18d5d924788d0cb1b2f084aca23c31f0cb45a2c59ec42c365915746a72f1e32abc24dbe0769d62316d6545d12e30a3c0f0a0eaf0858a2b0c62207a353f73d0d0f08a1e10dda4269c4421650b1156e8d3878c46868a1c391c51244962cb2c532333cec733cc533cb633828f45da2b1a1a6dc6e8d7d3f198d8e4bc47cb34144d44bc8445aa1f6222d4912772c424a893b6323a8bc6997ce165e18c443b23d1a9fb9e863c469b58797fa111216d58f8f0b76f0c68a28689449a2489165e1278699584c42162ac4afb28ac6869b94ecd2f1af1357e34644fe07f44fe3492a1e8cd7a15c59778d37cb47bc2e0977847bc7b12e70b6b18881166afec47f52487881e8650c4f86445b28a2114e2c51b7469c3c635963c34344e24d0c78440518d0d4698f8c210b1488aa28e6c6932a8d08f8d50a34d3252b1ba449465cb43d0d3923e47c45e8707128d35c925ce22ac92a2c846c9c69e230f27638d4b11cd6192c4081aff00b10fd464b085ca4550c626bc1a2156228a453a145b169cafa34f4e1eec5a718f2b637426319c92566a44711ae4a1222225d0f93c48c4a122c556553476497451e29727c769722e792515567713d1d0d268f93a3db58d2e0914c849227c8d1a5a9e3c1a8d5e2134a0d324d36591dd3c4089f21234fa243c448ae06863443d91ec8b1118b6d51a7f1e926c708fa478a3c5215a16597c89da1ac38d724e17c9380e2388914228ab144a286c8f2715645da1561523b66969f8c523f24a90939f6c8da3acce0a49a66b6878c9d0b6319d31bca12162b64f1023e8d734890c643b10c92a2443b655488118b66868a82b658f142a25ce64488c9d8a498d1e897f44a29928f653762584b147457b2cf169d89a434a84ab8c269d8dfa3e3e9f36c6fa15f9591a8cac9493952c2653c38269a25f139e07f127fd0fe2eaff0047ff009b57fa25a2d7a63d39118372489c69e23172e8f0a108a2b2c9622c81add1a7d9318c8a1356d1434491a75e5435f91a5a6e4e9766968a824df7b92e49c95f08b11224364274c8cd4b15c9c26357635434552284b81a1087c3158d1ecf3e49ce852646db34a35142382868450ba1ac7a212a7c8da67031c63fd23f8a169d1adf1bcada27a328f71346a176bbc508acd0c65088746af447f625d12c453a22b9bcb20bff00e885a0e73e0d2d25a512f7cd2e0aaec44890e43911d469f6475932ec711a48ae19e16851a4ec8c0511c0afc451e06bc97457e035514716ff00f07215b3a3e3c6c8f145ac26a8f584865949e28ac3d8d27e87a107e87f190fe39fc725e8f01c594ca18d1588744b947ff43e8788a122892e049b4697c77292932118c53e0bdd7870f21c3fd1a6b1356486cb3ceba23f25a23af175c8ddd12563b4a892e112fd7825c50ebf11aa2d24792f43945b6ba16a5d9e4c48b2db66842a27a1258636fc45d2cb45b45d9ef6f1b6f0e298f4c70a1a1aa1a1a3d9a7fa92fd492a67a25848fe8513c0d3d04a9b12497d2b163a685648d7e19636378536887c99223f2e9f243e4a6dd8b5537d91d6837568fe583f647553e2c7acfcdc58f5d29531eabe684c4b2d9a1a57cb22924a84b0ce8e53234d954b0cb3ca8537db4271624b2f6b74393ec4d368ed9388d0d0d0d0d72690ff005262e89617c5495f91fc1d0b4e850afa5ecf62effc1a49d1a91f48f911a8d8d8d965e1965899622dae84db76cab624242cc22e523474fc6286d7a15e18fb449db12f62e5668f13c5d3b22ab0d8aec937653ae70e5188f52fa3e44dd1a739b5d9a575ce1a2511a1a1a24880c9f4c8f3118f1784fecb63ff00d21ca25479c636d9ad5394a3ea8d5e0b2f17b91445096c6c8c5c9f0686828a57842b10f865b6535e853ff04dd96cb76362743d57c2a13e71589fe56c5aa9257d13f91fd139b16a251353f28d9f155b76ac54bd65a1c09418d134444ed2353d90e878504348f1b3c071e7b285cefacca2d9fac52256e5c327a4dfb2705067ccd2a9dae8f62db4514288a228891598c5ca554686828915437cb2251e278b1b67f34fa688eaa3f9bfc14ece3fbe4534df8b24aeabd17fe0859d4b51743d49a6d3be19a727a8e91a91f0be6cd39dbe4fe33e3c2933ae44d359a46a24d13893457240d544786c6339650e545df624862cf3b1f234c4f0ac4dd96e870b3e4e8294193838b28a28a1212144511444b08784add23e3e878d365624b1798a5ecd48db210a1e99fc4c5a74850e6d91a5634e98ba42c592b3e468797291084b4a1d7278469b642173fc4d3d36a9b23ec456c64a099a90a1aa6409ab89ec648b2c47e343a584af6dec625848ac4a366bfc6f2b6bb25a6d368f11228f11445128a2b358f8da0dbb68aacbe508ab2d21f657b3bf4254390e5ca1f9594521bb542d97871b25f1e12546968ff1be114c517fd0dd616d943c8d5d068e87d12e18c65ad9d9c96d7d34258b2c5139f2172d9f27e3f972bb1c69d347894514509668486cd0d2f395b5c114975b68a121c97545bf79a18ed2efe87858e45848edeeb2acd6d0f687c264bb18cb2fef77b1143821a3e47c7bfc914ca1228aca586463e52491a70f18a5962d96f2961aff004a1ffd08d7d0528dc7b3560d3e8ed0d0928aff0096f366b6829728945c58b7c9d1f1749a5e4d0baddced45e18feff58a28ad9424593d1d39f68f95a0b4f95d0d7fcaf34705227a519766a68b86eb66941ce484a9242fb9fd4b62456e62c561e3e4e93d4d26976b929a953d8ffe17ba8925ed1aba0d731dab9747c6d2f188c58797f4bd8961228a1ad9587bab6b4511fe8f93f1939a92d8fef451435b950e26b7c74f95d8d35c343123e36875262c32f0b6bdcf62e862eb2f7bfb5f3ff12d8d15b2b16c4d3ecd4d24d138b4ea8d0d1b76d0a294782c4875f43def28645ec7848597f459587bdffd348764b4d4989251e04dacbfbde16188bcbc2d8d66b6afa5ff00d0f1fcb14e989a1936d47820ee2ac43b29e16c62dec785892c47acbdcef0b1470bec7f5d1c95b5ef97449dbe4d39cbf1450d1155858ef72cf5eac4f9d95b1f5883cbc2cb6ab6de173f63c2cd15f4d0daaeb73c4ba2507668e9f16c78470ecb742e57d08aa473cd0babf7943dad113d61ed6b62dd6487c2ecf23f93ff0036bc2dcd096ca6745962d958623c6224b3c136ada21e88fd084868a4be844953c27c6f93a43794589ed95516d327384a05f3b18fe87b11487dfd0f2b63f46aaad415b4afe9ae04f6ada898c83dfa954be9639a1b28e094527b18fe87943121afa1fd0e36d7d48e0538bf639457b1b4ceb0a8a1e5f286217587b24aebe87c1390937c0e34ce28a25dec63fb17445b78a8df03a382d0d65ffc3cd3126d129f8baa2f96cb977562d462970adb2324f17b5e22f734fe898cbfe90db2ff00b63649d3e4ffc4002d11000202020201030304020301010000000001021103102131120420412230321342516123713340521481ffda0008010301013f0081f1a64fadfcdd9cb2d45139b6fec445cc49247c0b6c6cbf6a1f565aae349965b3c99c94c6ca28a122ea23f8d3e08322ec7d0ff27bf16e0da3f8222ed0ba44bf24445dc85a749174d0d8f86645e32445dbe492ff00118fa1b1f567c088907cd1fb74c97431ebf6d99725f049eaf4fd8887e235c6ecb252d5965e92d5e9c5ee84b4d14514bd96219174637a7f9b4c7ac5282c724fb1f644443a24ba623e58b7f949ff00088cb8e4c89927c5322ada25ff00110e867ed644f92247b21cc4631f43ef737512434723f7211637ab1cbdc8b3c989ea98d696e87aad216d6a121135fe47ecf9222204889f252dcafe1764ff0028c50e4dcda1f2998d1d61afec88cfdac8e911ecc63ef4c977a4e89cefa19631e9e90971a88cb1b1fb90d97b4f5d9d32c4be56f8383c4f028e04b8d2d43e05d195737b44842319fc91e85ed71fa9c84abc9b12fa252fe48f12a24f8a121f63e91110b58bab1f63192ef544e34b824597f617bebda908475aaf929484a8aa7aab1aa38f93945a298bdb07c90e8cbf1b8f32491953591c48ad63d2d2d318c92b4d12b5131f326457049d0b963ec5d0888d187f12486324865f04e564bed2f6d145143da1087a8be288248691fb4f16d58df0774c977eca39d24323d98fa33f51173ac5251c89b47a869e4b444463f7b193464ba313e449288f96d9d46c8e911198592d36498dab1f0c931bd34255abf72d51451451438fb508a5a4d5921742634d48ba747627ba2b5632241995b6218bb26a99117c10f73dccc9d18bb27749228ec5a4225c331127a9be494db22af92f824e8625ab1d7b92122851b1418a07e93fe05898f112c74380d1456922cb2270ce9b3b25ca43b137ab28a16e8441925c7b32ae84221ec5b7a9f464313e4ab8d92e4e34b4897662e897459924f928524b8439319ceacbfe8e0f129ee8488c190c643091c07e844fd147e924896344e08942c962e071a28f1122b51ec48fded0953a17e4d0d6ab6b5ceab51ec75e3a7acb8dfe9c2444447d8b4f733218e90dbf148952f626226a9985f249225d196f52d228f11a1fb122849908590c243111c696ad1c0da1d31c559e14d9e3c51931f03894789e238d0bb1744be18d5ab5baa4515a4b91ed1c8ac4f817e5bc997cb0c63f288b111f625b63464b489905c89ba4871dd88465ec8763eb5993b63da132ca434b48485016262c2eba31616bb4421424343197a65724a3cd9e04a089c6a456a8a249a64477650e3428f16f542478a1a1e9964685db22c6aa5b7f8912247d8bd8d191f064442ec55e2992f621190897c0dd3333e74c48f11da1365fb228c702102112284b4d8f57a6cb2ad21aa1a2788706789451385ab22be91c3a1c451e44be0f13c0501a18d15a5aaa2be46f916afe9176223a4217b1992c9b31fe42e204adb1ed08c9d0b867c22514e5c19e232842b1b28690e2508c51b211211121112c631ebe37090e9b1afe18d0d264b1f3c12c6280a1f078d36bfb2b83c0703c451e4f06c506383270f9a2ab7c89b3e28ae07f9096b143cd3fe05f9d1f2474b77b64ccaadb21765270437ec4244fa3e45d1d326ae24a16878b83a1345eac6f48c312088ad210f4c671a7b5f2521f4452e45d1281fa74788e093b12121c1704e14789d6a892e392715a621eb1ae4cea9a22f8d41ca22fca4ffb111d2f6d8d927fd197b20fea12b8125b44572244d702ec872897631ae49f0c9c62c9522cf314c72bd638f299044111d210f57b6f762658d89974297f45264e24ba22f9117c143850d595a92b4648f039d4a9969e9b1766248ccae84f51e897e4408e90bdb648cbc3af820b913a8126de96a22263f9317e06413b2486934647151b1eaf485131a22405a5b63197edb6367909899199e4c9f44992e1a117c8a470381543a1b7d191f04f96c8354318972415195702d6327f99123f6648caad18dd317e2890c421087d12ed987844dae55090cb33536c7ec89144510440421698f6deac6c6cb18d965919098f93b9137723cb83c85968fd65f2473c5aa2e144e484f933744bb62745dea2b913e113bf162d43892b3d425fa9c11e91117d891948a20ef1218c4210b593b30be09943199799487ec898fa2088084216d8c7ab2cb19637ab2c4c8324e90b826d58d96f4996cf37d5962a32f48c892b1b23d1647bd493f0645884645ca641898bec48c843f3317e0d0c62d2762d4fb303fa89f6318ccd1e47ec8f6882204042131698c950d8c6cb2cbf65bde374cec9ba80df2597a42d590e4c8be0c8868f813224493e2a87d911197f1463f81085ba656e6b832aae487e688fc8c7a4274cb1994c3f9a25d936d48ec666bb19f3b890f822216908b2c6c6ef4d8dfd9440ea28f512f154597b42dc19256b826bf2ff0062e99fb06b92024325f9310ba3345f82663a222e85abf6e432754457d44463d21f6b523274606a3343b26b9d48c91b449577ec82e5104211e4798a6799e43917b915ba19435b48c7025c232cbca4ec65ebe04216910e62658b567892ea85d9045d09dc89f19242e85d19249e1a31a488885ef9da56bffd322e2d117533a97fb5aa3b8b11f2b49da32117f5a1ae09ea5acabeb1ade257244535af21e43f54598598595314cf22c43d51456e8a288c4899a77c1389e16780a0780a35f051d3d231be0cfd8f4911e90c5fd332fe626224ae247b11f22daeb6c913e24d7c33c6a62e649ff0b4fa13d210951908f0cfda8c9a96a714d138b8bde08f22252a2726c4c6597fd8a4d11cac8e464277eda2b7451188f83c86f91d0d9c3da290e05088c8cb6c9762b114d25a46654e2474ff0016417226216d75ec9ae0c835f5221d0dd0db6c5a88b53e99db17e289ab3e490c9c7c919e3f4aadfa6d38db16342c5116147ff326897a51e0923c64be05641b21d09526ca28a1a18914280f826e4e42448ae071470ba2f4ac4d8a65a635447b32d388fe45d51088dade7ea0c8ae04634a57641b52a5fc88485eff00969990ae118fa18bf962e5dea2245a25d1f241dc5131a18ca24ad3434d49a7af4cbe9b1ae051b12a10ab5678a1e28b1fa75f02c2d118707894892298d0d0910564624a0e990871c8d521a64936388e278b298aca651c69327cc5191531459822e5f064b8e4a1aeb59dc5e28d76883542e885fc11e26c888471a5eccdc5327ca4c6f98a2176c51ed8dd8b48478bf3b1ae07db3173044d1225ba33e2fdc847a7ff008d15b42a150e8b14cf2387b5aa2436266311189e3d8e234a87e23f0ffd158fff00428c3ff43c6be0fd31c28a188487d134ec8636cc38d4627a8c759532ef535706c447a317e464e32321d210b6bd9915c5afe8c7cc289bff0027fa31937f0b6888b5224b93d3f31648c9c34363227038da250f17460550456acba17f2d8a691faabe06ed9fa724ec4e4bb233b14acb4589d8c974368b31c880892b1aa252a272f2258d77e42c7f3e4784ec5e49fc98f3749ab26a2f94486211f028f948c5848d2747abee3b7f8b172221c49332bacad321f056abdd222bc2527f037f5330b44ea3d0f48421f03e49f67a7e913f932f2863d444accf8e959817d084491245d12c94273932307e5478491595929c947931e74a5c919390a48b22cae0c9d0d8998fb21214efa24d50fa2734460e49996137c159211a64f338c918b2a9d291fa51449d70498c423e0824425543eecf56ea2990faa37a82525220aa4d7f67c913d4abc8bfb463aa5a5ef9931fcb30f078f2dbda2889955a47c1347a67c92e89ae063d43e48138a945d98d52121a1c49a6c585b7c9fa54b823c488f8b47167abc897d28509d7566073515c31d58d52444e91376890888e7c18f2704a751b6b817d714d74658493e4c5913a27e24fea7c9253cb375130e1f1a7267eac57317c13c96c722c421115c117c92aa3d547ca1c18fe98d6937da1ba93110ed19e0b8918d91f73d4ff00164bfe2bfe98bf0661ec9339d4448477ac8607531bb892192d4111e0bfa488909124389e2450b1c5fc1fa711c29332422da72891924aa3147ea4f85437695a13b2286b82648426590ec8b7d3426d7c7049a7da42863449b5d531ca77d2149a6f844a73658ded0991e8ba4297d439d9377168f9d227f911e88999af048c688ad2f6b25d31f38a67ec918bb1ff002de92d59110cca8c3f99fb47d92e1b1ea33a1597c0be089450e2780a251434382be50d25f03a298a245125c19091627a4c86514ac7d1288d3564ac92e6c632f485ac649e912e8b4dbd76e8cf1f09abfe08f5acd1bc299e9db92e442f7be87d4d1ffa462ec6ada1452385a8a10fa22dbb3274627f5a3f6922637a5deac8913e75c22c4d168b88e513cc932ac512844ba322262109962911cad0bd43f91668325283f925449a1b1bda7c898998c9a42e5ebb634d666bfbdfa8979b889f04593578d989d2484217ba5d0ff2689f136637522b8439242b6210b544c83a9a244898f484223c90d3632cf23c8bf625b5d8cc8f926bdb6290a4cf3679b1c997b7a4210b844e6d4a54cf4f37276cbd4d54f48cb5e09d11e511e85f8bff00443b1097bfe0cdc34cccb921d9fb13288ad2169a322e08afad7fb1be064e3c125a547142643a20224bdc915ed433292f6bd597f61216be09c796cc097956f2afa84b597fe2b21d591e85cc5a314aa74c485f633744f9424ec82b8447c32f485af37fa944fa3f7115f49225d325b83b4221d10223286b68486212f64a44df0363677b7ecbf7d0b48c8f9a31b5068e1ab43e0f536a9a20db8e9b8fe8ca35c9893499121c5b488417ea36c42fb19893a91056da31fe08f91f225d0b6e2bc93243fc887e08912243d63ecf920f82244631ad2d2d242db7c1264ba18d89edfbafda90b4ba25f992c6e51544525048665e5725e99122458d54c8fc7d8665e8ca4254d331fe057225a42dcba25c49987fe344d0fa2489762211e46aa44483222287b621085b96a4e89ee2f7433e3de85a43e85f564147e8dcd5a621085db10bb252f1c9e243a5f61990c9ac0ef1fb10b537e2892e09afa9989bf08997bd646a862149a63e7922c810625b7a7bb223d4c6e89939177a4f48450caf72d2d3e9985372b252f1c4d98e6a71b1924e57fd231b6dd328853912fa72c9210bb47a94e5957890e2290bdecc865d6093a712f698b538a9217465ecc1d1918cc83d322ee2b5020d89edad3116590de48b64e2d122684848a2c423b1fd8425a95f833d2e3fa6d9963706bfa3d263716e4fa18df8bb13a9b2ce09aa9b2222715c320ed0bdecc865d62e257fc9f3ec8e99f06547a7e53320cc83dafc48b22c83e48be043450d0c659cb21c22b5c346589244958d14783a250624cb13f7a1696b1ab385d2d374da4592e49a4a6475939f111127f8a31b17d8c8641907f4458d8b717a6d214bc95994f4f2694bfd0ddc2c6249ab6ccde3e5c6d3fa685c31320f922c8edeaf4908a298a922516c9c4f164a260847cae44717a59e3e91ea3046327e3d12a896458bdeb4b58f8dca6bf51c75232da9f24575acd6a316637714c8f6675fe2b3d3b6e3c91fb190c8331738d8ebc5155b8e9ab230f14d195183b7fe86aa3432435a647488be48484c5d69eab91216948b43ff006274fb250f943464684f9e190cca0a9b33fa852e11295bd217bd16f515667b8c15189b78e37af5117faeabe47f048f52d49c05d25ac8ae0911e10bb271b8189702fb193a264b867a7f912e36bb169eb22e0c0feb3276c6487b5b898d90767c163285ab2cb43992cb42991c8ccd91be98dc84fe91cdff002734745885f612d4172349c523a5a925e57f3a919570474d7021157166317d8c88c889f6617c92e05a42df9fd5464e8c4ffca8cd2a9b5a950e09db3e5884f918c8b20cc6c8bbd31c74d8e547921e42794f2b62916d21bb9122e8ab958dda3b2b498bdcb5120b56b591a48b4f944cc9ff00139231bb88895b84a8c5272423f6cbfd18323727117b5ee464fc8c9d983f3464ae34842db87d564d704154d1995bbd49172a1a11f22d59066364589d95458dd12c890f31fa8df363958f91448c121aae470ed9185c4947e071a250b1c68aad25f66288a12e0f4ee4e728b25d9ea63fe330797e9bb25d0dafd19c4c2a96afe968c6bc2c8f253a6618a8cddfd991917264ecc3f913e521f297f2589317b25d1fb8c9cc56a5a623e45d6d32126424464592272e09c84cae08c450e08e2e11fa7c2270e288417fb26924527f0385d9e1c0e2381e367f542a2abdaad3172422242671193a25cb24934d175c12e8f862e1ed7644424fcd8bec489f6c9ae4c6ea64ff000427a427b9cea90c971224bfc77a96b243c6988a1f5b4c4c84b82122c9193a248488c78218ed10c68843fa2386264f470c8b87c8fd1ce12a42f48be5b1fa7c6897a58cba63f4b343f4f35f0383fe0fd3e0f03c471777ec5a8f6451195e9b4b8d3e990929498d1dba445ff91a651d9e494a9897023f53c7338b17d864c9ae591af244a9c1084216e7152a289fe44f9c7ffe08626e2c9b72121911e99164644244656326380a02928fc11cf1a2391314c8c883af924afe470fec947a2a5fc0fc90f2a4e9d0d6293e49c71446a1f04e3cf24ff82ab491425c905635c33d33979493d66f28e554b83e1125688292cad0c4eb258d279a4c4ecf9250bc9627a963bca9b12afb0cc84c5f909de317425a4b563d645cb3f62ff43d3db10f4d5917cd09919109098c48514cfd34d8b0c7f831e08f043045ab238e02c692bb2e3689e5c50ec9fab82e12466f5591be18f34e5dd8d5bbb1ca9129b976c84c936df0c90fb28a11e263e04c8c126eb5249ea449549bd5724d2be0808c9c344444dab42ebec326b9268f931f30a1774222b9f64b84c8bb5664576455e2449a4f4c4a4c7c3ad46896df121484c8ba646567911762224288323d5143751ab1ddf64eda1c5b568716cf1a5c8d939725b222243109091e4459123913978ea4ea365da433249292421991d495f445717acf2719408a4d27acf350946fe48731d3dadb268c87c987989f245f04756f4e9a2292e099197d08cbf9a6318b235f05b7a4318e44a76c8b232148590536418988446542996343efa10d1244da24c62116c6f54aca48eccb912918b27911249af5516707ab52fd2546093789592b3d57ed688f11564ccefca3120aa0b92ad1ea7ea844824a315acf172a544388a5f666641f0cf4eed0f86d7f62e9085a6f7344170645458de9edbe0b32cbe3498a429596297446442564188a2cf36879a47eb0b28e64a6c68687a57cedbd2466c9fa70324e4e5662ced7285ebd274e22f59073b21ea314ea992519c04a956b32b8d9775a9115c2113fc48f48435c1d7b6fd923293ecf4dd227c4d916445ecf3b9d1231fc9947a44ad22cb5f24a4a8b24ee57b426262646463990911626319224e5626ed0b918c90f4874ca3e04847a89369a13fa9a64783c5b158b24e0f867a6f5cea991cb19ae0665fc198ddc752e9b461979228cd2a898a4a5111965e31b213528fd966527d9e95fd2665fe422882a6f77a705764ba20f9665e9eac52a639da1b48735fc99273ae0f39b4afd914569088377d98a485214cf22c6ed0c8ae452a1cc9cc63624c7d09a68ba236db2fe0be0f529c95743fca84ea917c8c65bf83d1e5fa926cb275e2cc11716c65f124625e362766457067a78b8c2ff009623326e2d1e9a0e305a7ef68c8b966447a66675f526444219627a647f233924324e913cceea279c9f6c4cf21fb2028aa24a8e6cbe48c8c73ae11099e429167972790e436399639095f2368ed8e34c621c9dd09a3365b9491516d324e2b91f2ecef69b8b4d183d4794127d92764782f4be48f42443f1a11c34c8f08b1bf721993b267a6ecceb88320211ce91924d5509f027c993927d93951966e5c1450843b171bc7d91278d49128d085d917f2466c8cb8135a43ed0d0d36f4c68f21db137637e4fb621f084669f8f0874ec54a249796331a745736491d694da76990f54eb923ea55f2c59f1ff0027ebc3f931e74db564671fe49644976609a7698893518b6639a98c659626589886654645cb3d3ba664e7190e5885ec74f57c93e8cd38c79b2793c9f7aaf636e9a44534b9624f50ed102289e0535d12c728376b810a445b62975c976fb2cbe74df34374499d0ac69084bb14150951564b846495bb1f659645f3434592562d50e22e04262725ca931659572ecc59bc676c87a884ba6647e517c9e9a2e36ec6ec6589ff0065962627ac8645c987f23bc6c876210deacb2c9492337a88c519323c8ca2bd8c4439b6fe052be8f822cc34e28821449e15355465f4928f4783426c56852e7b14f93cb91ccf3e4f3bb1b56793b56374ff00a2df911fc8a76218a2d99da50a1f5ab5d1d31f65f03131ad50865e932c626d74c5ea26be487ac947b23eb62cff00e84c59936791e45884593465ec87e4887e2ffd11ec48458d9659e667f5095a44dca4f917b9ea32af8e05249f08abe532f9304e99895d11424785f664f4919275c13f4528db141abb1269a17e445b6d915cbb236fc84e552b15b424e42c6c58ba3c235a6cab388c4cf92e6c5d8dd59d943eec52b1ee91cad7652f7d0bba2e88c9df62cad11c82909899648cdda23f92313ed0ad4c888be064a743c9c197d437c21bf73f6d511e257f0c92a641bb3d24fcb1a22210921c15193d2e39fc193d1292e3e09fa3952a3ff9a490fd34fb487826be3b1fa79764bd2aa53447d32f14d3e4f08c63c939705ee07a9cbe31a44ddbd3b6747c92a6b82a971aa169548f13a6311c89dfb121446cb8df098a6e4d2232a6426444cb1998f9307635f5b2221fac7d0fd64897a8b25964fd97f67e0fd884dbec83e4f433fada23d11d265ea486868ae0690a9764f8548f2a44a6396d21cbc53666c9e7210eb4ef545be8e537b6e8f35679f3543677a755c90aa3cf9a2cec8c3f924a91222f8d5909109589ef223e4c064fcc88bd8d362fb55a44a54c5da1c14a9ae0f48e5171ff0064189d1622cb3cb5658d8e44e6390ded129f8ae4cf9dbff476c6e969d5d9dfc8d247c58da7d33e9ffd1486e290b963a4fa141768f8dda22aa43c5e5cc458daecc51b1c4c9c24526ae86d755a4c4d98f2d10cc9b2cf2e09a24b9303e5193968444f2e4b67950a679597f610aece85244e9b7488d510c94a9a30e5b5caa767a5cffa905fc9e458996596790e439aa1cc94c721bda1b49599337936af827d70c5c451262e5122a91149f36494173c8dc5f43a43c934b847ea4dae111f24ad8a4dfc11e07ec5cd11e912a5cb31cb9e091967c119703ef48b1c9b31c9c656639da22c9744cc2dda25d2108f9d5265788c4c6efdeb83c86ac4338a13b2d451e93d4b83488e4525c099659e6790e4398e6c721b1b1b2f48f5199be116ced116d7070d943e06c957ed3c9abb3c97c2645c97ed16493ee28f3937f889ba5a7da1ed919518b273c935197c89a8ba6395744db13ecf91d5ee844723463c96397048c4ea6771222f6595c8c8f3cfb697b16da1268572443ca323d37a8ae190c89a148f24799e6390e43639165eac466c94a894adeaf4996376397895f2249f671f096a1db1c64a7fd1c69a10f6c8b2c52e0b6342b6d9fd0fd97a8e4a6432a6764389231bb89116d6eb815fbeb4b56796970297246660cfd262658e4791e458c7abd2324fc22ff92526edb65965965d0dad4a9f0453ae4a1a650afcff00a1bdb131e9696ace75d4beca6467c7245f26062ec4cbfe57b53d3fb495142745a678ab1455899873f093679a65965965e9b2c44528ab666c8e53649eec457078b3c509456be0e06958915b621e97bff71f257b90cb213a661922d5885c6dff00d1ae469d899e71b1497c18b27029597ed7ac70f2923d5e4515e289b2fdb63f658de97b1fb9fb5f7bbd5fb2cb2d2a2399a3d3e6f3e1917ff52b77b5268c796bb2334fdea4b1c1b32e4729b6c6263da5a7ed7a5ec6fdabd96365f23f7d8f8134211e9e7e39052b56bfea5fbac8b21929919dfb1212a3d4e6f843917a7ed62f63d2f637c8b94596589fbbe74fdae5f08e17fb1db12d792148f4fea3e9f16ffe9b197ee4da3b2392886614ac4233e6495264a4db1eabd8b4c5ee5ec7d88977ee7a6365f0bdb76e90dd70973a48e06db1212170fbfbafdadfdbbfe84da31e5e69b232b32e4518d2324bb6397950a2ca1962d2d317da6225b5b7a631748a2b4df348ebaef491653382ce75c7fd16fdf627bb3b1c486468c936cb3845ebe3d8b5216a4c421fb59163ebd8bd8c64398edbfe05c218b83b3845bd57befeeb7ec4fd97bb158faf65b6e8e54ab57ed4484324c8b10fdac86a5c32fdd22acc6dd69fb1afe46ef765965fb2fda9fbacb2fd8fb474d7b93155a125e235c35edf1e7bfb0f4d92e5a12a62d310f5221dea685ee63fc882fa775aaa1e99637ab17b569fb2cb2fdee6be0e1f698b94b8f6ad214c73e46f52427c09bae10aebdab4f526df053fe488b4cbdb3e77f22f6318f923cc50f5cb3a39296a4224ddd14d2bb29ff028fb51f1f6d968936243955a62be3da98c4cbf65fc0f974429215d162f62d5d265ea3c0bdcd0c8bb8ea5c098b6c621daaa2b4f8e048afe59d0dff25c74d275a4e3c515c7b1087f6ddb6dbe8f0be8e6d2622feefc9e34c4f4c5ec5a77fc95a42f73244044d174c5b633f8d767452f632d2ec94af842e876909d0b25af6afb9e3df3f221a13e04cbdded0f4b54c43e64717b5ec5a63658a42db2e8b7a9107c886892e48b13d310d5ce3f61ba449db2b8d36c8a392c4d8b6fafb727c74424da2524bb25929fd2472cbb691fa8efa3ce3c73bbdb1097b38f62efdb36d46d09b71564a54f81be4429d0a75cbe8528be87d8f9e0b2c90bbdcd6a24ba1b1223ccefd8fd937caad72f84c492be74a3afffc4004110000201020404050205030205040202030001020311101221310420415113223032614271051423408133529162a124435072b1153453c182e1d1f05463f1ffda0008010100013f027855d0a2fc9cb28dca5b5893b72b15271a8a6b0a93b0de55ab1d6a34d37d4a9565525763fd852dcb0e25968415b5649ea6ec72c6f8dadb8e5fda5f9b45cf1761dae46797ec65ec5de37785c4c9256bdcb999976669773c5a8bea3c49f72edf51ae4b6858cacd86969628fb89e69c9b20b3288de6989ea27d0f92db915fa6c86a537a9d304479e0b9992df0e1ddaad8e2fdabee277c29bfd367d4753bf27d68cd9624a0d6b8448b2ac5d29aa8b6ea41a92ba25a2d4a2bf4cbd8aba94ba8f925b0896c2e57855283f25b9a23d5f35c7225249b919bcaea4f62b54cf26cbfec60ed2448cd85fc8c66d83d31511cd2d10f9ac5fb72698d8b191b57468333772cba1aa2eb9d58b38e0d63e53cb8d9631d4a71f2499e78b653d21163d2e5f0ee751acb4d223ee1693fb91c63cb6363869de721e2f064f7c21a5589c4d9d321b1a143cd067d475c3adb18d3bab999f88ae4ece9bc22232a9c2cce1e5e15474e448bd8dc914fa8f925ed643da862dedcd22abbb28f4e65e84a76639e693388acdda1d10ff6487d707645fcaf14f05a97ede85f1b9778d8cbf258bfc916d1a2dc71babad71bbe5b72295b4e83896c3ed8a6ccc5afb3c7a8ade07f26eb51bf2407845e108c56a4db9314b52f7b223b60975210cd0ba66cecf97889e5b2ee5176a8b07833a8c9ac17b932aacd4990c3877ee435e77821ff00e305d84da23e6762b3ca941192d023b088bb1c4d0551665ee470d55ca3965ee5877c29f5c560f629bf2ac3fe62fb7355bd864775ea319c5e90b91ab922fbf41eff00b3433763f77d87cbf06dcf7e6b25b97f83f8c34ec790c9664e1256bc45a6ab71d9eb632f6c2dc8b0bfc1a33429db6326ba0e3f0647be16c519afba1ac28bbd2944d2cfb97d222d9e114264bb225a6a7c9195ca7b112abf2d91c33fd189529c668866574f92718d48d991a72a75637dafcac64f07b11d61fc0b7c285b3953fa8c6b0efc94e0a9d3bbec29e7ab765697e99e138c13108848953f3675be12f6b1a695d94ba8f0eb8d3db097f517332ac2da91dc8edeaf1535e15895ff006ace8de12b72a2fe8ac34ea5cb6365d59e5e985fe45565a5f5464849692b3ec34e2cfb0f1d8b2dd61a97c2d7fb91f76a35d5333df49ff9325b54c704fe0717065932d6c1e1a146566fe4a9ef67489d3ee44b3646c2dc7671b0f617429bf2902a499c13cd01f96225c8c4efbe0f16325b0c6527e432bf15e14fdc54f761d07b61b61e2b70b1429a7e66549e6aaa2ba174a93bf63878aa9166b09585b9119325513a6d328af28f05be34b6fe7097b973327ed78436e542e57b0ce365d097ecf616ff00b7b199199e398b8a5a617d2d21c6dcaae996d2e84c494b41a6b46656b546653df7239a3f634ea26e28d27ed767d8b4913a5d625fb8d0b18fb97dcabfd46744586eda1b8b415ee74135b3125729cba10762515511c1c5d3734c9f99f3ad878c8e831e141f42b7967875d091d70e987416c741568c68eda9c25294ea5ec71b532c721c0dec714fcf0b1e14b2dfa94dea4891221ecc575c1e916515e4c1fbb9992d86436e686a878365c9d471273b47334569a9bcc377c32bec794797b1e53cbd8bfc7a7b62ba973a7ec921cbb7a56233b69d3b19337b7fc128db05a9d76169af4638f6375f246a5d5a68f0def12c3bc77d8f2cb4355a3111a8f67aa1dbe92504fa0e0d6162cf096aff008146c9366663dc487a1734e83ee435688a4404537e61f34991d863c1e0c7843491c446f6786cc972ac116385a99534ca8bc4a97653b429dfe0954752b91cd6d4a5252a93784c91b4562b6c2b7b3ee256587d5ccc96ccec53f6f2c9da25192c8378b639d24ef2389e373f956c7bb632db7332e836dfad6e55b60ff6290ddfd1d0b76785ae45b45e35559e92ff00c928b8b1e8466a5bff00925069171c3ea88a2a4af17fc109ca2f4761384b7f2b1a71d1ec3a7d8bdd5a428c5ed21e689195cce5d751c2c59197e4f0be4b462d12dcdee2d7a9632bdd32ecb97b3232b314885ae448fbb9e643dbc8f0ee3c6a6b4f17cc8b1716c589d4bd2ca70f4fce7133cb4ec8e1a3688b727d0ea4b967e69c576d7062df998c452f672cd664d142393cb83c38ce26de4890a5292bdc74e29ea3a997643f4adcdb2fdba437e85b0b0c4d96fed1dd1d2e856ab0b3f72d86ada3c3879678e465b25469ad0b78757e1a1ac9224b5bf465bb6a88555b3d8c89fb75250945ec65cdb68cbcd68cb9aa2e29345e32dd587092353635ea2f83711dcf31a8b54418af72247647542e67a91575a62f16c78c35833bfa08434276133a142569151666535e5228ab7ba4892b343e5a7ee94b0911e796835ab28fb79a3be339e58b6538e7936fb9e4a74fe495f315346ff74b7f56286fd3b45fc0d5ba172e2f369d44fc396bd483cb344e319f9bfc938b8bb320ed24fb15929c5545bf532e68aff664b55b1a3497c118bde3b9752d36917688d676d762718f42d7f713a4d61768bdcb8aa343699a0ce82b178f5342517b972fadd1d532f629cf421b73d89b508367052bc67f71d87c92d896d8c25664979bd042c346282ee6a2762e53c2fe726f54316355da245658a58316dcfc43b444ca7bf32c19c657b2f0d1c32d2e49de6c94d2d7a8ddefe9db4d7d7e9ea2437dbd1fe70594762efb8f1feac7e5117a7872fe19ad35a95a1b35aa32f954d14a7756efa10f63f8e82fa90e3a3b107e64d15927e745f32d773547b919990ac9acb22a50eab62ddf936373331617355d48d4944f2cbe19959f0265329df4c142f13cd076972238b93cf95ec704f746d737e4912c7b92dae75e7bd85827829168b1448e0f7b8f7c163ee9fdb06c5bfa12b49389b6845eab9d1295dd91c6d9497d8a2f65f234a0a57ea4f5635f3fb54ff63d3d1be290ac5b929cf23b938dfcc852bc6c436cac8ade2ca6ad294483fd4ffba24bcaca6f24fe18a39664a2f2b6b61a4d66586cee4f469968cb62352501a8568de3a4bb0e2d7432cbb61a96c51a197b0eeba60a4d1723b949f9886e8aafcc9149fe9a1a525a907be37274e35a0e2f7e87091953a928c912c1e3227ea5ae2c161116f841e0c7b9bc8785495a3f25386488fd27b957de585b733add8cf975b1c44e539dcd16525372912bdcdbd0baff00a4e8687f058b63b09ab7f04348c8ebbe8c9fd32fe0f6c948fafec4fce9c864fcafee539dd587e59125d519bb9195b4e8249ec5fba32758b337497f93ae85d751641c63d1997b1634e834586f142b5ca4bf510be0af994aece11e6a312acfe95b918e55c8f42324f9993e44c7a3e758ac11116c88e1225b9056d718799e6ff03f4560cabba333d396a54cba2dcd5ad4cd08bd593e32295a28949b7763fb90f75fb13799f2dd751422fea3c07d1dc71ffa62934795ed85fb9a32c7d11f8643eb169a0d5e2cde3af516ebed623a0d6f6d8cce74f2bdd6c44ac94d29235474ba3735b0a69af32fe469ad63b173497dcbbd99b0f30b3f633e9e63ff0007f2357ea384960f1a2fcc8bec38c6a46cd1c3c5d28e52dab7cac8ef83c19d18f625cbbaf422f4c169826445d089d0916bd41bc3df2cbd3a9b0fd15832b6e8e8c58b764d94939b736549c6089bbf5158f0ddaf859d86f992334a2f4646b6be68a90a5c34ba6525c3dfd8d31a69d9fedadca8b16f550adf50a2a5a26385b7234dbd90fc3492b8ad964c96c52d7ffb2d96528fc9f52fb0dea3f812bb1af37fe484ed2b3d993595dba1aa347b68ccad3bdac4909b4593fb9959baf9c333d8f32b1d7535ed61ebba1a4f63543d77465c69e96666bd8f35b4294997e562df078bd8912e6b72db042785b080847419b33724fe98918a846c37e9470657f6ff0022dc8ed8f10ef960ba9292a54494a527a918f714a2b644a4da119d1292e8b9742cbb96c2e2725b0e4deffb3b16c2e5ae58ca653299752dbd865bd4b16d9dc4b3eaf61d5be8b443dae45f9645f568a0f56bb953dd73dd634711de48895358a95b544ad96fd1916a768bdfa33cd06d0d76ff00046a3b5aff00c33c924f5b3ec7c31e1adc6845d2dd8ea23c46292b8df7134d0d6163ecc85ca367142b91f7733189e83c19d0912e7b732108b8889110f618f73ec46393ee37e9ac1a2ae9162d7528eb118f61cffe2237ec713553f2a1e08e866b17f422be4f0efd874f51d29477458b725fd5b6194f0db3c06782784659190702d7b5cca35a9b0cb7a718a5e69139e6d17b70eb629dbce3b66fe0869517c9550bdc4fcaee7b65f03d1fc323e68b89ed6d332b43b4d6bb9aadff00c9bfc96fe4f347ff00d978f6b1956e368cec6d8de372e4742ed9a97c149a28d4b109e622fcc9722c55b33b992eae8cd7fbe0ce8c63f5baf2448111ed87512ca5fd458d49db3aee40a5b5891295a2c949ca6d8ef8e6c2fe8dcb971549771548fd512d4decc71f56c58c8285c8d2152f83c3142fd0c89743258ca248cbf02816b5cdc635a60e3cf62c28defd87ae17d751ee53dc9f465b626b353947f917b2e4f5a69d8b682f32b09bfe4979f7355a7414d753666858bb3cb63232c9e890d35ba3ec646ccb6c56a6c87b1aa1ea656584b2d884e4b620b666dbe2b1e3656ca9149fe947ec4a3192161d18c90f15be3d7d1e842a6b95891010f0fa86f0d97a7178f13b94df7216b8d9c554b5d22f65a1763e6b7a9fc9768bdf7f5231ee242a6d90a68ca64328ee587955cdcfe0b9a92896d4cbb8b5a6c89d1a2daebc885824ce8a24a16e858eacba705dd17176ee84536f32124b3448af2925695aff0063e7a9bea37d46af66871b6e2d7462cdb5ccbd6fa999dc76ec3b753cdf7446ff0050dc6fa21b97737327c9e1fc8a2868e85916585d97d0a2c556d28a32a9c2ccb38692ff00382c11c44250a8f31c2bcf415c9bb2d0583d98c972f4f4e0efb93a37d510935a3202df076689e8d0b5669137f4d635e39a2ca5eeb323a49e15d4bc42507715076dd60b9b3334664d2e783f28706b1b978ff6978f63ca69dfd3b090a04698a259990d4ca38b2ccc93eac54d6fb96c1a251dac4e3a0e3a95959a643ea2d6922de6251ea3e54916f9363a771abea3c3a91d5232dd8fd9f22b3717d6c3be5bc4694e3a7b90b0e9617dcbdf49194775ba2dd4ccd19bad8f2c97ff006656bffe49b7635fb8fa6864fe0b08d1f415af71b6f0774741f725b4589db6154d9f620ef08b45792f09a7d45b2c19b1251ab1cb2387a6e8a92bdd74c1e2c9733efe9588bb6c2b36786f7891c1e84b51b515a1b8b07e8c717d45ee202d8e26966575ba1b688cda1efceb0bc842d06afd0cbf1cdaf3db0b118196c421d58960b1b6161ac5ac3296b3cb2dba128f9bf82ac6f4ca5ed631a32ef6d86b0b1d048b2ec25a1974b8add86ae65dc92b3d44437686ed946fff000465e6358b3ebbf72a2cbe65b31db746998ca35f02ff004ff83c4d051a52eb6254a51e9a0be2e656fa0bfdc6efbe8797b6a745859918d9f985e693b15744a223ca7958b4b9d45d87a09ab1c2caf423f61f9a57e5b94d8c783c25cbd7d44220da2395e0cea6feac48ec3c3ea914f7c1f63888586ade926685e23b743ee67fb0fd0b616329918a0450a3df0b0bd167410d138de249332bd6247cb292ee64d0c8ee6d224d76343a88b3237b1a162cff00fd997adcbad6c4d5d614d234646cf32ff046de42a2bc34e8ce82fed7b315e2ecf61e8c6999e51dcd1ec2d50fe08cea47691e3afae087e14b552b31d37be712efa8d2be8c5aa486d44cccea50f73fb15659a64a5d046a6ad6c5afd7525a59135e54cd4fc3aa5e9db9994df9b078b243df93b9dbd058ad8811160c96f8dfd344719e9558b416c338b9ec3f454add0cc5f1bfa491610922c28ea2896d08e36f45f6c6cc68a9b47fdca91ea2d916f81c332274de96454a6d6a7c0b432eed17d8ccb4ba33233f61fb7e08eab42d7d0b38c8a4f567c0b495c7ee5f63e9fb9de2cb7437567d05ae1ae09d8f947f02b965d849f463936f5ffc0e39fb19a29591622ae5b523a425dd991ee2a6bac8b51ef73c4847688e6deacb2dcbea51519d29458fc9268fc3a76a8e3df9a453f760f1783f556098921292222c25b92c357b164bd2622183ee55d64994ddd322f42c7176cdce8d0f0df41c792e5f934ea69cb158222ae584b916d85fd15d791ad18d685af1944a5d8d63f635dd1e35327514f48c469191f4d888f462db0dba61adf41cb52ac74535b14fdc555a45fc928dbfc8f74fe07ac57fdc4f5b8f549e125f521a35469c9aaea7958a11ee5bf91b4f4d50fb0f722dec453b9377d2e659b32f767d91fc1ba1ad49220e4af6ec54f7dce0bfac9f334420dbb8dd9d98c6318c97ec2227d45696a8b5844896e462e5abd86edb17f529ed855527076c14924ca15135619c6eb6b7a2a528eccf15f53ca35d9962c58b73a1210848582b8961d45e9ac6d838967a938b8cd4e226a5d4d7a19575431c5095b61c5ddfc928b13b1ee46ad58e85ae455d6a538e6a738096b2ee8cb9a11f91ea8b5e2bec277847ee7562ff0063aee2eb12c34652ccd44ae6432a1c58a535d072a72138d922566f72317736d077428bee342dcf2f716906cee6f6424f525b1c052f2b90b6e5dca95b254a74d77d49c5490f347478318c961dfd688886841a91b1243dccdeaa218326f3567621691474654768b2724e395a274dc64d16e6b1a966599ae17f834ec69f3ce909162c245962b0eb82df1ebccb9ac25b8e3a0a29ad4c961a7d88dbb0e39ba19128a562bc7c9716938f6b15a8aba6850f8b0d35b9d4564f61fbb6dca6bcd7efa1593556f629fb622da45ba10f67f238f9c68d8b5f0b795b23b0a0a47847868ca8b7644b736256c1c3b0af1dc8eacb0ee22d73c37a684c926b4b61a8a39a71451cba40a906b54277e4949420e46682a8a5295e572f72abb44e9875431eef1e876f4108d0b34294732c29ea25a9ba335d12df0b7a2f144309156396a5c8af3588156ec74ae568eb71c752d6638fa497c16153b8d4572a1222b04752d869c8b917a8f0b0a3958de0e2463adfa0ed62b5a528c0942c4e178992495e3afc17e865cdeddfb1b8affe06a362ac33aba21671835fc918bf3af91ad1bff494d5e08f0c942c641ad05a8b467b25a6cc4ec6a6838a1fc0e3afc9e1d8ab4d31c6da3231ec5fb9963dc493ea6591e1178c3ee39bb5c599f51c9f53ee452ddb29b59ee70b55f8e9b7b972ac724b32e4928cd5a4713c33a52535aa20ef4e2fe07ab18c784bdc3c3a1d87bfa4a43a5196c41ce9bb3574432bd622113ee4fd37c90c24710af1212cda8b745897c1529791f7159a77dc54e33a77eab720af16ac4a8c5a7dc716858ec3d456158cd633be83937d79a28444b0960b6c6faae7b7abae12d4b5cb0eec8f632918de4e4fbe848d2c38f52514d6a8cb6d98d5dfc9152d351a9e8cf6c914b4a93877d88dfc59af825a42c535e443d8946e58fa8945c59b917a59917ad889656f935b60b595f0af2505f2cb49a1d96db96cde62fd18f466790aeccdaea8d8cb6d47a96ecce850bc9d88f92bc6e24ac89f99fc7232352da3d84a36d36c592c25bf2bdbd38e82b335a4eff4b236959a7a60c97af0c1957daca3b488ecb096e69d4a89788ca6e54aa5fa156ca5996cc8b4e657a377a1f97a9d894271dd5b0b972e5e2797b8b20f2f3456085cc9722c51afab645b93adce9a0d742cadb1e1f62d6dc689410e2c8e86524b5b1ff3e1f621efa84bcda115a58b6a49589ab6a894516ee5935f2366e42a657a8f5d5117a21bbcac31cd456a4ddddd893b26495db233716594e37435d068bb332968f73e18ae75c12296934cab4d54517d44ff004d22dcd4ad618c78772431e317e9222220a3560d320a5c3d4b3f63c244fd6453c19557e9b23d0bed86e4a3a164f4664d0953f23b179267e6761f1c9742b57955777eb2c573df957ec72fc997e4b59e2cb62f4bea5d5ac65d4cbb91d6254bf888dab5229c7f5a7f71afd44be08ab21a2c5ba1957b58e3d09c5ad51b963329116e3b333117bb33fc93153bb489c2c922a2b13dc85471666cda9d0924787a0b5dc70ca68cb0a0e4885a3e516841de383c5e1486318f090c78fcfa48888a4f2c89c54e1629392f2c87b92dc562fe83e4891df1ad6c8c4c811d468638ea3834659ea75d4f0f4b934bd642df042c2c2c5084217ec7ae1f058b16c1e0cca3438ea35a9d509227b224bf522fe0a5fd56cb79f37c60f0689c6ff73ee3813a66a856b9ac1d85292e97466b89f632e55a94a1d5950ac86b5c294aced8696b4bfc9e64b4352e795fc178f4d4cd26ca3bec47529e983c58ca5b6121ee3c27d3078f53e3d058444229b24487eb2d8891db0ad04e2d8ba907b14892b8c48687b1563f046590ab2cd27ea74116160908db9960bf756b96c5e0e37b1163ea5377b7cb20ef558ce88b5d11db0946e4b6fb1a4b4ea4a995697536134f46455ae653456b229d0bbcd22c8aa5624ba8d5e37ea845f54c7b099e5eb8c231914a8abec28db08f35ae52716f213bc1fc171e1d0974e57edf4e02224063d87ebc772384da8c64c8dee534dc19c25d4e4ae4b6e47a128c64544e9b63ddfa4b15c885fb7b7a76c2c586878752da12fa8a5baf8387d6537f385b4116b32c598d3250ba2fa5a44f5d99560cf29af4641549321492df71225f0544d127763b666356d0b598bda45bb5c92cdaadcd5e0dea52b5ca4da3537211ccf42f9659643e4a92508367e1d3bceadc769684a395db92583ff7e4632fc9d4ee75111224489d083bdc9acb2f5911dc8e15d3b1d4a2e51be828c7c5cc86efc92c38bb78889fb9fa6b08e0842f4116c17ef18fa0d12e85cadd84ed49beece19791e2916c6c58714fa0e947a2250f82746df491a5197c11a76144b1dc992d9fdc7a3b922ff051685e59347ca635b345c71cc528f6217b60ac95ce06ab9b9dfb952119ab116d3cb2dd7271145d54add0e025978acafa8cd6526fa63d0974631e1d066f875c6d8f63a08444423db53ee710b67e93e44222f09eaac356643366dc4b5e45833895e71fa68d0d960b15ff0044b632d87d4ed85477a92fb1596554e270eb2c6ddfd1b6161c4f0ec5b07a122ae84ef96c4bb12da23225ef18b378ff00e48c9ad18e36358cb4233d7428d4bbb11b365775143cbb753f0fa97ab246c4bcd2bf25ec3a709ce353ea4c96a3c58f97b7a1dcec742222244895b4b32b6b485ea3c618d6f7a146fd48bbae696a995e73d992f4d0b14217a0b9162b9edfb1b0c7b0fa1276814d66932769568220b716f847d59ad06577a12f6d8ea496a8ef843da45ea4b7f814dad3a11ab6d1ea8968f47a14aa2442bc1b213b68c543c3e223521b3dc9bbf2b2f67831e0f07eaf4109166448912beb116b47f81735b999aa6e2221858e2349448ef721c9b60ce2a0f75ea21722f417a0bf75dc7d0af3b794a5f53ff49c379eb6616ec5ebb25bb2b7b913a7fa64b764b6c69aff00625ee919f4b32f7d3084d45f9968468d3b5d0e8c59692ea42a5b297d3998bda864b063c7a1d59d11f4ff0038265b9a38418a3196c5dc1ebb112653dade83c64b19bff882245e3c47f52cff00823d8427cb55da3a156ca84afea2c16085e8a10bd25fb463dd88f7c9be9726f2517fea383865816fd8d45ab2afbe25bf4d925ac8b1d70a6ad1b8dfb8d2c8b9196646e52a93a7f623c4ab8eb78968c37230b242db9e3ec43278489743a92ea74c1ec53cb284d63766e5b9a245b8916a4b512b1221bbf41f35af39bf911d08e1c646f965d8a7a90d8859bb128db92daa3f1076515ea47058afd82c57eda433899e5865eac82f25be4ade6ab1876292d12ec2fd8cd6e54b6747fcb24f590f489d4a70ceff00f23f3655d2e568a53923ae1162211938f73f2b2bee8a34b2fdcb4fb90d62b078b2d764579342e992c244bdb835b9d31a1a5434f3725cd0b1662111d8442f162698c5eef5d611195fd8d0b423d8a352f52a2ec5eeb919c5d2cf4f376f55085c885fb05fb6677932a4949b97f823e4a6e4ce1966a92932085fb16578f9d19bf4f5256cecab72cdf4256a50cbd4a77ba2aff5258adc74e6acc4ed1ba295e628554f477446351f6217c975b09a7cbc4cfc1a7a6ece1bfa10fb1569fd512f8325b60f916e3e742b48d5323662111dcd9d8fa8ebc8dd8cebd18e11195bdd616cc8bd131472d5cdd244b6e5e85685a6fd48f22c172a585b05fbd7a8f62bcf2d3fb96cd3895a59e4a0b63878242fd933885e64cb7e9ff254d2a6889efa8aa647a213bcb3c994e5e66c93bb6f1b69722e7522a052e1925a8a19362eba9525e1d27238195f8789560d3cd05f742929628e2d4ecdbd753806e5c3ab9396483e47ccce9e8222d3d192a6e369448ea222555a5fb1d512f7724eed15565827d88bba4c7cf178470af0d1b2247da263d79aad34e2d92f450911e458e6ec5edf715c42162bf7cdf52ac9d49b9745b0a5a5ca11726dfc90568915a5fd16cbfa35d7958bfa4575e663d7ee7dd92a8ad6b686d0fbe2882dce0a3680b0518bdd1c749d92e87e1b2fd0fe46ecaec5ab93efc9e5945c5f538384e829465b5f426b3bd46b1e8319af274f41614ddf46568ca9b5563b75441a945344496c45f9922a7b972326af168a1fd343e69c5c3710b72384d79245223b0b7e77bb2be951fa2888b96e3dc5246614cf110a7ae1a199742e2fde48af534b1277b22579658a452828c5216e5cbe17133ec662e86d172e999f2e8cbf3d45e4643fa4710b44c9f41aba2db21bc51c1d3cd323151db91c615639647054a742ad483d9ec4ddf91e14e4dab3c2583c18fd542dc894ad34e2ca1fa35e545ecf61614d5eab2afbf910c49a13c5e35639e9b2935242e847097b590d242d98b75f6e69197cc7150b5422f2b27eee788b96e67562e5d8bee6614be4553f8429c853eecf15dfca41f56ee663347b972eb15fb3be17bea4a4b56cab533cb421a6a70d1bbcf2fe0ba148f11773c58f733f63c49e9d4cf13c5ff51e2771cdaea78acf10f113ea5efd48c98a5fe7998b4833885e427aa5635c196dcb61f87fd42e4d4a752ef5e786f84b078325eaa108868ee71d4f3423563bc4a153c4a519614de5948de4df349d84acb178cbfa72fb1c3adc891c2a47341db72d693b88edcecaf0ea4a93e83f9e7872b98e45cd4f317337c999917a7c9e20ea49e9b106fb19bffea2359f63c4cc78ac8d5d45233617fd95c64e7a3388aba2479b6d8b7d31fe45a251ff0024ea28e9d475657b47fc9e277429aee67919e4b733dfa1fc199b56690b32e86797f689cbfb0d1fd161668972f7e8297335656f92bfb5fd8d9224ad71e88ec35ab3a8cfc3e0accb2e58fbb0783c18bdcb0783c244bd5582110b4a9b8b381ba5387f6b2477e4b60da8abb209ca59dff182e5f17f4f2b12b6c2647610c9eb525f723d85b090d5b965b0d277b9e2ca32bf6388a49c5548ecf9e1c8e4334c3362f413436265cbfc9997733b5dc72b8a53d0f1642aa4268522e5cbfaf71b1cee54ab18dc7272936ccd29c885a2acb7272b2561495dbb6a32fdc6fb0bfee1376d199bbb333134fb8a122d53b19e51dee664c5f762bf423377333ec297232a22aaf2326b4475f81efa96b915169a7b8e3b212f838256872b3ae0f91dc842eeed937283b35a771f231fae845217938e92e9344862c14714bc495dec3c5f2a1101615ffaacff00c9014bfe2add2c68c92b7248fee44a3e6b0a3ff0d24c7cd1db193c2c65327c994b3ee59f732b3232ccd70d70cccf2beb636ea67646a119c5ecec42af4b919b6b5212dcb9195cbfa971b253275362acf71bff002ca31b1b1acaed8a9cada0ed4d5ada9253969b773c28db72345f66384ddaf229f0f37f0438488a9a5b2144f0fec6432fc193e074cf0fb32f5168c59c84afc9244fea456b92e848dbee2ee54d72b2f176287960b959f50db8eac7af23456ab96a4211eeae4f2c959938383b74c5921faab464a178e6890772253dce33cb5b87a9f3618cea5d22f8557f4add895912f4511113764c7fee2d489283f194fa3c242e468f0567b93bf991522d3e542c1e1612ec58b7c196ff0048a9ff00a4f0d763c35d8c8bb0e82ec4e85b63c39762cd161e172e7f0262dd117b5c836a534296a9117a35f227e9b24c73272bdfb1295ec4dea423795c4d47ee59e576ff002457ff00f4d6d68a3c14b5776cf0a5223462be93227a65d08d282fa4c88b7c162c5b9329963d8713258df919563e66ca9b7c92ea462a2b3cf6e887ab6c8b3a14e9e692fb893515a68277c561c4cdd2f0edd59a38938ba5afd3c8ef95d96a4a6fc4bcb7b895d265696cb918fd358d091521e1d54d6d22247747e23ffb6bf69217b53f83b8f16ecaeca6aedcdff183f462210d5cab1c9244445b4e7621eeee578de3cb1df1933514454d77628a146c278d8b194713c3254c74c74c7032e1fc8acfe1907d190e9a99acc73d51992d4a6fcd2b8a42f4192d09c89cbb0fb0f4598eb728a4b52953d2ec707376bd90a092d0d0d058af551af2555b95d6c28e6915a79a5f06a2d4d9228c5656ce0e5e253655a4e0ef1ff0464a58a38c9373f8470f2cf429bf82a34a12fb14fd8b1be8711c32af0cd1f7aff728f968413ec4bbe2c63f5a9e93454867a65195d10dce3b5a70a7fdd2454f2d37f6211f295359c628b617f165fe95e9462e4d8f4766448886713d0811f419256d495c7145486593e4a7be0cb0a3c9ae0b96c58711c47032332fc0e0786657d05b7c9a345f3459fda745f716e2e85fd0649f42a3327c92dec89c742d7764420ed612f2a12c74c57ad646bc951685724ed1fb8939589518d38ea5f71c7fa6492544fc365e56b0d3c69db1b9c470f1ad0d3491c1668d0cb2e84fcfa74e47b199c48b52892583c18fd5585295d0964ad38ff2533fabc6aed04555783466796c5bcf718de67917f2c49455960cb73f0fed38dd209fc94ddd223eec78cd2c47e9173bc2485b5996b687110ccae3c68fbb1b08d0d30b97c2e5c562e5d0997e468b63a16587c97d0be845e88586fccc9938992e786ae4910b66989e82d8b9733998cc29198cdf227f25cb998ba2fea4f66575aebb12f3897876b9394a6db6685085e599f42315289c2792bca3dcaf376cb1dd9085b9354539664f9a450ea318f063f5163c33e87131b4a13fe0a6f4b9c0f99d4a9dd8f07b936f68ee420a0be4785bd0a3374e5f0710d54b2be847cba11161c5eb48a7b210bd067525b994e2296495fa63477f46e663c45dcf191f983c797f68ab4ffb0cf5bfb0cd5adec3c59afa0fcc47ac59e3d2ee668bfa87cb7c132e4715cac63c5ee4ccad4d913319cfcc45753f33d91e2567d0ff0088ee469d77ff00305c355ffe567e567ffca7e5676feb33f2d57ff98f0b895f52667af1de02e23fb9588d552d997f4e4718bcc2bdd92dd5df412bfd8a34f3b6468e5445588bb544f9e975e6a851ea318c631faa8441daa22bc7350913a997866fb9c2472d088f09ee462a2378587e8ac111c2bff4994c888465b735c955c950bc671d0fa0af0cd4dfc0f0a1e83666b19dcb44283ee4611125d88a5b115a90ea2169f4a2dde28a9c3d3721f091ec3a15a3b333b5ef5634e985f1b899165c58215c5c8c6318c6b51ee4a6a27ea4fe111a314287c0b4642da321521b33c48e6f91352332c1994704fa13e196f1f2b3c5a949daa6ddc8cd35a0bd191c62f3167724bce87a42d638685a17b61d49f462db9594fddcd5b628af25d6e2a8a4f2bf2b18f0631fa8844914679a9238a8daa42974b8b6586895de17d0b897563e4b73a222c2a2f2b21e511133daa410df2b2da9c445aa8ca29a8886558da6f0e1fd06cd64c4ac6972fb19e3d475a3a33f3514ee8fcdeb71f1dd05c74ba94f8f59bcd7b10e3294f7fe05283ea65254e2c9f0f283bc76134f42d85cb9988c888b058db1631bc18c7b5d991ee2423345751d6d5a3c768752e78d24f5b8b889dfe487195a2f723f883ea8871d45a235a32578b1daead84a1192b33c19527e5d8a72cde8c8e33df61692d7b8e3e6fe0c9988ec84894496c43dab9594d7990f4e56705514a7511569c668d53b4b71e2c7e92c11157d08f629cf26838f895bc47fc117865954777ed266e4619771bc5ebe9448e15f6251b588ec22b425e471e82d50f918d1569294d364ac9682d8656ef850df9deb8685df7332253ec677a9e6b5cd71e16846aad49f06f33c9aabe854a5529fba36212a9d1d8a7c64d692453ab196d22df256a09abf5ee2ecc92c5322c83222222e56318c63d8b393bbc1929a32dd6692d0b66d8caf0fc3a9d1a91939957868dd64d897093e9aa21179f2db525c3545aa23527129f14fa8abaee29e657427a6a59097a0ce37dd165b76fb8a3792fb14682514ccb6224d1222de4be5b89a92d391ab92ab6e22941772518cd5993cd4dd9eddf07857cfe1f951f873fd792f8c26f35463c58fd45b91dc92ea6f61102d724f4b21914a2ae5ef8ddcbede824421295cdd2b088e1523744e5ed5db729bd1a161d395e135a6089ecc9224acce1f7e56586bb1ae198b908b96c88505bb3898ab1186c4a9b32328569d07f029ca57925d36389a974b429c6f3454e1a1522b4b153879d1db629f1335ee29d4522a52fa922486b1894c88888b918c631a245afab2c4a691e696fa223462ba1563fa6423a0e0fb1522d48e164e9d5fb8ea6694343cc9bd04b37149db6458adc3539a97975ee4e84e9adae42596c47bc190937baf499c6f43b9421aafb16b125a14cdd32aecce075a48ad4649e7a7fca213ccb1da2c94dc6ba72dee6e91c4cb450ea74c7359fc1e13a7c4c2a45794a92d3ca5ac3c1e0fd4444a7add1ac26a3d18b7b1a451077d4633710ed15a8af2d5ede9434847ec3f256908888687e6ad56ddc849f54475582e77b608a9b0cab1ea515af3e8c649e08a364456857a79a05377b7c16454a5b58f0ae85350a76ebd4ab2b9c15173ab98ca4e255e1e3999fa94aa3450e214d6ac943a93896c224089110b918f0b0e248cba5d93a8c82b8a245128e8c86939c18a9dca94d4914e8a5315b2e9fc0dbd59c2f9ea66c6a595cf0e9cf3297f0c84654e595ec534acb5ba125e8b38dd90ec93650fa7ec2d490b7c3883f0e95e9dbb13928c6eca49f99f77c95e842bc7b48a726a946fba45bcd998c78329d69c34e9848960f07ea2114f46715a460ffd453fea22bff4a453f62192c2ea2462e4f3487e95079a1f62bdff00336169716c22e4d7ebc92298bd2eaf0a9ed784b668a2b9e4332b1c6c244514aa74158af49d29e68ec42599632968ee462eb492450a2a9c1243d3725523dc9d4a7dce22d3aeb2f625e4774ce1f898d55aee554ae5b089020210b95e09121a4b7e8579caa3dec8a7c3c374d32a5254e5642a91d88cd099c5d1775563d372954538e0ed622fe4954727963a9460a9c12ebd47522875dcbda429b94af295fe070bec469a7f7211b69d0cbe8b38c5e437b94a365116c312d709eb7383f254655f3cfe174e465ecc8cae4878b2c47d8890c6318fd44229ee717fd38ffdc52fea47ec55fe9cbec52f62193364461f5486f99f2c1e51bd5cba8842c2affee1888ede95937a0d121a1f52972d868cbf038e162c6c2bb22dad8cd75aa1d057bc5d8f0ebab1e1cfae8781bdd909469ed11f11397b60c7f9891f979bd4970ccfcbb25c2b43a1283cc66cc9122c244080842e478ac27a92e196acf09f432d4eb23c3d753c37d04ea23c476d512a0f35e3a0a3c47c1e1d77d11f9493de453a5185f2a3f51ecac7856def23226bda4611e834f712ea5b5f499c5ff4ca30bc888b618912d2275232cb38f2b2447a0c63c1ed8535e518c631e0fd34229ee717fd35f7452feac3ec54f64bec51f621922296ec6efccf0b0f91611161c43cb53ee2be97218db95973899b8544e252aaaac7e4922689bf294b1b636c2438e16d4b0f6dc8ab2353a09dd92968477f83cae70ec795f52d6bb3c4b450e517d473d6c49a26cea6e5844489117a2c926b6330f0b8b42c3561d9492e8c8def614fccd0a666688cfcd6b1ac5e9b09dfd66713ed3848eef17b09155e96c7a723c21a8c78f42d732cf279753326318c631fa88895d5e8cbec51779d164bdafec50f60c674c2ddc6f0bf970b73dc4262c2b2bd45f08d735d91c272b245f4e6946e7114f2ea7071de432a2d091484216362c58711c704319d8d04966fe0496ff27565ccd6333636ac366fb9f62a765c8889122217a3b8e06df6c531378349d8b0979996b58b795896165eb3389d8e1a3e47cb37778adb95dca3157b5f52a39529f9bdafa8f1b1c43c94dbebd0e05ffc3c0af4feb8ff0025c7831fa8b088f5a33ffb4e19f929fc4b0a5d57c8c659b3ca8bdf096e7722b9d6088ec436c1b5e2b3a91df0af1935a10f6ae7ad4f3c6c5a318a8ac244fa94b042e5ca58ca65e45c96341586c4be056ec3449a8c745a8cb628891222f45961a435f0389d7058211d70bf2af519c4fb4a3fd35c9565658fcb3c39e4cd164657d1efc9f270352fc54eefa124a4acc9c7c2d16dc9c642a5f35ee8fc39c9d1fb324f2c5df9243f5108891d55be0a2ad0a8bb316a90b49b18c4ec3c3a0ccaad7e7ea2bb762bc2d4eeba1069ea448615959a917d48ef8ae5783d85832bad4a6210b1b162c58711c0c86535c6e5cbe16328b07a2243e4444891c17a562c38a63a678659a13c57ecd95d5e252f62c595659a582d7438c9658645d4e1dfe8c3ec57a69a72d9917a62e39e2e25052a3c6c53c272f127f0b1668f4670d1f064d7d2f62ade52f818f0631fa88894c8e9c54977451f65bb125e64ce98773a1db0b21ebe850928cd5ca8bc92fb1c3deff18430e297e9ff0022b6847d2b7257d88ee44582c1162c58b1947132190c8cf0d9919905132962cf16db1a18f14222217ab62c65329e1aec786649762d22ccd4b16f5d92d4871d460dc26ed614e33578bb89939698a38aa529433c7a1f874b3f0d1f83899fd0bf912e49d38d5cb2faa2c9eaac59612c268a72d112243c18c7ea2114995fcb529cca5ee6bb8ce983f71d1915746887e82111ab7a6e0f7b10595584470e21da990799e9b11f4edae3c46c4042c1084b96c58ca654653296c2d85b17afa112247042f5ac58b6162c5bf62c91c5c5f8b22956ab4a5e497f052fc59ed5623a91a91bc76e44ec518a826e0f7e865ddbddf2bd083bc50f0784886934324318c63f510881c443350fb14259a1090c432b3b28bff50e1a0b443c25d39d0b14477c2babd29fd8a5e58a56222dbd2d2f61c70aab429e0b14217a56f465cd122445ff0047648e3ad9ae4386f16175b9e0d4be56882b528af8c1634f7e7a7ed1f248bf99612dc631e0fd54229da51b1c2f965529f662223dcaaaeadfea4378dc7d3d058c48e153d92fb14fa111636e563958e2a5771caf5387ad9bcb2dc6545a329eed0b0582c17acf9192e688880842ff00a2b24719ee3867abb6cba95eb6b4eddcbe98f51907a8b95947d83c1e13d8a4e09de5fc156138acd1d7b97b8c63c1faa84517e63884e8d7855e8f46217b892d49f4fbf24748b16c2d4dc7ccae2222113f6cbec538bc8405854ec788f6b09f23271ba2bd34a299c351b2cf21ee48daab160b042dc582c6deab1f25c4448a1085ff0047915e339d6ca8ab38d3b53a6f6ffc9472ce74a3d6f725bf2329a6392c1e394e1e6ab297c15212a72bee8bdc783456a89d68a5b233688e229e5f32e57eaa108a9055a8b47092cd4edd63a151e5b31ea932a74fbe2dd8d192d11b4443e682cd2d1135965841889ecc8fb45b8b06ae53db51723c27152dc94b0b1557eb611c11710bf64f51f2c448424217fd1e4711564aa4ac47591f87c7f5ae54f7f258f13c2a915d192a109c4b4a9cad2c51c4cdc2969d4fc367ef46eb52de795b6e4e2e964929ad9946ce941fc15e799e55cafd5421141f42de1715f132a47341a284bcb97b13c3a97d58ff00a91b153a12d64962f15870fd4e33449adc83bc111dc582965ab389d7d1785b0422bff544210b058af41f36983243e48a222c17fd19e1338afeab2270595538bb6ec9528ca163cd4e59658a3899cbc4575629bbc22d763899ac96ea2c7cb38b8c8e1294a8f12d3dac559e964455962f62328cbc9242528432c5e835643e47eaa11120ecee7130cd4eeb74529678263f2d5fb9536582d8d0d3425ee89ff33996109b8cee715e7f0ec2d1216e470a9fd76217a0c5848444e297ea210858a10b9edcaf1631ee31bc5104245b042ffa2b19338cfea885fa7468fdc879a299c4d4bd7515fc8b1ab417114ffd4b63856e341465ba1a729e697f1cb17aa1db93a128a6537e527aa3a60ce83f55611111d62524e9c9c4acae8de023a61625ee47fcc3bfa17d04223b61c4695d085cec62c24b089c67be2210b058445eb3c244863c62534470582c17fd0de1338bfeab20bcd12a25e1422529ca34b2f532a5f7e45a117e83c18f6194b6192c7a12f5508888a631ec6c2161d497425d1fa688ed8713fd689117a2b0ab57c3b33cb357888e37e910b144442f558c686363c511202c160bfe8f5762beb519c3433d689555da21ca88efccc5ecc5ed8c064b91faa844444719ed87543df9172f5c163123b61c57f5299142e44317248e265b44e1f3f8be5d86719b216cb158262623afaac634343c12c21b90160b05ff0047aded6547e767e1d1bcdcbe07b8b7e68bd7178ee5a6a3788a4a583c787ab1a955c2da22ad16b587f81bbf23f550842238c910d63caf14f0675c10b6b89dc891c2bc6f528fdc71d0a78cdbb1e2cb2e8516dad795a2b53bc1e85086488ce31ec88e172e26217ec592245b18111722ff00a23c19c4bb5363f348e029e5a6f086fcd49c5cb2f52ac250d56a85252e4e2a7e152d37670b2bd085fb15a97d7013ba1e159e4a5268e027fadf72e55b788ed83c1faa844442c3a8ca7f57dfd07cd08432a1f96bcd7c888e1c56918cbb333271b91f73e449212e7d6e32bc34fe08f2a6475e4bfaac99d79204458a10bfe8ace35fe9b385a6a753529d942458e1da7c4387c15e8b8f9a3b09df1891a9ff001c9f4b97b95e19249aeb8a38d849aceb63f0f77a1f62b4f24482b471ba7a3152747888cd7b4a9514237c5fae842222113d35c3eb9723f4b879acb67d092fd79bf91322238ad69b284bf4d11f499627b162b7b191db9108808bfaeca875c2d844891e45ff0044632471eed03879b52b89f950ce1256e31dfaa3a156de3bcbfce30671747c39c66b6641af0d3f824e556adfe9431e09ee9ec508c292928f724aeeef918a6b624b42583c1faa842111113d5149dd1534aabe70783c560f14210f711116e57f64bec70dec421722db91e08a88b5ba9a0d5aa3582c15b0888582f55950eb8b13d48b20c42c17fd118c91c7464e3a14a954ccb4c1993f52135b956ae5a7a6fd0842d76f77c974f492ba34cb65b1b60f1a7bcb07c8c5b13c1fae888889110c8f96a7dce23e97f3cfd707c884751085b9595d328e9a085cec78c8945a372b2cb53058a160bd1be2f191576222c192213d08488b16085ff446327a96e44efc8b08e2f0ea6d57ef83c58c86c4b0960fd6891111161574b3f92aacd458bdab9531efcf119d480b72a147dcf05e9f12de5ba28d7525965b9638a5aa782e488b05cdd39d8cabb1010b09444b29096a4188582ffa2489752fe6e586dcd4fae2f1b5e5733ad878b2d7659ae9a175dc63dbf611224488b0aaaf065279a8ff000295a11c18c4ef12c35af32112d23840893d8a37759a24b2a23b63b214d14aa799c7964ae568cb23384a599e719c445e5627a0b0b88421732f418c990dda10b094a2897110b909c25b320c8b17356ad1a51bb1fe2356fa459478dcfbc484ee5ff74f09123ea3af24391614a0c72b3b3e5a93f0e50eed93a0a51d372ed7965bf2579ba71d0e0ddf8785fb1c450b79e05c7b7ec222108583386f6c97c8fac08bd0dc6436f4114d295448e2e1fa3a74212bc51110ca1a711326bca53db192bc454efd48432d4c5e3382945a2294236584f58b175c160b0485a0bd664ca8f2c9322ee219515c9c35145ad8a15b368f722c4cb97c5bec4e829bbcb525c2a234ac47422c5afeee64dd88c7af2f08b3e72ae6a53b3dbb97be0848e0eae6af58ab4e3557c8b345e578a38a94bc74d90949c51c5b5e55d6e2c78ba6e51ccba1c079a847e0ad350860f6c1fad122210b0650d2a5444d7ebb7f023693c23d70b73d3965a9191c45bf2d3fb1495a28891c25e5e298e5e521c9b8962f1b0d6a34654c9472cdac160b04f088b0475f499245485c8c9d27f046a292d0cc364b05bdca35337dc4cb972f62ef1762daec684225bf7726577a9c3c3f4d15a9a84f4d9e2f48b67e172fea15611a91b320b2b946fb6086af068e13352e3729b2b9279ea37c9c452f1a9e9ee89c3cff004639bb12bb95de2c4ecca50546ee3b3e854f3bbb1ab0f6e4d3d48884223831695fee8a9ef5c9dc8f3a2c372cb96fa090b716153ff70c4ee85cec7c92c6bfbaf82c16085c8b9ef83e4689c10e9db63cddcbcb1b11bad514eae65a998bf644561be091f0282edfba7832456d59c255cf0b7638a77a915db93854e8f136e92388a9921f2538d96bbe0b0cb194e32fa913936ac590f9232bee3c5925728dfb92243e4d7d488842238325ef832b74e47b096985f9160842111c2be95ff820c5e83e490f0e21392d314cb88b91785c585fd4631a1d878e824b4147fc94d7722b0b2467c8ed2fe06e324f5237b09268bb2ebf72f0931bc294b26c75bf245d9dc93cdaf3277583e488f16320f52431fae8422382c643726277c5e17e5582c1084238bfea47ec5117a0c78d5a9e1d9d88ca335743269ec3f2cec7716f82c23d44c4f0b9d045fd36c90dc51276bf7c61b8ba2b0a5629a13b12a9e514eff72bf9925d53d0a735ae866942a28aeab6155696ab514f35ec696135fb993d09bd490b9d73476c1f2407c8c85f31d097ec6221611c64474635add60863f410aecd9d888b0e316b0288b7e542945f5c1e2caf2965d8a1e267f20d8caf0719a6f14265f41172e21609fa79ac4aa2b12977ec39ff00965b77d4ccecb51b4d7c917d0bd92b7522bfc91d8cd64788a49fc14bcf34ee677936d6e675acff00c9bda5d48cbc89cb47724af79adc4f4897f93322fcb7fd85f0a8364ac2e78eab958a2d46e269edcb49294b293cd095a583c7c5c93843fb9956869786e66ff383f5d611c238c85be16f53854b2dce2ef4ea292ea47b9111c5fb57dce1b564a3c92bdb414db3555396c4e178b4508785164cb1c4c6f011d7142b88b884f04ee378bc1973375331e26f6253befb1293ff0072f9b525ff00f59bab77348fcb231ee422faad85797c2b9e6b5d14efab6ca8fd9f25f74c5369dafb58a7b46f2d5b772d5213936af1628d9de3edec45f47ac6e5fdd66668a7ae974277d9abdc52b2137a3b998cc6a5ff0062f0931f23d2dcb0a729d3cd114b5b3df144ed1a72933f0f9e7a72bf72ad0706e50ff05ef8ed16fe0fc3677ad51b7a935192b33db271e453bf19172e922e717973c5adff0062844708e323a8f4f45efc9c2cfa1c6f9a5142d1084715fd33867663e44c701415ee5f078cb61c98a5996138dd589432cda3a8b04f05c97e5bb1c89cec84cab5146d633b97f236ddfb19acac365dab12354f08ee90fcbe45adcb3492e849794b59dfa586f36bdb624ef99904a4e0d94213c8d766372709ff00b9aff362da2bf7358c86df91db54c71595b5f714fa1165eff71c95873712e662feb3c1b24c58ceee508aeaca943352ca26f67d319e9067012fd038aa0a4b3add10778e08e2aee84ac7e152bf8889c9422db16d8efa1421e0716bfb59392846ec5772949f5e4ad45ca51a90fe50aa47226c9bcf2cdfb1422382c64752e9e83f24b5db92c3e78ee37a88888e217e9328caf6e55e8bd994f06714ad66278c4444b89e0b95b273e84e5763a9aee37d59adae5fa21f4b167ab3a8a2ad7628bff7d44b5d7b14fac88c2cdc88c7db7d885e736db257727d886ac6b2b643dc5286abb232bfe0debdff00d24f587cdc8a76773ead4bdf5ff23d752e47a89def735b2213d1dfa333b212ccb42e5fd3b9b8ca8c96dc92728548cbe48565282912d67290b06b323f0ed14e3f271755a5923bb22b2c52c1099c3f0f92bb9c5e8fa15af296bb72e6ee4af2df078e6cb22ea4897ec5088e11c2248ea4e2f744bcf0643d8877954b74c253e88b62f91608888adfd39149e82db9172be496f642df1af0cd062c108b972fc89bbe37d2c4a6f644a65ecf734ea5eff61276b9b75336874fb997cc8776be2e34f516bd7a1156445ea4f68aea28e58b8934d75dd1b4158b39908df73276277cacc96ff046379abec7595ba093d9f6b918e8c66d95ff00925adcfab43663ddb33356667ec42799b17a4ee315d1724d3e57aab3232b432a2c2c6954cafee5bcd763c160b3295d19ae3e4647d983c6453d890c63f59088888611d890f06b08fbe44e77796228a5e82c111113f63296a436f45e0b09ce34f73496ab92b796ae08d16285827821bb31cb425d58e5976c3b896abb752f7d7fc0ff00fa3b1d04f5fe0d763e923bafb097908a48824e4be0b6fa12a5e6254990a6ee24af83c24a56b232651ffe0d72b45af6b96b0f5329335dd11b58f968d56a88cf6f4ae324f41cb624d1d7d2eab07cb61f2f4c597c2992dc7fb08888884584490c58b42497a0842f6b9084447ed652d1b29edcfd7078c8e22706b528d679d452d0963c553bab8b0437a8842c1724eef6d896fb8deb87d8e96e82d8b7510ccb6b1e1ec64dc51426919c8d4b34426997448ba3c4478a78bb8a6292372c8b60d5ccb83b1b37d99f5e8ec2baebfc0969a329df67d0dfd0b925bd8f82fa31b3b0bd38bd07cade5b5c7b726e5a596e84c78daec8c1bbe524f5c5fad110b0813e22d2c9157641bb6a319136f42c5b042599a4784952cbf051959b86113a321ef6ca1e6bf2ec8ce4eaa85422f32b92c11244e9dd32853c8db14af7c65aa26b248423e71b9190b177cc3dae35a3f92c584bb1d8dfed82123b0eda19d19f53317330aa94eb771d43348cc2b9a9768ce2accf18f10534ccdc92baeba17b490f5d0574ff00d25de846575cec6f4353327a12dae8bd8bdcf81dd6f8b16f6ea6cecf936d58e13caa4919d3e4af3f0a9e620a3568acdd515232a32b3f6f7e4ad3c94a4d1f87cbfe1e256a3f54792acb2d3933f0d4fc2ccfab38ba399668ef8bf590842222a6b3dc48686243f41ad3145eda91aca54ee53f7c9bc223d6253f2ca699c27b992e4d1c471b1e067acbb0ec958782c1937a887834711113c2fd0b9a9f02d88bc58fa7627b7d86b05a1742c730ea198b97c3a9636b9122d0f1bf3f883e2121f1b05d07c6c7fb45c55dec67d51f4fc91968fb91717628e8a4be4bf2fc97c5fb98dee395e5fc14911d6bc57c9569a9c2c2ba6d3c783f35793ec71946f1ceb744279a37c78997951c3cbf461f638ca791aa8bf9c60ec7e259f247b5ce0659f86a6ce2a4bc3b75229a5ae35a19e94923f0c95e338762bcf2c792ac3c4a6e27e1f29c73d39742ad4c9062c18f07e9a1111088886329bdc7ccf0bd90de0b08b685847611ff003e653df42fcda2e6655ee88b1e0c6ae8da4f0ea8be1d88c909ea27712f9c3719632b32fc8e25e4ba99999d9e21984d60b1582c17dcb972fa19d7733c4f155ccff02ccfa192773c2d371d08ea7e5fe08f083a1a12a775745397f93ebd049dd584b9afa8d93beeb733a2acad664e45e39ac88ec4bf4eac27f2295e371bbce4f0670953c2acd4ba95a7fa527f041698d683952d0e0e79a847e0e2e59dc69ff936c659270709ad0e0e9ca8a9c7e9e84af295d8f1bd8a3e1c66e51ea54bca5c8db2128e7f92b2cc5b097ac84444210878477c1f3b78ae4584513d389994fd6abb10d0783d87b1c4259aeb05be1d0ea85b1722c4f095d61bbc328d0d19450326e786cc8cc9232c8f38a6fb1e22b8ea40f1d0ebbe888f113fed3c5a9fda66aefe93c2af2dc8709ddb23c347b0a8c53d8515d844bb9d0c82a68ca4a24a2280e0f23ee4257c8f998fb97cc295d12ea49de36ea4e7a345086ae424349ee66fd3b26258c9264a578a4b913b14aa2db61c55efcb1934f72e3e48fb87c8c8a59896c3c1fac84470447162dc783c5e2f1421630c2baff88fe0a7cab6e7e8364b4d596bedc922bc53582c63866b221ad842242eacea2786543896122c22c65230bb3c33c15d87417623423d8f023d8742365a14a8ab3762346e4691904bd36bcc2b0ae53f6dbe71be2d8a5ab8b369b5f075252bcc9cbb1d4a71b2f4172db996f83c590f70f91a23b8c960fd6422382222c1e2f93ae2f14223abb1256dc44489c52fd68323617a972ad9c1dca151c5a44f19155686d822fa97b5b0e846572fa591fc8d9b8bdd6c2f831e85842df18f4c3797d86aea25924596a3fa45a292f922f513c2e23af25b9648692d4bf99b22d74624f93f91f4b137a5faa1c9e78762abf2dd7464a57654928af9385a57bb91b0f99f3f4c18b0826e436af6ea3e486e49db9512913e47e9a1088e0888b090f7c5ea447c8d0f9287b8e2e1e4b945dd0889c66f029ec475e45866572b4dc279a2ca73f1237c1e0d155796573858a5ab24ef8b26ae8ad42196fd7058f42e588b3a92e8395885f0d307838963ae08897d05bb2c7d38752fa9d638265cbe3b0b9592959ec4b5e82d1d9ff91588cad7c22f4197454bad519d48d9a256277536ca92cdb141254d3c1e14e3e24a497426a509d9f22bbbd8b97c62e31693dd95a33a7ab5a17b8c45ae3a8e9f174e0bf92ad08d45feaee294d49c66b5e473ff0088a70f9274a13858719539e56318ef63c452ab082ee54a519d368775a7aeb042c11116121ef8be6b798a8b2ebd0f92e229d4c93b9c44d4e8f948da24489c537e3917e5cc8e0a4e79db276e4b5c9424995149c947b9182a7051c1e089d99b4ac5f91b389a9f4ae5be17132f65722f4cccbdd89ec26b9ac58b084213dc4f04763b9d47b08b8bd1649d90f457256f7741acd6927fc91fbdc4cf91cac6689296865f933e57690de855ea8f6dd1c2cbc96c64ec8fc395fc47f271b0fd3bf662c2a4b2a3818fe8dfb9c5d3cb2ce84f0842fa99f3f190fb9a35665582a556cb678c352acaa52e314a7fdc46575738a69d48dba6299c52946ba97429bd13bf438ba97a918f6c197b155f87c4297cdc8c9349a26ef397df06587e9a10b14448e1325be0f9561a5cab6f0f536c1609b46e408ee7191f22650ec518ba751f664b996552b9265f925b1322f4e4a9649b252bc9bc6f822e77ee26395d8ddc4f523217a162ccd44cb9733590a62917c6e5cbfa2c6d97ba256d88c5772fa6bfe44ef85fb968e6c24a5ae5dcdd26f7ea27955cad2d1b14f3c4e1a7662c784a92a55f2f491c6cfc8a2ba8b619523789f87f10ade14b747192bab115a611958e268c94954814a79a9a7f04a5e25593c53b1c4d385786bee5d4a4ed463f632f99b78b44946a432c8a0f2524af7b0d799b63c5a8495a48a5251a561c7d74216084222227b9317b7078bc742a49358a238c45b9c5ff0041945f950b9d8f9593574436c59c64f68ae5be85cbeb86c5ec2d8b9051429e97624fafa362c58b3e834f7237bc88c999b42e2c57a2c6356d872d353b35a1169ad50b7d06ed6332eba1351cdd1990caf595ee5471707dcaaf353b14a8e6a55212dd6c456595991d2765b33c49424afb1e245f5343c5caf633f89af242694bdbaf726efc909ca1f629cf34256d049243c5907a13e4dca5a5c90f920f725a8f17ea2160842224592dca9b11f6e0f99a25b8f042161122cadad29147da842e790b967a6e4112c2a3cb16c93ccdbe6bf32fb91356c45ecfe7d3b8d97d4bdac26672e5cbfa2c95d2b8ea7c3fb926a4b496a39cb53369bff049a5b11f75c7b68ff83327f068eff0668e55aeb7dc6eaad74b0e515b9469c73294bb92aaa35aeb638c8659e6ee37649fc92929c2ff00038fd5162ad517538385d5e6f5ec54a1c4a9b74ed63271496b0235bfbb42f874e5a2f75831628972c3564b71f22db063f590b0421088922453d8632dcac78a114e329bd11dd11224d5e948a1edb09fa0c5c939652a3a72a7e6670f5ff5322d5134338c9d928fa88d48b14859b72182c2dccf0be971bea677789193ccfb09de56f813bc62c4f4132e2e796c37a127d6c4ed7ba13cdfff0026cb55a773a772d6ea39bbad3f92fab429475d07a5acba9a3bf61af15c52e8545fa364457bd756412af4324bdcb41664dc594bdb6ec6b94e1e9d2827527d362a579ba8da95b521f88578fd5721f8b54faa288713c2710aced72b7092879e8eabb109a97df1585ca2a4a4dbd997d799b57c5ea75b11594cc98f93618c7eb2160844444372a122975c6e6875c58f04b1e13fa4715e5e274ea2227d2ca4d66172f5c336a556e324d10a8a63c671ba2a536e2d1c0c32dd936376572acf3cdbf511b89f433584c52232b965cb62d8dba9b265f5b1b97dc8f6f921a2fb0b762def82e56ec396971cd4896c6a4adf25bcc9ad07257f913bdf32fe452dd0be0ff57533294b635be54c9c9b9e4451a4a1125e57f055b5ee91196ba2d4bb53966451dea4576b9aa68a9e64ecf41ef85c5f0709c74e93b49e855f06ac7c486e3a5514335ae4657c1118e6385abe255952b688e2684a8f9e1edea88c9495f1a6aece16ae6e2aaae891c470d759e9efd88caeb0b8b48b933f0e9ba9e23671742dfa90fe44f16d41666708bc6a6e525b95a9ca8cff00d3d078bf510b04211121b9536190dd8f9e5d8b74c117c386ab9746710af594ba58444e226e348a50591493d6e41e973859e66db2767cb52334ee8ab195e367b94e0a9c46cbe32943ab3c58424f525c643a1578994d5bd7be09bb917fc91d8dada8b52f858b6194689ec3f6b3ebfe07b8d68c87716d1665d596173498e7664f2f52eba486e5f713f9b8f2ed724a56b5f322295895e352ebaa33651752a7b935b8da8af9385a3bce485d493aaa524b52357cab3c6c4b2c270caf468e2e938f9ff8651965a898dde4ee7b5b2ac2dc97effe4539d2774ce0b8a8d687c9c453c9574eb8c6fe149c773f0d9e5e2a69f545ee8b41559a8e395ce9b517691c054c9c5da5f5685ecb52f9e5397ce3522ead2693d4fc2f32ab38bec549da94fec41e6c78a4dd2d0fc32a5e865ec71b25e17f38bf550b04222448153db82f7fa0ec52b673888f9b32332b08422f21099923529b5229a7094a253d636652864aad7425cb98765a999df09548c7a9e38fc4912a3367e5664a128bd893bfac95cb65b5f0fb14d0a4a288b726db213cdf62d71733438ec869abfd8fec66e88296c4216458b16e67b32fba436a5ba325b635b8a5b968b72b6e65e97b3139a86a3d7534938b2fab2abcb1b9c2d073f3c8b6855578d96e558574af144ea55b6b0b1e23b474ea56aaa5a2eab528d2939e854d19216ab2ff008251b3e452d2c70d57c27990ebaaf616109383f827c349578d7a5aabea56aca14afd5ec538d95edabc549a771d3a35271a9ed9a6569668dafa09243df0d991b78d09adfa9c5394965e9d44acb1bdb7d8e1a92a753345f95a3899e695bb0c7eb2160842224371fb70fad0f9d8ac9955f98d04278c4443617fee2a14dfa152d6d4adc6463a47567e7272dcab38c968c736438cab1563f3b545c6cd12e2e3285b27aba609ea3bf51317c99b616b77d84f30bdaafb74429f6338b6e6c8b5325ee3869f61475fb94d5a5e8e6b6e752af7ea3a8bae854965d4954eb6252f6974dbd751dbf921ae9d87d7ec2fe9a1bc9072285095579e7b0921b38ce2f2cf2437ea2ad5a16f310e3e134e3560785c1d44b2c9c593e1a0a2ddce1a4a94ddfa9c546ca2c76c24b34737f9e4427d4a53c92b909292bac54a707e566753d648725c963a60f14b52a36d216dc94a56762a31e0fd542108584488fda325bc7ee3f465c884222409acbc4c8a5b0b9a75234e3999c47152aafe3f7573a0e56594a7b9ee7be829df45b119ace6611d708bbb7833a96b11faae588ed7c23efe45be0f6b324dad3a17bab3d516d3cb2ff2352cac8db4cc89eda7463c9a3ca47eff00c12bc7cd05a23bdfaa2fb104ebcffd288c52587115153a729199e7ccca8954a29c3745e9a5e543b941547192b8de5724cbc6a708be31d8ab0d7910994aae47f0426a5d715e83c50f962b51ee4ade85f9d0b0890c110dc6b4c2a6c7d3cef6243c560e9da8e620f32b8b629c8acedc514a5a8b95b496a7175fc49d96de9a8b7b16b7a4d637c188bfc11db5232db41b6b4dbb8ad133e58dd94ef93515f3611eb85ee2dd9ba3a0bb1f4a2e5ed34262919ac377d872ebfe46f543b3dc968f6b9f6fff00667a895b7f82357374b31e5d1d86a16ba129e99a2b525ed67dcc92ad38c63b7529d18d3565848e3ab679f871e9b96d44b2c7491e52f49c11c3defa1c5539aa97ca70d9dd190ef76656d5c7a9bf949472be45853a9283d0a55d4d171e86645cbe0877b668aba23352e48c6e4fcaaf6f2f7e54b6648783b7aa8584708bd0444e984f623ed585f9593c7cdd842d18a5174b5ec53be676d8b94f53896bf3051dde0962da48e2f8ccfe58ede92dc850cd76dd911a94613b244fdcfd36b9508dd94eed92a845a6d1eea9f0b6335f4ec676a5614f614bcf53045ecd91f6dcbd8fff00820f4b172e665745c6d31e65b0a4a49a23277cb2dd0faeb6678ad7b913cb259917b6bb8d27aa7fc09596ba0b769345daf28e56ec28ceabf828d28d38da38f1757c3a727d4cdd6fab13d080d5996129c766478c92494e3728f13c3cda8a8e56caf171a93fb976b4b8ce83f3c7e7a925c9166c2767b91e26b435dc87e29a5a74ee4bf10a77d299f9f5fda7fea11fed171f0ec4b8f86576380e3282a0a2e69347115786f7464ae46b425d4ba16a719270a69776538c65422ba652ad2950a96fa5ed8b29b72e229d338aa1382cf0fe5119a9c6e31fac842117d05d086f8325b14bd983e564c6bcb7c7415cf11ca196c2114e5a16bd47729db4364ce1aa664369b654a90a51bc99c47153aafb47d4ab3bd974f4172b1ab722647bb3ab233592cb765bff00d10b2cd2f8b10badc4f2dc85dcb332997d5972ed0cbec33ea1cad6f93a3466d7231e8d09f72f690c95f33b199b71699195d3ee5fcffc0dd96bfec677add7d997d3a7dd1095469d9a65e4e5edb13bd8a3c3d5a8f348853518db193d0e32abad55afa6221415ec5b2fdcfa4838c772a54cc877566f6b17c8f32fe0e2de78c6a7c6a5b1d53ba271528e68ff00286b146f8466e2c9abeabd0fe4cf3fee23c4548bbdca959d4d64701c429528a72d51c5ce4ea245c4cb9c0d65f9d79ba9e241dd157c38549787b171bf59630621113a0c651da4be79e43d0e1d67524c92c9363786a6b8220cad49c259afa329bdb0a70709c8ad5e1457c956b4eabbc9fab08d0ab0d6592447858b7ad5562a538295a2ee2e16a3d9128b8bb3e45cee38ec2d47a75b917f3b92cba25f49d127d073d228bdfec2693b7c10b285c8cb465f62f78dc6ccfaa1b332e9b92d728ba951f9a2ccf9ac36d3d072ccd7433b713ea25a4ad6d7ff0024676bf7bec56b3927f066bd2bf4b8a71b4ba7c16528df612f2ddf7dd1576d0e1f867a39b146d8b67195b2d36667a914f2dc47957dc6f5b1252d2ecd2c4650d134d794d37e8ccf9a9ebf63a637b33dbaa2705359a3fca1ac109e2999624a9b459fa17149f7215a57f711e2bfb85522f665f53c24e7192d1a64a6943e717eb210886088ee741e14bdd3c25bf2d54d489323271d5137795f042e48a38cf62fb94a5e55742dce278a54f48fb894dc9ddfaf729c7ea64b8c927e525372777ca8b62b0b1287632be45a0a4d1195f765d3436dbca53d251bf627ed56ee5d74335a2989fe97f249ec3d248be5d7fc0b49909ffb917b9be8474ff25da6d929f9a2d93bdae8cb772772a2cd08b8ee8d24b37f9335e7e1ff00a74653d124d924e2e5e5baee29d48fd8a726f48ff82970c96acb62c9cb438dab9a7610a573ca91632f61277d49c23086ab51decbe0f758841ba159f62d8db0d62ee98e31abb6e34d735f43334671bc1162dca88cf5d519acf4642a2beacd2de598b337ef4ca8eda0992c1e16f450b044444488b61e11fea612e59ce739318d9277e4be0886e717fd3bfc94bccd49ec711c5dbcb01bfd8d7b46852cbd707d3956162dcb243858b0b457c50aef2c50e59a4c4f58fdb43c5cc67f312979e30ec5f47f73345c9a2f9ed6272bcb4fe093cd95a24d59177925a9094b46674efd9b1465e24969b0ece4a22d2125f27896d51e238dbb4893b487ef52f82c925396fd57c1092d55bec2e1e7297c7628f0f18212e49367133b45926e4d88858d2e5ee892d34127e51ed66456d27f614ad78fc9424d46b42db8fddcdf63346a2b4b7ee54a7283c131fa29e36e6cc5371cde696525259bdd722a8ca5fd6b23c0e1efff00b92528295b38d52d2d510e8bfa6a47fc9967717a0b1421107e62da912587d6863e56fb121f22d0e1a9e7a9af43898649dfa311038994552699e23cb6fd9d1ab0b659a170d096b19e9d8ab4f2c12e68bc6d8dcb0e23a238bc17762bbb8bcb43fd5264777a91de3f627fd3bdba9769e7b94ddaa229f9ae25ac8a53b7f82f6b94dda1297c17d11ad98a4e138af82a7b69bb751f92a4a5fda9156a27284d7f23f63b6e66bb237946df23eb1ec797327b1e1ce6e194a5c2e51444b966ce32af42fa118e11d51aea2cdd059e28f1236d8a77926bb1186e51925369ff0068fcb2cb23af23c7c4bab4b5274baad561bf2d97a4f955db1d1b6f348f065ba57c68d2cefde97dcf0aa2ff00991ff239f4a8bffc90f4eb746bcc84216e210bdd12abb46e4352584f7431f331f25ce1eae499c64aea28893e2543dbb939ca7ab7fb5f3475b9e2cac43c071d772a5271d56b1e48bc2d8d8b6162c3827a12a04a9c92168c6e568dcd32e8f5212d63f62f9965eda9295cbeb177e8667185d178f9eecbbcb0d093b5c4fcdfc16cd1b2d35d49d456b2e888bbe4d4f12528a8bf6b7fe09699d7d8d17972915a35735d88df323f2adea9eac5c2c5db32214e315648b7336569e85579a6c5dcbe6fb60be067956ac6f332d0b095baf42372947f537389a599665d0be985c7832f8465288f24be074e517dcbe17c53c6f85f17cd196595c94615d5e9efd8bd4853cbb1974bdc82e117bdc99f91a15e19a84f5ec6469e56b54539e49a538e9d515a93a73f2ec66bae75822222faa2b6b44a5b22584f617b560f958c65b0b8872b2dc956e887fb6be3c2fea5070655a7e1c9a1e34f5458b194b162d8a2c6544b865225c3d4b9e14e3a895a7a94ec94fe4b7958a5ed562abbc958d54bf833dbf83de66b4bf8239adafd4775d8a14fc4928dc92926d3dd3ff229feb5fe92adf3a1424e39fe7a0f8695f3228f0f6706286e22dcac6c9c8e32a97d3e4b5cd056684687c9a68369c5dbb8b77ff694dea24e3764b8959651cbb9a0c583b0de3a8d682938b26e94fa5993a728f4c5736859fa2b4772a55954ea53e19b85effc0ff271595d195fb94253a55e2e27157f15c87438a953ccf5895efe1d2d7e915ce9ccb05b90c1ec7ba8147db12583ea43d8b07c8f0912a7e4bf2664894dbfdd518f89e53868b83922bf0fe247e49c1c5d9e345eb616362c58b60b92c651d28be87e5e361f08afa0f8792d91e0d4fed67813250a975e51466b514259f6fa470792292ea558b569afe4a136aac668e220fc934b5bea7812729d95b63c06e71b8a8e5b69e57b99482bc57a32657a964cab2cd2be1b0ed62288e866b8dbb9e5caadb94ed925f715bfd8a5ef1d9e8496a4b47c9644b0b9a332f94e865233b2b3d4ab0b6ab9932e22fa60fd08e683cd96e4b89aaf551b58a5c5467414e7493d6c51a34dd59ffe0e3327f4e0b662e1fc4a349b9da2a3a9c44d4e7e4f6a2f8df9109e113a1d0a5ac1a2969a12d87851f6bfbf33a90b6e668f724e3dc75e394cd8662ffbbe09799b2ed559cba7523ac60ce3f87bc33adf14ecc8d9a4f0b6162c5b0b73245916c599494134655fec5b45a0e9269a2970f493d514e36567df071bd8b68245bd0b93671b557b4644ea59b2940ea753ab231d082d648fabf8670facec4dbcce31249a4277d192567c8f18916d32f72cec429b9bb58ab08c28f9b1b97c1143c2551789b15a970d512ca3a2e0d152318adc945f324d90a6dbb5d1c3528a8eba90a5071cb950b86853a7256d335ce32949c156a7d3716db9695bdcedc898f058ac22c4bca476293b485a33e9c194f792e6bb2f8dcbfef3e4e1f4a575dc87b9aee506e94b23d9ec6f74ce2e878553e1e11a52a91797a1c3bd2dd858db1b162c5b0b7a091632f5c2c2425d30b7a72671359538b273cd2be0a2688596c6ab0fb9149ea6ab623acbf81af3ff00042d09213f70dda17ea5bca3bdb918cb614e94a7d070843dd33f37462aca171f1753a684eace7bbe65850cad6fa95e9ca303cae251d5ea544b369859b23426f7d0cb469ad7563966b908e691c2c5926e03aafb1c63af92d4e0d46da898ee6bc97d31be17161021d4ec74443558485ef1ff00d0572a5d0a7529a86422e3164aa5e4a642bc2ac7fd48e2692ab4fe4cad3699f85c259a52e854f271725dc88b1b16e6b16f4ac65bdb0b16f4dbb15eb2a6aed9526eac9dc685a09df6322b62b5d893d84b5dcf30b5d48ff557d897bd7dcd9bbec49ea3d0b92c58c841cb64783082bcf7ec54e29bf2c341fc994ab0c96f9e6582f932c96a8a53f1e0e2c9f06d2bc657f81370d08c1c994f82bead8d52a4ac4a6fa0e3dde14619237670f9e71d07c3c6cf77a0f88953a764f5b9e3d57f5b2cd3e58895d93865d50b058222d14f73a88a6f4b1018cfa912e6b72d88d19c8ab4654f915b5fd95851ee5fb6142ce4ae54db432db465a54e5728558b4b5d4e25f0be227d7a9c3d6a4e9cf22b1564dd7b94f58a7cd6e6b6162dcb6e55e9b657aea9c6ec9ca55659a5fc151db63e8b9a389b2d08bb32e397633349771e77d0a54a7dc952abfdc787552dc53a8aa2cc89d68f88bee3746525e6454e1acef1772709f614244a123248cb2ec2a337d510a11faa44b888d3f2d38928d4a8b3662ca252a74bc3729ae83772b7b21ceb5c213670d4dcb35b71caac2465f1b65e629c2149de5b93a937a25a0d6bab33dd5ac4e9c8852f0f596e79e6ce11ce3b0e76a726fb1f988679, '07974507514', '1234', 'Bhedaghat', NULL, '2024-08-28 13:17:38', 'jio ho');

-- --------------------------------------------------------

--
-- Table structure for table `visit`
--

CREATE TABLE `visit` (
  `id` int(255) NOT NULL,
  `project_name` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `employee_name` varchar(255) NOT NULL,
  `lead_id` int(255) NOT NULL,
  `employeeId` int(255) NOT NULL,
  `visit` varchar(255) NOT NULL,
  `visit_date` varchar(255) NOT NULL,
  `report` varchar(255) NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `visit`
--

INSERT INTO `visit` (`id`, `project_name`, `name`, `employee_name`, `lead_id`, `employeeId`, `visit`, `visit_date`, `report`) VALUES
(30, '', 'Prakash Pandey', 'umer', 149, 29, 'fresh', '2024-11-09', 'pending'),
(31, '', 'Prakash Pandey', 'umer', 149, 29, 'repeated', '2024-11-07', 'pending'),
(32, '', 'Prakash Pandey', 'umer', 149, 29, 'associative', '2024-11-01', 'pending'),
(33, 'nirvana homes exotica', 'test of project name unit', 'umer', 154, 29, 'fresh', '2025-02-18', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `website_api`
--

CREATE TABLE `website_api` (
  `id` int(255) NOT NULL,
  `api` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `website_api`
--

INSERT INTO `website_api` (`id`, `api`) VALUES
(4, 'https://one-realty.in/api/user-data');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`client_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `company_profile`
--
ALTER TABLE `company_profile`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contracts`
--
ALTER TABLE `contracts`
  ADD PRIMARY KEY (`contract_id`),
  ADD KEY `client_id` (`client_id`);

--
-- Indexes for table `device_usage`
--
ALTER TABLE `device_usage`
  ADD PRIMARY KEY (`usage_id`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`employeeId`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `employee_sold_units`
--
ALTER TABLE `employee_sold_units`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `follow_up_leads`
--
ALTER TABLE `follow_up_leads`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `formtable`
--
ALTER TABLE `formtable`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `form_id` (`form_id`);

--
-- Indexes for table `invoice_company_proflie`
--
ALTER TABLE `invoice_company_proflie`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice_data`
--
ALTER TABLE `invoice_data`
  ADD PRIMARY KEY (`invoice_id`);

--
-- Indexes for table `invoice_notes`
--
ALTER TABLE `invoice_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_invoice_id` (`invoice_id`);

--
-- Indexes for table `invoice_services_data`
--
ALTER TABLE `invoice_services_data`
  ADD PRIMARY KEY (`service_invoice_id`);

--
-- Indexes for table `leads`
--
ALTER TABLE `leads`
  ADD PRIMARY KEY (`lead_id`);

--
-- Indexes for table `leadstable`
--
ALTER TABLE `leadstable`
  ADD PRIMARY KEY (`id`),
  ADD KEY `form_id` (`form_id`);

--
-- Indexes for table `leads_email`
--
ALTER TABLE `leads_email`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quotation_id` (`quotation_id`);

--
-- Indexes for table `notes_data`
--
ALTER TABLE `notes_data`
  ADD PRIMARY KEY (`notes_id`);

--
-- Indexes for table `organization`
--
ALTER TABLE `organization`
  ADD PRIMARY KEY (`companyId`);

--
-- Indexes for table `otpcollections`
--
ALTER TABLE `otpcollections`
  ADD PRIMARY KEY (`otp_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`main_project_id`);

--
-- Indexes for table `quotations_data`
--
ALTER TABLE `quotations_data`
  ADD PRIMARY KEY (`quotation_id`);

--
-- Indexes for table `quotations_information`
--
ALTER TABLE `quotations_information`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `registered_data`
--
ALTER TABLE `registered_data`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `remark`
--
ALTER TABLE `remark`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `responses_99acres`
--
ALTER TABLE `responses_99acres`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`service_id`);

--
-- Indexes for table `services_data`
--
ALTER TABLE `services_data`
  ADD PRIMARY KEY (`service_id`),
  ADD KEY `quotation_id` (`quotation_id`);

--
-- Indexes for table `todo_items`
--
ALTER TABLE `todo_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`unit_id`),
  ADD KEY `Foreign Key` (`main_project_id`) USING BTREE;

--
-- Indexes for table `unit_data`
--
ALTER TABLE `unit_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `unit_id` (`unit_id`);

--
-- Indexes for table `user_data`
--
ALTER TABLE `user_data`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `visit`
--
ALTER TABLE `visit`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `website_api`
--
ALTER TABLE `website_api`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `client_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `company_profile`
--
ALTER TABLE `company_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `contracts`
--
ALTER TABLE `contracts`
  MODIFY `contract_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `device_usage`
--
ALTER TABLE `device_usage`
  MODIFY `usage_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `employeeId` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `employee_sold_units`
--
ALTER TABLE `employee_sold_units`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `follow_up_leads`
--
ALTER TABLE `follow_up_leads`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `formtable`
--
ALTER TABLE `formtable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `invoice_company_proflie`
--
ALTER TABLE `invoice_company_proflie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `invoice_data`
--
ALTER TABLE `invoice_data`
  MODIFY `invoice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `invoice_notes`
--
ALTER TABLE `invoice_notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `invoice_services_data`
--
ALTER TABLE `invoice_services_data`
  MODIFY `service_invoice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT for table `leads`
--
ALTER TABLE `leads`
  MODIFY `lead_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=156;

--
-- AUTO_INCREMENT for table `leadstable`
--
ALTER TABLE `leadstable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=971;

--
-- AUTO_INCREMENT for table `leads_email`
--
ALTER TABLE `leads_email`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=173;

--
-- AUTO_INCREMENT for table `notes_data`
--
ALTER TABLE `notes_data`
  MODIFY `notes_id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `organization`
--
ALTER TABLE `organization`
  MODIFY `companyId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `otpcollections`
--
ALTER TABLE `otpcollections`
  MODIFY `otp_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `main_project_id` int(55) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `quotations_data`
--
ALTER TABLE `quotations_data`
  MODIFY `quotation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=271;

--
-- AUTO_INCREMENT for table `quotations_information`
--
ALTER TABLE `quotations_information`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `registered_data`
--
ALTER TABLE `registered_data`
  MODIFY `user_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `remark`
--
ALTER TABLE `remark`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `responses_99acres`
--
ALTER TABLE `responses_99acres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=225;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `service_id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `services_data`
--
ALTER TABLE `services_data`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=471;

--
-- AUTO_INCREMENT for table `todo_items`
--
ALTER TABLE `todo_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `unit_id` int(55) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `unit_data`
--
ALTER TABLE `unit_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1749;

--
-- AUTO_INCREMENT for table `user_data`
--
ALTER TABLE `user_data`
  MODIFY `user_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `visit`
--
ALTER TABLE `visit`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `website_api`
--
ALTER TABLE `website_api`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `contracts`
--
ALTER TABLE `contracts`
  ADD CONSTRAINT `contracts_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`);

--
-- Constraints for table `invoice_notes`
--
ALTER TABLE `invoice_notes`
  ADD CONSTRAINT `fk_invoice_id` FOREIGN KEY (`invoice_id`) REFERENCES `invoice_data` (`invoice_id`) ON DELETE CASCADE;

--
-- Constraints for table `leadstable`
--
ALTER TABLE `leadstable`
  ADD CONSTRAINT `leadstable_ibfk_1` FOREIGN KEY (`form_id`) REFERENCES `formtable` (`form_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
