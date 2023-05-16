import { MutationCache as MutationCache$1 } from '@tanstack/query-core';
import { cloneDeepUnref } from './utils.mjs';

class MutationCache extends MutationCache$1 {
  find(filters) {
    return super.find(cloneDeepUnref(filters));
  }

  findAll(filters) {
    return super.findAll(cloneDeepUnref(filters));
  }

}

export { MutationCache };
//# sourceMappingURL=mutationCache.mjs.map
