import { InfiniteQueryObserver } from '@tanstack/query-core';
import { useBaseQuery } from './useBaseQuery.mjs';

function useInfiniteQuery(arg1, arg2, arg3) {
  const result = useBaseQuery(InfiniteQueryObserver, arg1, arg2, arg3);
  return { ...result,
    fetchNextPage: result.fetchNextPage.value,
    fetchPreviousPage: result.fetchPreviousPage.value,
    refetch: result.refetch.value,
    remove: result.remove.value
  };
}

export { useInfiniteQuery };
//# sourceMappingURL=useInfiniteQuery.mjs.map
