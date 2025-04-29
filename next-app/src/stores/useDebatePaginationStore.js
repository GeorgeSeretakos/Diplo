import { create } from "zustand";

export const useDebatePaginationStore = create((set) => ({
  page: 1,
  mergedIds: null,
  setPage: (newPage) => set({ page: newPage }),
  setMergedIds: (ids) => set({ mergedIds: ids }),
  resetMergedIds: () => set({ mergedIds: null })
}))