import { 
  Search, 
  FileText, 
  Image, 
  FileImage, 
  Code, 
  Globe, 
  PenTool, 
  Brain, 
  Calculator,
  Zap,
  Eye,
  Shield,
  Link,
  BarChart3,
  Palette,
  Scissors,
  Download,
  Upload,
  Maximize,
  Minimize,
  RotateCw,
  Crop,
  Filter,
  Hash,
  Type,
  AlignLeft,
  Clock,
  FileCode,
  Database,
  Settings,
  Wrench,
  Target,
  TrendingUp,
  Award,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle,
  Star,
  Heart,
  Share,
  Copy,
  Save,
  Folder,
  FolderOpen,
  Archive,
  Lock,
  Unlock,
  Key,
  Shuffle,
  RefreshCw,
  ArrowUpDown,
  ArrowLeftRight,
  Layers,
  Grid,
  List,
  Table,
  Columns,
  Rows,
  Plus,
  Minus,
  X,
  Percent,
  MoreHorizontal,
  MoreVertical,
  Menu,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Timer,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  Video,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Server,
  Cloud,
  Wifi,
  Bluetooth,
  Usb,
  HardDrive,
  Cpu,
  Power,
  Battery,
  BatteryLow,
  Plug,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  Thermometer,
  Wind,
  Compass,
  Navigation,
  Map,
  Route,
  Car,
  Truck,
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
  CreditCard,
  DollarSign,
  TrendingDown,
  PieChart,
  LineChart,
  AreaChart,
  Activity,
  Headphones,
  Speaker,
  Radio,
  Tv,
  Film,
  Music,
  Disc,
  PlayCircle,
  PauseCircle,
  StopCircle,
  FastForward,
  Rewind,
  Repeat,
  BookOpen,
  Book,
  Bookmark,
  GraduationCap,
  Users,
  User,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Crown,
  Medal,
  Trophy,
  Flag,
  Tag,
  Tags,
  Paperclip,
  Pin,
  Magnet,
  Anchor,
  Feather,
  Pen,
  Pencil,
  Edit,
  Edit2,
  Edit3,
  Eraser,
  Paintbrush,
  Pipette,
  Brush,
  Rainbow,
  Snowflake,
  Droplet,
  Droplets,
  Waves,
  Umbrella,
  Mountain,
  Trees,
  Flower,
  Flower2,
  Leaf,
  Apple,
  Cherry,
  Split,
  Merge,
  Gauge,
  Zap as Lightning,
  Quote,
  Library,
  Focus,
  MoreHorizontal as Multiply,
  Minus as Divide,
  Check as Equal,
  Timer as Stopwatch
} from "lucide-react";

// Tool icon mapping based on actual tools in database
export const TOOL_ICON_MAP: Record<string, any> = {
  // SEO & Analysis Tools
  "seo-score-checker": Search,
  "meta-tags-analyzer": Code,
  "keyword-density-checker": Hash,
  "backlink-checker": Link,
  "page-speed-checker": Zap,
  "advanced-page-speed-checker": Activity,
  "robots-txt-generator": Settings,
  "redirect-chain-checker": ArrowLeftRight,
  "schema-markup-tester": Database,
  "google-pagespeed-insights": TrendingUp,
  "safe-browsing-checker": Shield,
  "ip-geolocation-finder": MapPin,
  "domain-age-checker": Calendar,
  "adsense-ban-checker": AlertCircle,

  // Text & Content Tools
  "text-case-converter": Type,
  "word-counter": FileText,
  "smart-modern-notepad": Edit,
  "remove-duplicate-lines": Scissors,
  "word-frequency-counter": BarChart3,
  "character-frequency-counter": Hash,
  "slug-generator": Link,
  "jwt-decoder": Unlock,
  "regex-generator": Code,
  "js-obfuscator": Shield,

  // PDF Tools  
  "pdf-password-remover": Unlock,
  "pdf-page-extractor": Download,

  // Image & Media Tools
  "profile-picture-maker": User,
  "background-remover": Layers,
  "image-dpi-converter": Settings,
  "image-to-text-ocr": Eye,
  "webp-to-jpg-converter": ArrowLeftRight,

  // Data & Conversion Tools
  "csv-to-json-converter": ArrowLeftRight,
  "html-to-markdown-converter": Code,

  // Calculation Tools
  "date-difference-calculator": Calendar,
  "age-in-months-calculator": Clock,
  "percentage-calculator": Percent,

  // Fallback patterns for unmatched tools
  "calculator": Calculator,
  "converter": ArrowLeftRight,
  "generator": Zap,
  "checker": CheckCircle,
  "analyzer": BarChart3,
  "validator": Shield,
  "optimizer": TrendingUp,
  "extractor": Download,
  "formatter": Code,
  "counter": Hash,
  "editor": Edit,
  "viewer": Eye,
  "tool": Wrench,
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