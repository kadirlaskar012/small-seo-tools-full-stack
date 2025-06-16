import { getCustomToolIcon } from "@/lib/custom-tool-icons";

interface ToolLogoProps {
  toolSlug: string;
  categorySlug: string;
  size?: number;
  className?: string;
}

export function ToolLogo({ toolSlug, categorySlug, size = 64, className = "" }: ToolLogoProps) {
  const IconComponent = getCustomToolIcon(toolSlug);
  
  return (
    <div 
      className={`tool-logo ${className}`}
      style={{ 
        width: size, 
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <IconComponent />
    </div>
  );
}

export function ToolLogoSVG({ toolSlug, categorySlug, size = 64, className = "" }: ToolLogoProps) {
  const IconComponent = getCustomToolIcon(toolSlug);
  
  return (
    <div 
      className={`tool-logo-svg ${className}`}
      style={{ 
        width: size, 
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <IconComponent />
    </div>
  );
}