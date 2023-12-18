import React from 'react';

const ArrowIcon = ({ selected }: { selected: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1="6"
      y1="12"
      x2="14"
      y2="12"
      stroke={selected ? 'white' : '#0062ba'}
      strokeWidth="2"
    />
    <polygon points="14,8 22,12 14,16" fill={selected ? 'white' : '#0062ba'} />
  </svg>
);

export default ArrowIcon;
