import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createReading, fetchReadings } from "./api";
import type { Reading } from "./api";

// Infinite scroll hook for readings with pagination
export function useInfiniteReadings(pageSize: number = 20) {
  return useInfiniteQuery({
    queryKey: ["readings", pageSize],
    queryFn: ({ pageParam = 1 }) => fetchReadings(pageParam, pageSize),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined; // No more pages
    },
    initialPageParam: 1,
    staleTime: 30000, // Cache for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data for 5 minutes
  });
}

// Mutation hook for creating readings with optimistic updates
export function useCreateReading() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReading,
    onSuccess: () => {
      // Invalidate and refetch readings to get updated data
      queryClient.invalidateQueries({ queryKey: ["readings"] });
    },
  });
}

// Hook to get all readings flattened from infinite pages
export function useAllReadings() {
  const { data, ...rest } = useInfiniteReadings();

  const allReadings: Reading[] =
    data?.pages.flatMap((page) => page.items) ?? [];

  return {
    readings: allReadings,
    ...rest,
  };
}
