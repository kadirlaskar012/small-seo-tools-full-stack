import { useState, useEffect } from "react";
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
import { ToolLogo } from "@/components/ui/tool-logo";
import { generateUniqueIcon, getCategoryIcon, getToolIcon } from "@/lib/ai-generated-icons";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const isMobile = useMobile();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const getIconForCategory = (categoryName: string) => {
    return getCategoryIcon(categoryName);
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
      <section className="relative overflow-hidden">
        {/* Background with gradient and patterns */}
        <div className="absolute inset-0 gradient-bg"></div>
        <div className="absolute inset-0 dot-pattern opacity-20"></div>
        
        <div className="relative py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">
                The Ultimate 
                <span className="block gradient-text bg-gradient-to-r from-white to-blue-200">
                  Online Tools
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
                Powerful, fast, and easy-to-use tools for all your digital needs. 
                <span className="block mt-2 font-medium">No registration required. Always free.</span>
              </p>
            </div>
            
            <div className="animate-slide-up flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
              <div className="relative w-full max-w-lg">
                <Input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 text-lg bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl focus:ring-4 focus:ring-white/20"
                />
                <Search className="absolute left-5 top-4 h-6 w-6 text-muted-foreground" />
              </div>
              <Button 
                size="lg"
                className="btn-gradient px-8 py-4 text-lg font-semibold rounded-2xl shadow-2xl"
                onClick={() => document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Combine className="h-6 w-6 mr-2" />
                Browse All Tools
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
            
            {/* Stats */}
            <div className="animate-scale-in mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="glass rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{tools.length}+</div>
                <div className="text-white/80">Premium Tools</div>
              </div>
              <div className="glass rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">100%</div>
                <div className="text-white/80">Free Forever</div>
              </div>
              <div className="glass rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">0</div>
                <div className="text-white/80">Registration Required</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area with 75%/25% Split */}
      <section id="tools-section" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content - 75% width */}
            <main className="flex-1 lg:w-3/4">
              <div className="animate-fade-in">
                <h2 className="text-4xl font-bold mb-12 gradient-text">Tool Categories</h2>
                
                {/* Group tools by category */}
                {categories.map((category) => {
                  const categoryTools = filteredTools.filter(tool => tool.category.id === category.id);
                  if (categoryTools.length === 0) return null;

                  const getCategoryClass = (slug: string) => {
                    const categoryClasses: Record<string, string> = {
                      'seo-tools': 'category-seo',
                      'text-tools': 'category-development',
                      'image-tools': 'category-productivity',
                      'pdf-tools': 'category-security',
                      'web-tools': 'category-seo',
                      'development-tools': 'category-development',
                      'productivity-tools': 'category-productivity',
                      'security-tools': 'category-security',
                    };
                    return categoryClasses[slug] || 'category-seo';
                  };

                  return (
                    <div key={category.id} className="mb-16 animate-slide-up">
                      <div className={`rounded-2xl p-8 mb-8 ${getCategoryClass(category.slug)}`}>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-4xl">{getIconForCategory(category.name)}</div>
                          <div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">
                              {category.name}
                            </h3>
                            <p className="text-muted-foreground">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Tools Grid */}
                      {!isMobile ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                          {categoryTools.map((tool) => (
                            <Link key={tool.id} href={`/${tool.slug}`}>
                              <div className="tool-card group text-center animate-scale-in">
                                <div className="flex items-center justify-center mx-auto mb-4">
                                  <ToolLogo 
                                    toolSlug={tool.slug} 
                                    categorySlug={tool.category.slug} 
                                    size={56}
                                    className="transition-transform group-hover:scale-110 duration-300"
                                  />
                                </div>
                                <h4 className="font-semibold text-sm text-foreground leading-tight group-hover:text-primary transition-colors">
                                  {tool.title}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                  {tool.description}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        /* Enhanced Mobile List Layout */
                        <div className="space-y-3">
                          {categoryTools.map((tool) => (
                            <Link key={tool.id} href={`/${tool.slug}`}>
                              <div className="tool-card-mobile group">
                                <div className="flex items-center gap-4">
                                  <ToolLogo 
                                    toolSlug={tool.slug} 
                                    categorySlug={tool.category.slug} 
                                    size={40}
                                    className="transition-transform group-hover:scale-105 duration-200"
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                                      {tool.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {tool.description}
                                    </p>
                                  </div>
                                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {filteredTools.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
                  <p className="text-lg text-muted-foreground">
                    {searchQuery ? "No tools found matching your search." : "No tools available."}
                  </p>
                </div>
              )}
            </main>

            {/* Enhanced Sidebar - 25% width */}
            <aside className="w-full lg:w-1/4 space-y-8">
              {/* Enhanced Search and Filter Box */}
              <div className="tool-card animate-scale-in">
                <h3 className="text-xl font-bold mb-6 gradient-text flex items-center gap-3">
                  <Search className="h-6 w-6" />
                  Search & Filter
                </h3>
                <div className="space-y-6">
                  <div>
                    <Input
                      type="text"
                      placeholder="Search tools..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-12 rounded-xl border-2 focus:border-primary/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-3 block">
                      Categories
                    </label>
                    <div className="space-y-2">
                      <Button
                        variant={selectedCategory === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory("all")}
                        className={`w-full justify-start rounded-xl h-11 transition-all duration-200 ${
                          selectedCategory === "all" 
                            ? "btn-gradient shadow-lg" 
                            : "hover:bg-accent border-border"
                        }`}
                      >
                        All Categories
                      </Button>
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.slug ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category.slug)}
                          className={`w-full justify-start rounded-xl h-11 transition-all duration-200 ${
                            selectedCategory === category.slug 
                              ? "btn-gradient shadow-lg" 
                              : "hover:bg-accent border-border"
                          }`}
                        >
                          <div className="mr-3 text-lg">{getIconForCategory(category.name)}</div>
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Popular Tools */}
              <div className="tool-card animate-scale-in">
                <h3 className="text-xl font-bold mb-6 gradient-text">
                  🔥 Popular Tools
                </h3>
                <div className="space-y-3">
                  {tools.slice(0, 8).map((tool) => (
                    <Link key={tool.id} href={`/${tool.slug}`}>
                      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-primary/20">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:scale-110 transition-transform"></div>
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {tool.title}
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-auto" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Enhanced Advertise Section */}
              <div className="tool-card animate-scale-in">
                <div className="gradient-border rounded-2xl">
                  <div className="p-6 bg-card rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-bold">✨</span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground">
                        Advertise With Us
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      Reach thousands of users daily with your products and services on our growing platform.
                    </p>
                    <Button variant="outline" size="sm" className="w-full rounded-xl border-2 hover:border-primary/30 transition-colors">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>

              {/* Enhanced Latest Blog Posts */}
              {blogPosts.length > 0 && (
                <div className="tool-card animate-scale-in">
                  <h3 className="text-xl font-bold mb-6 gradient-text">
                    📰 Latest Articles
                  </h3>
                  <div className="space-y-4">
                    {blogPosts.slice(0, 3).map((post) => (
                      <Link key={post.id} href={`/blog/${post.slug}`}>
                        <div className="group cursor-pointer p-4 rounded-xl hover:bg-accent/50 transition-all duration-200 border border-transparent hover:border-primary/20">
                          <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                            {post.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
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

              {/* Enhanced Quick Stats */}
              <div className="tool-card animate-scale-in">
                <h3 className="text-xl font-bold mb-6 gradient-text">
                  📊 Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-accent/30">
                    <span className="text-sm font-medium text-foreground">Total Tools</span>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-semibold">
                      {tools.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-accent/30">
                    <span className="text-sm font-medium text-foreground">Categories</span>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-semibold">
                      {categories.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-accent/30">
                    <span className="text-sm font-medium text-foreground">Blog Posts</span>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-semibold">
                      {blogPosts.length}
                    </Badge>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Enhanced Blog Section Preview */}
      {blogPosts.length > 0 && (
        <section className="relative py-20 overflow-hidden">
          {/* Background with subtle pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-accent/20"></div>
          <div className="absolute inset-0 grid-pattern opacity-20"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Latest from Our Blog
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Tips, tutorials, and insights to help you make the most of our tools and boost your productivity
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {blogPosts.slice(0, 3).map((post, index) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <div className={`tool-card group cursor-pointer h-full animate-slide-up`} 
                       style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-medium">
                        Blog
                      </Badge>
                      <span className="text-xs text-muted-foreground font-medium">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground font-medium">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <div className="flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                        Read more 
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center animate-scale-in">
              <Link href="/blog">
                <Button size="lg" className="btn-gradient px-8 py-4 text-lg font-semibold rounded-2xl shadow-2xl">
                  <span className="mr-2">View All Posts</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
