import { generateToolLogo, getToolLogoDataURL } from "@/lib/tool-logos";

interface ToolLogoProps {
  toolSlug: string;
  categorySlug: string;
  size?: number;
  className?: string;
}

export function ToolLogo({ toolSlug, categorySlug, size = 64, className = "" }: ToolLogoProps) {
  const logoDataURL = getToolLogoDataURL(toolSlug, categorySlug);
  
  return (
    <img
      src={logoDataURL}
      alt={`${toolSlug} logo`}
      width={size}
      height={size}
      className={`tool-logo ${className}`}
      style={{ 
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
    />
  );
}

export function ToolLogoSVG({ toolSlug, categorySlug, size = 64, className = "" }: ToolLogoProps) {
  const svgString = generateToolLogo(toolSlug, categorySlug);
  
  return (
    <div 
      className={`tool-logo-svg ${className}`}
      style={{ 
        width: size, 
        height: size,
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
}