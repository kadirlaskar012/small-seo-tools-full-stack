import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ToolList from "@/components/admin/tool-list";
import ToolForm from "@/components/admin/tool-form";
import BlogList from "@/components/admin/blog-list";
import BlogForm from "@/components/admin/blog-form";
import type { Category, ToolWithCategory, BlogPost } from "@shared/schema";
import SEOHead from "@/components/seo-head";
import { Combine, FileText, Settings, TrendingUp } from "lucide-react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("tools");

  const { data: tools = [] } = useQuery<ToolWithCategory[]>({
    queryKey: ["/api/tools"],
  });

  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <>
      <SEOHead 
        title="Admin Panel - The Ultimate Online Tools"
        description="Admin panel for managing tools, blog posts, and website content."
        noIndex={true}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage your tools, blog posts, and website content
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Combine className="h-4 w-4" />
              Tools
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              SEO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Manage Tools</h2>
                <ToolList tools={tools} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">Add New Tool</h2>
                <ToolForm categories={categories} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="blog" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Blog Posts</h2>
                <BlogList posts={blogPosts} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">Create New Post</h2>
                <BlogForm />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {category.icon === 'text_fields' ? '📝' : 
                           category.icon === 'image' ? '🖼️' :
                           category.icon === 'picture_as_pdf' ? '📄' :
                           category.icon === 'search' ? '🔍' : '🛠️'}
                        </span>
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  SEO settings and analytics will be available in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
