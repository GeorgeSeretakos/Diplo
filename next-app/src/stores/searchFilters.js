import {create} from "zustand";
import {devtools} from "zustand/middleware";

const useSearchFilters = create(
  devtools((set) => ({
    filters: {
      keyPhrase: "",
      startDate: "",
      endDate: "",
      session: "",
      meeting: "",
      period: "",
      topics: [],
      speakers: [],
    },
    setFilters: (newFilters) => set({ filters: { ...newFilters }}),
    resetFilters: () =>
      set({
        filters: {
          keyPhrase: "",
          startDate: "",
          endDate: "",
          session: "",
          meeting: "",
          period: "",
          topics: [],
          speakers: []
        },
      }),
  }))
);

export default useSearchFilters;