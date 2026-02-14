import React from 'react';
import Svg, { Circle, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';

const AppIcon = ({
  name,
  size = 18,
  color = '#111827',
  strokeWidth = 2,
  style,
}) => {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
  };

  const renderIcon = () => {
    switch (name) {
      case 'trend':
        return (
          <>
            <Polyline points="3 17 9 11 13 15 21 7" {...common} />
            <Polyline points="15 7 21 7 21 13" {...common} />
          </>
        );
      case 'pin':
        return (
          <>
            <Path d="M14.5 3.5l6 6-2.5 2.5-2-2-3.5 3.5v6l-1.8 1.8v-6.4L7.1 18 4.5 15.4 8 12l-2-2L8.5 7.5z" {...common} />
          </>
        );
      case 'check':
        return (
          <>
            <Circle cx="12" cy="12" r="9" {...common} />
            <Polyline points="8 12.5 10.8 15.2 16.2 9.8" {...common} />
          </>
        );
      case 'star':
        return (
          <Polygon points="12 3 14.8 8.7 21 9.6 16.5 14 17.6 20.2 12 17.3 6.4 20.2 7.5 14 3 9.6 9.2 8.7" {...common} />
        );
      case 'clock':
        return (
          <>
            <Circle cx="12" cy="12" r="9" {...common} />
            <Line x1="12" y1="7.8" x2="12" y2="12" {...common} />
            <Line x1="12" y1="12" x2="15.4" y2="13.8" {...common} />
          </>
        );
      case 'bell':
        return (
          <>
            <Path d="M18 16H6c1.1-1.1 2-2.7 2-4.5V10a4 4 0 0 1 8 0v1.5c0 1.8.9 3.4 2 4.5z" {...common} />
            <Path d="M10 18a2 2 0 0 0 4 0" {...common} />
          </>
        );
      case 'calendar':
        return (
          <>
            <Rect x="3.5" y="5.5" width="17" height="15" rx="2" {...common} />
            <Line x1="8" y1="3.5" x2="8" y2="7.5" {...common} />
            <Line x1="16" y1="3.5" x2="16" y2="7.5" {...common} />
            <Line x1="3.5" y1="10" x2="20.5" y2="10" {...common} />
          </>
        );
      case 'bolt':
        return (
          <Polygon points="13.5 2.5 5.8 13 11.2 13 9.8 21.5 18.2 10.8 12.8 10.8" {...common} />
        );
      case 'spark':
        return (
          <>
            <Path d="M12 3l1.6 3.4L17 8l-3.4 1.6L12 13l-1.6-3.4L7 8l3.4-1.6z" {...common} />
            <Path d="M18 15l.9 1.9 1.9.9-1.9.9L18 20.5l-.9-1.9-1.9-.9 1.9-.9z" {...common} />
            <Path d="M5.5 15.5l.7 1.3 1.3.7-1.3.7-.7 1.3-.7-1.3-1.3-.7 1.3-.7z" {...common} />
          </>
        );
      case 'plus':
        return (
          <>
            <Line x1="12" y1="5" x2="12" y2="19" {...common} />
            <Line x1="5" y1="12" x2="19" y2="12" {...common} />
          </>
        );
      case 'wave':
        return (
          <>
            <Path d="M8 13c1.1 0 1.9-.8 1.9-1.9 0-1.2-1-2.2-2.2-2.2-1.6 0-2.7 1.3-2.7 2.9 0 2.4 2 4.4 4.4 4.4" {...common} />
            <Path d="M12.7 14.8a4.4 4.4 0 0 0 0-6.2" {...common} />
            <Path d="M15.8 17.8a8.8 8.8 0 0 0 0-12.4" {...common} />
          </>
        );
      default:
        return <Circle cx="12" cy="12" r="2" fill={color} />;
    }
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      {renderIcon()}
    </Svg>
  );
};

export default React.memo(AppIcon);
