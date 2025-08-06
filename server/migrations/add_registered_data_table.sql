-- Migration to create registered_data table for OAuth support
-- Run this SQL script to add the registered_data table if it doesn't exist

CREATE TABLE IF NOT EXISTS `registered_data` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `roles` enum('Super-Admin', 'Admin', 'Employee') NOT NULL DEFAULT 'Super-Admin',
  `status` enum('active', 'inactive') NOT NULL DEFAULT 'active',
  `is_oauth` tinyint(1) NOT NULL DEFAULT 0,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Add OAuth column to existing registered_data table if it exists but doesn't have is_oauth column
-- This is safe to run even if the column already exists
ALTER TABLE `registered_data` 
ADD COLUMN IF NOT EXISTS `is_oauth` tinyint(1) NOT NULL DEFAULT 0 AFTER `status`;

-- Add created_date column if it doesn't exist
ALTER TABLE `registered_data` 
ADD COLUMN IF NOT EXISTS `created_date` timestamp NOT NULL DEFAULT current_timestamp() AFTER `is_oauth`;

-- Add updated_date column if it doesn't exist
ALTER TABLE `registered_data` 
ADD COLUMN IF NOT EXISTS `updated_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() AFTER `created_date`;

-- Insert a default Super Admin user for testing (optional)
-- Password is 'admin123' hashed with bcrypt
-- INSERT IGNORE INTO `registered_data` (`user_name`, `email`, `password`, `roles`, `status`, `is_oauth`) 
-- VALUES ('Super Admin', 'admin@doaguru.com', '$2b$10$rOzJqQZJqQZJqQZJqQZJqOzJqQZJqQZJqQZJqQZJqQZJqQZJqQZJq', 'Super-Admin', 'active', 0);
