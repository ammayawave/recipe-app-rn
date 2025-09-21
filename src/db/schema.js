import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  recipeId: integer("recipe_id").notNull(),
  title: text("title").notNull(),
  image: text("image").notNull(),
  cookTime: integer("cook_time"),
  servings: integer("servings"),
  createdAt: timestamp("created_at").defaultNow(),
});
