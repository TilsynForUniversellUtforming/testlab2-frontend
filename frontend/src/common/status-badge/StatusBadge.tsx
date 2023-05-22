import './status-badge.scss';

import classNames from 'classnames';

/**
 * Defines the levels for the status badge.
 * @typedef {Object} Levels
 * @property {string[]} primary - An array of labels for displaying the primary color.
 * @property {string[]} danger - An array of labels for displaying the danger color.
 * @property {string[]} success - An array of labels for displaying the success color.
 */
export type Levels = {
  primary: string[];
  danger: string[];
  success: string[];
};

/**
 * Props for the StatusBadge component.
 * @typedef {Object} Props
 * @property {*} [customLabel] - Optional custom label to display on the badge.
 * @property {string} [status] - The status of the badge, used to decide the color of the badge. If the customLabel is not set, the status will be used as the label.
 * @property {Levels} levels - The levels configuration for the badge.
 */
interface Props {
  customLabel?: string;
  status?: any;
  levels: Levels;
}

const StatusBadge = ({ customLabel, status, levels }: Props) => {
  if (status == null || typeof status === 'undefined') {
    return null;
  }

  const sanitizedLabel = customLabel
    ? customLabel
    : String(status)
        .replace('_', ' ')
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

  return (
    <div
      className={classNames(
        'status-badge',
        { primary: levels.primary.includes(status) },
        { danger: levels.danger.includes(status) },
        { success: levels.success.includes(status) }
      )}
    >
      {sanitizedLabel}
    </div>
  );
};

export default StatusBadge;
