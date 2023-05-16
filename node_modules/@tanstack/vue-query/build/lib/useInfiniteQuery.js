'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var queryCore = require('@tanstack/query-core');
var useBaseQuery = require('./useBaseQuery.js');

function useInfiniteQuery(arg1, arg2, arg3) {
  const result = useBaseQuery.useBaseQuery(queryCore.InfiniteQueryObserver, arg1, arg2, arg3);
  return { ...result,
    fetchNextPage: result.fetchNextPage.value,
    fetchPreviousPage: result.fetchPreviousPage.value,
    refetch: result.refetch.value,
    remove: result.remove.value
  };
}

exports.useInfiniteQuery = useInfiniteQuery;
//# sourceMappingURL=useInfiniteQuery.js.map
