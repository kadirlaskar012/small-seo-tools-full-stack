import { getToolIcon, getCategoryIcon } from "@/lib/ai-generated-icons";

interface ToolLogoProps {
  toolSlug: string;
  categorySlug: string;
  size?: number;
  className?: string;
}

export function ToolLogo({ toolSlug, categorySlug, size = 64, className = "" }: ToolLogoProps) {
  // Convert slug to readable name
  const toolName = toolSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const categoryName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const iconSVG = getToolIcon(toolName, categoryName);
  
  return (
    <div 
      className={`tool-logo ${className}`}
      style={{ 
        width: size, 
        height: size,
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px'
      }}
      dangerouslySetInnerHTML={{ __html: iconSVG }}
    />
  );
}

export function ToolLogoSVG({ toolSlug, categorySlug, size = 64, className = "" }: ToolLogoProps) {
  // Convert slug to readable name
  const toolName = toolSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const categoryName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const iconSVG = getToolIcon(toolName, categoryName);
  
  return (
    <div 
      className={`tool-logo-svg ${className}`}
      style={{ 
        width: size, 
        height: size,
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px'
      }}
      dangerouslySetInnerHTML={{ __html: iconSVG }}
    />
  );
}