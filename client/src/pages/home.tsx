import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMobile } from "@/hooks/use-mobile";
import { Search, ArrowRight, Combine, ChevronRight } from "lucide-react";
import type { Category, ToolWithCategory, BlogPost } from "@shared/schema";
import SEOHead from "@/components/seo-head";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const isMobile = useMobile();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: tools = [] } = useQuery<ToolWithCategory[]>({
    queryKey: ["/api/tools"],
  });

  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog?published=true"],
  });

  const filteredTools = tools.filter(tool => {
    const matchesSearch = !searchQuery || 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
      tool.category.slug === selectedCategory;
    
    return matchesSearch && matchesCategory && tool.isActive;
  });

  const getIconForCategory = (icon: string) => {
    const iconMap: Record<string, string> = {
      text_fields: "📝",
      image: "🖼️",
      picture_as_pdf: "📄",
      search: "🔍",
    };
    return iconMap[icon] || "🛠️";
  };

  const getColorForCategory = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
      red: "bg-red-100 text-red-600",
      cyan: "bg-cyan-100 text-cyan-600",
      green: "bg-green-100 text-green-600",
      orange: "bg-orange-100 text-orange-600",
    };
    return colorMap[color] || "bg-gray-100 text-gray-600";
  };

  return (
    <>
      <SEOHead 
        title="The Ultimate Online Tools - Free Online Tools for Everyone"
        description="Powerful, fast, and easy-to-use online tools for all your digital needs. Text tools, image tools, PDF tools, SEO tools and more. No registration required."
        keywords="online tools, free tools, text tools, image tools, pdf tools, seo tools, web tools"
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">The Ultimate Online Tools</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Powerful, fast, and easy-to-use tools for all your digital needs. No registration required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="relative w-full max-w-md">
              <Input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 py-3 text-foreground"
              />
              <Search className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
            </div>
            <Button 
              variant="secondary" 
              size="lg"
              className="flex items-center gap-2"
              onClick={() => document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Combine className="h-5 w-5" />
              Browse All Tools
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Area with 75%/25% Split */}
      <section id="tools-section" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content - 75% width */}
            <main className="flex-1 lg:w-3/4">
              <h2 className="text-3xl font-bold mb-8">Tool Categories</h2>
              
              {/* Group tools by category */}
              {categories.map((category) => {
                const categoryTools = filteredTools.filter(tool => tool.category.id === category.id);
                if (categoryTools.length === 0) return null;

                return (
                  <div key={category.id} className="category-box p-6 mb-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-16 h-16 ${getColorForCategory(category.color)} rounded-2xl flex items-center justify-center text-3xl`}>
                        {getIconForCategory(category.icon)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {category.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Tools Grid - Mobile shows names only */}
                    {!isMobile ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryTools.map((tool) => (
                          <Link key={tool.id} href={`/${tool.slug}`}>
                            <Card className="hover:shadow-md transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer h-full">
                              <CardContent className="p-4">
                                <div className="flex items-center mb-3">
                                  <div className={`w-10 h-10 ${getColorForCategory(tool.category.color)} rounded-lg flex items-center justify-center mr-3 text-lg`}>
                                    {getIconForCategory(tool.category.icon)}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm leading-tight line-clamp-1">
                                      {tool.title}
                                    </h4>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                  {tool.description}
                                </p>
                                <Button size="sm" className="w-full">
                                  Use Tool
                                </Button>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      /* Mobile List Layout - Tool names only */
                      <div className="space-y-2">
                        {categoryTools.map((tool) => (
                          <Link key={tool.id} href={`/${tool.slug}`}>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                              <span className="font-medium text-sm">{tool.title}</span>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              
              {filteredTools.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
                  <p className="text-lg text-muted-foreground">
                    {searchQuery ? "No tools found matching your search." : "No tools available."}
                  </p>
                </div>
              )}
            </main>

            {/* Sidebar - 25% width */}
            <aside className="w-full lg:w-1/4 space-y-6">
              {/* Search and Filter Box */}
              <div className="sidebar-box p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search & Filter
                </h3>
                <div className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Search tools..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Category
                    </label>
                    <div className="space-y-2">
                      <Button
                        variant={selectedCategory === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory("all")}
                        className="w-full justify-start"
                      >
                        All Categories
                      </Button>
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.slug ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category.slug)}
                          className="w-full justify-start"
                        >
                          <span className="mr-2">{getIconForCategory(category.icon)}</span>
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest Blog Posts */}
              {blogPosts.length > 0 && (
                <div className="sidebar-box p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Latest Articles
                  </h3>
                  <div className="space-y-4">
                    {blogPosts.slice(0, 3).map((post) => (
                      <Link key={post.id} href={`/blog/${post.slug}`}>
                        <div className="group cursor-pointer">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">
                            {post.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" asChild className="w-full mt-4">
                    <Link href="/blog">
                      View All Articles
                    </Link>
                  </Button>
                </div>
              )}

              {/* Tool Statistics */}
              <div className="sidebar-box p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Tools</span>
                    <Badge variant="secondary">{tools.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Categories</span>
                    <Badge variant="secondary">{categories.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Blog Posts</span>
                    <Badge variant="secondary">{blogPosts.length}</Badge>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Blog Section Preview */}
      {blogPosts.length > 0 && (
        <section className="py-16 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Latest from Our Blog</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Tips, tutorials, and insights to help you make the most of our tools
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(0, 3).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-2">
                        <Badge variant="outline">Blog</Badge>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-primary text-sm font-medium">Read more →</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/blog">
                <Button variant="outline" size="lg" className="gap-2">
                  View All Posts
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
