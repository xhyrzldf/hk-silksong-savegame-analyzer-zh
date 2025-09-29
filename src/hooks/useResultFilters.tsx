/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { isItemUnlockedInPlayerSave, type CategoryItem } from "../parsers/dictionary";

type CompletionFilterOption = "completed" | "incomplete";
type ProgressFilterOption = "hundredPercent" | "nonHundredPercent";
export type ActFilterOption = 1 | 2 | 3;

type CompletionFilterState = Record<CompletionFilterOption, boolean>;
type ProgressFilterState = Record<ProgressFilterOption, boolean>;
type ActFilterState = Record<ActFilterOption, boolean>;

export type FilteredCategoryItem = {
  item: CategoryItem;
  result: ReturnType<typeof isItemUnlockedInPlayerSave>;
  normalizedAct: ActFilterOption;
  countsTowardsHundred: boolean;
};

interface ResultFiltersContextValue {
  completion: CompletionFilterState;
  progress: ProgressFilterState;
  acts: ActFilterState;
  toggleCompletion: (option: CompletionFilterOption) => void;
  toggleProgress: (option: ProgressFilterOption) => void;
  toggleAct: (option: ActFilterOption) => void;
  resetFilters: () => void;
}

const ResultFiltersContext = createContext<ResultFiltersContextValue | undefined>(undefined);

const DEFAULT_COMPLETION: CompletionFilterState = {
  completed: true,
  incomplete: true,
};

const DEFAULT_PROGRESS: ProgressFilterState = {
  hundredPercent: true,
  nonHundredPercent: true,
};

const DEFAULT_ACTS: ActFilterState = {
  1: true,
  2: true,
  3: true,
};

export function ResultFiltersProvider({ children }: { children: ReactNode }) {
  const [completion, setCompletion] = useState<CompletionFilterState>(DEFAULT_COMPLETION);
  const [progress, setProgress] = useState<ProgressFilterState>(DEFAULT_PROGRESS);
  const [acts, setActs] = useState<ActFilterState>(DEFAULT_ACTS);

  const toggleCompletion = useCallback((option: CompletionFilterOption) => {
    setCompletion(prev => ({ ...prev, [option]: !prev[option] }));
  }, []);

  const toggleProgress = useCallback((option: ProgressFilterOption) => {
    setProgress(prev => ({ ...prev, [option]: !prev[option] }));
  }, []);

  const toggleAct = useCallback((option: ActFilterOption) => {
    setActs(prev => ({ ...prev, [option]: !prev[option] }));
  }, []);

  const resetFilters = useCallback(() => {
    setCompletion({ ...DEFAULT_COMPLETION });
    setProgress({ ...DEFAULT_PROGRESS });
    setActs({ ...DEFAULT_ACTS });
  }, []);

  const value = useMemo(
    () => ({
      completion,
      progress,
      acts,
      toggleCompletion,
      toggleProgress,
      toggleAct,
      resetFilters,
    }),
    [completion, progress, acts, toggleCompletion, toggleProgress, toggleAct, resetFilters],
  );

  return <ResultFiltersContext.Provider value={value}>{children}</ResultFiltersContext.Provider>;
}

export function useResultFilters() {
  const context = useContext(ResultFiltersContext);
  if (!context) {
    throw new Error("useResultFilters must be used within a ResultFiltersProvider");
  }
  return context;
}

function normalizeAct(whichAct: number): ActFilterOption {
  if (whichAct === 2) return 2;
  if (whichAct === 3) return 3;
  return 1;
}

export function useFilteredCategoryItems(
  items: CategoryItem[],
  parsedJson: unknown,
): FilteredCategoryItem[] {
  const { completion, progress, acts } = useResultFilters();

  return useMemo(() => {
    if (!parsedJson) {
      return [];
    }

    return items
      .map(item => {
        const result = isItemUnlockedInPlayerSave(item.parsingInfo, parsedJson);
        const normalizedAct = normalizeAct(item.whichAct);
        const countsTowardsHundred = (item.completionPercent ?? 0) > 0;
        return { item, result, normalizedAct, countsTowardsHundred };
      })
      .filter(({ result, normalizedAct, countsTowardsHundred }) => {
        const completionMatches =
          (result.unlocked && completion.completed) || (!result.unlocked && completion.incomplete);
        if (!completionMatches) {
          return false;
        }

        const progressMatches =
          (countsTowardsHundred && progress.hundredPercent) ||
          (!countsTowardsHundred && progress.nonHundredPercent);
        if (!progressMatches) {
          return false;
        }

        if (!acts[normalizedAct]) {
          return false;
        }

        return true;
      });
  }, [items, parsedJson, completion, progress, acts]);
}
