import { Link } from "wouter";
import { Combine, Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary/10 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Combine className="h-6 w-6 text-primary mr-2" />
              <h3 className="text-xl font-bold">The Ultimate Online Tools</h3>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Your one-stop destination for powerful online tools. Fast, free, and easy to use.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Tool Categories</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/?category=text-tools" className="hover:text-primary transition-colors">
                  Text Tools
                </Link>
              </li>
              <li>
                <Link href="/?category=image-tools" className="hover:text-primary transition-colors">
                  Image Tools
                </Link>
              </li>
              <li>
                <Link href="/?category=pdf-tools" className="hover:text-primary transition-colors">
                  PDF Tools
                </Link>
              </li>
              <li>
                <Link href="/?category=seo-tools" className="hover:text-primary transition-colors">
                  SEO Tools
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 The Ultimate Online Tools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
