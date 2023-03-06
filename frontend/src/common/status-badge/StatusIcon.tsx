export interface Props {
  finished?: boolean;
}

const StatusIcon = ({ finished = false }: Props) => {
  const icon = finished ? <>&#10003;</> : <>&#10005;</>;
  return (
    <div
      className="d-none d-lg-flex justify-content-center align-items-center border border-1 rounded-circle text-muted"
      style={{ height: '2rem', width: '2rem' }}
    >
      {icon}
    </div>
  );
};

export default StatusIcon;
