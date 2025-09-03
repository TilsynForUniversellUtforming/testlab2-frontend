import { renderHook } from '@testing-library/react-hooks';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTestOverviewState } from '@test/util/useTestOverviewState';
import { act } from 'react';

vi.mock('@test/util/testregelUtils', () => ({
  isTestFinished: vi.fn().mockReturnValue(false),
  getPageTypeList: vi.fn().mockReturnValue([{ sideId: 1, name: 'Page 1' }]),
  getInitialPageType: vi.fn().mockReturnValue({ sideId: 1, name: 'Page 1' }),
  mapTestregelOverviewElements: vi.fn().mockReturnValue([]),
  progressionForSelection: vi.fn().mockReturnValue(0),
  toTestregelStatus: vi.fn().mockReturnValue(new Map()),
}));

const mockSetAlert = vi.fn();
vi.mock('@common/alert/useAlertModal', () => ({
  default: () => [undefined, mockSetAlert, { current: null }],
}));

describe('useTestOverviewState', () => {
  const mockProps = {
    testgrunnlagId: 1,
    loeysingId: 2,
    innhaldstypeList: [{ id: 1, innhaldstype: 'Type 1' }],
    sideutvalTypeList: [{ id: 1, type: 'Side 1' }],
    testResultatForLoeysing: [],
    sideutvalForLoeysing: [],
    testreglarForLoeysing: [],
    testKeys: {},
  };
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useTestOverviewState(mockProps));

    expect(result.current.innhaldstype).toEqual(mockProps.innhaldstypeList[0]);
    expect(result.current.pageType).toEqual({ sideId: 1, name: 'Page 1' });
    expect(result.current.testFerdig).toBe(false);
    expect(result.current.progressionPercent).toBe(0);
    expect(result.current.testregelListElements).toEqual([]);
    expect(result.current.testStatusMap).toEqual(new Map());
    expect(result.current.showHelpText).toBe(true);
  });

  it('should toggle help text visibility', () => {
    const { result } = renderHook(() => useTestOverviewState(mockProps));

    act(() => {
      result.current.toggleShowHelpText();
    });

    expect(result.current.showHelpText).toBe(false);

    act(() => {
      result.current.toggleShowHelpText();
    });

    expect(result.current.showHelpText).toBe(true);
  });

  it('should update page type on sideutval change', () => {
    const { result } = renderHook(() => useTestOverviewState(mockProps));

    act(() => {
      result.current.onChangeSideutval(1);
    });

    expect(result.current.pageType).toEqual({ sideId: 1, name: 'Page 1' });
    expect(mockSetAlert).not.toHaveBeenCalled();
  });

  it('should call setAlert on invalid sideutval change', () => {
    const { result } = renderHook(() => useTestOverviewState(mockProps));

    act(() => {
      result.current.onChangeSideutval(999);
    });

    expect(mockSetAlert).toHaveBeenCalled();
    expect(mockSetAlert).toHaveBeenCalledWith(
      'danger',
      'Kan ikkje velje sideutval',
      'Ugylig sideutval'
    );
  });

  it('should update innhaldstype on change', () => {
    const { result } = renderHook(() => useTestOverviewState(mockProps));

    act(() => {
      result.current.onChangeInnhaldstype(1);
    });

    expect(result.current.innhaldstype).toEqual(mockProps.innhaldstypeList[0]);
    expect(mockSetAlert).not.toHaveBeenCalled();
  });

  it('should call setAlert on invalid innhaldstype change', () => {
    console.log(mockProps);
    const { result } = renderHook(() => useTestOverviewState(mockProps));

    act(() => {
      result.current.onChangeInnhaldstype(999);
    });

    expect(mockSetAlert).toHaveBeenCalledWith(
      'danger',
      'Kan ikkje velje innhaldstype',
      'Ugylig innhaldstype'
    );
  });
});
