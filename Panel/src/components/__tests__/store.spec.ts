import { describe, it, expect, beforeEach } from 'vitest'

import { VueWrapper, mount } from '@vue/test-utils'
import Timeline from '../TimelineGraph.vue'
import { setActivePinia, createPinia } from 'pinia'// import any store you want to interact with in tests
// import { useSomeStore } from '@/stores/myStore'
import { useQueryStore } from '../../store';
import fs from 'fs';
import path from 'path';


describe('Counter Store', () => {
  let initialData: [Message];
  describe('Test Data', () => {
    it('reads from data.json', () => {
      initialData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data.json'), 'utf-8'))
    })
    it('gets 6 sample data messages in an array', () => {
      expect(Array.isArray(initialData)).toBeTruthy()
      expect(initialData.length).not.toBe(0);
      expect(initialData.length).toBe(6);
      expect(initialData[0].source).toBeTruthy();
    })
  });

  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('adds query data', () => {
    const store = useQueryStore()
    expect(store.data).toEqual([])
    store.addNewQuery(initialData[0])
    expect(store.data.length).toBe(1)
  })

  it('sets selection', () => {
    const store = useQueryStore()
    expect(store.selection).toBe(-1)
    store.setSelection(4)
    expect(store.selection).toBe(4)
  })

  it('sets hover selection', () => {
    const store = useQueryStore()
    expect(store.hoverSelection).toBe(-1)
    store.setHoverSelection(4)
    expect(store.hoverSelection).toBe(4)
  })

  it('sets page start time', () => {
    const store = useQueryStore()
    expect(store.pageStartTime).toBe(-1)
    store.setPageStartTime(400)
    expect(store.pageStartTime).toBe(400)
  })

})