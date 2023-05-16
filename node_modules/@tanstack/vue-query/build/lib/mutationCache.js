'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var queryCore = require('@tanstack/query-core');
var utils = require('./utils.js');

class MutationCache extends queryCore.MutationCache {
  find(filters) {
    return super.find(utils.cloneDeepUnref(filters));
  }

  findAll(filters) {
    return super.findAll(utils.cloneDeepUnref(filters));
  }

}

exports.MutationCache = MutationCache;
//# sourceMappingURL=mutationCache.js.map
