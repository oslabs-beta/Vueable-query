'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vueDemi = require('vue-demi');
var utils = require('./utils.js');

function useQueryClient(id = '') {
  var _getCurrentInstance;

  const vm = (_getCurrentInstance = vueDemi.getCurrentInstance()) == null ? void 0 : _getCurrentInstance.proxy;

  if (!vm) {
    throw new Error('vue-query hooks can only be used inside setup() function.');
  }

  const key = utils.getClientKey(id);
  const queryClient = vueDemi.inject(key);

  if (!queryClient) {
    throw new Error("No 'queryClient' found in Vue context, use 'VueQueryPlugin' to properly initialize the library.");
  }

  return queryClient;
}

exports.useQueryClient = useQueryClient;
//# sourceMappingURL=useQueryClient.js.map
