import { 
  Sparkles,
  Rocket,
  Gem,
  Crown,
  Wand2,
  Zap,
  Flame,
  Star,
  Trophy,
  Award,
  Medal,
  Target,
  Crosshair,
  Radar,
  Scan,
  Search,
  Microscope,
  Telescope,
  Fingerprint,
  Focus,
  Eye,
  EyeOff,
  Glasses,
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  KeyRound,
  FileText,
  FileEdit,
  FileCheck,
  FileX,
  FilePlus,
  FileSearch,
  FileCog,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileJson,
  Database,
  Server,
  Cloud,
  CloudUpload,
  CloudDownload,
  HardDrive,
  Cpu,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Wifi,
  Link,
  Unlink,
  Share,
  ExternalLink,
  Download,
  Upload,
  RefreshCw,
  RotateCw,
  RotateCcw,
  ArrowLeftRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Shuffle,
  Repeat,
  Play,
  Pause,
  Square,
  Circle,
  Triangle,
  Grid,
  List,
  Table,
  Layout,
  Layers,
  Package,
  Box,
  Archive,
  Folder,
  FolderOpen,
  Hash,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  PenTool,
  Paintbrush,
  Brush,
  Palette,
  Pipette,
  Rainbow,
  Scissors,
  Copy,
  Clipboard,
  ClipboardCheck,
  ClipboardX,
  Edit,
  Save,
  Bookmark,
  BookOpen,
  Book,
  Library,
  Quote,
  MessageSquare,
  MessageCircle,
  Mail,
  Send,
  Phone,
  Video,
  Camera,
  Image,
  ImagePlus,
  ImageMinus,
  Images,
  Film,
  Music,
  Headphones,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Radio,
  Tv,
  Speaker,
  Calendar,
  Clock,
  Timer,
  Hourglass,
  MapPin,
  Map,
  Navigation,
  Compass,
  Route,
  Car,
  Plane,
  Ship,
  Train,
  Bike,
  Home,
  Building,
  Store,
  Factory,
  School,
  Hospital,
  Coffee,
  ShoppingCart,
  ShoppingBag,
  Gift,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Calculator,
  Plus,
  Minus,
  X,
  Divide,
  Equal,
  Percent,
  DollarSign,
  CreditCard,
  Banknote,
  Coins,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  BarChart,
  BarChart2,
  BarChart3,
  BarChart4,
  PieChart,
  LineChart,
  AreaChart,
  Activity,
  Waves,
  Signal,
  Antenna,
  Bluetooth,
  Usb,
  Power,
  Battery,
  BatteryLow,
  Plug,
  Lightbulb,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  Thermometer,
  Wind,
  Snowflake,
  Droplet,
  Droplets,
  Umbrella,
  Mountain,
  Trees,
  Flower,
  Leaf,
  Apple,
  Cherry,
  Users,
  User,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Settings,
  Cog,
  Wrench,
  Hammer,
  Construction,
  HardHat,
  Code,
  Brain,
  CheckCircle,
  AlertCircle,
  Info,
  MoreHorizontal,
  Check,
  Crop,
  Filter
} from "lucide-react";

