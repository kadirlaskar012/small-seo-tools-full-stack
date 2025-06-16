import React from 'react';

// Base SVG wrapper with consistent styling
const IconBase: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`relative inline-flex items-center justify-center w-16 h-16 ${className}`}>
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-sm"
    >
      {/* Document background with soft corners */}
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="8"
        ry="8"
        fill="white"
        stroke="#3B82F6"
        strokeWidth="1.5"
        className="drop-shadow-md"
      />
      {children}
    </svg>
  </div>
);

// Individual tool icons with consistent styling
export const SEOScoreIcon = () => (
  <IconBase>
    <g transform="translate(16, 16)">
      <circle cx="16" cy="16" r="12" stroke="#3B82F6" strokeWidth="2" fill="none" />
      <path d="M26 26L30 30" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
      <text x="16" y="20" textAnchor="middle" fontSize="10" fill="#3B82F6" fontWeight="600">SEO</text>
    </g>
  </IconBase>
);

export const MetaTagsIcon = () => (
  <IconBase>
    <g transform="translate(16, 16)">
      <rect x="8" y="10" width="16" height="2" fill="#3B82F6" />
      <rect x="8" y="14" width="12" height="2" fill="#3B82F6" />
      <rect x="8" y="18" width="14" height="2" fill="#3B82F6" />
      <path d="M6 8L10 12L6 16" stroke="#3B82F6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 8L22 12L26 16" stroke="#3B82F6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </IconBase>
);

export const KeywordDensityIcon = () => (
  <IconBase>
    <g transform="translate(16, 16)">
      <rect x="8" y="8" width="16" height="16" stroke="#3B82F6" strokeWidth="2" fill="none" rx="2" />
      <circle cx="12" cy="12" r="1.5" fill="#3B82F6" />
      <circle cx="16" cy="12" r="1.5" fill="#3B82F6" />
      <circle cx="20" cy="12" r="1.5" fill="#3B82F6" />
      <circle cx="12" cy="16" r="1.5" fill="#3B82F6" />
      <circle cx="16" cy="16" r="1.5" fill="#3B82F6" />
      <circle cx="20" cy="16" r="1.5" fill="#3B82F6" />
      <circle cx="12" cy="20" r="1.5" fill="#3B82F6" />
      <circle cx="16" cy="20" r="1.5" fill="#3B82F6" />
      <circle cx="20" cy="20" r="1.5" fill="#3B82F6" />
    </g>
  </IconBase>
);

export const BacklinkIcon = () => (
  <IconBase>
    <g transform="translate(16, 16)">
      <circle cx="12" cy="12" r="4" stroke="#3B82F6" strokeWidth="2" fill="none" />
      <circle cx="20" cy="20" r="4" stroke="#3B82F6" strokeWidth="2" fill="none" />
      <path d="M15 15L17 17" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
    </g>
  </IconBase>
);

export const PageSpeedIcon = () => (
  <IconBase>
    <g transform="translate(16, 16)">
      <circle cx="16" cy="16" r="10" stroke="#3B82F6" strokeWidth="2" fill="none" />
      <path d="M16 8V16L22 20" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 10L28 8L26 6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </IconBase>
);

export const RobotsIcon = () => (
  <IconBase>
    <g transform="translate(16, 16)">
      <rect x="10" y="8" width="12" height="16" stroke="#3B82F6" strokeWidth="2" fill="none" rx="2" />
      <circle cx="14" cy="12" r="1.5" fill="#3B82F6" />
      <circle cx="18" cy="12" r="1.5" fill="#3B82F6" />
      <rect x="13" y="16" width="6" height="2" fill="#3B82F6" rx="1" />
      <rect x="13" y="20" width="6" height="1" fill="#3B82F6" rx="0.5" />
    </g>
  </IconBase>
);

export const TextCaseIcon = () => (
  <IconBase>
    <g transform="translate(16, 16)">
      <text x="16" y="20" textAnchor="middle" fontSize="12" fill="#3B82F6" fontWeight="600">Aa</text>
      <path d="M8 24L24 24" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
    </g>
  </IconBase>
);

