import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Monitor, Settings, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DPIConversionResult {
  success: boolean;
  output_url?: string;
  original_dpi?: number;
  new_dpi?: number;
  original_size?: [number, number];
  new_size?: [number, number];
  file_size_original?: number;
  file_size_new?: number;
  format?: string;
  processing_time?: number;
  error?: string;
}

export function ImageDPIConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<DPIConversionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [targetDPI, setTargetDPI] = useState("300");
  const [customDPI, setCustomDPI] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const commonDPIs = [
    { value: "72", label: "72 DPI (Web/Screen)" },
    { value: "150", label: "150 DPI (Standard Print)" },
    { value: "300", label: "300 DPI (High Quality Print)" },
    { value: "600", label: "600 DPI (Professional Print)" },
    { value: "custom", label: "Custom DPI" },
  ];

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

  const convertDPI = async () => {
    if (!selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please select an image file first",
        variant: "destructive",
      });
      return;
    }

    const dpiValue = targetDPI === "custom" ? customDPI : targetDPI;
    if (!dpiValue || isNaN(Number(dpiValue)) || Number(dpiValue) <= 0) {
      toast({
        title: "Invalid DPI",
        description: "Please enter a valid DPI value",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('target_dpi', dpiValue);

      const response = await fetch('/api/tools/image-dpi-converter', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast({
          title: "DPI Conversion Complete",
          description: `Image DPI changed from ${data.original_dpi || 'Unknown'} to ${data.new_dpi} DPI`,
        });
      }
    } catch (error) {
      console.error("DPI conversion error:", error);
      setResult({
        success: false,
        error: "Failed to convert DPI. Please try again.",
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
      link.download = `dpi-converted-${targetDPI === "custom" ? customDPI : targetDPI}-${Date.now()}.${result.format?.toLowerCase() || 'jpg'}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download the converted image",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setTargetDPI("300");
    setCustomDPI("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const loadSample = () => {
    toast({
      title: "Sample Image",
      description: "Please upload your own image for DPI conversion",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload and Settings Section */}
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
                      alt="Preview" 
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

              {/* DPI Settings */}
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  DPI Settings
                </Label>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="target-dpi" className="text-sm">Target DPI</Label>
                    <Select value={targetDPI} onValueChange={setTargetDPI}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select DPI" />
                      </SelectTrigger>
                      <SelectContent>
                        {commonDPIs.map((dpi) => (
                          <SelectItem key={dpi.value} value={dpi.value}>
                            {dpi.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {targetDPI === "custom" && (
                    <div>
                      <Label htmlFor="custom-dpi" className="text-sm">Custom DPI Value</Label>
                      <Input
                        id="custom-dpi"
                        type="number"
                        placeholder="Enter DPI (e.g., 150)"
                        value={customDPI}
                        onChange={(e) => setCustomDPI(e.target.value)}
                        min="1"
                        max="2400"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={convertDPI} 
                  disabled={!selectedFile || isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Settings className="h-4 w-4 mr-2 animate-spin" />
                      Converting DPI...
                    </>
                  ) : (
                    <>
                      <Settings className="h-4 w-4 mr-2" />
                      Convert DPI
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
            <div className="space-y-4">
              <Label className="text-base font-medium">Conversion Result</Label>
              
              {result ? (
                <>
                  {result.success ? (
                    <div className="space-y-4">
                      {result.output_url && (
                        <div className="border rounded-lg p-4">
                          <img 
                            src={result.output_url} 
                            alt="Converted" 
                            className="w-full max-h-64 object-contain rounded-lg"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-600">Original</Label>
                          <div className="space-y-1">
                            <Badge variant="outline">
                              DPI: {result.original_dpi || 'Unknown'}
                            </Badge>
                            {result.original_size && (
                              <Badge variant="outline">
                                Size: {result.original_size[0]} × {result.original_size[1]}
                              </Badge>
                            )}
                            {result.file_size_original && (
                              <Badge variant="outline">
                                {(result.file_size_original / 1024 / 1024).toFixed(2)} MB
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-600">Converted</Label>
                          <div className="space-y-1">
                            <Badge variant="default">
                              DPI: {result.new_dpi}
                            </Badge>
                            {result.new_size && (
                              <Badge variant="outline">
                                Size: {result.new_size[0]} × {result.new_size[1]}
                              </Badge>
                            )}
                            {result.file_size_new && (
                              <Badge variant="outline">
                                {(result.file_size_new / 1024 / 1024).toFixed(2)} MB
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {result.processing_time && (
                        <Badge variant="outline">
                          Processing Time: {result.processing_time}ms
                        </Badge>
                      )}

                      <Button 
                        onClick={downloadImage}
                        className="w-full"
                        disabled={!result.output_url}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download DPI Converted Image
                      </Button>
                    </div>
                  ) : (
                    <Alert variant="destructive">
                      <AlertDescription>
                        <strong>DPI Conversion Failed:</strong> {result.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <Monitor className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Converted image will appear here</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}