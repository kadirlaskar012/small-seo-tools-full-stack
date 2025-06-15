import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Upload, Save, Globe, Image, Settings } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { SiteSetting } from "@shared/schema";

export default function SiteSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  const { data: settings = [] } = useQuery<SiteSetting[]>({
    queryKey: ["/api/settings"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      return response.json();
    },
  });

  const settingMutation = useMutation({
    mutationFn: async (data: { key: string; value: string }) => {
      return apiRequest("/api/settings", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Success",
        description: "Setting saved successfully",
      });
    },
  });

  const getSetting = (key: string) => {
    return settings.find(s => s.key === key)?.value || "";
  };

  const handleSaveSetting = async (key: string, value: string) => {
    settingMutation.mutate({ key, value });
  };

  const handleFileUpload = async (file: File, settingKey: string) => {
    try {
      const result = await uploadMutation.mutateAsync(file);
      await handleSaveSetting(settingKey, result.url);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Site Settings</h2>
        <p className="text-muted-foreground">
          Configure your website's global settings, branding, and SEO options.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="meta" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Meta Injection
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic site information and settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input
                    id="site-name"
                    defaultValue={getSetting("site_name")}
                    placeholder="The Ultimate Online Tools"
                    onBlur={(e) => handleSaveSetting("site_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-tagline">Site Tagline</Label>
                  <Input
                    id="site-tagline"
                    defaultValue={getSetting("site_tagline")}
                    placeholder="Powerful tools for everyone"
                    onBlur={(e) => handleSaveSetting("site_tagline", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  defaultValue={getSetting("site_description")}
                  placeholder="A comprehensive collection of free online tools..."
                  onBlur={(e) => handleSaveSetting("site_description", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    defaultValue={getSetting("contact_email")}
                    placeholder="contact@example.com"
                    onBlur={(e) => handleSaveSetting("contact_email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-url">Site URL</Label>
                  <Input
                    id="site-url"
                    defaultValue={getSetting("site_url")}
                    placeholder="https://example.com"
                    onBlur={(e) => handleSaveSetting("site_url", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding & Visual Identity</CardTitle>
              <CardDescription>
                Upload your logo, favicon, and configure visual elements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Site Logo</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    {getSetting("site_logo") ? (
                      <img
                        src={getSetting("site_logo")}
                        alt="Site Logo"
                        className="max-h-20 mx-auto mb-4"
                      />
                    ) : (
                      <div className="mb-4">
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setLogoFile(file);
                          handleFileUpload(file, "site_logo");
                        }
                      }}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload">
                      <Button variant="outline" className="cursor-pointer" asChild>
                        <span>Upload Logo</span>
                      </Button>
                    </label>
                    <p className="text-xs text-muted-foreground mt-2">
                      PNG, JPG up to 2MB. Recommended: 200x60px
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Favicon</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    {getSetting("site_favicon") ? (
                      <img
                        src={getSetting("site_favicon")}
                        alt="Favicon"
                        className="w-8 h-8 mx-auto mb-4"
                      />
                    ) : (
                      <div className="mb-4">
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFaviconFile(file);
                          handleFileUpload(file, "site_favicon");
                        }
                      }}
                      className="hidden"
                      id="favicon-upload"
                    />
                    <label htmlFor="favicon-upload">
                      <Button variant="outline" className="cursor-pointer" asChild>
                        <span>Upload Favicon</span>
                      </Button>
                    </label>
                    <p className="text-xs text-muted-foreground mt-2">
                      ICO, PNG 32x32px recommended
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Configuration</CardTitle>
              <CardDescription>
                Configure default SEO settings for your website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-title">Default Page Title</Label>
                <Input
                  id="default-title"
                  defaultValue={getSetting("default_title")}
                  placeholder="The Ultimate Online Tools"
                  onBlur={(e) => handleSaveSetting("default_title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-description">Default Meta Description</Label>
                <Textarea
                  id="default-description"
                  defaultValue={getSetting("default_description")}
                  placeholder="Powerful, fast, and easy-to-use online tools for all your digital needs."
                  onBlur={(e) => handleSaveSetting("default_description", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-keywords">Default Keywords</Label>
                <Input
                  id="default-keywords"
                  defaultValue={getSetting("default_keywords")}
                  placeholder="online tools, free tools, web tools, utilities"
                  onBlur={(e) => handleSaveSetting("default_keywords", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="og-image">Default OG Image URL</Label>
                  <Input
                    id="og-image"
                    defaultValue={getSetting("og_image")}
                    placeholder="https://example.com/og-image.jpg"
                    onBlur={(e) => handleSaveSetting("og_image", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter-handle">Twitter Handle</Label>
                  <Input
                    id="twitter-handle"
                    defaultValue={getSetting("twitter_handle")}
                    placeholder="@yourhandle"
                    onBlur={(e) => handleSaveSetting("twitter_handle", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meta">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Meta Injection</CardTitle>
              <CardDescription>
                Add custom meta tags, analytics codes, and tracking scripts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="head-scripts">Head Scripts (Analytics, Meta Tags)</Label>
                <Textarea
                  id="head-scripts"
                  defaultValue={getSetting("head_scripts")}
                  placeholder="<!-- Google Analytics, Meta Pixel, etc. -->"
                  rows={6}
                  onBlur={(e) => handleSaveSetting("head_scripts", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Scripts added here will be injected into the &lt;head&gt; section of every page.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="body-scripts">Body Scripts (Chat widgets, etc.)</Label>
                <Textarea
                  id="body-scripts"
                  defaultValue={getSetting("body_scripts")}
                  placeholder="<!-- Chat widgets, tracking pixels, etc. -->"
                  rows={6}
                  onBlur={(e) => handleSaveSetting("body_scripts", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Scripts added here will be injected before the closing &lt;/body&gt; tag.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-css">Custom CSS</Label>
                <Textarea
                  id="custom-css"
                  defaultValue={getSetting("custom_css")}
                  placeholder="/* Custom styles */"
                  rows={6}
                  onBlur={(e) => handleSaveSetting("custom_css", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Custom CSS will be added to the site's stylesheet.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}