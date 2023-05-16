import { getCurrentInstance, inject } from 'vue-demi';
import { getClientKey } from './utils.mjs';

function useQueryClient(id = '') {
  var _getCurrentInstance;

  const vm = (_getCurrentInstance = getCurrentInstance()) == null ? void 0 : _getCurrentInstance.proxy;

  if (!vm) {
    throw new Error('vue-query hooks can only be used inside setup() function.');
  }

  const key = getClientKey(id);
  const queryClient = inject(key);

  if (!queryClient) {
    throw new Error("No 'queryClient' found in Vue context, use 'VueQueryPlugin' to properly initialize the library.");
  }

  return queryClient;
}

export { useQueryClient };
//# sourceMappingURL=useQueryClient.mjs.map
