PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_advert` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`price` integer NOT NULL,
	`category` text NOT NULL,
	`status` text NOT NULL,
	`seller` text NOT NULL,
	`email` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_advert`("id", "title", "description", "price", "category", "status", "seller", "email") SELECT "id", "title", "description", "price", "category", "status", "seller", "email" FROM `advert`;--> statement-breakpoint
DROP TABLE `advert`;--> statement-breakpoint
ALTER TABLE `__new_advert` RENAME TO `advert`;--> statement-breakpoint
PRAGMA foreign_keys=ON;