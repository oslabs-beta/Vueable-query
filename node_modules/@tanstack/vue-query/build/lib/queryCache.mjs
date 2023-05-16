import { QueryCache as QueryCache$1 } from '@tanstack/query-core';
import { cloneDeepUnref, isQueryKey } from './utils.mjs';

class QueryCache extends QueryCache$1 {
  find(arg1, arg2) {
    const arg1Unreffed = cloneDeepUnref(arg1);
    const arg2Unreffed = cloneDeepUnref(arg2);
    return super.find(arg1Unreffed, arg2Unreffed);
  }

  findAll(arg1, arg2) {
    const arg1Unreffed = cloneDeepUnref(arg1);
    const arg2Unreffed = cloneDeepUnref(arg2);

    if (isQueryKey(arg1Unreffed)) {
      return super.findAll(arg1Unreffed, arg2Unreffed);
    }

    return super.findAll(arg1Unreffed);
  }

}

export { QueryCache };
//# sourceMappingURL=queryCache.mjs.map
