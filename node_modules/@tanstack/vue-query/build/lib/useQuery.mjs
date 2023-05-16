import { QueryObserver } from '@tanstack/query-core';
import { useBaseQuery } from './useBaseQuery.mjs';

function useQuery(arg1, arg2, arg3) {
  const result = useBaseQuery(QueryObserver, arg1, arg2, arg3);
  return { ...result,
    refetch: result.refetch.value,
    remove: result.remove.value
  };
}

export { useQuery };
//# sourceMappingURL=useQuery.mjs.map
