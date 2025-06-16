import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/ui/scroll-to-top";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import Tool from "@/pages/tool";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function Router() {
  const [location] = useLocation();

  // Scroll to top whenever the location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/admin" component={Admin} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/tool/:slug">
            {(params) => {
              window.history.replaceState(null, '', `/${params.slug}`);
              return <Tool />;
            }}
          </Route>
          <Route path="/:slug" component={Tool} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
