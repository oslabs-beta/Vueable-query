import { describe, it, expect } from 'vitest'

import { VueWrapper, mount } from '@vue/test-utils'
import TimelinePanel from '../TimelinePanel.vue'
import TimelineGraph from '../TimelineGraph.vue'
import { createTestingPinia } from '@pinia/testing'
// import any store you want to interact with in tests
// import { useSomeStore } from '@/stores/myStore'
import { useQueryStore } from '../../store';


describe('Timeline Panel Vue Component', () => {
  // initialize 'global' variables for tests
  let wrapper: VueWrapper;
  let store: any;

  it('imports the component properly', () => {
    expect(TimelinePanel).toBeTruthy();
  })
  it('mounts properly with initialized store in testing environment', () => {
    wrapper = mount(TimelinePanel, {
      global: {
        plugins: [
          createTestingPinia(),
        ],
      },
    }) 
    // this store is the same testing store initalized above
    store = useQueryStore();
    expect(store.data.length).toBe(0);
  }) 

  it('has an h2 title', () => {
    expect(wrapper.findAll("h2").length).toBeGreaterThan(0);
  })
  it('renders one Timeline Graph child', () => {
    expect(wrapper.findAllComponents(TimelineGraph).length).toBe(1)
  })

  

})