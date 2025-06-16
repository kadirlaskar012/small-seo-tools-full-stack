import {
  users,
  categories,
  tools,
  blogPosts,
  siteSettings,
  admins,
  toolUsage,
  similarTools,
  uploadedFiles,
  schemaTemplates,
  pageSchemas,
  toolIcons,
  siteBranding,
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
  type ToolWithUsage,
  type ToolUsage,
  type InsertToolUsage,
  type SimilarTool,
  type InsertSimilarTool,
  type UploadedFile,
  type InsertUploadedFile,
  type SchemaTemplate,
  type InsertSchemaTemplate,
  type PageSchema,
  type InsertPageSchema,
  type ToolIcon,
  type InsertToolIcon,
  type SiteBranding,
  type InsertSiteBranding,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

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

  // Tool Usage Analytics
  getToolUsage(toolId: number): Promise<ToolUsage | undefined>;
  incrementToolUsage(toolId: number): Promise<void>;
  getPopularTools(limit?: number): Promise<ToolWithUsage[]>;

  // Similar Tools
  getSimilarTools(toolId: number): Promise<ToolWithCategory[]>;
  setSimilarTools(toolId: number, similarToolIds: number[]): Promise<void>;

  // File Uploads
  getUploadedFiles(): Promise<UploadedFile[]>;
  getUploadedFile(id: number): Promise<UploadedFile | undefined>;
  getUploadedFileByName(filename: string): Promise<UploadedFile | undefined>;
  createUploadedFile(file: InsertUploadedFile): Promise<UploadedFile>;
  deleteUploadedFile(id: number): Promise<boolean>;

  // Schema Templates
  getSchemaTemplates(): Promise<SchemaTemplate[]>;
  getSchemaTemplate(id: number): Promise<SchemaTemplate | undefined>;
  createSchemaTemplate(template: InsertSchemaTemplate): Promise<SchemaTemplate>;
  updateSchemaTemplate(id: number, template: Partial<InsertSchemaTemplate>): Promise<SchemaTemplate | undefined>;
  deleteSchemaTemplate(id: number): Promise<boolean>;

  // Page Schemas
  getPageSchemas(): Promise<PageSchema[]>;
  getPageSchema(pageType: string, pageId?: number): Promise<PageSchema | undefined>;
  createPageSchema(schema: InsertPageSchema): Promise<PageSchema>;
  updatePageSchema(id: number, schema: Partial<InsertPageSchema>): Promise<PageSchema | undefined>;
  deletePageSchema(id: number): Promise<boolean>;

  // Tool Icons
  getToolIcons(): Promise<ToolIcon[]>;
  getToolIcon(toolId: number): Promise<ToolIcon | undefined>;
  createToolIcon(icon: InsertToolIcon): Promise<ToolIcon>;
  updateToolIcon(toolId: number, icon: Partial<InsertToolIcon>): Promise<ToolIcon | undefined>;
  deleteToolIcon(toolId: number): Promise<boolean>;

  // Site Branding
  getSiteBranding(): Promise<SiteBranding[]>;
  getSiteBrandingByType(type: string): Promise<SiteBranding | undefined>;
  createSiteBranding(branding: InsertSiteBranding): Promise<SiteBranding>;
  updateSiteBranding(id: number, branding: Partial<InsertSiteBranding>): Promise<SiteBranding | undefined>;
  deleteSiteBranding(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async initializeDefaultData() {
    // Clear existing data for fresh initialization
    await db.delete(tools);
    await db.delete(categories);
    console.log('Cleared existing data, initializing new 30-tool database...');

    // Import new curated tools data
    const { NEW_TOOL_CATEGORIES, getAllNewTools } = await import('../src/data/new-tools-data');
    
    // Insert all 10 categories first
    for (const category of NEW_TOOL_CATEGORIES) {
      await db.insert(categories).values({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        color: category.color
      });
    }

    // Get all 30 curated tools
    const allTools = getAllNewTools();
    console.log(`Inserting ${allTools.length} curated tools across ${NEW_TOOL_CATEGORIES.length} categories...`);

    // Insert all tools at once since there are only 30
    const toolsData = allTools.map(tool => ({
      title: tool.title,
      slug: tool.slug,
      description: tool.description,
      categoryId: tool.categoryId,
      code: tool.code,
      metaTitle: tool.metaTitle,
      metaDescription: tool.metaDescription,
      metaTags: tool.keywords,
      image: null,
      isActive: true,
    }));
    
    await db.insert(tools).values(toolsData);
    console.log('Successfully inserted all 30 curated tools!');

    // Check if blog posts already exist to avoid duplicates
    const existingBlogPosts = await db.select().from(blogPosts);
    if (existingBlogPosts.length === 0) {
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
    return (result.rowCount || 0) > 0;
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
    return (result.rowCount || 0) > 0;
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
    return (result.rowCount || 0) > 0;
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

  // Tool Usage Analytics
  async getToolUsage(toolId: number): Promise<ToolUsage | undefined> {
    const [usage] = await db.select().from(toolUsage).where(eq(toolUsage.toolId, toolId));
    return usage || undefined;
  }

  async incrementToolUsage(toolId: number): Promise<void> {
    await db
      .insert(toolUsage)
      .values({ toolId, usageCount: 1, lastUsed: new Date() })
      .onConflictDoUpdate({
        target: toolUsage.toolId,
        set: {
          usageCount: sql`${toolUsage.usageCount} + 1`,
          lastUsed: new Date(),
        },
      });
  }

  async getPopularTools(limit: number = 10): Promise<ToolWithUsage[]> {
    const results = await db
      .select({
        id: tools.id,
        title: tools.title,
        slug: tools.slug,
        description: tools.description,
        code: tools.code,
        metaTitle: tools.metaTitle,
        metaDescription: tools.metaDescription,
        metaTags: tools.metaTags,
        image: tools.image,
        categoryId: tools.categoryId,
        isActive: tools.isActive,
        createdAt: tools.createdAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          color: categories.color,
          icon: categories.icon,
        },
        usageCount: toolUsage.usageCount,
      })
      .from(tools)
      .leftJoin(categories, eq(tools.categoryId, categories.id))
      .leftJoin(toolUsage, eq(tools.id, toolUsage.toolId))
      .where(eq(tools.isActive, true))
      .orderBy(desc(toolUsage.usageCount))
      .limit(limit);
    
    return results.map(result => ({
      ...result,
      category: result.category!,
      usageCount: result.usageCount || 0,
    }));
  }

  // Similar Tools
  async getSimilarTools(toolId: number): Promise<ToolWithCategory[]> {
    const results = await db
      .select({
        id: tools.id,
        title: tools.title,
        slug: tools.slug,
        description: tools.description,
        code: tools.code,
        metaTitle: tools.metaTitle,
        metaDescription: tools.metaDescription,
        metaTags: tools.metaTags,
        image: tools.image,
        categoryId: tools.categoryId,
        isActive: tools.isActive,
        createdAt: tools.createdAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          color: categories.color,
          icon: categories.icon,
        },
      })
      .from(similarTools)
      .innerJoin(tools, eq(similarTools.similarToolId, tools.id))
      .innerJoin(categories, eq(tools.categoryId, categories.id))
      .where(eq(similarTools.toolId, toolId))
      .orderBy(desc(similarTools.priority));

    // If no manually set similar tools, get tools from same category
    if (results.length === 0) {
      const tool = await this.getTool(toolId);
      if (tool) {
        const categoryTools = await this.getToolsByCategory(tool.categoryId);
        return categoryTools.filter(t => t.id !== toolId).slice(0, 6);
      }
    }

    return results.map(result => ({
      ...result,
      category: result.category!,
    }));
  }

  async setSimilarTools(toolId: number, similarToolIds: number[]): Promise<void> {
    // Delete existing similar tools
    await db.delete(similarTools).where(eq(similarTools.toolId, toolId));
    
    // Insert new similar tools
    if (similarToolIds.length > 0) {
      await db.insert(similarTools).values(
        similarToolIds.map((similarToolId, index) => ({
          toolId,
          similarToolId,
          priority: similarToolIds.length - index, // Higher priority for earlier items
        }))
      );
    }
  }

  // File Uploads
  async getUploadedFiles(): Promise<UploadedFile[]> {
    return await db.select().from(uploadedFiles).orderBy(desc(uploadedFiles.createdAt));
  }

  async getUploadedFile(id: number): Promise<UploadedFile | undefined> {
    const [file] = await db.select().from(uploadedFiles).where(eq(uploadedFiles.id, id));
    return file || undefined;
  }

  async getUploadedFileByName(filename: string): Promise<UploadedFile | undefined> {
    const [file] = await db.select().from(uploadedFiles).where(eq(uploadedFiles.filename, filename));
    return file || undefined;
  }

  async createUploadedFile(file: InsertUploadedFile): Promise<UploadedFile> {
    const [result] = await db
      .insert(uploadedFiles)
      .values(file)
      .returning();
    return result;
  }

  async deleteUploadedFile(id: number): Promise<boolean> {
    const result = await db.delete(uploadedFiles).where(eq(uploadedFiles.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Schema Templates
  async getSchemaTemplates(): Promise<SchemaTemplate[]> {
    return await db.select().from(schemaTemplates).orderBy(desc(schemaTemplates.createdAt));
  }

  async getSchemaTemplate(id: number): Promise<SchemaTemplate | undefined> {
    const [template] = await db.select().from(schemaTemplates).where(eq(schemaTemplates.id, id));
    return template || undefined;
  }

  async createSchemaTemplate(template: InsertSchemaTemplate): Promise<SchemaTemplate> {
    const [result] = await db
      .insert(schemaTemplates)
      .values(template)
      .returning();
    return result;
  }

  async updateSchemaTemplate(id: number, updateData: Partial<InsertSchemaTemplate>): Promise<SchemaTemplate | undefined> {
    const [result] = await db
      .update(schemaTemplates)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(schemaTemplates.id, id))
      .returning();
    return result || undefined;
  }

  async deleteSchemaTemplate(id: number): Promise<boolean> {
    const result = await db.delete(schemaTemplates).where(eq(schemaTemplates.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Page Schemas
  async getPageSchemas(): Promise<PageSchema[]> {
    return await db.select().from(pageSchemas).orderBy(desc(pageSchemas.createdAt));
  }

  async getPageSchema(pageType: string, pageId?: number): Promise<PageSchema | undefined> {
    let query = db.select().from(pageSchemas).where(eq(pageSchemas.pageType, pageType));
    
    if (pageId !== undefined) {
      query = query.where(eq(pageSchemas.pageId, pageId));
    }
    
    const [schema] = await query;
    return schema || undefined;
  }

  async createPageSchema(schema: InsertPageSchema): Promise<PageSchema> {
    const [result] = await db
      .insert(pageSchemas)
      .values(schema)
      .returning();
    return result;
  }

  async updatePageSchema(id: number, updateData: Partial<InsertPageSchema>): Promise<PageSchema | undefined> {
    const [result] = await db
      .update(pageSchemas)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(pageSchemas.id, id))
      .returning();
    return result || undefined;
  }

  async deletePageSchema(id: number): Promise<boolean> {
    const result = await db.delete(pageSchemas).where(eq(pageSchemas.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Tool Icons
  async getToolIcons(): Promise<ToolIcon[]> {
    return await db.select().from(toolIcons).orderBy(toolIcons.createdAt);
  }

  async getToolIcon(toolId: number): Promise<ToolIcon | undefined> {
    const [icon] = await db.select().from(toolIcons).where(eq(toolIcons.toolId, toolId));
    return icon || undefined;
  }

  async createToolIcon(icon: InsertToolIcon): Promise<ToolIcon> {
    const [result] = await db
      .insert(toolIcons)
      .values(icon)
      .returning();
    return result;
  }

  async updateToolIcon(toolId: number, updateData: Partial<InsertToolIcon>): Promise<ToolIcon | undefined> {
    const [result] = await db
      .update(toolIcons)
      .set(updateData)
      .where(eq(toolIcons.toolId, toolId))
      .returning();
    return result || undefined;
  }

  async deleteToolIcon(toolId: number): Promise<boolean> {
    const result = await db.delete(toolIcons).where(eq(toolIcons.toolId, toolId));
    return (result.rowCount || 0) > 0;
  }

  async getSiteBranding(): Promise<SiteBranding[]> {
    return await db.select().from(siteBranding).orderBy(siteBranding.createdAt);
  }

  async getSiteBrandingByType(type: string): Promise<SiteBranding | undefined> {
    const [result] = await db
      .select()
      .from(siteBranding)
      .where(eq(siteBranding.type, type))
      .orderBy(siteBranding.createdAt)
      .limit(1);
    return result || undefined;
  }

  async createSiteBranding(branding: InsertSiteBranding): Promise<SiteBranding> {
    const [result] = await db
      .insert(siteBranding)
      .values(branding)
      .returning();
    return result;
  }

  async updateSiteBranding(id: number, updateData: Partial<InsertSiteBranding>): Promise<SiteBranding | undefined> {
    const [result] = await db
      .update(siteBranding)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(siteBranding.id, id))
      .returning();
    return result || undefined;
  }

  async deleteSiteBranding(id: number): Promise<boolean> {
    const result = await db.delete(siteBranding).where(eq(siteBranding.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Tool Articles Management
  async getToolArticle(toolId: number): Promise<ToolArticle | undefined> {
    try {
      const [article] = await db.select().from(toolArticles).where(eq(toolArticles.toolId, toolId));
      return article;
    } catch (error) {
      console.error("Error fetching tool article:", error);
      return undefined;
    }
  }

  async getAllToolArticles(): Promise<ToolArticle[]> {
    try {
      return await db.select().from(toolArticles).orderBy(desc(toolArticles.createdAt));
    } catch (error) {
      console.error("Error fetching tool articles:", error);
      return [];
    }
  }

  async createToolArticle(article: InsertToolArticle): Promise<ToolArticle> {
    try {
      const [newArticle] = await db.insert(toolArticles).values({
        ...article,
        updatedAt: new Date()
      }).returning();
      return newArticle;
    } catch (error) {
      console.error("Error creating tool article:", error);
      throw error;
    }
  }

  async updateToolArticle(toolId: number, article: Partial<InsertToolArticle>): Promise<ToolArticle> {
    try {
      const [updatedArticle] = await db.update(toolArticles)
        .set({
          ...article,
          updatedAt: new Date()
        })
        .where(eq(toolArticles.toolId, toolId))
        .returning();
      return updatedArticle;
    } catch (error) {
      console.error("Error updating tool article:", error);
      throw error;
    }
  }

  async deleteToolArticle(toolId: number): Promise<void> {
    try {
      await db.delete(toolArticles).where(eq(toolArticles.toolId, toolId));
    } catch (error) {
      console.error("Error deleting tool article:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
