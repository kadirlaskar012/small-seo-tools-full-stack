import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Upload, Download, Image as ImageIcon, Scissors, Eye, EyeOff, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BackgroundRemovalResult {
  success: boolean;
  output_url?: string;
  processing_time?: number;
  image_info?: {
    original_size: [number, number];
    output_size: [number, number];
    format: string;
  };
  error?: string;
}

export function BackgroundRemover() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<BackgroundRemovalResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [smoothEdges, setSmoothEdges] = useState(true);
  const [hdMode, setHdMode] = useState(false);
  const [showComparison, setShowComparison] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeBackground = async () => {
    if (!selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please select an image file first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('smooth_edges', smoothEdges.toString());
      formData.append('hd_mode', hdMode.toString());

      const response = await fetch('/api/tools/background-remover', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast({
          title: "Background Removed",
          description: `Processing completed in ${data.processing_time || 0}ms`,
        });
      }
    } catch (error) {
      console.error("Background removal error:", error);
      setResult({
        success: false,
        error: "Failed to remove background. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!result?.output_url) return;

    try {
      const response = await fetch(result.output_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `background-removed-${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download the processed image",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const loadSample = () => {
    toast({
      title: "Sample Image",
      description: "Please upload your own image for background removal",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Background Remover
          </CardTitle>
          <CardDescription>
            Automatically remove backgrounds from images using AI technology. 
            Get transparent PNG images ready for use.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <div className="space-y-4">
            <Label htmlFor="image-upload" className="text-base font-medium">Upload Image</Label>
            
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              
              {previewUrl ? (
                <div className="space-y-4">
                  <img 
                    src={previewUrl} 
                    alt="Original" 
                    className="max-w-full max-h-48 mx-auto rounded-lg shadow-md"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedFile?.name} ({((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-gray-400" />
                  <div>
                    <p className="text-lg">Drop an image here or click to upload</p>
                    <p className="text-sm text-gray-500">Supports JPG, PNG, JPEG files</p>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <Label htmlFor="smooth-edges" className="text-sm font-medium">
                  Smooth Edges
                </Label>
                <Switch
                  id="smooth-edges"
                  checked={smoothEdges}
                  onCheckedChange={setSmoothEdges}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="hd-mode" className="text-sm font-medium">
                  HD Mode (Slower)
                </Label>
                <Switch
                  id="hd-mode"
                  checked={hdMode}
                  onCheckedChange={setHdMode}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={removeBackground} 
                disabled={!selectedFile || isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Scissors className="h-4 w-4 mr-2 animate-spin" />
                    Removing Background...
                  </>
                ) : (
                  <>
                    <Scissors className="h-4 w-4 mr-2" />
                    Remove Background
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={loadSample}>
                Sample
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <>
              {result.success ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Result</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowComparison(!showComparison)}
                      >
                        {showComparison ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {showComparison ? "Hide" : "Show"} Comparison
                      </Button>
                    </div>
                  </div>

                  {showComparison && previewUrl ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600">Original</Label>
                        <div className="relative">
                          <img 
                            src={previewUrl} 
                            alt="Original" 
                            className="w-full rounded-lg shadow-md"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600">Background Removed</Label>
                        <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4" style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='smallGrid' width='8' height='8' patternUnits='userSpaceOnUse'%3e%3cpath d='M 8 0 L 0 0 0 8' fill='none' stroke='gray' stroke-width='0.5'/%3e%3c/pattern%3e%3cpattern id='grid' width='80' height='80' patternUnits='userSpaceOnUse'%3e%3crect width='80' height='80' fill='url(%23smallGrid)'/%3e%3cpath d='M 80 0 L 0 0 0 80' fill='none' stroke='gray' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e")`,
                        }}>
                          <img 
                            src={result.output_url} 
                            alt="Background Removed" 
                            className="w-full rounded-lg shadow-md"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4" style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='smallGrid' width='8' height='8' patternUnits='userSpaceOnUse'%3e%3cpath d='M 8 0 L 0 0 0 8' fill='none' stroke='gray' stroke-width='0.5'/%3e%3c/pattern%3e%3cpattern id='grid' width='80' height='80' patternUnits='userSpaceOnUse'%3e%3crect width='80' height='80' fill='url(%23smallGrid)'/%3e%3cpath d='M 80 0 L 0 0 0 80' fill='none' stroke='gray' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e")`,
                    }}>
                      <img 
                        src={result.output_url} 
                        alt="Background Removed" 
                        className="max-w-full max-h-96 mx-auto rounded-lg shadow-md"
                      />
                    </div>
                  )}

                  {result.image_info && (
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default">
                        Processing Time: {result.processing_time || 0}ms
                      </Badge>
                      <Badge variant="outline">
                        Original: {result.image_info.original_size[0]} × {result.image_info.original_size[1]}
                      </Badge>
                      <Badge variant="outline">
                        Output: {result.image_info.output_size[0]} × {result.image_info.output_size[1]}
                      </Badge>
                      <Badge variant="outline">
                        Format: {result.image_info.format}
                      </Badge>
                    </div>
                  )}

                  <Button 
                    onClick={downloadImage}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG with Transparent Background
                  </Button>
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertDescription>
                    <strong>Background Removal Failed:</strong> {result.error}
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}