import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeSEO, analyzeMetaTags, analyzeKeywordDensity } from "./seo-analyzer";
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

      const crypto = require('crypto');
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

  const httpServer = createServer(app);
  return httpServer;
}
