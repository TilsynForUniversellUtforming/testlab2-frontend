import { sanitizeEnumLabel } from '@common/util/stringutils';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import TestlabStatusTag, { ColorMapping } from '../TestlabStatusTag';

describe('<TestlabStatusTag />', () => {
  type TestlabTestStatus =
    | 'test-first'
    | 'test-second'
    | 'test-second2'
    | 'test-third'
    | 'test-success'
    | 'test-danger'
    | 'test-warning'
    | 'test-info'
    | 'test-neutral';

  const colorMapping: ColorMapping<TestlabTestStatus> = {
    first: ['test-first'],
    second: ['test-second', 'test-second2'],
    third: ['test-third'],
    success: ['test-success'],
    danger: ['test-danger'],
    warning: ['test-warning'],
    info: ['test-info'],
    neutral: ['test-neutral'],
  };

  it('renders correctly with default props', () => {
    render(
      <TestlabStatusTag<TestlabTestStatus>
        status="test-second"
        colorMapping={colorMapping}
      />
    );
    const sanitisedLabel = sanitizeEnumLabel('test-second');
    const tagElement = screen.getByText(sanitisedLabel);
    expect(tagElement).toBeInTheDocument();
  });

  it('does not render when status is undefined', () => {
    render(
      <>
        <TestlabStatusTag<TestlabTestStatus>
          colorMapping={colorMapping}
          status="test-first"
          data-testid="status-tag-1"
        />
        <TestlabStatusTag<TestlabTestStatus>
          colorMapping={colorMapping}
          status={undefined}
          data-testid="status-tag-2"
        />
      </>
    );
    const tagElement1 = screen.queryByTestId('status-tag-1');
    expect(tagElement1).toBeInTheDocument();

    const tagElement2 = screen.queryByTestId('status-tag-2');
    expect(tagElement2).not.toBeInTheDocument();
  });

  it('should use correct color with the corresponding colorMap', () => {
    render(
      <>
        <TestlabStatusTag<TestlabTestStatus>
          colorMapping={colorMapping}
          status="test-first"
          data-testid="test-first"
        />
        <TestlabStatusTag<TestlabTestStatus>
          colorMapping={colorMapping}
          status="test-second"
          data-testid="test-second"
        />
        <TestlabStatusTag<TestlabTestStatus>
          colorMapping={colorMapping}
          status="test-third"
          data-testid="test-third"
        />
        <TestlabStatusTag<TestlabTestStatus>
          colorMapping={colorMapping}
          status="test-success"
          data-testid="test-success"
        />
        <TestlabStatusTag<TestlabTestStatus>
          colorMapping={colorMapping}
          status="test-danger"
          data-testid="test-danger"
        />
        <TestlabStatusTag<TestlabTestStatus>
          colorMapping={colorMapping}
          status="test-warning"
          data-testid="test-warning"
        />
        <TestlabStatusTag<TestlabTestStatus>
          colorMapping={colorMapping}
          status="test-info"
          data-testid="test-info"
        />
        <TestlabStatusTag<TestlabTestStatus>
          colorMapping={colorMapping}
          status="test-neutral"
          data-testid="test-neutral"
        />
      </>
    );

    expect(screen.queryByTestId('test-first')?.getAttribute('class')).toMatch(
      /first/gi
    );
    expect(screen.queryByTestId('test-second')?.getAttribute('class')).toMatch(
      /second/gi
    );
    expect(screen.queryByTestId('test-third')?.getAttribute('class')).toMatch(
      /third/gi
    );
    expect(screen.queryByTestId('test-success')?.getAttribute('class')).toMatch(
      /success/gi
    );
    expect(screen.queryByTestId('test-danger')?.getAttribute('class')).toMatch(
      /danger/gi
    );
    expect(screen.queryByTestId('test-warning')?.getAttribute('class')).toMatch(
      /warning/gi
    );
    expect(screen.queryByTestId('test-info')?.getAttribute('class')).toMatch(
      /info/gi
    );
    expect(screen.queryByTestId('test-neutral')?.getAttribute('class')).toMatch(
      /neutral/gi
    );
  });

  it('should use correct color with the corresponding colorMap when map has multiple statuses per color', () => {
    render(
      <>
        <TestlabStatusTag<TestlabTestStatus>
          colorMapping={colorMapping}
          status="test-second"
          data-testid="status-tag-1"
        />
        <TestlabStatusTag<TestlabTestStatus>
          colorMapping={colorMapping}
          status="test-second2"
          data-testid="status-tag-2"
        />
      </>
    );

    const tagElement1 = screen.queryByTestId('status-tag-1');
    expect(tagElement1?.getAttribute('class')).toMatch(/second/gi);

    const tagElement2 = screen.queryByTestId('status-tag-2');
    expect(tagElement2?.getAttribute('class')).toMatch(/second/gi);
  });

  it("should display 'neutral' color when status is not mapped to a color in colorMap", () => {
    render(
      <TestlabStatusTag<TestlabTestStatus>
        colorMapping={colorMapping}
        status="status-not-mapped"
        data-testid="status-tag-1"
      />
    );

    const tagElement1 = screen.queryByTestId('status-tag-1');
    expect(tagElement1?.getAttribute('class')).toMatch(/neutral/gi);
  });
});
