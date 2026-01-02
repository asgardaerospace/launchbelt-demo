
import React from 'react';

interface LaunchbeltLogoProps {
  className?: string;
  glowColor?: string;
}

const LaunchbeltLogo: React.FC<LaunchbeltLogoProps> = ({ className = "w-12 h-12", glowColor = "rgba(59, 130, 246, 0.5)" }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: `drop-shadow(0 0 12px ${glowColor})` }}
    >
      <defs>
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <filter id="bevel">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
          <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.75" specularExponent="20" lightingColor="#ffffff" result="specOut">
            <fePointLight x="-50" y="-100" z="200" />
          </feSpecularLighting>
          <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
          <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litGraphic" />
        </filter>
      </defs>
      
      <g filter="url(#bevel)">
        {/* Main Vertical Blade */}
        <path 
          d="M100 10 L112 35 L112 120 L100 135 L88 120 L88 35 Z" 
          fill="url(#metalGradient)" 
        />
        
        {/* Upper Wings */}
        <path 
          d="M112 60 L140 35 L170 35 L155 65 L112 100 Z" 
          fill="url(#metalGradient)" 
        />
        <path 
          d="M88 60 L60 35 L30 35 L45 65 L88 100 Z" 
          fill="url(#metalGradient)" 
        />
        
        {/* Mid-Lower Angled Sharp Wings */}
        <path 
          d="M112 100 L145 130 L125 130 L100 115 Z" 
          fill="url(#metalGradient)" 
        />
        <path 
          d="M88 100 L55 130 L75 130 L100 115 Z" 
          fill="url(#metalGradient)" 
        />
        
        {/* Bottom V-Shape Guard */}
        <path 
          d="M100 145 L130 115 L145 130 L100 175 L55 130 L70 115 Z" 
          fill="url(#metalGradient)" 
        />
        
        {/* Final Base Diamond Point */}
        <path 
          d="M100 155 L115 170 L100 190 L85 170 Z" 
          fill="url(#metalGradient)" 
        />
      </g>
    </svg>
  );
};

export default LaunchbeltLogo;
