import React from 'react';
import Svg, { Path } from 'react-native-svg';

const TasksIcon = ({ color = '#999', size = 22 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      
      {/* Check circle 1 */}
      <Path
        d="M4 6.5l1.5 1.5L8 5.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Line 1 */}
      <Path
        d="M10 7h10"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Check circle 2 */}
      <Path
        d="M4 12.5l1.5 1.5L8 11.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Line 2 */}
      <Path
        d="M10 13h10"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Check circle 3 */}
      <Path
        d="M4 18.5l1.5 1.5L8 17.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Line 3 */}
      <Path
        d="M10 19h10"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />

    </Svg>
  );
};

export default TasksIcon;
