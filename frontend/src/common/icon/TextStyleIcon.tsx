const TextStyleIcon = ({
  selected,
  filled,
  onlyText,
}: {
  selected: boolean;
  filled?: boolean;
  onlyText?: boolean;
}) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {!onlyText && (
      <rect
        x="0"
        y="0"
        width="24"
        height="24"
        stroke={selected ? 'white' : '#0062ba'}
        strokeWidth="3"
        fill={filled ? (selected ? 'white' : '#0062ba') : 'none'}
      />
    )}
    <text
      x="8"
      y="16"
      fill={
        filled
          ? selected
            ? '#0062ba'
            : 'white'
          : selected
            ? 'white'
            : '#0062ba'
      }
      style={{ font: 'bold 16px sans-serif' }}
    >
      a
    </text>
  </svg>
);

export default TextStyleIcon;
