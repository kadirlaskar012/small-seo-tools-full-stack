import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Download, 
  Upload, 
  Copy, 
  Search, 
  Trash2,
  Save,
  Moon,
  Sun,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette,
  RotateCcw,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Loader2,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotepadTheme {
  name: string;
  bg: string;
  text: string;
  border: string;
  accent: string;
}

const themes: NotepadTheme[] = [
  { name: "Light", bg: "bg-white", text: "text-gray-900", border: "border-gray-200", accent: "text-blue-600" },
  { name: "Dark", bg: "bg-gray-900", text: "text-gray-100", border: "border-gray-700", accent: "text-blue-400" },
  { name: "Monokai", bg: "bg-gray-800", text: "text-green-400", border: "border-gray-600", accent: "text-yellow-400" },
  { name: "Solarized", bg: "bg-amber-50", text: "text-amber-900", border: "border-amber-200", accent: "text-orange-600" },
  { name: "Dracula", bg: "bg-purple-900", text: "text-purple-100", border: "border-purple-700", accent: "text-pink-400" },
  { name: "Ocean", bg: "bg-blue-50", text: "text-blue-900", border: "border-blue-200", accent: "text-teal-600" }
];

const fontFamilies = [
  { name: "Roboto", value: "font-sans" },
  { name: "Courier", value: "font-mono" },
  { name: "Times", value: "font-serif" },
  { name: "Inter", value: "font-sans" },
  { name: "Fira Code", value: "font-mono" }
];

