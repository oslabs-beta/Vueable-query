import { describe, it, expect } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import TextPanel from '../Panel/src/components/TextPanel.vue'
import { createTestingPinia } from '@pinia/testing'
import { useQueryStore } from '../Panel/src/store';
import fs from 'fs';
import path from 'path';
import QueryKeyVue from '../Panel/src/components/QueryKey.vue';

describe('Query End Vue Component', () => {


  let initialData: [Message];
  let wrapper: VueWrapper;
  let store: any;
  
  describe('Testing Setup', () => {
    it('imports the component properly', () => {
      expect(TextPanel).toBeTruthy();
    })
    it('mounts properly with initialized store in testing environment', () => {
      // sets initialData to data.json, which is an array of Messages
      initialData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data.json'), 'utf-8'))
      expect(Array.isArray(initialData)).toBeTruthy()
      const testingPinia = createTestingPinia({
        initialState: {
          query: {data: initialData},
          pageStartTime: 1684991737226
        },
      });
      store = useQueryStore();
      expect(store.data.length).not.toBe(0);
      wrapper = mount(TextPanel, {
        global: {
          plugins: [
            testingPinia,
          ],
        },
      }) 
    }) 
  })
  describe('displays', () => {
    it('a Query Key component for each store key', () => {
      expect(wrapper.findAllComponents(QueryKeyVue).length).toBe(store.keys.length)
    })
  })
})