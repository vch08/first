CREATE TABLE `advert` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`price` text NOT NULL,
	`category` text NOT NULL,
	`status` text NOT NULL,
	`seller` text NOT NULL
);