export function SmartModernNotepad() {
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("untitled.txt");
  const [currentTheme, setCurrentTheme] = useState(themes[0]);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState(fontFamilies[0]);
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [isAutoSave, setIsAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState({ words: 0, characters: 0, lines: 1 });
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState("left");
  const [textColor, setTextColor] = useState("#000000");
  const [autoCapitalize, setAutoCapitalize] = useState(false);
  const [showFind, setShowFind] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Auto-save to localStorage
  useEffect(() => {
    if (isAutoSave && content) {
      localStorage.setItem("notepad-content", content);
      localStorage.setItem("notepad-filename", fileName);
      setLastSaved(new Date());
    }
  }, [content, fileName, isAutoSave]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem("notepad-content");
    const savedFileName = localStorage.getItem("notepad-filename");
    
    if (savedContent) {
      setContent(savedContent);
    }
    if (savedFileName) {
      setFileName(savedFileName);
    }
  }, []);

  // Update word count
  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const characters = content.length;
    const lines = content.split('\n').length;
    
    setWordCount({ words, characters, lines });
  }, [content]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            downloadFile();
            break;
          case 'f':
            e.preventDefault();
            setShowFind(!showFind);
            break;
          case '/':
            e.preventDefault();
            toggleTheme();
            break;
          case 'b':
            e.preventDefault();
            setIsBold(!isBold);
            break;
          case 'i':
            e.preventDefault();
            setIsItalic(!isItalic);
            break;
          case 'u':
            e.preventDefault();
            setIsUnderline(!isUnderline);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFind, isBold, isItalic, isUnderline]);

  const downloadFile = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "File Downloaded",
      description: `${fileName} has been saved to your downloads`
    });
  };

  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(text);
        setFileName(file.name);
        toast({
          title: "File Uploaded",
          description: `${file.name} has been loaded successfully`
        });
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a .txt file",
        variant: "destructive"
      });
    }
  };

  const clearContent = () => {
    setContent("");
    setFileName("untitled.txt");
    localStorage.removeItem("notepad-content");
    localStorage.removeItem("notepad-filename");
    toast({
      title: "Content Cleared",
      description: "Notepad has been cleared"
    });
  };

  const copyAllContent = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Content Copied",
        description: "All content has been copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy content",
        variant: "destructive"
      });
    }
  };

  const selectAllContent = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
    }
  };

  const findAndReplace = () => {
    if (!searchTerm) return;
    
    const newContent = content.replaceAll(searchTerm, replaceTerm);
    setContent(newContent);
    
    toast({
      title: "Replace Complete",
      description: `Replaced "${searchTerm}" with "${replaceTerm}"`
    });
  };

  const toggleTheme = () => {
    const currentIndex = themes.findIndex(theme => theme.name === currentTheme.name);
    const nextIndex = (currentIndex + 1) % themes.length;
    setCurrentTheme(themes[nextIndex]);
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 32));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 10));
  };

  const formatText = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = selectedText;
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `_${selectedText}_`;
        break;
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
  };

  const getTextStyle = () => {
    return {
      fontSize: `${fontSize}px`,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      textDecoration: isUnderline ? 'underline' : 'none',
      textAlign: textAlign as any,
      color: textColor,
      wordWrap: wordWrap ? 'break-word' : 'normal',
      whiteSpace: wordWrap ? 'pre-wrap' : 'pre'
    };
  };

  const getLineNumbers = () => {
    if (!showLineNumbers) return null;
    
    const lines = content.split('\n');
    return (
      <div className="absolute left-0 top-0 p-4 text-sm text-gray-500 select-none pointer-events-none">
        {lines.map((_, index) => (
          <div key={index} style={{ height: `${fontSize * 1.2}px` }}>
            {index + 1}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`w-full max-w-7xl mx-auto space-y-6 ${currentTheme.bg} ${currentTheme.text} min-h-screen transition-all duration-300`}>
      <div className="text-center space-y-2 p-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          📝 Smart Modern Notepad
        </h1>
        <p className="text-muted-foreground">
          Write, edit, save, and share your notes instantly with this modern and elegant online notepad tool
        </p>
      </div>

      {/* Toolbar */}
      <Card className={`shadow-lg ${currentTheme.border}`}>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-48"
                placeholder="File name"
              />
              {isAutoSave && lastSaved && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Auto-saved {lastSaved.toLocaleTimeString()}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={downloadFile}>
                <Download className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button variant="outline" size="sm" onClick={clearContent}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Formatting Toolbar */}
          <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {/* Text Formatting */}
            <div className="flex items-center gap-1 border-r pr-2">
              <Button
                variant={isBold ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsBold(!isBold)}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant={isItalic ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsItalic(!isItalic)}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant={isUnderline ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsUnderline(!isUnderline)}
              >
                <Underline className="h-4 w-4" />
              </Button>
            </div>

            {/* Text Alignment */}
            <div className="flex items-center gap-1 border-r pr-2">
              <Button
                variant={textAlign === "left" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTextAlign("left")}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={textAlign === "center" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTextAlign("center")}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={textAlign === "right" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTextAlign("right")}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Font Size */}
            <div className="flex items-center gap-1 border-r pr-2">
              <Button variant="ghost" size="sm" onClick={decreaseFontSize}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm min-w-[2rem] text-center">{fontSize}</span>
              <Button variant="ghost" size="sm" onClick={increaseFontSize}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Font Family */}
            <Select value={fontFamily.name} onValueChange={(value) => {
              const font = fontFamilies.find(f => f.name === value) || fontFamilies[0];
              setFontFamily(font);
            }}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map(font => (
                  <SelectItem key={font.name} value={font.name}>
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Text Color */}
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-8 h-8 rounded border cursor-pointer"
              />
            </div>

            {/* Theme Selector */}
            <Select value={currentTheme.name} onValueChange={(value) => {
              const theme = themes.find(t => t.name === value) || themes[0];
              setCurrentTheme(theme);
            }}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themes.map(theme => (
                  <SelectItem key={theme.name} value={theme.name}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Settings Bar */}
          <div className="flex flex-wrap items-center gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Button
              variant={showLineNumbers ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowLineNumbers(!showLineNumbers)}
            >
              {showLineNumbers ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              Line Numbers
            </Button>
            
            <Button
              variant={wordWrap ? "default" : "ghost"}
              size="sm"
              onClick={() => setWordWrap(!wordWrap)}
            >
              Word Wrap
            </Button>

            <Button
              variant={isAutoSave ? "default" : "ghost"}
              size="sm"
              onClick={() => setIsAutoSave(!isAutoSave)}
            >
              <Save className="h-4 w-4 mr-2" />
              Auto Save
            </Button>

            <Button
              variant={autoCapitalize ? "default" : "ghost"}
              size="sm"
              onClick={() => setAutoCapitalize(!autoCapitalize)}
            >
              Auto Capitalize
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFind(!showFind)}
            >
              <Search className="h-4 w-4 mr-2" />
              Find & Replace
            </Button>

            <Button variant="ghost" size="sm" onClick={selectAllContent}>
              Select All
            </Button>

            <Button variant="ghost" size="sm" onClick={copyAllContent}>
              <Copy className="h-4 w-4 mr-2" />
              Copy All
            </Button>
          </div>

          {/* Find & Replace */}
          {showFind && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Find text..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Replace with..."
                  value={replaceTerm}
                  onChange={(e) => setReplaceTerm(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={findAndReplace} disabled={!searchTerm}>
                  Replace All
                </Button>
              </div>
            </div>
          )}

          {/* Text Editor */}
          <div className="relative">
            {getLineNumbers()}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing your notes here..."
              className={`w-full min-h-[500px] p-4 ${showLineNumbers ? 'pl-12' : ''} border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border} ${fontFamily.value}`}
              style={getTextStyle()}
            />
          </div>

          {/* Status Bar */}
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <div className="flex gap-4">
              <span>Words: {wordCount.words}</span>
              <span>Characters: {wordCount.characters}</span>
              <span>Lines: {wordCount.lines}</span>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">
                {currentTheme.name} Theme
              </Badge>
              <Badge variant="outline">
                {fontSize}px
              </Badge>
              <Badge variant="outline">
                {fontFamily.name}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts Help */}
      <Card className={`shadow-lg ${currentTheme.border}`}>
        <CardHeader>
          <CardTitle className="text-lg">Keyboard Shortcuts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl + S</kbd> Save file</div>
            <div><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl + F</kbd> Find & Replace</div>
            <div><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl + /</kbd> Toggle theme</div>
            <div><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl + B</kbd> Bold text</div>
            <div><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl + I</kbd> Italic text</div>
            <div><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl + U</kbd> Underline text</div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        onChange={uploadFile}
        className="hidden"
      />
    </div>
  );
}