// Tool icon mapping with attractive and relevant icons
export const TOOL_ICON_MAP: Record<string, any> = {
  // SEO & Analysis Tools
  "seo-score-checker": Telescope,
  "meta-tags-analyzer": FileCode,
  "keyword-density-checker": Fingerprint,
  "backlink-checker": Link,
  "page-speed-checker": Rocket,
  "advanced-page-speed-checker": Zap,
  "robots-txt-generator": Cog,
  "redirect-chain-checker": Route,
  "schema-markup-tester": Database,
  "google-pagespeed-insights": TrendingUp,
  "safe-browsing-checker": ShieldCheck,
  "ip-geolocation-finder": Radar,
  "domain-age-checker": Hourglass,
  "adsense-ban-checker": Trophy,

  // Text & Content Tools
  "text-case-converter": Type,
  "word-counter": BookOpen,
  "smart-modern-notepad": Edit,
  "remove-duplicate-lines": Scissors,
  "word-frequency-counter": BarChart4,
  "character-frequency-counter": Hash,
  "slug-generator": Link,
  "jwt-decoder": KeyRound,
  "regex-generator": Wand2,
  "js-obfuscator": Shield,

  // PDF Tools  
  "pdf-password-remover": Unlock,
  "pdf-page-extractor": FilePlus,

  // Image & Media Tools
  "profile-picture-maker": Camera,
  "background-remover": Layers,
  "image-dpi-converter": Focus,
  "image-to-text-ocr": Scan,
  "webp-to-jpg-converter": RefreshCw,

  // Data & Conversion Tools
  "csv-to-json-converter": ArrowLeftRight,
  "html-to-markdown-converter": FileCode,

  // Calculation Tools
  "date-difference-calculator": Calendar,
  "age-in-months-calculator": Timer,
  "percentage-calculator": Calculator,

  // Enhanced fallback patterns
  "calculator": Calculator,
  "converter": Shuffle,
  "generator": Sparkles,
  "checker": CheckCircle,
  "analyzer": Microscope,
  "validator": ShieldCheck,
  "optimizer": Rocket,
  "extractor": Download,
  "formatter": Paintbrush,
  "counter": BarChart3,
  "editor": Edit,
  "viewer": Eye,
  "tool": Wrench,
  "remover": X,
  "maker": Wand2,
  "tester": Target,
  "finder": Crosshair,
  "decoder": Unlock,
  "obfuscator": EyeOff,
  "notepad": BookOpen,
  "frequency": Activity,
  "slug": Hash,
  "jwt": Key,
  "regex": Star,
  "profile": User,
  "background": ImageMinus,
  "dpi": Focus,
  "ocr": Glasses,
  "webp": RotateCw,
  "jpg": Image,
  "csv": Table,
  "json": FileJson,
  "html": Globe,
  "markdown": FileText,
  "date": Calendar,
  "age": Clock,
  "percentage": Percent,
  "seo": Trophy,
  "meta": FileEdit,
  "keyword": Target,
  "backlink": Link,
  "speed": Flame,
  "robots": Settings,
  "redirect": ArrowLeftRight,
  "schema": Database,
  "pagespeed": Activity,
  "safe": Shield,
  "browsing": Globe,
  "geolocation": MapPin,
  "domain": Crown,
  "adsense": Award,
  "ban": X,
  "text": Type,
  "word": BookOpen,
  "smart": Lightbulb,
  "modern": Gem,
  "duplicate": Copy,
  "lines": List,
  "character": Hash,
  "pdf": FileText,
  "password": Lock,
  "page": FilePlus,
  "image": ImagePlus,
  "picture": Camera,
  "remove": Minus,
  "convert": RefreshCw,
  "data": Database,
  "html-to-markdown": ArrowLeftRight,
  "csv-to-json": Shuffle
};

// Function to get icon for a tool with smart fallback matching
export function getToolIcon(toolSlug: string) {
  // Direct match first
  if (TOOL_ICON_MAP[toolSlug]) {
    return TOOL_ICON_MAP[toolSlug];
  }
  
  // Pattern-based fallback matching
  const slug = toolSlug.toLowerCase();
  
  if (slug.includes('calculator')) return Calculator;
  if (slug.includes('converter')) return ArrowLeftRight;
  if (slug.includes('generator')) return Zap;
  if (slug.includes('checker')) return CheckCircle;
  if (slug.includes('analyzer')) return BarChart3;
  if (slug.includes('validator')) return Shield;
  if (slug.includes('optimizer')) return TrendingUp;
  if (slug.includes('extractor')) return Download;
  if (slug.includes('formatter')) return Code;
  if (slug.includes('counter')) return Hash;
  if (slug.includes('editor')) return Edit;
  if (slug.includes('viewer')) return Eye;
  if (slug.includes('password')) return Key;
  if (slug.includes('pdf')) return FileText;
  if (slug.includes('image')) return Image;
  if (slug.includes('text')) return Type;
  if (slug.includes('seo')) return Search;
  if (slug.includes('speed')) return Zap;
  if (slug.includes('security') || slug.includes('secure')) return Shield;
  if (slug.includes('link')) return Link;
  if (slug.includes('meta')) return Code;
  if (slug.includes('robot')) return Settings;
  if (slug.includes('redirect')) return ArrowLeftRight;
  if (slug.includes('schema')) return Database;
  if (slug.includes('notepad') || slug.includes('note')) return Edit;
  if (slug.includes('duplicate')) return Scissors;
  if (slug.includes('frequency')) return BarChart3;
  if (slug.includes('slug')) return Link;
  if (slug.includes('jwt')) return Unlock;
  if (slug.includes('regex')) return Code;
  if (slug.includes('obfuscator')) return Shield;
  if (slug.includes('profile')) return User;
  if (slug.includes('background')) return Layers;
  if (slug.includes('dpi')) return Settings;
  if (slug.includes('ocr')) return Eye;
  if (slug.includes('webp') || slug.includes('jpg')) return ArrowLeftRight;
  if (slug.includes('csv') || slug.includes('json')) return ArrowLeftRight;
  if (slug.includes('html') || slug.includes('markdown')) return Code;
  if (slug.includes('date')) return Calendar;
  if (slug.includes('age')) return Clock;
  if (slug.includes('percentage')) return Percent;
  if (slug.includes('geo')) return MapPin;
  if (slug.includes('domain')) return Globe;
  if (slug.includes('adsense')) return AlertCircle;
  
  // Default fallback
  return Wrench;
}