export const WordCountIcon = () => (
  <IconBase>
    <g transform="translate(16, 16)">
      <rect x="8" y="10" width="16" height="2" fill="#3B82F6" />
      <rect x="8" y="14" width="12" height="2" fill="#3B82F6" />
      <rect x="8" y="18" width="14" height="2" fill="#3B82F6" />
      <rect x="8" y="22" width="10" height="2" fill="#3B82F6" />
      <text x="26" y="24" fontSize="8" fill="#3B82F6" fontWeight="600">123</text>
    </g>
  </IconBase>
);

export const NotepadIcon = () => (
  <IconBase>
    <g transform="translate(16, 16)">
      <rect x="10" y="8" width="12" height="16" stroke="#3B82F6" strokeWidth="2" fill="none" rx="1" />
      <rect x="8" y="10" width="2" height="12" fill="#3B82F6" rx="1" />
      <rect x="12" y="12" width="8" height="1" fill="#3B82F6" />
      <rect x="12" y="15" width="6" height="1" fill="#3B82F6" />
      <rect x="12" y="18" width="7" height="1" fill="#3B82F6" />
    </g>
  </IconBase>
);

export const PDFPasswordIcon = () => (
  <IconBase>
    <g transform="translate(16, 16)">
      <rect x="10" y="8" width="12" height="16" stroke="#3B82F6" strokeWidth="2" fill="none" rx="1" />
      <text x="16" y="18" textAnchor="middle" fontSize="6" fill="#3B82F6" fontWeight="600">PDF</text>
      <rect x="14" y="20" width="4" height="3" stroke="#3B82F6" strokeWidth="1.5" fill="none" rx="0.5" />
      <circle cx="16" cy="21.5" r="0.5" fill="#3B82F6" />
    </g>
  </IconBase>
);

export const ProfilePictureIcon = () => (
  <IconBase>
    <g transform="translate(16, 16)">
      <circle cx="16" cy="16" r="10" stroke="#3B82F6" strokeWidth="2" fill="none" />
      <circle cx="16" cy="13" r="3" stroke="#3B82F6" strokeWidth="2" fill="none" />
      <path d="M10 22C10 19 12.5 17 16 17S22 19 22 22" stroke="#3B82F6" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  </IconBase>
);

export const BackgroundRemoverIcon = () => (
  <IconBase>
    <g transform="translate(16, 16)">
      <rect x="8" y="8" width="16" height="16" stroke="#3B82F6" strokeWidth="2" fill="none" rx="2" />
      <circle cx="12" cy="12" r="2" fill="#3B82F6" />
      <path d="M16 16L20 12L24 16L20 20Z" stroke="#3B82F6" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <path d="M20 20L24 24" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
    </g>
  </IconBase>
);

export const OCRIcon = () => (
  <IconBase>
    <g transform="translate(16, 16)">
      <rect x="8" y="8" width="16" height="16" stroke="#3B82F6" strokeWidth="2" fill="none" rx="2" />
      <circle cx="12" cy="12" r="2" fill="#3B82F6" />
      <rect x="16" y="16" width="6" height="1" fill="#3B82F6" />
      <rect x="16" y="18" width="4" height="1" fill="#3B82F6" />
      <rect x="16" y="20" width="5" height="1" fill="#3B82F6" />
      <rect x="16" y="22" width="3" height="1" fill="#3B82F6" />
    </g>
  </IconBase>
);

export const CSVConverterIcon = () => (
  <IconBase>
    <g transform="translate(16, 16)">
      <rect x="8" y="10" width="8" height="12" stroke="#3B82F6" strokeWidth="2" fill="none" rx="1" />
      <rect x="18" y="10" width="8" height="12" stroke="#3B82F6" strokeWidth="2" fill="none" rx="1" />
      <text x="12" y="18" textAnchor="middle" fontSize="6" fill="#3B82F6" fontWeight="600">CSV</text>
      <text x="22" y="18" textAnchor="middle" fontSize="6" fill="#3B82F6" fontWeight="600">JSON</text>
      <path d="M16 16H18" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 15L18 16L17 17" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </IconBase>
);

