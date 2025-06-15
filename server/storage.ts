import {
  users,
  categories,
  tools,
  blogPosts,
  siteSettings,
  admins,
  type User,
  type InsertUser,
  type Category,
  type InsertCategory,
  type Tool,
  type InsertTool,
  type BlogPost,
  type InsertBlogPost,
  type SiteSetting,
  type InsertSiteSetting,
  type Admin,
  type InsertAdmin,
  type ToolWithCategory,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Tools
  getTools(): Promise<ToolWithCategory[]>;
  getToolsByCategory(categoryId: number): Promise<ToolWithCategory[]>;
  getTool(id: number): Promise<ToolWithCategory | undefined>;
  getToolBySlug(slug: string): Promise<ToolWithCategory | undefined>;
  createTool(tool: InsertTool): Promise<Tool>;
  updateTool(id: number, tool: Partial<InsertTool>): Promise<Tool | undefined>;
  deleteTool(id: number): Promise<boolean>;

  // Blog Posts
  getBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Site Settings
  getSiteSettings(): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  setSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;

  // Admins
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
}

export class DatabaseStorage implements IStorage {
  async initializeDefaultData() {
    // Check if data already exists
    const existingCategories = await db.select().from(categories);
    if (existingCategories.length > 0) {
      return; // Data already exists
    }

    // Default categories
    const defaultCategories = [
      { name: "Text Tools", slug: "text-tools", description: "Tools for text manipulation and analysis", icon: "text_fields", color: "blue" },
      { name: "Image Tools", slug: "image-tools", description: "Tools for image processing and optimization", icon: "image", color: "purple" },
      { name: "PDF Tools", slug: "pdf-tools", description: "Tools for PDF manipulation and conversion", icon: "picture_as_pdf", color: "red" },
      { name: "SEO Tools", slug: "seo-tools", description: "Tools for SEO analysis and optimization", icon: "search", color: "cyan" },
    ];

    const insertedCategories = await db.insert(categories).values(defaultCategories).returning();

    // Default tools
    const defaultTools = [
      {
        title: "Word Counter",
        slug: "word-counter",
        description: "Count words, characters, paragraphs, and reading time instantly",
        categoryId: insertedCategories[0].id,
        code: "word-counter",
        metaTitle: "Word Counter Tool - Count Words and Characters Online",
        metaDescription: "Free online word counter tool. Count words, characters, paragraphs, and sentences. Perfect for writers, students, and content creators.",
        metaTags: "word count, character count, text analysis, writing tools",
        image: null,
        isActive: true,
      },
      {
        title: "Image Compressor",
        slug: "image-compressor",
        description: "Compress images without losing quality",
        categoryId: insertedCategories[1].id,
        code: "image-compressor",
        metaTitle: "Image Compressor - Compress Images Online Free",
        metaDescription: "Free online image compression tool. Reduce image file size without losing quality. Supports JPEG, PNG, WebP formats.",
        metaTags: "image compression, optimize images, reduce file size, image tools",
        image: null,
        isActive: true,
      },
      {
        title: "PDF to Word",
        slug: "pdf-to-word",
        description: "Convert PDF files to editable Word documents",
        categoryId: insertedCategories[2].id,
        code: "pdf-to-word",
        metaTitle: "PDF to Word Converter - Convert PDF to DOC Online",
        metaDescription: "Free online PDF to Word converter. Convert PDF files to editable Word documents quickly and easily.",
        metaTags: "pdf to word, pdf converter, document conversion, pdf tools",
        image: null,
        isActive: true,
      },
    ];

    await db.insert(tools).values(defaultTools);

    // Default blog posts
    const defaultBlogPosts = [
      {
        title: "10 Essential SEO Tools Every Website Owner Should Use",
        slug: "essential-seo-tools-website-owners",
        content: "Discover the must-have SEO tools that will help boost your website's search engine rankings and drive more organic traffic...",
        excerpt: "Discover the must-have SEO tools that will help boost your website's search engine rankings and drive more organic traffic.",
        metaTitle: "10 Essential SEO Tools Every Website Owner Should Use",
        metaDescription: "Discover the must-have SEO tools that will help boost your website's search engine rankings and drive more organic traffic.",
        metaTags: "seo tools, website optimization, search engine rankings",
        image: null,
        isPublished: true,
      },
      {
        title: "How to Optimize Images for Web Without Losing Quality",
        slug: "optimize-images-web-quality",
        content: "Learn the best practices for image compression and optimization to improve your website's loading speed while maintaining visual quality...",
        excerpt: "Learn the best practices for image compression and optimization to improve your website's loading speed while maintaining visual quality.",
        metaTitle: "How to Optimize Images for Web Without Losing Quality",
        metaDescription: "Learn the best practices for image compression and optimization to improve your website's loading speed while maintaining visual quality.",
        metaTags: "image optimization, web performance, image compression",
        image: null,
        isPublished: true,
      },
    ];

    await db.insert(blogPosts).values(defaultBlogPosts);
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async updateCategory(id: number, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount > 0;
  }

  // Tools
  async getTools(): Promise<ToolWithCategory[]> {
    const results = await db
      .select()
      .from(tools)
      .leftJoin(categories, eq(tools.categoryId, categories.id));
    
    return results.map(row => ({
      ...row.tools,
      category: row.categories!,
    }));
  }

  async getToolsByCategory(categoryId: number): Promise<ToolWithCategory[]> {
    const results = await db
      .select()
      .from(tools)
      .leftJoin(categories, eq(tools.categoryId, categories.id))
      .where(eq(tools.categoryId, categoryId));
    
    return results.map(row => ({
      ...row.tools,
      category: row.categories!,
    }));
  }

  async getTool(id: number): Promise<ToolWithCategory | undefined> {
    const [result] = await db
      .select()
      .from(tools)
      .leftJoin(categories, eq(tools.categoryId, categories.id))
      .where(eq(tools.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.tools,
      category: result.categories!,
    };
  }

  async getToolBySlug(slug: string): Promise<ToolWithCategory | undefined> {
    const [result] = await db
      .select()
      .from(tools)
      .leftJoin(categories, eq(tools.categoryId, categories.id))
      .where(eq(tools.slug, slug));
    
    if (!result) return undefined;
    
    return {
      ...result.tools,
      category: result.categories!,
    };
  }

  async createTool(insertTool: InsertTool): Promise<Tool> {
    const [tool] = await db
      .insert(tools)
      .values(insertTool)
      .returning();
    return tool;
  }

  async updateTool(id: number, updateData: Partial<InsertTool>): Promise<Tool | undefined> {
    const [updated] = await db
      .update(tools)
      .set(updateData)
      .where(eq(tools.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteTool(id: number): Promise<boolean> {
    const result = await db.delete(tools).where(eq(tools.id, id));
    return result.rowCount > 0;
  }

  // Blog Posts
  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(blogPosts.createdAt);
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(blogPosts.createdAt);
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db
      .insert(blogPosts)
      .values(insertPost)
      .returning();
    return post;
  }

  async updateBlogPost(id: number, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db
      .update(blogPosts)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount > 0;
  }

  // Site Settings
  async getSiteSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings);
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting || undefined;
  }

  async setSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const [result] = await db
      .insert(siteSettings)
      .values(setting)
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: {
          value: setting.value,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }

  // Admins
  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin || undefined;
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const [result] = await db
      .insert(admins)
      .values(admin)
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
