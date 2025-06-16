import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ToolList from "@/components/admin/tool-list";
import ToolForm from "@/components/admin/tool-form";
import BlogList from "@/components/admin/blog-list";
import BlogForm from "@/components/admin/blog-form";
import SiteSettings from "@/components/admin/site-settings";
import GoogleTools from "@/components/admin/google-tools";
import FileManager from "@/components/admin/file-manager";
import SchemaManager from "@/components/admin/schema-manager";
import { LogoUpload } from "@/components/admin/logo-upload";
import { HomepageIconManager } from "@/components/admin/homepage-icon-manager";
import type { Category, ToolWithCategory, BlogPost } from "@shared/schema";
import SEOHead from "@/components/seo-head";
import { Combine, FileText, Settings, TrendingUp, Globe, FolderOpen, Database, Image, Eye, Edit, Menu } from "lucide-react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("tools");

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          <TabsList className="grid grid-cols-11 w-full">
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Combine className="h-4 w-4" />
              Tools
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Pages
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Menu className="h-4 w-4" />
              Social
            </TabsTrigger>
            <TabsTrigger value="icons" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Icons
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="schema" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Schema
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="google" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Google
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Files
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
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

          <TabsContent value="pages" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Page Management</h2>
                <p className="text-muted-foreground mb-6">
                  Edit and customize static pages, meta tags, and content structure.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Homepage Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Hero Title</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter homepage hero title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Hero Description</label>
                      <textarea 
                        className="w-full p-2 border rounded-md h-24"
                        placeholder="Enter hero description"
                      />
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      Update Homepage
                    </button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>About Page</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">About Title</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter about page title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">About Content</label>
                      <textarea 
                        className="w-full p-2 border rounded-md h-32"
                        placeholder="Enter about page content"
                      />
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      Update About Page
                    </button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Policy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Privacy Policy Content</label>
                      <textarea 
                        className="w-full p-2 border rounded-md h-32"
                        placeholder="Enter privacy policy content"
                      />
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      Update Privacy Policy
                    </button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Terms of Service</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Terms of Service Content</label>
                      <textarea 
                        className="w-full p-2 border rounded-md h-32"
                        placeholder="Enter terms of service content"
                      />
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      Update Terms of Service
                    </button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Social Menu Management</h2>
                <p className="text-muted-foreground mb-6">
                  Configure social media links and navigation menu items.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Social Media Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Facebook URL</label>
                      <input 
                        type="url" 
                        className="w-full p-2 border rounded-md"
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Twitter URL</label>
                      <input 
                        type="url" 
                        className="w-full p-2 border rounded-md"
                        placeholder="https://twitter.com/youraccount"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                      <input 
                        type="url" 
                        className="w-full p-2 border rounded-md"
                        placeholder="https://linkedin.com/company/yourcompany"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Instagram URL</label>
                      <input 
                        type="url" 
                        className="w-full p-2 border rounded-md"
                        placeholder="https://instagram.com/youraccount"
                      />
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      Update Social Links
                    </button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Navigation Menu</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-3">Current Menu Items</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>Home</span>
                          <button className="text-red-600 text-sm">Remove</button>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>Tools</span>
                          <button className="text-red-600 text-sm">Remove</button>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>Blog</span>
                          <button className="text-red-600 text-sm">Remove</button>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>About</span>
                          <button className="text-red-600 text-sm">Remove</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Add New Menu Item</h4>
                      <div className="space-y-2">
                        <input 
                          type="text" 
                          className="w-full p-2 border rounded-md"
                          placeholder="Menu item name"
                        />
                        <input 
                          type="text" 
                          className="w-full p-2 border rounded-md"
                          placeholder="Menu item URL"
                        />
                      </div>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 mt-3">
                        Add Menu Item
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Footer Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Contact Email</label>
                      <input 
                        type="email" 
                        className="w-full p-2 border rounded-md"
                        placeholder="contact@yoursite.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Support Email</label>
                      <input 
                        type="email" 
                        className="w-full p-2 border rounded-md"
                        placeholder="support@yoursite.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Copyright Text</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md"
                        placeholder="© 2024 Your Company Name"
                      />
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      Update Footer
                    </button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Business Address</label>
                      <textarea 
                        className="w-full p-2 border rounded-md h-20"
                        placeholder="Enter your business address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        className="w-full p-2 border rounded-md"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      Update Contact Info
                    </button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="icons" className="space-y-6">
            <HomepageIconManager />
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Site Branding</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LogoUpload
                  type="logo"
                  title="Website Logo"
                  description="Upload your main website logo that will appear in the header and throughout the site."
                />
                <LogoUpload
                  type="nav_icon"
                  title="Navigation Icon"
                  description="Upload a small icon for navigation elements and mobile displays."
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schema" className="space-y-6">
            <SchemaManager />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{tools.length}</div>
                  <p className="text-muted-foreground">Active tools</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Blog Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{blogPosts.length}</div>
                  <p className="text-muted-foreground">Published posts</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{categories.length}</div>
                  <p className="text-muted-foreground">Tool categories</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Tool Categories Overview</CardTitle>
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
                      <div className="text-sm text-muted-foreground">
                        {tools.filter(tool => tool.category.id === category.id).length} tools
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="google" className="space-y-6">
            <GoogleTools />
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <FileManager />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SiteSettings />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
