import { Tag } from '@digdir/design-system-react';

import { sanitizeLabel } from '../util/stringutils';

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
  status?: string;
  levels: Levels;
}

const getBadgeColor = (status: string, levels: Levels) => {
  if (levels.primary.includes(status)) {
    return 'third';
  } else if (levels.danger.includes(status)) {
    return 'danger';
  } else if (levels.success.includes(status)) {
    return 'success';
  } else {
    return 'neutral';
  }
};

const StatusBadge = ({ customLabel, status, levels }: Props) => {
  if (status == null || typeof status === 'undefined') {
    return null;
  }

  const sanitizedLabel = customLabel
    ? customLabel
    : sanitizeLabel(String(status));

  const color = getBadgeColor(status, levels);

  return (
    <Tag color={color} size="xsmall">
      {sanitizedLabel}
    </Tag>
  );
};

export default StatusBadge;
