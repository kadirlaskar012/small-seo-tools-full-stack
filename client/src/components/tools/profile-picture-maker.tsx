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
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 10MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResultUrl('');
    }
  }, [toast]);

  const processImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('options', JSON.stringify(options));

      const result = await apiRequest('/api/tools/profile-picture-maker', {
        method: 'POST',
        body: formData,
      });

      if (result.success) {
        setResultUrl(result.output_url);
        toast({
          title: "Profile picture created!",
          description: `Processed in ${result.processing_time}ms`,
        });
      } else {
        toast({
          title: "Processing failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generatePracticeSheet = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('options', JSON.stringify(options));

      const result = await apiRequest('/api/tools/profile-picture-practice-sheet', {
        method: 'POST',
        body: formData,
      });

      if (result.success) {
        // Download the practice sheet
        const link = document.createElement('a');
        link.href = result.practice_sheet_url;
        link.download = 'profile-practice-sheet.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: "Practice sheet generated!",
          description: `${result.total_profiles} profiles in ${result.grid_layout} layout`,
        });
      } else {
        toast({
          title: "Generation failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate practice sheet",
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

  const saveTemplate = () => {
    const templateName = `Template ${savedTemplates.length + 1}`;
    const newTemplate = {
      name: templateName,
      options: { ...options },
      timestamp: new Date().toISOString()
    };
    
    const updated = [...savedTemplates, newTemplate];
    setSavedTemplates(updated);
    localStorage.setItem('profile-picture-templates', JSON.stringify(updated));
    
    toast({
      title: "Template saved!",
      description: `Saved as "${templateName}"`,
    });
  };

  const loadTemplate = (template: any) => {
    setOptions(template.options);
    toast({
      title: "Template loaded!",
      description: `Applied "${template.name}"`,
    });
  };

  // Load saved templates on mount
  useEffect(() => {
    const saved = localStorage.getItem('profile-picture-templates');
    if (saved) {
      setSavedTemplates(JSON.parse(saved));
    }
  }, []);

  const resetToDefaults = () => {
    setOptions({
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
  };

  const updateOption = (key: keyof ProfilePictureOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              Profile Picture Maker
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Create stunning profile pictures with advanced editing tools</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            {resultUrl && (
              <>
                <Button variant="outline" size="sm" onClick={shareImage}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button onClick={downloadImage}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload and Preview Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
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
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
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
                  <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
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
                      className="max-w-full max-h-[280px] object-contain rounded"
                    />
                  </div>
                </div>
              )}

              {/* Template Management */}
              {savedTemplates.length > 0 && (
                <div className="space-y-2">
                  <Label>Saved Templates</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {savedTemplates.map((template, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => loadTemplate(template)}
                        className="text-xs"
                      >
                        {template.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Controls Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Editing Controls
              </CardTitle>
              <CardDescription>
                Customize your profile picture with advanced editing tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="styles" className="space-y-4">
                <TabsList className="grid grid-cols-6 w-full">
                  <TabsTrigger value="styles">Styles</TabsTrigger>
                  <TabsTrigger value="canvas">Canvas</TabsTrigger>
                  <TabsTrigger value="transform">Transform</TabsTrigger>
                  <TabsTrigger value="background">Background</TabsTrigger>
                  <TabsTrigger value="border">Border</TabsTrigger>
                  <TabsTrigger value="adjust">Adjust</TabsTrigger>
                </TabsList>

                {/* Profile Styles */}
                <TabsContent value="styles" className="space-y-4">
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Profile Style
                    </Label>
                    
                    <Select value={options.style_type} onValueChange={(value) => updateOption('style_type', value)}>
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
                        <div className="grid grid-cols-4 gap-2">
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

                {/* Canvas Options */}
                <TabsContent value="canvas" className="space-y-4">
                  <div className="space-y-3">
                    <Label>Canvas Shape</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'square', label: 'Square' },
                        { value: '4:5', label: '4:5' },
                        { value: 'rounded', label: 'Rounded' },
                        { value: 'circle', label: 'Circle' },
                        { value: 'viber', label: 'Viber' }
                      ].map((canvas) => (
                        <Button
                          key={canvas.value}
                          variant={options.canvas_type === canvas.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateOption('canvas_type', canvas.value)}
                        >
                          {canvas.label}
                        </Button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Width: {options.canvas_width}px</Label>
                        <Slider
                          value={[options.canvas_width]}
                          onValueChange={([value]) => updateOption('canvas_width', value)}
                          min={200}
                          max={800}
                          step={10}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Height: {options.canvas_height}px</Label>
                        <Slider
                          value={[options.canvas_height]}
                          onValueChange={([value]) => updateOption('canvas_height', value)}
                          min={200}
                          max={800}
                          step={10}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Transform Controls */}
                <TabsContent value="transform" className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Zoom: {options.zoom.toFixed(1)}x</Label>
                        <Slider
                          value={[options.zoom]}
                          onValueChange={([value]) => updateOption('zoom', value)}
                          min={0.5}
                          max={3.0}
                          step={0.1}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Rotation: {options.rotation}°</Label>
                        <Slider
                          value={[options.rotation]}
                          onValueChange={([value]) => updateOption('rotation', value)}
                          min={-180}
                          max={180}
                          step={1}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Position X: {options.position_x}px</Label>
                        <Slider
                          value={[options.position_x]}
                          onValueChange={([value]) => updateOption('position_x', value)}
                          min={-100}
                          max={100}
                          step={1}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Position Y: {options.position_y}px</Label>
                        <Slider
                          value={[options.position_y]}
                          onValueChange={([value]) => updateOption('position_y', value)}
                          min={-100}
                          max={100}
                          step={1}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={options.flip_h}
                          onCheckedChange={(checked) => updateOption('flip_h', checked)}
                        />
                        <Label className="flex items-center gap-2">
                          <FlipHorizontal className="h-4 w-4" />
                          Flip Horizontal
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={options.flip_v}
                          onCheckedChange={(checked) => updateOption('flip_v', checked)}
                        />
                        <Label className="flex items-center gap-2">
                          <FlipVertical className="h-4 w-4" />
                          Flip Vertical
                        </Label>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          updateOption('zoom', 1.0);
                          updateOption('rotation', 0);
                          updateOption('position_x', 0);
                          updateOption('position_y', 0);
                          updateOption('flip_h', false);
                          updateOption('flip_v', false);
                        }}
                      >
                        <RotateCw className="h-4 w-4 mr-2" />
                        Reset Transform
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Background Options */}
                <TabsContent value="background" className="space-y-4">
                  <div className="space-y-3">
                    <Label>Background Type</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'solid', label: 'Solid Color' },
                        { value: 'gradient', label: 'Gradient' },
                        { value: 'pattern', label: 'Pattern' }
                      ].map((bg) => (
                        <Button
                          key={bg.value}
                          variant={options.bg_type === bg.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateOption('bg_type', bg.value)}
                        >
                          {bg.label}
                        </Button>
                      ))}
                    </div>

                    {options.bg_type === 'solid' && (
                      <div className="space-y-2">
                        <Label>Background Color</Label>
                        <div className="grid grid-cols-6 gap-2">
                          {[
                            [255, 255, 255], [240, 240, 240], [200, 200, 200], [100, 100, 100], [50, 50, 50], [0, 0, 0],
                            [255, 200, 200], [200, 255, 200], [200, 200, 255], [255, 255, 200], [255, 200, 255], [200, 255, 255]
                          ].map((color, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded cursor-pointer border-2 border-gray-300 hover:border-blue-500"
                              style={{ backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }}
                              onClick={() => updateOption('bg_color', color)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {options.bg_type === 'gradient' && (
                      <div className="space-y-2">
                        <Label>Gradient Colors</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            [[255, 200, 200], [255, 100, 100]],
                            [[200, 255, 200], [100, 255, 100]],
                            [[200, 200, 255], [100, 100, 255]],
                            [[255, 255, 200], [255, 200, 100]]
                          ].map((gradient, index) => (
                            <div
                              key={index}
                              className="w-full h-8 rounded cursor-pointer border-2 border-gray-300 hover:border-blue-500"
                              style={{
                                background: `linear-gradient(to bottom, rgb(${gradient[0][0]}, ${gradient[0][1]}, ${gradient[0][2]}), rgb(${gradient[1][0]}, ${gradient[1][1]}, ${gradient[1][2]}))`
                              }}
                              onClick={() => updateOption('gradient_colors', gradient)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {options.bg_type === 'pattern' && (
                      <div className="space-y-2">
                        <Label>Pattern Type</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {['dots', 'lines', 'checker'].map((pattern) => (
                            <Button
                              key={pattern}
                              variant={options.pattern_type === pattern ? "default" : "outline"}
                              size="sm"
                              onClick={() => updateOption('pattern_type', pattern)}
                            >
                              {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Border Options */}
                <TabsContent value="border" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Border Size: {options.border_size}px</Label>
                      <Slider
                        value={[options.border_size]}
                        onValueChange={([value]) => updateOption('border_size', value)}
                        min={0}
                        max={50}
                        step={1}
                      />
                    </div>

                    {options.border_size > 0 && (
                      <div className="space-y-2">
                        <Label>Border Color</Label>
                        <div className="grid grid-cols-8 gap-2">
                          {[
                            [255, 255, 255], [0, 0, 0], [255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0], [255, 0, 255], [0, 255, 255]
                          ].map((color, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded cursor-pointer border-2 border-gray-300 hover:border-blue-500"
                              style={{ backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }}
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
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Brightness: {options.brightness.toFixed(1)}</Label>
                        <Slider
                          value={[options.brightness]}
                          onValueChange={([value]) => updateOption('brightness', value)}
                          min={0.1}
                          max={2.0}
                          step={0.1}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Contrast: {options.contrast.toFixed(1)}</Label>
                        <Slider
                          value={[options.contrast]}
                          onValueChange={([value]) => updateOption('contrast', value)}
                          min={0.1}
                          max={2.0}
                          step={0.1}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Saturation: {options.saturation.toFixed(1)}</Label>
                        <Slider
                          value={[options.saturation]}
                          onValueChange={([value]) => updateOption('saturation', value)}
                          min={0.0}
                          max={2.0}
                          step={0.1}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Hue: {options.hue}°</Label>
                        <Slider
                          value={[options.hue]}
                          onValueChange={([value]) => updateOption('hue', value)}
                          min={-180}
                          max={180}
                          step={1}
                        />
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateOption('brightness', 1.0);
                        updateOption('contrast', 1.0);
                        updateOption('saturation', 1.0);
                        updateOption('hue', 0);
                      }}
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      Reset Adjustments
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <Separator className="my-6" />

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={saveTemplate}
                  variant="outline"
                  disabled={!selectedFile}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>

                <Button 
                  onClick={generatePracticeSheet}
                  variant="outline"
                  disabled={!selectedFile || isProcessing}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Practice Sheet
                </Button>

                <Button 
                  onClick={resetToDefaults}
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset All
                </Button>

                {resultUrl && (
                  <Badge variant="secondary" className="px-3 py-1">
                    <Eye className="h-3 w-3 mr-1" />
                    Live Preview Active
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}