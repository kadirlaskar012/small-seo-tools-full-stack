import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCategorySchema, insertToolSchema, insertBlogPostSchema, insertSiteSettingSchema, type ToolWithCategory } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database with default data
  await storage.initializeDefaultData();
  
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const data = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(data);
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create category" });
      }
    }
  });

  // Tools
  app.get("/api/tools", async (req, res) => {
    try {
      const { category } = req.query;
      let tools: ToolWithCategory[];
      
      if (category && typeof category === 'string') {
        const categoryRecord = await storage.getCategoryBySlug(category);
        if (categoryRecord) {
          tools = await storage.getToolsByCategory(categoryRecord.id);
        } else {
          tools = [];
        }
      } else {
        tools = await storage.getTools();
      }
      
      res.json(tools);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tools" });
    }
  });

  app.get("/api/tools/popular", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const popularTools = await storage.getPopularTools(limit);
      res.json(popularTools);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular tools" });
    }
  });

  app.get("/api/tools/:slug", async (req, res) => {
    try {
      const tool = await storage.getToolBySlug(req.params.slug);
      if (!tool) {
        return res.status(404).json({ message: "Tool not found" });
      }
      res.json(tool);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tool" });
    }
  });

  app.get("/api/tools/:id/similar", async (req, res) => {
    try {
      const toolId = parseInt(req.params.id);
      const similarTools = await storage.getSimilarTools(toolId);
      res.json(similarTools);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch similar tools" });
    }
  });

  app.post("/api/tools/:id/usage", async (req, res) => {
    try {
      const toolId = parseInt(req.params.id);
      await storage.incrementToolUsage(toolId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to track usage" });
    }
  });

  app.post("/api/tools", async (req, res) => {
    try {
      const data = insertToolSchema.parse(req.body);
      const tool = await storage.createTool(data);
      res.json(tool);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create tool" });
      }
    }
  });

  app.put("/api/tools/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertToolSchema.partial().parse(req.body);
      const tool = await storage.updateTool(id, data);
      
      if (!tool) {
        return res.status(404).json({ message: "Tool not found" });
      }
      
      res.json(tool);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update tool" });
      }
    }
  });

  app.delete("/api/tools/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTool(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Tool not found" });
      }
      
      res.json({ message: "Tool deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete tool" });
    }
  });

  // Blog Posts
  app.get("/api/blog", async (req, res) => {
    try {
      const { published } = req.query;
      let posts;
      
      if (published === 'true') {
        posts = await storage.getPublishedBlogPosts();
      } else {
        posts = await storage.getBlogPosts();
      }
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog", async (req, res) => {
    try {
      const data = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(data);
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create blog post" });
      }
    }
  });

  app.put("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(id, data);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update blog post" });
      }
    }
  });

  app.delete("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBlogPost(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Site Settings API
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const { key, value } = req.body;
      if (!key) {
        return res.status(400).json({ message: "Key is required" });
      }
      const setting = await storage.setSiteSetting({ key, value });
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Failed to save setting" });
    }
  });

  // File Upload API (for logos, images, etc.)
  app.post("/api/upload", async (req, res) => {
    try {
      // For now, return a placeholder URL
      // In production, this would handle actual file uploads to cloud storage
      const mockUrl = `/uploads/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
      res.json({ url: mockUrl });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Schema Template routes
  app.get("/api/schema-templates", async (req, res) => {
    try {
      const templates = await storage.getSchemaTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching schema templates:", error);
      res.status(500).json({ message: "Failed to fetch schema templates" });
    }
  });

  app.get("/api/schema-templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getSchemaTemplate(id);
      if (!template) {
        return res.status(404).json({ message: "Schema template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching schema template:", error);
      res.status(500).json({ message: "Failed to fetch schema template" });
    }
  });

  app.post("/api/schema-templates", async (req, res) => {
    try {
      const template = await storage.createSchemaTemplate(req.body);
      res.json(template);
    } catch (error) {
      console.error("Error creating schema template:", error);
      res.status(500).json({ message: "Failed to create schema template" });
    }
  });

  app.put("/api/schema-templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.updateSchemaTemplate(id, req.body);
      if (!template) {
        return res.status(404).json({ message: "Schema template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error updating schema template:", error);
      res.status(500).json({ message: "Failed to update schema template" });
    }
  });

  app.delete("/api/schema-templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSchemaTemplate(id);
      if (!success) {
        return res.status(404).json({ message: "Schema template not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting schema template:", error);
      res.status(500).json({ message: "Failed to delete schema template" });
    }
  });

  // Page Schema routes
  app.get("/api/page-schemas", async (req, res) => {
    try {
      const schemas = await storage.getPageSchemas();
      res.json(schemas);
    } catch (error) {
      console.error("Error fetching page schemas:", error);
      res.status(500).json({ message: "Failed to fetch page schemas" });
    }
  });

  app.get("/api/page-schemas/:pageType/:pageId?", async (req, res) => {
    try {
      const { pageType, pageId } = req.params;
      const schema = await storage.getPageSchema(pageType, pageId ? parseInt(pageId) : undefined);
      if (!schema) {
        return res.status(404).json({ message: "Page schema not found" });
      }
      res.json(schema);
    } catch (error) {
      console.error("Error fetching page schema:", error);
      res.status(500).json({ message: "Failed to fetch page schema" });
    }
  });

  app.post("/api/page-schemas", async (req, res) => {
    try {
      const schema = await storage.createPageSchema(req.body);
      res.json(schema);
    } catch (error) {
      console.error("Error creating page schema:", error);
      res.status(500).json({ message: "Failed to create page schema" });
    }
  });

  app.put("/api/page-schemas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const schema = await storage.updatePageSchema(id, req.body);
      if (!schema) {
        return res.status(404).json({ message: "Page schema not found" });
      }
      res.json(schema);
    } catch (error) {
      console.error("Error updating page schema:", error);
      res.status(500).json({ message: "Failed to update page schema" });
    }
  });

  app.delete("/api/page-schemas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePageSchema(id);
      if (!success) {
        return res.status(404).json({ message: "Page schema not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting page schema:", error);
      res.status(500).json({ message: "Failed to delete page schema" });
    }
  });

  // Tool Icon routes
  app.get("/api/tools/:toolId/icon", async (req, res) => {
    try {
      const toolId = parseInt(req.params.toolId);
      const icon = await storage.getToolIcon(toolId);
      if (!icon) {
        return res.status(404).json({ message: "Tool icon not found" });
      }
      res.json(icon);
    } catch (error) {
      console.error("Error fetching tool icon:", error);
      res.status(500).json({ message: "Failed to fetch tool icon" });
    }
  });

  app.post("/api/tools/:toolId/icon", async (req, res) => {
    try {
      const toolId = parseInt(req.params.toolId);
      const icon = await storage.createToolIcon({
        toolId,
        ...req.body,
      });
      res.json(icon);
    } catch (error) {
      console.error("Error creating tool icon:", error);
      res.status(500).json({ message: "Failed to create tool icon" });
    }
  });

  app.put("/api/tools/:toolId/icon", async (req, res) => {
    try {
      const toolId = parseInt(req.params.toolId);
      const icon = await storage.updateToolIcon(toolId, req.body);
      if (!icon) {
        return res.status(404).json({ message: "Tool icon not found" });
      }
      res.json(icon);
    } catch (error) {
      console.error("Error updating tool icon:", error);
      res.status(500).json({ message: "Failed to update tool icon" });
    }
  });

  app.delete("/api/tools/:toolId/icon", async (req, res) => {
    try {
      const toolId = parseInt(req.params.toolId);
      const success = await storage.deleteToolIcon(toolId);
      if (!success) {
        return res.status(404).json({ message: "Tool icon not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting tool icon:", error);
      res.status(500).json({ message: "Failed to delete tool icon" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
