import { describe, it, expect } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import QueryEnd from '../Panel/src/components/QueryEnd.vue'
import { createTestingPinia } from '@pinia/testing'
import { useQueryStore } from '../Panel/src/store';
import fs from 'fs';
import path from 'path';
import { VueDd } from 'vue-dd';

describe('Query End Vue Component', () => {


  let initialData: [Message];
  let wrapper: VueWrapper;
  let store: any;
  describe('Testing Setup', () => {
    it('imports the component properly', () => {
      expect(QueryEnd).toBeTruthy();
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
      wrapper = mount(QueryEnd, {
        props: {c: store.endQueries[0]},
        global: {
          plugins: [
            testingPinia,
          ],
        },
      }) 
    }) 
  })
  describe('displays', () => {
    it('the start time', () => {
      expect(wrapper.text()).toContain(store.endQueries[0].startTime)
    })
    it('a vue-dd component', () => {
      expect(wrapper.findAllComponents(VueDd).length).toBe(1)
    })
  })
})