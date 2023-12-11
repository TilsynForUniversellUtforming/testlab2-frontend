const SquareIcon = ({ selected }: { selected: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      stroke={selected ? 'white' : '#0062ba'}
      strokeWidth="3"
      fill="none"
    />
  </svg>
);

export default SquareIcon;
