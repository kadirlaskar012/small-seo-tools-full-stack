import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";

interface SiteBranding {
  id: number;
  type: string;
  name: string;
  fileData: string;
  fileType: string;
  fileName: string;
  fileSize: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function DynamicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get site branding
  const { data: logoData } = useQuery({
    queryKey: ["/api/site-branding", "logo"],
    queryFn: () => apiRequest("/api/site-branding/logo"),
    retry: false,
  });

  const { data: navIconData } = useQuery({
    queryKey: ["/api/site-branding", "nav_icon"],
    queryFn: () => apiRequest("/api/site-branding/nav_icon"),
    retry: false,
  });

  // Get categories for navigation
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const getLogoUrl = () => {
    if (logoData?.fileData) {
      return `data:${logoData.fileType};base64,${logoData.fileData}`;
    }
    return null;
  };

  const getNavIconUrl = () => {
    if (navIconData?.fileData) {
      return `data:${navIconData.fileType};base64,${navIconData.fileData}`;
    }
    return null;
  };

  const logoUrl = getLogoUrl();
  const navIconUrl = getNavIconUrl();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center space-x-2">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Website Logo"
                className="h-8 w-auto max-w-[120px] object-contain"
              />
            ) : navIconUrl ? (
              <div className="flex items-center space-x-2">
                <img
                  src={navIconUrl}
                  alt="Site Icon"
                  className="h-8 w-8 object-contain"
                />
                <span className="font-bold text-xl">Online Tools</span>
              </div>
            ) : (
              <span className="font-bold text-xl">Online Tools</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            {categories.slice(0, 4).map((category: any) => (
              <Link
                key={category.id}
                href={`/?category=${category.slug}`}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {category.name}
              </Link>
            ))}
            <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              Blog
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </form>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </form>

              {/* Mobile Navigation Links */}
              <Link
                href="/"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {categories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/?category=${category.slug}`}
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <Link
                href="/blog"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}