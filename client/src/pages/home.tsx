import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ArrowRight, ChevronRight } from "lucide-react";
import type { Category, ToolWithCategory, BlogPost } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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

  const getColorForCategory = (color: string) => {
    const colorMap: Record<string, string> = {
      "#3B82F6": "bg-blue-100 text-blue-600 border-blue-200",
      "#8B5CF6": "bg-purple-100 text-purple-600 border-purple-200",
      "#EF4444": "bg-red-100 text-red-600 border-red-200",
      "#10B981": "bg-green-100 text-green-600 border-green-200",
      "#F59E0B": "bg-orange-100 text-orange-600 border-orange-200",
      "#6366F1": "bg-indigo-100 text-indigo-600 border-indigo-200",
      "#EC4899": "bg-pink-100 text-pink-600 border-pink-200",
      "#14B8A6": "bg-teal-100 text-teal-600 border-teal-200",
      "#84CC16": "bg-lime-100 text-lime-600 border-lime-200",
      "#F97316": "bg-orange-100 text-orange-600 border-orange-200",
    };
    return colorMap[color] || "bg-gray-100 text-gray-600 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* SEO Meta Tags */}
      <title>Free SEO Tools Collection - Powerful Tools for Website Optimization</title>
      <meta name="description" content="Access 30+ free SEO tools including page speed checker, meta tag analyzer, keyword density checker, and more. Improve your website's search engine ranking." />
      <meta name="keywords" content="free seo tools, page speed test, meta tags analyzer, keyword density, seo checker, website optimization" />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 lg:mb-6">
              Powerful SEO Tools
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-6 lg:mb-8 text-blue-100">
              Free tools to optimize your website and boost search rankings
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 py-3 text-lg bg-white/10 border border-white/20 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Tool Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === "all" 
                  ? "bg-blue-100 text-blue-600 border-2 border-blue-200" 
                  : "bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              All Tools ({tools.length})
            </button>
            {categories.map((category) => {
              const categoryTools = tools.filter(tool => tool.category.id === category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors border-2 ${
                    selectedCategory === category.slug 
                      ? getColorForCategory(category.color)
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {!isMobile && (
                    <span className="mr-2">{category.icon}</span>
                  )}
                  {category.name} ({categoryTools.length})
                </button>
              );
            })}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Card key={tool.id} className="group hover:shadow-lg transition-all duration-200 border-2 border-gray-100 hover:border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${getColorForCategory(tool.category.color)} flex-shrink-0 mr-4`}>
                    {!isMobile && (
                      <span className="text-2xl">{tool.category.icon}</span>
                    )}
                    {isMobile && (
                      <div className="w-6 h-6 bg-current rounded opacity-60"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {tool.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getColorForCategory(tool.category.color)}`}>
                    {tool.category.name}
                  </span>
                  <Link 
                    href={`/tools/${tool.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:translate-x-1 transition-transform"
                  >
                    Use Tool
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-600">Try adjusting your search or category filter.</p>
          </div>
        )}

        {/* Blog Section */}
        {blogPosts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Latest Articles
              </h2>
              <Link 
                href="/blog"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.slice(0, 3).map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}