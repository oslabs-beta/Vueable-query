'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var queryCore = require('@tanstack/query-core');
var utils = require('./utils.js');

class QueryCache extends queryCore.QueryCache {
  find(arg1, arg2) {
    const arg1Unreffed = utils.cloneDeepUnref(arg1);
    const arg2Unreffed = utils.cloneDeepUnref(arg2);
    return super.find(arg1Unreffed, arg2Unreffed);
  }

  findAll(arg1, arg2) {
    const arg1Unreffed = utils.cloneDeepUnref(arg1);
    const arg2Unreffed = utils.cloneDeepUnref(arg2);

    if (utils.isQueryKey(arg1Unreffed)) {
      return super.findAll(arg1Unreffed, arg2Unreffed);
    }

    return super.findAll(arg1Unreffed);
  }

}

exports.QueryCache = QueryCache;
//# sourceMappingURL=queryCache.js.map
