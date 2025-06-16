import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Upload, 
  Download, 
  Share2, 
  RotateCw, 
  FlipHorizontal, 
  FlipVertical, 
  Move, 
  Palette, 
  Sun, 
  Moon,
  RefreshCw,
  FileImage,
  Zap,
  Sparkles,
  Target,
  Settings,
  Eye,
  Save,
  Printer
} from 'lucide-react';

interface ProfilePictureOptions {
  style_type: string;
  style_variant: number;
  canvas_type: string;
  canvas_width: number;
  canvas_height: number;
  zoom: number;
  rotation: number;
  flip_h: boolean;
  flip_v: boolean;
  position_x: number;
  position_y: number;
  bg_type: string;
  bg_color: number[];
  gradient_colors?: number[][];
  pattern_type?: string;
  border_size: number;
  border_color: number[];
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
}

export default function ProfilePictureMaker() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [resultUrl, setResultUrl] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState<any[]>([]);
  
  const [options, setOptions] = useState<ProfilePictureOptions>({
    style_type: 'none',
    style_variant: 1,
    canvas_type: 'square',
    canvas_width: 400,
    canvas_height: 400,
    zoom: 1.0,
    rotation: 0,
    flip_h: false,
    flip_v: false,
    position_x: 0,
    position_y: 0,
    bg_type: 'solid',
    bg_color: [255, 255, 255],
    border_size: 0,
    border_color: [255, 255, 255],
    brightness: 1.0,
    contrast: 1.0,
    saturation: 1.0,
    hue: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Auto-process when options change
  useEffect(() => {
    if (selectedFile && !isProcessing) {
      const timeoutId = setTimeout(() => {
        processImage();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [options, selectedFile]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const processImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('options', JSON.stringify(options));

      const response = await apiRequest('/api/tools/profile-picture-maker/process', {
        method: 'POST',
        body: formData,
      });

      if (response.success && response.image_url) {
        setResultUrl(response.image_url);
        toast({
          title: "Success!",
          description: "Profile picture processed successfully",
        });
      } else {
        throw new Error(response.error || 'Processing failed');
      }
    } catch (error: any) {
      toast({
        title: "Processing failed",
        description: error.message || "Failed to process image",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (resultUrl) {
      const link = document.createElement('a');
      link.href = resultUrl;
      link.download = 'profile-picture.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const shareImage = async () => {
    if (resultUrl && navigator.share) {
      try {
        const response = await fetch(resultUrl);
        const blob = await response.blob();
        const file = new File([blob], 'profile-picture.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'My Profile Picture',
          text: 'Check out my new profile picture!',
          files: [file]
        });
      } catch (error) {
        toast({
          title: "Share failed",
          description: "Sharing not supported on this device",
          variant: "destructive",
        });
      }
    } else {
      // Fallback - copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Share link copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard",
          variant: "destructive",
        });
      }
    }
  };

  const updateOption = (key: keyof ProfilePictureOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center max-w-7xl mx-auto gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              Profile Picture Maker
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Create stunning profile pictures with advanced editing tools</p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            {resultUrl && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={shareImage} className="hidden sm:flex">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button onClick={downloadImage} size="sm">
                  <Download className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Upload and Preview Section */}
          <div className="lg:col-span-1 order-1 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileImage className="h-5 w-5" />
                  Upload & Preview
                </CardTitle>
                <CardDescription>
                  Upload your image and see live preview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Select Image</Label>
                  <div 
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedFile ? selectedFile.name : 'Click to upload image'}
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Replace Photo Button */}
                {selectedFile && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Replace Photo
                  </Button>
                )}

                {/* Live Preview */}
                {(previewUrl || resultUrl) && (
                  <div className="space-y-2">
                    <Label>Live Preview</Label>
                    <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-[200px] sm:min-h-[300px] flex items-center justify-center">
                      {isProcessing && (
                        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center z-10">
                          <div className="text-white flex items-center gap-2">
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                            Processing...
                          </div>
                        </div>
                      )}
                      
                      <img
                        src={resultUrl || previewUrl}
                        alt="Preview"
                        className="max-w-full max-h-[180px] sm:max-h-[280px] object-contain rounded"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Controls Section */}
          <div className="lg:col-span-2 order-2 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5" />
                  Editing Controls
                </CardTitle>
                <CardDescription>
                  Customize your profile picture with advanced editing tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="styles" className="space-y-4">
                  <div className="w-full">
                    <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full h-auto p-1">
                      <TabsTrigger value="styles" className="text-xs px-1 py-2 h-auto">Styles</TabsTrigger>
                      <TabsTrigger value="canvas" className="text-xs px-1 py-2 h-auto">Canvas</TabsTrigger>
                      <TabsTrigger value="transform" className="text-xs px-1 py-2 h-auto">Transform</TabsTrigger>
                      <TabsTrigger value="background" className="text-xs px-1 py-2 h-auto">Bg</TabsTrigger>
                      <TabsTrigger value="border" className="text-xs px-1 py-2 h-auto">Border</TabsTrigger>
                      <TabsTrigger value="adjust" className="text-xs px-1 py-2 h-auto">Adjust</TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Profile Styles */}
                  <TabsContent value="styles" className="space-y-4">
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Profile Style
                      </Label>
                      
                      <Select value={options.style_type} onValueChange={(value: string) => updateOption('style_type', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Style</SelectItem>
                          <SelectItem value="abstract">Abstract</SelectItem>
                          <SelectItem value="bw">Black & White</SelectItem>
                          <SelectItem value="bordered">Bordered</SelectItem>
                        </SelectContent>
                      </Select>

                      {options.style_type !== 'none' && (
                        <div className="space-y-2">
                          <Label>Style Variant</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map((variant) => (
                              <Button
                                key={variant}
                                variant={options.style_variant === variant ? "default" : "outline"}
                                size="sm"
                                onClick={() => updateOption('style_variant', variant)}
                              >
                                Style {variant}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Canvas Settings */}
                  <TabsContent value="canvas" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Canvas Shape</Label>
                        <Select value={options.canvas_type} onValueChange={(value: string) => updateOption('canvas_type', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="square">Square</SelectItem>
                            <SelectItem value="circle">Circle</SelectItem>
                            <SelectItem value="rectangle">Rectangle</SelectItem>
                            <SelectItem value="rounded">Rounded Square</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Width: {options.canvas_width}px</Label>
                          <Slider
                            value={[options.canvas_width]}
                            onValueChange={([value]: number[]) => updateOption('canvas_width', value)}
                            min={200}
                            max={800}
                            step={50}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Height: {options.canvas_height}px</Label>
                          <Slider
                            value={[options.canvas_height]}
                            onValueChange={([value]: number[]) => updateOption('canvas_height', value)}
                            min={200}
                            max={800}
                            step={50}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Transform Controls */}
                  <TabsContent value="transform" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Zoom: {options.zoom.toFixed(1)}x</Label>
                        <Slider
                          value={[options.zoom]}
                          onValueChange={([value]: number[]) => updateOption('zoom', value)}
                          min={0.5}
                          max={3.0}
                          step={0.1}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Rotation: {options.rotation}°</Label>
                        <Slider
                          value={[options.rotation]}
                          onValueChange={([value]: number[]) => updateOption('rotation', value)}
                          min={-180}
                          max={180}
                          step={1}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={options.flip_h}
                            onCheckedChange={(checked: boolean) => updateOption('flip_h', checked)}
                          />
                          <Label className="flex items-center gap-2">
                            <FlipHorizontal className="h-4 w-4" />
                            Flip Horizontal
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={options.flip_v}
                            onCheckedChange={(checked: boolean) => updateOption('flip_v', checked)}
                          />
                          <Label className="flex items-center gap-2">
                            <FlipVertical className="h-4 w-4" />
                            Flip Vertical
                          </Label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Background Settings */}
                  <TabsContent value="background" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Background Type</Label>
                        <Select value={options.bg_type} onValueChange={(value: string) => updateOption('bg_type', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solid">Solid Color</SelectItem>
                            <SelectItem value="gradient">Gradient</SelectItem>
                            <SelectItem value="pattern">Pattern</SelectItem>
                            <SelectItem value="transparent">Transparent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {options.bg_type === 'solid' && (
                        <div className="space-y-2">
                          <Label>Background Color</Label>
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {[
                              [255, 255, 255], [240, 240, 240], [200, 200, 200], [100, 100, 100],
                              [255, 235, 235], [235, 255, 235], [235, 235, 255], [255, 255, 235],
                              [59, 130, 246], [34, 197, 94], [239, 68, 68], [168, 85, 247]
                            ].map((color, index) => (
                              <button
                                key={index}
                                className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500"
                                style={{ backgroundColor: `rgb(${color.join(',')})` }}
                                onClick={() => updateOption('bg_color', color)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Border Settings */}
                  <TabsContent value="border" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Border Size: {options.border_size}px</Label>
                        <Slider
                          value={[options.border_size]}
                          onValueChange={([value]: number[]) => updateOption('border_size', value)}
                          min={0}
                          max={20}
                          step={1}
                        />
                      </div>

                      {options.border_size > 0 && (
                        <div className="space-y-2">
                          <Label>Border Color</Label>
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {[
                              [255, 255, 255], [0, 0, 0], [59, 130, 246], [34, 197, 94],
                              [239, 68, 68], [168, 85, 247], [245, 158, 11], [20, 184, 166]
                            ].map((color, index) => (
                              <button
                                key={index}
                                className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500"
                                style={{ backgroundColor: `rgb(${color.join(',')})` }}
                                onClick={() => updateOption('border_color', color)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Photo Adjustments */}
                  <TabsContent value="adjust" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Brightness: {options.brightness.toFixed(1)}</Label>
                        <Slider
                          value={[options.brightness]}
                          onValueChange={([value]: number[]) => updateOption('brightness', value)}
                          min={0.5}
                          max={2.0}
                          step={0.1}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Contrast: {options.contrast.toFixed(1)}</Label>
                        <Slider
                          value={[options.contrast]}
                          onValueChange={([value]: number[]) => updateOption('contrast', value)}
                          min={0.5}
                          max={2.0}
                          step={0.1}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Saturation: {options.saturation.toFixed(1)}</Label>
                        <Slider
                          value={[options.saturation]}
                          onValueChange={([value]: number[]) => updateOption('saturation', value)}
                          min={0.0}
                          max={2.0}
                          step={0.1}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Hue: {options.hue}°</Label>
                        <Slider
                          value={[options.hue]}
                          onValueChange={([value]: number[]) => updateOption('hue', value)}
                          min={-180}
                          max={180}
                          step={1}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <Separator className="my-6" />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={processImage} 
                    disabled={!selectedFile || isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Process Image
                      </>
                    )}
                  </Button>

                  {resultUrl && (
                    <Button variant="outline" onClick={downloadImage} className="flex-1 sm:flex-none">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>

                {resultUrl && (
                  <Badge variant="secondary" className="px-3 py-1 w-fit">
                    <Eye className="h-3 w-3 mr-1" />
                    Live Preview Active
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}