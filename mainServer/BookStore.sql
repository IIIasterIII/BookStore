CREATE DATABASE BookStore;
USE BookStore;

CREATE TABLE `comments` (
  `id_c` int(11) NOT NULL,
  `user_id_fk` int(11) DEFAULT NULL,
  `text` varchar(255) NOT NULL,
  `group_id` varchar(255) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `decoration_purchase_history` (
  `int_d_p_h` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id_fk` int(11) DEFAULT NULL,
  `item_id` varchar(155) DEFAULT NULL,
  `sum` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `profiles` (
  `profile_id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `surname` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `country` varchar(150) DEFAULT NULL,
  `banner_url` varchar(255) DEFAULT NULL,
  `border_url` varchar(255) DEFAULT NULL,
  `background_url` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `last_update_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id_fk` int(11) DEFAULT NULL,
  `money` double DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `hash_password` varchar(255) NOT NULL,
  `registered_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `user_decoration` (
  `id_u_d` int(11) NOT NULL,
  `user_id_fk` int(11) DEFAULT NULL,
  `type` enum('border','avatar','banner') DEFAULT NULL,
  `item_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `user_refills` (
  `id_r` int(11) NOT NULL,
  `sum` double DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id_fk` int(11) DEFAULT NULL,
  `euro` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `comments`
  ADD PRIMARY KEY (`id_c`),
  ADD KEY `user_id_fk` (`user_id_fk`);

ALTER TABLE `decoration_purchase_history`
  ADD PRIMARY KEY (`int_d_p_h`),
  ADD KEY `user_id_fk` (`user_id_fk`);

ALTER TABLE `profiles`
  ADD PRIMARY KEY (`profile_id`),
  ADD KEY `user_id_fk` (`user_id_fk`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `unique_email` (`email`),
  ADD UNIQUE KEY `unique_username` (`username`);

ALTER TABLE `user_decoration`
  ADD PRIMARY KEY (`id_u_d`),
  ADD KEY `user_id_fk` (`user_id_fk`);

ALTER TABLE `user_refills`
  ADD PRIMARY KEY (`id_r`),
  ADD KEY `user_id_fk` (`user_id_fk`);

ALTER TABLE `comments`
  MODIFY `id_c` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

ALTER TABLE `decoration_purchase_history`
  MODIFY `int_d_p_h` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

ALTER TABLE `profiles`
  MODIFY `profile_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

ALTER TABLE `user_decoration`
  MODIFY `id_u_d` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

ALTER TABLE `user_refills`
  MODIFY `id_r` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id_fk`) REFERENCES `users` (`user_id`);

ALTER TABLE `decoration_purchase_history`
  ADD CONSTRAINT `decoration_purchase_history_ibfk_1` FOREIGN KEY (`user_id_fk`) REFERENCES `users` (`user_id`);

ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`user_id_fk`) REFERENCES `users` (`user_id`);

ALTER TABLE `user_decoration`
  ADD CONSTRAINT `user_decoration_ibfk_1` FOREIGN KEY (`user_id_fk`) REFERENCES `users` (`user_id`);

ALTER TABLE `user_refills`
  ADD CONSTRAINT `user_refills_ibfk_1` FOREIGN KEY (`user_id_fk`) REFERENCES `users` (`user_id`);
COMMIT;
