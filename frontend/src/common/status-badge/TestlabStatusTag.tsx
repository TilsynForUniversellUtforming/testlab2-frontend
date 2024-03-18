import { TestlabColor } from '@common/types';
import { Tag, TagProps } from '@digdir/designsystemet-react';

import { sanitizeEnumLabel } from '../util/stringutils';

/**
 * Defines the color mapping for the status badge. This type maps each color to an array of labels.
 * Each key is a color from the TestlabColor and the value is an array of type literals (T[]),
 * where T is the type of the labels. This structure allows for easy mapping of labels to specific badge colors.
 *
 * @template T - The type of labels used for the status badge.
 * @property {T[]} [info] - An array of labels for displaying the 'info' color.
 * @property {T[]} [warning] - An array of labels for displaying the 'warning' color.
 * @property {T[]} [success] - An array of labels for displaying the 'success' color.
 * @property {T[]} [danger] - An array of labels for displaying the 'danger' color.
 * @property {T[]} [neutral] - An array of labels for displaying the 'neutral' color.
 * @property {T[]} [first] - An array of labels for displaying the 'first' color.
 * @property {T[]} [second] - An array of labels for displaying the 'second' color.
 * @property {T[]} [third] - An array of labels for displaying the 'third' color.
 */
export type ColorMapping<T extends string> = {
  [key in TestlabColor]?: T[];
};

interface Props<T extends string> extends TagProps {
  customLabel?: string;
  status?: string;
  colorMapping: ColorMapping<T>;
}

const getTagColor = <T extends string>(
  status: T,
  colorMapping?: ColorMapping<T>
): TestlabColor => {
  const defaultColor: TestlabColor = 'neutral';

  if (!colorMapping) return defaultColor;

  for (const [color, statuses] of Object.entries(colorMapping)) {
    if (statuses?.includes(status)) {
      return color as TestlabColor;
    }
  }

  return defaultColor;
};

/**
 * Tag component for displaying statuses associated with the colors defined in TestlabColor, with a customizable label.
 * The color of the tag is determined by the status and the provided color mapping configuration. Each color should be
 * associated with unique statuses only.
 *
 * Example:
 * To display 'status_1' as 'danger', and 'status_2' and 'status_3' as 'success' use colorMapping
 *  {
 *   danger: ['status_1'],
 *   success: ['status_2', 'status_3'],
 *  }
 *
 * @template T - The type of the status, extending from string.
 * @param {Object} props - The props for the TestlabStatusTag component.
 * @param {string} [props.customLabel] - Optional custom label to display on the tag.
 *                                        If not provided, the status will be used as the label.
 * @param {T} [props.status] - The object status, which is used to determine the color of the tag.
 *                             This must be one of the values defined in the colorMapping configuration.
 * @param {ColorMapping<T>} props.colorMapping - The colorMapping configuration for the tag. This defines the mapping
 *                                   of different statuses to their corresponding tag colors.
 */
const TestlabStatusTag = <T extends string>({
  customLabel,
  status,
  colorMapping,
  size = 'small',
  ...rest
}: Props<T>) => {
  if (status == null || typeof status === 'undefined') {
    return null;
  }

  const sanitizedLabel = customLabel
    ? customLabel
    : sanitizeEnumLabel(String(status));

  return (
    <Tag color={getTagColor(status, colorMapping)} {...rest} size={size}>
      {sanitizedLabel}
    </Tag>
  );
};

export default TestlabStatusTag;
