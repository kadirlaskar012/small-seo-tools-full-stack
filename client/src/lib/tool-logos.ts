// Dynamic SVG logo generation system for tools
export interface LogoConfig {
  backgroundColor: string;
  iconColor: string;
  accentColor: string;
  shape: 'circle' | 'rounded-square' | 'hexagon' | 'diamond';
  pattern: 'solid' | 'gradient' | 'dots' | 'lines';
  iconType: string;
}

// Color palettes for different categories
const CATEGORY_COLORS = {
  'seo-tools': {
    primary: '#10B981', // emerald
    secondary: '#059669',
    accent: '#ECFDF5'
  },
  'text-tools': {
    primary: '#3B82F6', // blue
    secondary: '#2563EB', 
    accent: '#EFF6FF'
  },
  'pdf-tools': {
    primary: '#EF4444', // red
    secondary: '#DC2626',
    accent: '#FEF2F2'
  },
  'image-tools': {
    primary: '#8B5CF6', // violet
    secondary: '#7C3AED',
    accent: '#F5F3FF'
  },
  'converter-tools': {
    primary: '#F59E0B', // amber
    secondary: '#D97706',
    accent: '#FFFBEB'
  },
  'code-tools': {
    primary: '#06B6D4', // cyan
    secondary: '#0891B2',
    accent: '#ECFEFF'
  },
  'website-tools': {
    primary: '#84CC16', // lime
    secondary: '#65A30D',
    accent: '#F7FEE7'
  },
  'writing-tools': {
    primary: '#EC4899', // pink
    secondary: '#DB2777',
    accent: '#FDF2F8'
  },
  'ai-tools': {
    primary: '#6366F1', // indigo
    secondary: '#4F46E5',
    accent: '#EEF2FF'
  },
  'math-tools': {
    primary: '#14B8A6', // teal
    secondary: '#0D9488',
    accent: '#F0FDFA'
  }
};

// Icon patterns for different tool types
const TOOL_ICONS = {
  // SEO Tools
  'seo-score-checker': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  'page-speed-test': 'M13 10V3L4 14h7v7l9-11h-7z',
  'keyword-density-checker': 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14',
  'meta-tag-analyzer': 'M10 20l4-16m2 16l4-16M6 9h14M4 15h14',
  'robots-txt-generator': 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4',
  
  // Text Tools
  'word-counter': 'M4 6h16M4 12h16M4 18h7',
  'character-counter': 'M4 7h16M4 11h16M4 15h10',
  'text-case-converter': 'M4 7V4a1 1 0 011-1h5a1 1 0 011 1v3M4 7h8M4 7v9a1 1 0 001 1h2a1 1 0 001-1V7m0 0V4a1 1 0 011-1h2a1 1 0 011 1v3',
  'text-reverser': 'M4 4l5 7H4a2 2 0 01-2-2V4a2 2 0 012-2zM20 20l-5-7h5a2 2 0 012 2v5a2 2 0 01-2 2z',
  'duplicate-line-remover': 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  
  // PDF Tools
  'pdf-merger': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'pdf-splitter': 'M9 13h6m0-4H9m8 8V7a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2z',
  'pdf-compressor': 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
  'pdf-to-word': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  
  // Image Tools
  'image-compressor': 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  'image-resizer': 'M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m-4 12h2a2 2 0 002-2v-2',
  'image-cropper': 'M8 3v8h8m-8 0H3m5 0v5m0-5l5-5',
  'background-remover': 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
  
  // Converter Tools
  'unit-converter': 'M8 5l4 4 4-4m-4 4v10M4 13l4-4 4 4m-4-4V3',
  'currency-converter': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
  'temperature-converter': 'M10 2v20M14 2v20M6 6h12M6 18h12',
  
  // Code Tools  
  'code-formatter': 'M10 20l4-16m2 16l4-16M6 9h14M4 15h14',
  'code-minifier': 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  'html-validator': 'M10 20l4-16m2 16l4-16M6 9h14M4 15h14',
  'css-validator': 'M7 21h10l2-16H5l2 16zM12 16l.5-6h-1l.5 6z',
  
  // Website Tools
  'website-screenshot': 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z',
  'website-monitor': 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  'uptime-checker': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  
  // Writing Tools
  'grammar-checker': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  'spell-checker': 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  'readability-checker': 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  
  // AI Tools
  'ai-writer': 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  'ai-chatbot': 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  'machine-learning': 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  
  // Math Tools
  'calculator': 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  'equation-solver': 'M7 21h10l2-16H5l2 16zM12 16l.5-6h-1l.5 6z',
  'statistics-calculator': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
};