// Function to get all available icons for the icon picker
export function getAllIcons() {
  return {
    // Basic
    Search, FileText, Image, Code, Globe, PenTool, Brain, Calculator,
    
    // Actions
    Zap, Eye, Shield, Link, Settings, Wrench, Target, TrendingUp,
    
    // Media
    Camera, Video, Music, Volume2, Mic, Headphones,
    
    // Files
    Download, Upload, Archive, Folder, Save, Copy,
    
    // Editing
    Edit, Scissors, Crop, RotateCw, Filter, Palette,
    
    // Math
    Plus, Minus, MoreHorizontal, Calculator, Percent, Check,
    
    // Communication
    Mail, Phone, Share, Users, User,
    
    // Time
    Calendar, Clock, Timer,
    
    // Status
    CheckCircle, AlertCircle, Info, Star, Award,
    
    // Navigation
    ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Home,
    
    // Tech
    Database, Server, Cloud, Wifi, Monitor, Smartphone,
    
    // Business
    TrendingUp, BarChart3, PieChart, DollarSign, CreditCard,
    
    // Design
    Paintbrush, Brush, Layers, Grid, Type, Rainbow,
  };
}

// Categories for icon picker
export const ICON_CATEGORIES = {
  basic: ['Search', 'FileText', 'Image', 'Code', 'Globe', 'PenTool', 'Brain', 'Calculator'],
  actions: ['Zap', 'Eye', 'Shield', 'Link', 'Settings', 'Wrench', 'Target'],
  media: ['Camera', 'Video', 'Music', 'Volume2', 'Mic', 'Headphones'],
  files: ['Download', 'Upload', 'Archive', 'Folder', 'Save', 'Copy'],
  editing: ['Edit', 'Scissors', 'Crop', 'RotateCw', 'Filter', 'Palette'],
  math: ['Plus', 'Minus', 'MoreHorizontal', 'Calculator', 'Percent', 'Check'],
  communication: ['Mail', 'Phone', 'Share', 'Users', 'User'],
  time: ['Calendar', 'Clock', 'Timer'],
  status: ['CheckCircle', 'AlertCircle', 'Info', 'Star', 'Award'],
  navigation: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home'],
  tech: ['Database', 'Server', 'Cloud', 'Wifi', 'Monitor', 'Smartphone'],
  business: ['TrendingUp', 'BarChart3', 'PieChart', 'DollarSign', 'CreditCard'],
  design: ['Paintbrush', 'Brush', 'Layers', 'Grid', 'Type', 'Rainbow'],
};

// Function to get icon name from component
export function getIconName(IconComponent: any): string {
  return IconComponent.displayName || IconComponent.name || 'Unknown';
}

// Function to get icon component from name
export function getIconFromName(iconName: string) {
  const allIcons = getAllIcons();
  return (allIcons as any)[iconName] || Wrench;
}