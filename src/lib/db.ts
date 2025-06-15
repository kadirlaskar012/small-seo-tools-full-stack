import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../../shared/schema";
import { eq, desc, sql } from "drizzle-orm";
import { TOOL_CATEGORIES, getAllTools } from '../data/tools-data';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Initialize database with tools data
export async function initializeDatabase() {
  try {
    console.log('Initializing comprehensive tools database...');
    
    // Clear existing data for fresh initialization
    await db.delete(schema.tools);
    await db.delete(schema.categories);
    
    // Insert all 10 categories
    for (const category of TOOL_CATEGORIES) {
      await db.insert(schema.categories).values({
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        color: category.color
      });
    }
    
    // Insert all 320+ tools
    const allTools = getAllTools();
    console.log(`Inserting ${allTools.length} tools...`);
    
    for (const tool of allTools) {
      await db.insert(schema.tools).values({
        title: tool.title,
        slug: tool.slug,
        description: tool.description,
        categoryId: tool.categoryId,
        code: tool.slug,
        metaTitle: tool.metaTitle,
        metaDescription: tool.metaDescription,
        metaTags: tool.metaTags,
        isActive: true
      });
    }
    
    // Check if site settings exist
    const existingSettings = await db.select().from(schema.siteSettings);
    if (existingSettings.length === 0) {
      const defaultSettings = [
        { key: 'site_name', value: 'SEO Tools Pro' },
        { key: 'site_description', value: 'Free online SEO tools for webmasters and digital marketers' },
        { key: 'site_logo', value: '' },
        { key: 'site_favicon', value: '' },
        { key: 'google_analytics_id', value: '' },
        { key: 'google_adsense_id', value: '' },
        { key: 'google_verification', value: '' }
      ];
      
      for (const setting of defaultSettings) {
        await db.insert(schema.siteSettings).values(setting);
      }
    }
    
    console.log(`Database initialized with ${allTools.length} tools across ${TOOL_CATEGORIES.length} categories`);
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Database query functions
export async function getCategories() {
  return await db.select().from(schema.categories).where(eq(schema.categories.isActive, true));
}

export async function getTools() {
  const results = await db
    .select({
      id: schema.tools.id,
      title: schema.tools.title,
      slug: schema.tools.slug,
      description: schema.tools.description,
      code: schema.tools.code,
      metaTitle: schema.tools.metaTitle,
      metaDescription: schema.tools.metaDescription,
      metaTags: schema.tools.metaTags,
      categoryId: schema.tools.categoryId,
      isActive: schema.tools.isActive,
      createdAt: schema.tools.createdAt,
      category: {
        id: schema.categories.id,
        name: schema.categories.name,
        slug: schema.categories.slug,
        description: schema.categories.description,
        color: schema.categories.color,
        icon: schema.categories.icon,
        isActive: schema.categories.isActive
      }
    })
    .from(schema.tools)
    .leftJoin(schema.categories, eq(schema.tools.categoryId, schema.categories.id))
    .where(eq(schema.tools.isActive, true));
    
  return results.map(result => ({
    ...result,
    category: result.category!
  }));
}

export async function getToolBySlug(slug: string) {
  const [tool] = await db
    .select({
      id: schema.tools.id,
      title: schema.tools.title,
      slug: schema.tools.slug,
      description: schema.tools.description,
      code: schema.tools.code,
      metaTitle: schema.tools.metaTitle,
      metaDescription: schema.tools.metaDescription,
      metaTags: schema.tools.metaTags,
      categoryId: schema.tools.categoryId,
      isActive: schema.tools.isActive,
      createdAt: schema.tools.createdAt,
      category: {
        id: schema.categories.id,
        name: schema.categories.name,
        slug: schema.categories.slug,
        description: schema.categories.description,
        color: schema.categories.color,
        icon: schema.categories.icon,
        isActive: schema.categories.isActive
      }
    })
    .from(schema.tools)
    .leftJoin(schema.categories, eq(schema.tools.categoryId, schema.categories.id))
    .where(eq(schema.tools.slug, slug));
    
  if (!tool) return null;
  
  return {
    ...tool,
    category: tool.category!
  };
}

export async function getSimilarTools(toolId: number, limit = 6) {
  const tool = await db.select().from(schema.tools).where(eq(schema.tools.id, toolId));
  if (!tool[0]) return [];
  
  const similarTools = await db
    .select({
      id: schema.tools.id,
      title: schema.tools.title,
      slug: schema.tools.slug,
      description: schema.tools.description,
      code: schema.tools.code,
      metaTitle: schema.tools.metaTitle,
      metaDescription: schema.tools.metaDescription,
      metaTags: schema.tools.metaTags,
      categoryId: schema.tools.categoryId,
      isActive: schema.tools.isActive,
      createdAt: schema.tools.createdAt,
      category: {
        id: schema.categories.id,
        name: schema.categories.name,
        slug: schema.categories.slug,
        description: schema.categories.description,
        color: schema.categories.color,
        icon: schema.categories.icon,
        isActive: schema.categories.isActive
      }
    })
    .from(schema.tools)
    .leftJoin(schema.categories, eq(schema.tools.categoryId, schema.categories.id))
    .where(eq(schema.tools.categoryId, tool[0].categoryId))
    .limit(limit + 1);
    
  return similarTools
    .filter(t => t.id !== toolId)
    .slice(0, limit)
    .map(result => ({
      ...result,
      category: result.category!
    }));
}

export async function getSiteSettings() {
  return await db.select().from(schema.siteSettings);
}

export async function getBlogPosts() {
  return await db.select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.createdAt));
}

export async function getPopularTools(limit = 10) {
  const results = await db
    .select({
      id: schema.tools.id,
      title: schema.tools.title,
      slug: schema.tools.slug,
      description: schema.tools.description,
      code: schema.tools.code,
      metaTitle: schema.tools.metaTitle,
      metaDescription: schema.tools.metaDescription,
      metaTags: schema.tools.metaTags,
      categoryId: schema.tools.categoryId,
      isActive: schema.tools.isActive,
      createdAt: schema.tools.createdAt,
      usageCount: schema.toolUsage.usageCount,
      category: {
        id: schema.categories.id,
        name: schema.categories.name,
        slug: schema.categories.slug,
        description: schema.categories.description,
        color: schema.categories.color,
        icon: schema.categories.icon,
        isActive: schema.categories.isActive
      }
    })
    .from(schema.tools)
    .leftJoin(schema.categories, eq(schema.tools.categoryId, schema.categories.id))
    .leftJoin(schema.toolUsage, eq(schema.tools.id, schema.toolUsage.toolId))
    .where(eq(schema.tools.isActive, true))
    .orderBy(desc(schema.toolUsage.usageCount))
    .limit(limit);
    
  return results.map(result => ({
    ...result,
    category: result.category!,
    usageCount: result.usageCount || 0
  }));
}