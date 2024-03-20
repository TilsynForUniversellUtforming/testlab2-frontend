const TextStyleIcon = ({
  selected,
  filled,
  onlyText,
  text,
}: {
  selected: boolean;
  filled?: boolean;
  onlyText?: boolean;
  text?: string;
}) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {!onlyText && (
      <rect
        x="0"
        y="0"
        width="18"
        height="18"
        stroke={selected ? 'white' : '#0062ba'}
        strokeWidth="3"
        fill={filled ? (selected ? 'white' : '#0062ba') : 'none'}
      />
    )}
    <text
      x={text ? '-1' : '5'}
      y={14}
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
      {text ? text : 'a'}
    </text>
  </svg>
);

export default TextStyleIcon;
