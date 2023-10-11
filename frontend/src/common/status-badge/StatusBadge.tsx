import { Tag } from '@digdir/design-system-react';
import { Color } from '@maaling/api/types';

import { sanitizeLabel } from '../util/stringutils';

/**
 * Defines the levels for the status badge.
 * @param {string[]} primary - An array of labels for displaying the primary color.
 * @param {string[]} danger - An array of labels for displaying the danger color.
 * @param {string[]} success - An array of labels for displaying the success color.
 */
export type Levels<T> = {
  primary: T[];
  danger: T[];
  success: T[];
};

/**
 * Props for the StatusBadge component.
 * @param {string} [customLabel] - Optional custom label to display on the badge.
 * @param {string} [status] - The status of the badge, used to decide the color of the badge. If the customLabel is not set, the status will be used as the label.
 * @param {Levels} levels - The levels configuration for the badge.
 */
interface Props<T> {
  customLabel?: string;
  status?: string;
  levels: Levels<T>;
}

const getBadgeColor = <T extends string>(
  status: string,
  levels: Levels<T>
): Color => {
  try {
    const typeStatus = status as unknown as T;
    if (levels.primary.includes(typeStatus)) {
      return 'third';
    } else if (levels.danger.includes(typeStatus)) {
      return 'danger';
    } else if (levels.success.includes(typeStatus)) {
      return 'success';
    } else {
      return 'neutral';
    }
  } catch (e) {
    return 'neutral';
  }
};

const StatusBadge = <T extends string>({
  customLabel,
  status,
  levels,
}: Props<T>) => {
  if (status == null || typeof status === 'undefined') {
    return null;
  }

  const sanitizedLabel = customLabel
    ? customLabel
    : sanitizeLabel(String(status));

  return (
    <Tag color={getBadgeColor(status, levels)} size="xsmall">
      {sanitizedLabel}
    </Tag>
  );
};

export default StatusBadge;