export const CalculatorIcon = () => (
  <IconBase>
    <g transform="translate(16, 16)">
      <rect x="10" y="8" width="12" height="16" stroke="#3B82F6" strokeWidth="2" fill="none" rx="2" />
      <rect x="12" y="10" width="8" height="3" fill="#3B82F6" rx="1" />
      <circle cx="13" cy="16" r="1" fill="#3B82F6" />
      <circle cx="16" cy="16" r="1" fill="#3B82F6" />
      <circle cx="19" cy="16" r="1" fill="#3B82F6" />
      <circle cx="13" cy="19" r="1" fill="#3B82F6" />
      <circle cx="16" cy="19" r="1" fill="#3B82F6" />
      <circle cx="19" cy="19" r="1" fill="#3B82F6" />
      <circle cx="13" cy="22" r="1" fill="#3B82F6" />
      <circle cx="16" cy="22" r="1" fill="#3B82F6" />
      <circle cx="19" cy="22" r="1" fill="#3B82F6" />
    </g>
  </IconBase>
);

// Default fallback icon
export const DefaultToolIcon = () => (
  <IconBase>
    <g transform="translate(16, 16)">
      <rect x="10" y="10" width="12" height="12" stroke="#3B82F6" strokeWidth="2" fill="none" rx="2" />
      <path d="M14 14L18 18" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 14L14 18" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
    </g>
  </IconBase>
);

// Icon mapping for all tools
export const CUSTOM_TOOL_ICONS: Record<string, React.ComponentType> = {
  // SEO & Analysis Tools
  "seo-score-checker": SEOScoreIcon,
  "meta-tags-analyzer": MetaTagsIcon,
  "keyword-density-checker": KeywordDensityIcon,
  "backlink-checker": BacklinkIcon,
  "page-speed-checker": PageSpeedIcon,
  "advanced-page-speed-checker": PageSpeedIcon,
  "robots-txt-generator": RobotsIcon,
  "redirect-chain-checker": BacklinkIcon,
  "schema-markup-tester": MetaTagsIcon,
  "google-pagespeed-insights": PageSpeedIcon,
  "safe-browsing-checker": SEOScoreIcon,
  "ip-geolocation-finder": SEOScoreIcon,
  "domain-age-checker": SEOScoreIcon,
  "adsense-ban-checker": SEOScoreIcon,

  // Text & Content Tools
  "text-case-converter": TextCaseIcon,
  "word-counter": WordCountIcon,
  "smart-modern-notepad": NotepadIcon,
  "remove-duplicate-lines": TextCaseIcon,
  "word-frequency-counter": WordCountIcon,
  "character-frequency-counter": WordCountIcon,
  "slug-generator": TextCaseIcon,
  "jwt-decoder": MetaTagsIcon,
  "regex-generator": MetaTagsIcon,
  "js-obfuscator": MetaTagsIcon,

  // PDF Tools
  "pdf-password-remover": PDFPasswordIcon,
  "pdf-page-extractor": PDFPasswordIcon,

  // Image & Media Tools
  "profile-picture-maker": ProfilePictureIcon,
  "background-remover": BackgroundRemoverIcon,
  "image-dpi-converter": BackgroundRemoverIcon,
  "image-to-text-ocr": OCRIcon,
  "webp-to-jpg-converter": BackgroundRemoverIcon,

  // Data & Conversion Tools
  "csv-to-json-converter": CSVConverterIcon,
  "html-to-markdown-converter": CSVConverterIcon,

  // Calculation Tools
  "date-difference-calculator": CalculatorIcon,
  "age-in-months-calculator": CalculatorIcon,
  "percentage-calculator": CalculatorIcon,
};

// Function to get custom tool icon
export function getCustomToolIcon(toolSlug: string): React.ComponentType {
  return CUSTOM_TOOL_ICONS[toolSlug] || DefaultToolIcon;
}