// Default icon for unknown tools
const DEFAULT_ICON = 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4';

export function generateToolLogo(toolSlug: string, categorySlug: string): string {
  const colors = CATEGORY_COLORS[categorySlug as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS['seo-tools'];
  const iconPath = TOOL_ICONS[toolSlug as keyof typeof TOOL_ICONS] || DEFAULT_ICON;
  
  // Create unique patterns based on tool name
  const toolHash = toolSlug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const shapeIndex = toolHash % 4;
  const patternIndex = toolHash % 3;
  
  const shapes = ['circle', 'rounded-square', 'hexagon', 'diamond'];
  const patterns = ['gradient', 'solid', 'dots'];
  
  const shape = shapes[shapeIndex];
  const pattern = patterns[patternIndex];
  
  return createSVGLogo({
    backgroundColor: colors.primary,
    iconColor: '#FFFFFF',
    accentColor: colors.accent,
    shape: shape as LogoConfig['shape'],
    pattern: pattern as LogoConfig['pattern'],
    iconType: iconPath
  });
}

function createSVGLogo(config: LogoConfig): string {
  const { backgroundColor, iconColor, accentColor, shape, pattern, iconType } = config;
  
  let backgroundElement = '';
  let maskElement = '';
  
  // Create background shape
  switch (shape) {
    case 'circle':
      backgroundElement = `<circle cx="32" cy="32" r="28" fill="${backgroundColor}" />`;
      maskElement = `<circle cx="32" cy="32" r="28" fill="white" />`;
      break;
    case 'rounded-square':
      backgroundElement = `<rect x="4" y="4" width="56" height="56" rx="12" fill="${backgroundColor}" />`;
      maskElement = `<rect x="4" y="4" width="56" height="56" rx="12" fill="white" />`;
      break;
    case 'hexagon':
      backgroundElement = `<polygon points="32,4 54,18 54,46 32,60 10,46 10,18" fill="${backgroundColor}" />`;
      maskElement = `<polygon points="32,4 54,18 54,46 32,60 10,46 10,18" fill="white" />`;
      break;
    case 'diamond':
      backgroundElement = `<polygon points="32,8 52,32 32,56 12,32" fill="${backgroundColor}" />`;
      maskElement = `<polygon points="32,8 52,32 32,56 12,32" fill="white" />`;
      break;
  }
  
  // Add pattern overlay
  let patternOverlay = '';
  if (pattern === 'gradient') {
    patternOverlay = `
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${accentColor};stop-opacity:0.8" />
        </linearGradient>
      </defs>`;
    backgroundElement = backgroundElement.replace(`fill="${backgroundColor}"`, 'fill="url(#grad)"');
  } else if (pattern === 'dots') {
    patternOverlay = `
      <defs>
        <pattern id="dots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1" fill="${accentColor}" opacity="0.3"/>
        </pattern>
      </defs>
      <rect x="0" y="0" width="64" height="64" fill="url(#dots)" mask="url(#mask)"/>`;
  }
  
  return `
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      ${patternOverlay}
      <defs>
        <mask id="mask">
          ${maskElement}
        </mask>
      </defs>
      ${backgroundElement}
      ${pattern === 'dots' ? patternOverlay.split('</defs>')[1] : ''}
      <g transform="translate(20, 20)">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="${iconType}"/>
        </svg>
      </g>
    </svg>
  `;
}

// Function to get logo as data URL
export function getToolLogoDataURL(toolSlug: string, categorySlug: string): string {
  const svgString = generateToolLogo(toolSlug, categorySlug);
  const base64 = btoa(unescape(encodeURIComponent(svgString)));
  return `data:image/svg+xml;base64,${base64}`;
}

// Function to generate all tool logos
export function generateAllToolLogos(tools: Array<{slug: string, category: {slug: string}}>) {
  const logos: Record<string, string> = {};
  
  tools.forEach(tool => {
    logos[tool.slug] = getToolLogoDataURL(tool.slug, tool.category.slug);
  });
  
  return logos;
}