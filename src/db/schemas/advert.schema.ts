import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const advert = sqliteTable("advert", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  title: text("title").notNull(),

  description: text("description").notNull(),

  price: integer("price").notNull(),

  category: text("category").notNull(),

  status: text("status").notNull(),

  seller: text("seller").notNull(),

  email: text("email").notNull(),

  image: text("image"),
});

export type Advert = typeof advert.$inferSelect;
