import {
  users,
  categories,
  tools,
  blogPosts,
  type User,
  type InsertUser,
  type Category,
  type InsertCategory,
  type Tool,
  type InsertTool,
  type BlogPost,
  type InsertBlogPost,
  type ToolWithCategory,
} from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private tools: Map<number, Tool>;
  private blogPosts: Map<number, BlogPost>;
  private currentUserId: number;
  private currentCategoryId: number;
  private currentToolId: number;
  private currentBlogPostId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.tools = new Map();
    this.blogPosts = new Map();
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentToolId = 1;
    this.currentBlogPostId = 1;

    // Initialize with default categories
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Default categories
    const defaultCategories = [
      { name: "Text Tools", slug: "text-tools", description: "Tools for text manipulation and analysis", icon: "text_fields", color: "blue" },
      { name: "Image Tools", slug: "image-tools", description: "Tools for image processing and optimization", icon: "image", color: "purple" },
      { name: "PDF Tools", slug: "pdf-tools", description: "Tools for PDF manipulation and conversion", icon: "picture_as_pdf", color: "red" },
      { name: "SEO Tools", slug: "seo-tools", description: "Tools for SEO analysis and optimization", icon: "search", color: "cyan" },
    ];

    defaultCategories.forEach(cat => {
      const category: Category = { ...cat, id: this.currentCategoryId++ };
      this.categories.set(category.id, category);
    });

    // Default tools
    const defaultTools = [
      {
        title: "Word Counter",
        slug: "word-counter",
        description: "Count words, characters, paragraphs, and reading time instantly",
        categoryId: 1,
        code: "word-counter",
        metaTitle: "Word Counter Tool - Count Words and Characters Online",
        metaDescription: "Free online word counter tool. Count words, characters, paragraphs, and sentences. Perfect for writers, students, and content creators.",
        metaTags: "word count, character count, text analysis, writing tools",
        isActive: true,
        createdAt: new Date(),
      },
      {
        title: "Image Compressor",
        slug: "image-compressor",
        description: "Compress images without losing quality",
        categoryId: 2,
        code: "image-compressor",
        metaTitle: "Image Compressor - Compress Images Online Free",
        metaDescription: "Free online image compression tool. Reduce image file size without losing quality. Supports JPEG, PNG, WebP formats.",
        metaTags: "image compression, optimize images, reduce file size, image tools",
        isActive: true,
        createdAt: new Date(),
      },
      {
        title: "PDF to Word",
        slug: "pdf-to-word",
        description: "Convert PDF files to editable Word documents",
        categoryId: 3,
        code: "pdf-to-word",
        metaTitle: "PDF to Word Converter - Convert PDF to DOC Online",
        metaDescription: "Free online PDF to Word converter. Convert PDF files to editable Word documents quickly and easily.",
        metaTags: "pdf to word, pdf converter, document conversion, pdf tools",
        isActive: true,
        createdAt: new Date(),
      },
    ];

    defaultTools.forEach(tool => {
      const newTool: Tool = { ...tool, id: this.currentToolId++ };
      this.tools.set(newTool.id, newTool);
    });

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
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "How to Optimize Images for Web Without Losing Quality",
        slug: "optimize-images-web-quality",
        content: "Learn the best practices for image compression and optimization to improve your website's loading speed while maintaining visual quality...",
        excerpt: "Learn the best practices for image compression and optimization to improve your website's loading speed while maintaining visual quality.",
        metaTitle: "How to Optimize Images for Web Without Losing Quality",
        metaDescription: "Learn the best practices for image compression and optimization to improve your website's loading speed while maintaining visual quality.",
        metaTags: "image optimization, web performance, image compression",
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    defaultBlogPosts.forEach(post => {
      const newPost: BlogPost = { ...post, id: this.currentBlogPostId++ };
      this.blogPosts.set(newPost.id, newPost);
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updated: Category = { ...category, ...updateData };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Tools
  async getTools(): Promise<ToolWithCategory[]> {
    const tools = Array.from(this.tools.values());
    return tools.map(tool => ({
      ...tool,
      category: this.categories.get(tool.categoryId)!,
    }));
  }

  async getToolsByCategory(categoryId: number): Promise<ToolWithCategory[]> {
    const tools = Array.from(this.tools.values()).filter(tool => tool.categoryId === categoryId);
    return tools.map(tool => ({
      ...tool,
      category: this.categories.get(tool.categoryId)!,
    }));
  }

  async getTool(id: number): Promise<ToolWithCategory | undefined> {
    const tool = this.tools.get(id);
    if (!tool) return undefined;
    
    const category = this.categories.get(tool.categoryId);
    if (!category) return undefined;
    
    return { ...tool, category };
  }

  async getToolBySlug(slug: string): Promise<ToolWithCategory | undefined> {
    const tool = Array.from(this.tools.values()).find(t => t.slug === slug);
    if (!tool) return undefined;
    
    const category = this.categories.get(tool.categoryId);
    if (!category) return undefined;
    
    return { ...tool, category };
  }

  async createTool(insertTool: InsertTool): Promise<Tool> {
    const id = this.currentToolId++;
    const tool: Tool = { 
      ...insertTool, 
      id,
      createdAt: new Date(),
    };
    this.tools.set(id, tool);
    return tool;
  }

  async updateTool(id: number, updateData: Partial<InsertTool>): Promise<Tool | undefined> {
    const tool = this.tools.get(id);
    if (!tool) return undefined;
    
    const updated: Tool = { ...tool, ...updateData };
    this.tools.set(id, updated);
    return updated;
  }

  async deleteTool(id: number): Promise<boolean> {
    return this.tools.delete(id);
  }

  // Blog Posts
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.isPublished)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const post: BlogPost = { 
      ...insertPost, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: number, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;
    
    const updated: BlogPost = { 
      ...post, 
      ...updateData,
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }
}

export const storage = new MemStorage();
