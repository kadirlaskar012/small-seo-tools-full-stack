import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon").notNull().default("build"),
  color: text("color").notNull().default("blue"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  code: text("code").notNull(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaTags: text("meta_tags"),
  image: text("image"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaTags: text("meta_tags"),
  image: text("image"),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tool usage analytics
export const toolUsage = pgTable("tool_usage", {
  id: serial("id").primaryKey(),
  toolId: integer("tool_id").references(() => tools.id, { onDelete: "cascade" }),
  usageCount: integer("usage_count").default(0),
  lastUsed: timestamp("last_used").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Similar tools relationships
export const similarTools = pgTable("similar_tools", {
  id: serial("id").primaryKey(),
  toolId: integer("tool_id").references(() => tools.id, { onDelete: "cascade" }),
  similarToolId: integer("similar_tool_id").references(() => tools.id, { onDelete: "cascade" }),
  priority: integer("priority").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// File uploads for static files
export const uploadedFiles = pgTable("uploaded_files", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }),
  size: integer("size"),
  path: varchar("path", { length: 500 }).notNull(),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema Markup System
export const schemaTemplates = pgTable("schema_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  schemaType: varchar("schema_type", { length: 50 }).notNull(), // Article, WebPage, Tool, FAQ, Product, LocalBusiness
  isGlobal: boolean("is_global").default(false),
  isActive: boolean("is_active").default(true),
  schemaData: jsonb("schema_data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pageSchemas = pgTable("page_schemas", {
  id: serial("id").primaryKey(),
  pageType: varchar("page_type", { length: 50 }).notNull(), // tool, blog, category, home
  pageId: integer("page_id"), // references tool.id, blogPost.id, category.id, etc.
  schemaTemplateId: integer("schema_template_id").references(() => schemaTemplates.id),
  customSchemaData: jsonb("custom_schema_data"), // override template data
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tool Icons System
export const toolIcons = pgTable("tool_icons", {
  id: serial("id").primaryKey(),
  toolId: integer("tool_id").references(() => tools.id).notNull(),
  iconType: varchar("icon_type", { length: 20 }).default("emoji"), // emoji, lucide, custom
  iconData: varchar("icon_data", { length: 100 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Site Branding System
export const siteBranding = pgTable("site_branding", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 20 }).notNull(), // 'logo' or 'nav_icon'
  name: text("name").notNull(),
  fileData: text("file_data").notNull(), // Base64 encoded file data
  fileType: varchar("file_type", { length: 50 }).notNull(), // 'image/png', 'image/svg+xml', etc.
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertToolSchema = createInsertSchema(tools).omit({
  id: true,
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
});

export const insertToolUsageSchema = createInsertSchema(toolUsage).omit({
  id: true,
  createdAt: true,
});

export const insertSimilarToolSchema = createInsertSchema(similarTools).omit({
  id: true,
  createdAt: true,
});

export const insertUploadedFileSchema = createInsertSchema(uploadedFiles).omit({
  id: true,
  createdAt: true,
});

export const insertSchemaTemplateSchema = createInsertSchema(schemaTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPageSchemaSchema = createInsertSchema(pageSchemas).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertToolIconSchema = createInsertSchema(toolIcons).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Tool = typeof tools.$inferSelect;
export type InsertTool = z.infer<typeof insertToolSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;

export type ToolUsage = typeof toolUsage.$inferSelect;
export type InsertToolUsage = z.infer<typeof insertToolUsageSchema>;

export type SimilarTool = typeof similarTools.$inferSelect;
export type InsertSimilarTool = z.infer<typeof insertSimilarToolSchema>;

export type UploadedFile = typeof uploadedFiles.$inferSelect;
export type InsertUploadedFile = z.infer<typeof insertUploadedFileSchema>;

export type SchemaTemplate = typeof schemaTemplates.$inferSelect;
export type InsertSchemaTemplate = z.infer<typeof insertSchemaTemplateSchema>;

export type PageSchema = typeof pageSchemas.$inferSelect;
export type InsertPageSchema = z.infer<typeof insertPageSchemaSchema>;

export type ToolIcon = typeof toolIcons.$inferSelect;
export type InsertToolIcon = z.infer<typeof insertToolIconSchema>;

export const insertSiteBrandingSchema = createInsertSchema(siteBranding).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type SiteBranding = typeof siteBranding.$inferSelect;
export type InsertSiteBranding = z.infer<typeof insertSiteBrandingSchema>;

export type ToolWithCategory = Tool & { category: Category };
export type ToolWithUsage = Tool & { category: Category; usageCount?: number };
export type ToolWithIcon = Tool & { category: Category; icon?: ToolIcon };
