import {create} from "zustand";
import {devtools} from "zustand/middleware";

export const useDebatesCacheStore = create(devtools((set) => ({
  cachedDebates: [],
  totalPages: 1,
  page: 1,

  setCachedDebates: (debates) => set({ cachedDebates: debates }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  setPage: (page) => set({ page }),
  resetCache: () => set({ cachedDebates: [], totalPages: 1, page: 1 }),
})))