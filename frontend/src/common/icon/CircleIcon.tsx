const CircleIcon = ({ selected }: { selected: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke={selected ? 'white' : '#0062ba'}
      strokeWidth="3"
      fill="none"
    />
  </svg>
);

export default CircleIcon;
