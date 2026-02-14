import React from 'react';
import Svg, { Circle, Path, Rect, Polygon } from 'react-native-svg';

const TaskManagerLogo = ({ size = 40, color = '#2563eb', style }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" style={style}>
      {/* Main container shape */}
      <Rect 
        x="8" 
        y="12" 
        width="48" 
        height="40" 
        rx="8" 
        fill="none" 
        stroke={color} 
        strokeWidth="3" 
        strokeLinejoin="round"
      />
      
      {/* Header bar */}
      <Rect 
        x="8" 
        y="12" 
        width="48" 
        height="10" 
        rx="4" 
        fill={color} 
        opacity="0.1"
      />
      
      {/* Check mark icon */}
      <Path 
        d="M20 32l8 8 16-16" 
        fill="none" 
        stroke={color} 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Task list lines */}
      <Path 
        d="M16 44h32" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <Path 
        d="M16 52h32" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      
      {/* Decorative corner accents */}
      <Polygon 
        points="8,12 16,12 8,20" 
        fill={color} 
        opacity="0.1"
      />
      <Polygon 
        points="56,12 48,12 56,20" 
        fill={color} 
        opacity="0.1"
      />
    </Svg>
  );
};

export default React.memo(TaskManagerLogo);