import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Edit, Plus, Trash2, Eye, Save } from "lucide-react";

interface Tool {
  id: number;
  title: string;
  slug: string;
  category: {
    name: string;
  };
}

interface ToolArticle {
  id: number;
  toolId: number;
  title: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  schemaMarkup: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminArticles() {
  const [selectedTool, setSelectedTool] = useState<number | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ToolArticle | null>(null);
  const { toast } = useToast();

  const { data: tools = [] } = useQuery<Tool[]>({
    queryKey: ["/api/tools"],
  });

  const { data: articles = [] } = useQuery<ToolArticle[]>({
    queryKey: ["/api/admin/tool-articles"],
  });

  const createArticleMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/admin/tool-articles", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tool-articles"] });
      setIsEditorOpen(false);
      setEditingArticle(null);
      toast({
        title: "Success",
        description: "Article created successfully",
      });
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: ({ toolId, data }: { toolId: number; data: any }) => 
      apiRequest(`/api/admin/tool-articles/${toolId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tool-articles"] });
      setIsEditorOpen(false);
      setEditingArticle(null);
      toast({
        title: "Success",
        description: "Article updated successfully",
      });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: (toolId: number) => apiRequest(`/api/admin/tool-articles/${toolId}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tool-articles"] });
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
    },
  });

  const filteredArticles = selectedTool 
    ? articles.filter(article => article.toolId === selectedTool)
    : articles;

  const getToolById = (toolId: number) => tools.find(tool => tool.id === toolId);

  const openEditor = (article?: ToolArticle) => {
    setEditingArticle(article || null);
    setIsEditorOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tool Articles Management</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create and manage SEO-optimized articles for each tool with WordPress-style editor
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Label htmlFor="tool-filter">Filter by Tool</Label>
          <Select value={selectedTool?.toString() || ""} onValueChange={(value) => setSelectedTool(value ? parseInt(value) : null)}>
            <SelectTrigger>
              <SelectValue placeholder="All tools" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All tools</SelectItem>
              {tools.map((tool) => (
                <SelectItem key={tool.id} value={tool.id.toString()}>
                  {tool.title} ({tool.category.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end">
          <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openEditor()}>
                <Plus className="h-4 w-4 mr-2" />
                New Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingArticle ? "Edit Article" : "Create New Article"}
                </DialogTitle>
                <DialogDescription>
                  {editingArticle 
                    ? "Edit the article content, SEO settings, and publication status." 
                    : "Create a new SEO-optimized article for a specific tool with custom content and metadata."
                  }
                </DialogDescription>
              </DialogHeader>
              <ArticleEditor
                article={editingArticle}
                tools={tools}
                onSave={(data) => {
                  if (editingArticle) {
                    updateArticleMutation.mutate({ toolId: editingArticle.toolId, data });
                  } else {
                    createArticleMutation.mutate(data);
                  }
                }}
                isLoading={createArticleMutation.isPending || updateArticleMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => {
          const tool = getToolById(article.toolId);
          return (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {tool?.title} • {tool?.category.name}
                    </p>
                  </div>
                  <Badge variant={article.isPublished ? "default" : "secondary"}>
                    {article.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                  {article.excerpt || "No excerpt available"}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Updated {new Date(article.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`/tools/${tool?.slug}`, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openEditor(article)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => deleteArticleMutation.mutate(article.toolId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {selectedTool ? "No articles found for selected tool" : "No articles created yet"}
          </p>
          <Button onClick={() => openEditor()} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Article
          </Button>
        </div>
      )}
    </div>
  );
}

// WordPress-style Article Editor Component
function ArticleEditor({ 
  article, 
  tools, 
  onSave, 
  isLoading 
}: { 
  article: ToolArticle | null;
  tools: Tool[];
  onSave: (data: any) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    toolId: article?.toolId || '',
    title: article?.title || '',
    content: article?.content || '',
    excerpt: article?.excerpt || '',
    metaTitle: article?.metaTitle || '',
    metaDescription: article?.metaDescription || '',
    metaKeywords: article?.metaKeywords || '',
    schemaMarkup: article?.schemaMarkup || '',
    isPublished: article?.isPublished ?? true,
  });

  const generateSchema = () => {
    const tool = tools.find(t => t.id === parseInt(formData.toolId.toString()));
    if (!tool) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": formData.title,
      "description": formData.metaDescription || formData.excerpt,
      "author": {
        "@type": "Organization",
        "name": "SEO Tools Hub"
      },
      "publisher": {
        "@type": "Organization",
        "name": "SEO Tools Hub"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://example.com/tools/${tool.slug}`
      },
      "articleSection": tool.category.name,
      "keywords": formData.metaKeywords,
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString()
    };

    setFormData(prev => ({
      ...prev,
      schemaMarkup: JSON.stringify(schema, null, 2)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tool Selection */}
      <div>
        <Label htmlFor="toolId">Select Tool *</Label>
        <Select 
          value={formData.toolId.toString()} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, toolId: parseInt(value) }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a tool" />
          </SelectTrigger>
          <SelectContent>
            {tools.map((tool) => (
              <SelectItem key={tool.id} value={tool.id.toString()}>
                {tool.title} ({tool.category.name})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Article Title */}
      <div>
        <Label htmlFor="title">Article Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter article title"
          required
        />
      </div>

      {/* Article Content (WordPress-style) */}
      <div>
        <Label htmlFor="content">Article Content *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Write your article content here. You can use HTML tags for formatting."
          rows={12}
          className="min-h-[300px] font-mono"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          HTML tags supported: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a&gt;, etc.
        </p>
      </div>

      {/* Article Excerpt */}
      <div>
        <Label htmlFor="excerpt">Article Excerpt</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
          placeholder="Brief summary of the article"
          rows={3}
        />
      </div>

      {/* SEO Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            value={formData.metaTitle}
            onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
            placeholder="SEO optimized title"
          />
        </div>
        <div>
          <Label htmlFor="metaKeywords">Meta Keywords</Label>
          <Input
            id="metaKeywords"
            value={formData.metaKeywords}
            onChange={(e) => setFormData(prev => ({ ...prev, metaKeywords: e.target.value }))}
            placeholder="keyword1, keyword2, keyword3"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea
          id="metaDescription"
          value={formData.metaDescription}
          onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
          placeholder="SEO meta description (150-160 characters)"
          rows={3}
        />
      </div>

      {/* Schema Markup */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="schemaMarkup">Schema Markup (JSON-LD)</Label>
          <Button type="button" onClick={generateSchema} size="sm" variant="outline">
            Generate Schema
          </Button>
        </div>
        <Textarea
          id="schemaMarkup"
          value={formData.schemaMarkup}
          onChange={(e) => setFormData(prev => ({ ...prev, schemaMarkup: e.target.value }))}
          placeholder="JSON-LD schema markup for SEO"
          rows={8}
          className="font-mono text-sm"
        />
      </div>

      {/* Publish Settings */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublished"
          checked={formData.isPublished}
          onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
          className="rounded"
        />
        <Label htmlFor="isPublished">Publish immediately</Label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button type="submit" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Article"}
        </Button>
      </div>
    </form>
  );
}