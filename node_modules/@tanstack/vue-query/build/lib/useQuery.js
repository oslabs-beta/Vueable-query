'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var queryCore = require('@tanstack/query-core');
var useBaseQuery = require('./useBaseQuery.js');

function useQuery(arg1, arg2, arg3) {
  const result = useBaseQuery.useBaseQuery(queryCore.QueryObserver, arg1, arg2, arg3);
  return { ...result,
    refetch: result.refetch.value,
    remove: result.remove.value
  };
}

exports.useQuery = useQuery;
//# sourceMappingURL=useQuery.js.map
