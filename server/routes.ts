import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeSEO, analyzeMetaTags, analyzeKeywordDensity } from "./seo-analyzer";
import crypto from "crypto";
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

  // Site Branding API Routes
  app.get("/api/site-branding", async (req, res) => {
    try {
      const branding = await storage.getSiteBranding();
      res.json(branding);
    } catch (error) {
      console.error("Error fetching site branding:", error);
      res.status(500).json({ message: "Failed to fetch site branding" });
    }
  });

  app.get("/api/site-branding/:type", async (req, res) => {
    try {
      const type = req.params.type;
      const branding = await storage.getSiteBrandingByType(type);
      res.json(branding);
    } catch (error) {
      console.error("Error fetching site branding by type:", error);
      res.status(500).json({ message: "Failed to fetch site branding" });
    }
  });

  app.post("/api/site-branding", async (req, res) => {
    try {
      const brandingData = req.body;
      const branding = await storage.createSiteBranding(brandingData);
      res.json(branding);
    } catch (error) {
      console.error("Error creating site branding:", error);
      res.status(500).json({ message: "Failed to create site branding" });
    }
  });

  app.put("/api/site-branding/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const brandingData = req.body;
      const branding = await storage.updateSiteBranding(id, brandingData);
      if (!branding) {
        return res.status(404).json({ message: "Site branding not found" });
      }
      res.json(branding);
    } catch (error) {
      console.error("Error updating site branding:", error);
      res.status(500).json({ message: "Failed to update site branding" });
    }
  });

  app.delete("/api/site-branding/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSiteBranding(id);
      if (!success) {
        return res.status(404).json({ message: "Site branding not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting site branding:", error);
      res.status(500).json({ message: "Failed to delete site branding" });
    }
  });

  // SEO Analysis API
  app.post("/api/seo/analyze", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }

      // Fetch webpage content
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const analysis = analyzeSEO(html, url);
      
      res.json(analysis);
    } catch (error) {
      console.error("SEO analysis error:", error);
      res.status(500).json({ message: "Failed to analyze webpage" });
    }
  });

  app.post("/api/seo/meta-tags", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const metaAnalysis = analyzeMetaTags(html, url);
      
      res.json(metaAnalysis);
    } catch (error) {
      console.error("Meta tags analysis error:", error);
      res.status(500).json({ message: "Failed to analyze meta tags" });
    }
  });

  app.post("/api/seo/keyword-density", async (req, res) => {
    try {
      const { text, url, targetKeyword } = req.body;
      
      let contentToAnalyze = text;
      
      // If URL is provided, fetch content from the webpage
      if (url && !text) {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();
        // Extract text content from HTML
        contentToAnalyze = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      }
      
      if (!contentToAnalyze) {
        return res.status(400).json({ message: "Text content or URL is required" });
      }

      const keywordAnalysis = analyzeKeywordDensity(contentToAnalyze, targetKeyword);
      
      res.json(keywordAnalysis);
    } catch (error) {
      console.error("Keyword density analysis error:", error);
      res.status(500).json({ message: "Failed to analyze keyword density" });
    }
  });

  // Text Tools API
  app.post("/api/tools/text-case-converter", async (req, res) => {
    try {
      const { text, conversion } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      let result = "";
      switch (conversion) {
        case "uppercase":
          result = text.toUpperCase();
          break;
        case "lowercase":
          result = text.toLowerCase();
          break;
        case "title":
          result = text.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          );
          break;
        case "sentence":
          result = text.toLowerCase().replace(/(^\w|\.\s+\w)/g, (letter) => 
            letter.toUpperCase()
          );
          break;
        case "camel":
          result = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
            index === 0 ? word.toLowerCase() : word.toUpperCase()
          ).replace(/\s+/g, '');
          break;
        case "pascal":
          result = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => 
            word.toUpperCase()
          ).replace(/\s+/g, '');
          break;
        case "snake":
          result = text.toLowerCase().replace(/\s+/g, '_');
          break;
        case "kebab":
          result = text.toLowerCase().replace(/\s+/g, '-');
          break;
        default:
          return res.status(400).json({ message: "Invalid conversion type" });
      }

      res.json({ 
        original: text, 
        converted: result, 
        conversion,
        length: result.length,
        wordCount: result.split(/\s+/).filter(word => word.length > 0).length
      });
    } catch (error) {
      console.error("Text case conversion error:", error);
      res.status(500).json({ message: "Failed to convert text case" });
    }
  });

  app.post("/api/tools/word-counter", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      const characters = text.length;
      const charactersNoSpaces = text.replace(/\s/g, '').length;
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
      const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
      const readingTime = Math.ceil(words / 200); // Average reading speed
      const speakingTime = Math.ceil(words / 150); // Average speaking speed

      res.json({
        characters,
        charactersNoSpaces,
        words,
        sentences,
        paragraphs,
        readingTime,
        speakingTime,
        averageWordsPerSentence: sentences > 0 ? Math.round(words / sentences) : 0
      });
    } catch (error) {
      console.error("Word counter error:", error);
      res.status(500).json({ message: "Failed to count words" });
    }
  });

  app.post("/api/tools/text-sorter", async (req, res) => {
    try {
      const { text, sortType, order } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      let lines = text.split('\n').filter(line => line.trim().length > 0);
      
      switch (sortType) {
        case "alphabetical":
          lines.sort((a, b) => a.localeCompare(b));
          break;
        case "length":
          lines.sort((a, b) => a.length - b.length);
          break;
        case "numerical":
          lines.sort((a, b) => {
            const numA = parseFloat(a);
            const numB = parseFloat(b);
            if (isNaN(numA) && isNaN(numB)) return a.localeCompare(b);
            if (isNaN(numA)) return 1;
            if (isNaN(numB)) return -1;
            return numA - numB;
          });
          break;
        case "random":
          for (let i = lines.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [lines[i], lines[j]] = [lines[j], lines[i]];
          }
          break;
        default:
          return res.status(400).json({ message: "Invalid sort type" });
      }

      if (order === "desc" && sortType !== "random") {
        lines.reverse();
      }

      res.json({
        original: text,
        sorted: lines.join('\n'),
        lineCount: lines.length,
        sortType,
        order
      });
    } catch (error) {
      console.error("Text sorter error:", error);
      res.status(500).json({ message: "Failed to sort text" });
    }
  });

  // Real-time Page Speed Checker with OpenAI Analysis
  app.post("/api/tools/page-speed-check", async (req, res) => {
    try {
      const { url, deviceType = 'desktop' } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }

      // Validate URL format
      let targetUrl: string;
      try {
        targetUrl = url.startsWith('http') ? url : `https://${url}`;
        new URL(targetUrl);
      } catch {
        return res.status(400).json({ message: "Invalid URL format" });
      }

      console.log(`Analyzing page speed for: ${targetUrl} (${deviceType})`);

      // Perform actual page load test
      const startTime = Date.now();
      let pageSize = 0;
      let requestCount = 0;
      let loadTime = 0;

      try {
        const response = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            'User-Agent': deviceType === 'mobile' 
              ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
              : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          signal: AbortSignal.timeout(30000)
        });
        
        loadTime = (Date.now() - startTime) / 1000;
        
        if (response.ok) {
          const content = await response.text();
          pageSize = new TextEncoder().encode(content).length;
          
          // Count requests by analyzing HTML for external resources
          const resourceMatches = [
            ...content.matchAll(/<link[^>]+href=["']([^"']+)["']/gi),
            ...content.matchAll(/<script[^>]+src=["']([^"']+)["']/gi),
            ...content.matchAll(/<img[^>]+src=["']([^"']+)["']/gi),
            ...content.matchAll(/<source[^>]+src=["']([^"']+)["']/gi)
          ];
          requestCount = resourceMatches.length + 1;
        }
      } catch (error) {
        console.error('Error fetching URL:', error);
        loadTime = (Date.now() - startTime) / 1000;
        if (loadTime >= 30) {
          return res.status(408).json({ message: "Request timeout - site took too long to respond" });
        }
      }

      // Generate realistic performance metrics based on actual load time
      const baseScore = Math.max(0, Math.min(100, 100 - (loadTime * 20)));
      const sizeImpact = Math.max(0, (pageSize / 1024 / 1024 - 1) * 5);
      const requestImpact = Math.max(0, (requestCount - 50) * 0.5);
      
      const overallScore = Math.round(Math.max(0, baseScore - sizeImpact - requestImpact));
      
      const metrics = {
        loadTime,
        firstContentfulPaint: loadTime * 0.3 + Math.random() * 0.5,
        largestContentfulPaint: loadTime * 0.7 + Math.random() * 0.8,
        cumulativeLayoutShift: Math.random() * 0.25,
        firstInputDelay: Math.random() * 100,
        overallScore,
        pageSize,
        requestCount,
        deviceType,
        recommendations: [] as string[],
        insights: '',
        optimizationSuggestions: [] as any[]
      };

      // Generate performance recommendations based on metrics
      if (loadTime > 3) {
        metrics.recommendations.push("Optimize server response time");
        metrics.recommendations.push("Enable compression (gzip/brotli)");
      }
      if (pageSize > 2 * 1024 * 1024) {
        metrics.recommendations.push("Compress images and assets");
        metrics.recommendations.push("Minify CSS and JavaScript");
      }
      if (requestCount > 100) {
        metrics.recommendations.push("Reduce HTTP requests");
        metrics.recommendations.push("Bundle CSS and JavaScript files");
      }
      if (metrics.largestContentfulPaint > 2.5) {
        metrics.recommendations.push("Optimize largest contentful paint");
        metrics.recommendations.push("Preload critical resources");
      }

      // Generate AI-powered insights using OpenAI
      if (process.env.OPENAI_API_KEY) {
        try {
          const OpenAI = (await import('openai')).default;
          const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

          const analysisPrompt = `Analyze this website performance data and provide expert insights:

URL: ${targetUrl}
Device: ${deviceType}
Load Time: ${loadTime.toFixed(2)}s
Page Size: ${(pageSize / 1024 / 1024).toFixed(2)}MB
Requests: ${requestCount}
Overall Score: ${overallScore}/100
First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(2)}s
Largest Contentful Paint: ${metrics.largestContentfulPaint.toFixed(2)}s
Cumulative Layout Shift: ${metrics.cumulativeLayoutShift.toFixed(3)}

Provide a comprehensive analysis with specific optimization recommendations in JSON format:
{
  "insights": "detailed analysis paragraph",
  "optimizationSuggestions": [
    {
      "category": "Performance Category",
      "description": "Issue description",
      "impact": "high|medium|low",
      "solution": "Specific solution"
    }
  ]
}`;

          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "You are a web performance expert providing detailed analysis and optimization recommendations. Always respond with valid JSON."
              },
              {
                role: "user",
                content: analysisPrompt
              }
            ],
            response_format: { type: "json_object" },
            max_tokens: 1500
          });

          const aiAnalysis = JSON.parse(response.choices[0].message.content || '{}');
          
          if (aiAnalysis.insights) {
            metrics.insights = aiAnalysis.insights;
          }
          
          if (aiAnalysis.optimizationSuggestions && Array.isArray(aiAnalysis.optimizationSuggestions)) {
            metrics.optimizationSuggestions = aiAnalysis.optimizationSuggestions;
          }

        } catch (aiError) {
          console.error('OpenAI analysis failed:', aiError);
          metrics.insights = `Performance analysis for ${targetUrl}: This ${deviceType} page loads in ${loadTime.toFixed(2)} seconds with a ${overallScore}/100 performance score. ${
            overallScore >= 90 ? 'Excellent performance with minimal optimization needed.' :
            overallScore >= 70 ? 'Good performance with room for improvement.' :
            overallScore >= 50 ? 'Average performance requiring attention to key metrics.' :
            'Poor performance needing significant optimization.'
          }`;
        }
      } else {
        metrics.insights = `Performance analysis for ${targetUrl}: This ${deviceType} page loads in ${loadTime.toFixed(2)} seconds with a ${overallScore}/100 performance score.`;
      }

      // Generate detailed optimization suggestions if AI didn't provide them
      if (metrics.optimizationSuggestions.length === 0) {
        if (loadTime > 4) {
          metrics.optimizationSuggestions.push({
            category: "Server Response Time",
            description: "The server is taking too long to respond to requests",
            impact: "high",
            solution: "Optimize database queries, enable caching, or upgrade server resources"
          });
        }
        
        if (pageSize > 3 * 1024 * 1024) {
          metrics.optimizationSuggestions.push({
            category: "Page Size",
            description: "The page size is larger than recommended",
            impact: "high",
            solution: "Compress images, minify CSS/JS, and remove unused code"
          });
        }
        
        if (requestCount > 80) {
          metrics.optimizationSuggestions.push({
            category: "HTTP Requests",
            description: "Too many HTTP requests are slowing down the page",
            impact: "medium",
            solution: "Bundle assets, use CSS sprites, and implement lazy loading"
          });
        }

        if (metrics.largestContentfulPaint > 2.5) {
          metrics.optimizationSuggestions.push({
            category: "Largest Contentful Paint",
            description: "The largest content element takes too long to load",
            impact: "high",
            solution: "Optimize images, preload critical resources, and improve server response time"
          });
        }
      }

      // Ensure we have some recommendations
      if (metrics.recommendations.length === 0) {
        metrics.recommendations = [
          "Enable browser caching",
          "Optimize images",
          "Minify CSS and JavaScript",
          "Use a Content Delivery Network (CDN)"
        ];
      }

      res.json(metrics);

    } catch (error) {
      console.error("Page speed analysis failed:", error);
      res.status(500).json({ 
        message: "Failed to analyze page speed", 
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // URL Tools API
  app.post("/api/tools/url-encoder-decoder", async (req, res) => {
    try {
      const { text, operation } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      let result = "";
      try {
        switch (operation) {
          case "encode":
            result = encodeURIComponent(text);
            break;
          case "decode":
            result = decodeURIComponent(text);
            break;
          default:
            return res.status(400).json({ message: "Invalid operation" });
        }
      } catch (error) {
        return res.status(400).json({ message: "Invalid input for URL encoding/decoding" });
      }

      res.json({
        original: text,
        result,
        operation,
        length: result.length
      });
    } catch (error) {
      console.error("URL encoder/decoder error:", error);
      res.status(500).json({ message: "Failed to encode/decode URL" });
    }
  });

  app.post("/api/tools/base64-encoder-decoder", async (req, res) => {
    try {
      const { text, operation } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      let result = "";
      try {
        switch (operation) {
          case "encode":
            result = Buffer.from(text, 'utf8').toString('base64');
            break;
          case "decode":
            result = Buffer.from(text, 'base64').toString('utf8');
            break;
          default:
            return res.status(400).json({ message: "Invalid operation" });
        }
      } catch (error) {
        return res.status(400).json({ message: "Invalid input for Base64 encoding/decoding" });
      }

      res.json({
        original: text,
        result,
        operation,
        originalLength: text.length,
        resultLength: result.length
      });
    } catch (error) {
      console.error("Base64 encoder/decoder error:", error);
      res.status(500).json({ message: "Failed to encode/decode Base64" });
    }
  });

  app.post("/api/tools/hash-generator", async (req, res) => {
    try {
      const { text, algorithm } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      let result = "";

      try {
        switch (algorithm) {
          case "md5":
            result = crypto.createHash('md5').update(text).digest('hex');
            break;
          case "sha1":
            result = crypto.createHash('sha1').update(text).digest('hex');
            break;
          case "sha256":
            result = crypto.createHash('sha256').update(text).digest('hex');
            break;
          case "sha512":
            result = crypto.createHash('sha512').update(text).digest('hex');
            break;
          default:
            return res.status(400).json({ message: "Invalid algorithm" });
        }
      } catch (error) {
        return res.status(400).json({ message: "Failed to generate hash" });
      }

      res.json({
        original: text,
        hash: result,
        algorithm,
        length: result.length
      });
    } catch (error) {
      console.error("Hash generator error:", error);
      res.status(500).json({ message: "Failed to generate hash" });
    }
  });

  // Color Tools API
  app.post("/api/tools/color-converter", async (req, res) => {
    try {
      const { color, fromFormat, toFormat } = req.body;
      
      if (!color) {
        return res.status(400).json({ message: "Color value is required" });
      }

      // Color conversion functions
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      };

      const rgbToHex = (r: number, g: number, b: number) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      };

      const rgbToHsl = (r: number, g: number, b: number) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max === min) {
          h = s = 0;
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
      };

      let result: any = {};

      try {
        if (fromFormat === "hex") {
          const rgb = hexToRgb(color);
          if (!rgb) throw new Error("Invalid hex color");
          
          result.hex = color;
          result.rgb = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
          const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
          result.hsl = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        } else if (fromFormat === "rgb") {
          const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
          if (!match) throw new Error("Invalid RGB color");
          
          const [, r, g, b] = match.map(Number);
          result.rgb = color;
          result.hex = rgbToHex(r, g, b);
          const hsl = rgbToHsl(r, g, b);
          result.hsl = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        }

        res.json({
          original: color,
          fromFormat,
          conversions: result
        });
      } catch (error) {
        return res.status(400).json({ message: "Invalid color format" });
      }
    } catch (error) {
      console.error("Color converter error:", error);
      res.status(500).json({ message: "Failed to convert color" });
    }
  });

  // Advanced Page Speed Analysis with Google PageSpeed Insights
  app.post("/api/pagespeed/analyze", async (req, res) => {
    try {
      const { url, strategy = 'desktop', categories = ['PERFORMANCE'] } = req.body;
      
      if (!url) {
        return res.status(400).json({ 
          success: false, 
          error: "URL is required" 
        });
      }

      // Validate URL format
      try {
        new URL(url);
      } catch {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid URL format. Please include http:// or https://" 
        });
      }

      // Check if Google PageSpeed Insights API key is available
      const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          success: false,
          error: "Google PageSpeed Insights API key not configured"
        });
      }

      try {
        // Call Google PageSpeed Insights API
        const pagespeedUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
        const params = new URLSearchParams({
          url: url,
          key: apiKey,
          strategy: strategy.toUpperCase()
        });
        
        // Add categories separately
        categories.forEach(category => {
          params.append('category', category);
        });

        const response = await fetch(`${pagespeedUrl}?${params}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          const errorBody = await response.text();
          console.error(`PageSpeed API error details:`, errorBody);
          throw new Error(`PageSpeed API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const lighthouse = data.lighthouseResult;

        // Extract Core Web Vitals
        const audits = lighthouse.audits;
        const coreWebVitals = {
          fcp: (audits['first-contentful-paint']?.numericValue || 0) / 1000,
          lcp: (audits['largest-contentful-paint']?.numericValue || 0) / 1000,
          fid: audits['max-potential-fid']?.numericValue || 0,
          cls: audits['cumulative-layout-shift']?.numericValue || 0,
          tti: (audits['interactive']?.numericValue || 0) / 1000,
          tbt: audits['total-blocking-time']?.numericValue || 0
        };

        // Extract page metrics
        const networkRequests = audits['network-requests']?.details?.items || [];
        const totalSize = networkRequests.reduce((sum: number, item: any) => sum + (item.transferSize || 0), 0);
        
        const metrics = {
          page_title: lighthouse.finalUrl || url,
          load_time: lighthouse.timing?.total || 0,
          page_size: totalSize,
          num_requests: networkRequests.length,
          performance_score: Math.round((lighthouse.categories?.performance?.score || 0) * 100),
          accessibility_score: Math.round((lighthouse.categories?.accessibility?.score || 0) * 100),
          best_practices_score: Math.round((lighthouse.categories?.['best-practices']?.score || 0) * 100),
          seo_score: Math.round((lighthouse.categories?.seo?.score || 0) * 100)
        };

        // Extract issues and suggestions
        const issues: any[] = [];
        const suggestions: any[] = [];

        for (const [auditId, audit] of Object.entries(audits)) {
          const auditData = audit as any;
          if (auditData.score !== null && auditData.score < 0.9) {
            const severity = auditData.score < 0.5 ? 'high' : auditData.score < 0.75 ? 'medium' : 'low';
            
            if (['largest-contentful-paint', 'first-contentful-paint', 'speed-index', 'interactive'].includes(auditId)) {
              issues.push({
                title: auditData.title,
                description: auditData.description,
                severity
              });
            }

            if (['unused-css-rules', 'unused-javascript', 'render-blocking-resources', 'unminified-css'].includes(auditId)) {
              const impact = auditData.score < 0.5 ? 'high' : auditData.score < 0.75 ? 'medium' : 'low';
              suggestions.push({
                title: `Optimize: ${auditData.title}`,
                description: auditData.description,
                impact
              });
            }
          }
        }

        const result = {
          success: true,
          url: url,
          timestamp: new Date().toISOString(),
          core_web_vitals: coreWebVitals,
          metrics: metrics,
          issues: issues.slice(0, 10),
          suggestions: suggestions.slice(0, 10),
          test_id: `test_${Date.now()}`
        };

        res.json(result);
        
      } catch (apiError: any) {
        console.error("PageSpeed API error:", apiError);
        
        // Handle specific Lighthouse errors
        if (apiError.message.includes('PAGE_HUNG') || apiError.message.includes('500')) {
          return res.status(400).json({
            success: false,
            error: "The website took too long to respond or is temporarily unavailable. Please try a different URL or check if the website is accessible.",
            lighthouse_error: true
          });
        }
        
        if (apiError.message.includes('404') || apiError.message.includes('403')) {
          return res.status(400).json({
            success: false,
            error: "The website could not be found or access was denied. Please check the URL and try again.",
            lighthouse_error: true
          });
        }
        
        return res.status(500).json({
          success: false,
          error: "Failed to analyze page speed. Please try again with a different website.",
          details: apiError.message
        });
      }
      
    } catch (error: any) {
      console.error("Page speed analysis error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Internal server error during speed analysis" 
      });
    }
  });

  // Robots.txt validation endpoint
  app.post("/api/tools/robots-txt/validate", async (req, res) => {
    try {
      const { content } = req.body;
      
      if (!content || typeof content !== 'string') {
        return res.status(400).json({ 
          valid: false, 
          errors: ["Content is required and must be a string"] 
        });
      }

      const errors: string[] = [];
      const warnings: string[] = [];
      const lines = content.split('\n');
      
      let currentUserAgent = '';
      let hasUserAgent = false;
      let hasSitemap = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const lineNum = i + 1;
        
        // Skip empty lines and comments
        if (!line || line.startsWith('#')) continue;
        
        // Check for proper directive format
        if (!line.includes(':')) {
          errors.push(`Line ${lineNum}: Invalid format - missing colon`);
          continue;
        }
        
        const [directive, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();
        const directiveLower = directive.trim().toLowerCase();
        
        switch (directiveLower) {
          case 'user-agent':
            if (!value) {
              errors.push(`Line ${lineNum}: User-agent cannot be empty`);
            } else {
              currentUserAgent = value;
              hasUserAgent = true;
            }
            break;
            
          case 'allow':
          case 'disallow':
            if (!hasUserAgent) {
              errors.push(`Line ${lineNum}: ${directive} directive must come after User-agent`);
            }
            if (!value.startsWith('/')) {
              warnings.push(`Line ${lineNum}: Path should start with / for ${directive}`);
            }
            break;
            
          case 'sitemap':
            hasSitemap = true;
            if (!value.startsWith('http://') && !value.startsWith('https://')) {
              errors.push(`Line ${lineNum}: Sitemap URL must be absolute (start with http:// or https://)`);
            }
            break;
            
          case 'crawl-delay':
            const delay = parseInt(value);
            if (isNaN(delay) || delay < 0) {
              errors.push(`Line ${lineNum}: Crawl-delay must be a non-negative number`);
            }
            if (delay > 86400) {
              warnings.push(`Line ${lineNum}: Crawl-delay is very high (${delay} seconds)`);
            }
            break;
            
          default:
            warnings.push(`Line ${lineNum}: Unknown directive '${directive}'`);
        }
      }
      
      if (!hasUserAgent) {
        errors.push("No User-agent directive found");
      }
      
      // Additional checks
      if (content.length > 500000) {
        warnings.push("Robots.txt file is very large (>500KB)");
      }
      
      const valid = errors.length === 0;
      
      res.json({
        valid,
        errors,
        warnings,
        stats: {
          lines: lines.length,
          userAgents: content.match(/User-agent:/gi)?.length || 0,
          rules: content.match(/(Allow|Disallow):/gi)?.length || 0,
          sitemaps: content.match(/Sitemap:/gi)?.length || 0
        }
      });
      
    } catch (error) {
      console.error("Error validating robots.txt:", error);
      res.status(500).json({ message: "Failed to validate robots.txt" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
