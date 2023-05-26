import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useQueryStore } from '../../store';
import fs from 'fs';
import path from 'path';

describe('Counter Store', () => {
  let initialData: Message[];
  describe('Test Data', () => {
    it('reads from data.json', () => {
      initialData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data.json'), 'utf-8'))
    });
    it('gets 6 sample data messages in an array', () => {
      expect(Array.isArray(initialData)).toBeTruthy()
      expect(initialData.length).not.toBe(0);
      expect(initialData.length).toBe(6);
      expect(initialData[0].source).toBeTruthy();
    });
  });

  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
  });

  it('adds query data', () => {
    const store = useQueryStore();
    expect(store.data).toEqual([]);
    store.addNewQuery(initialData[0]);
    expect(store.data.length).toBe(1);
  });

  it('sets selection', () => {
    const store = useQueryStore();
    expect(store.selection).toBe(-1);
    store.setSelection(4);
    expect(store.selection).toBe(4);
  });

  it('sets hover selection', () => {
    const store = useQueryStore();
    expect(store.hoverSelection).toBe(-1);
    store.setHoverSelection(4);
    expect(store.hoverSelection).toBe(4);
  });

  it('sets page start time', () => {
    const store = useQueryStore();
    expect(store.pageStartTime).toBe(-1);
    store.setPageStartTime(400);
    expect(store.pageStartTime).toBe(400);
  });

  it('resets on resetHistory call', () => {
    const store = useQueryStore();
    store.addNewQuery(initialData[0]);
    store.setSelection(4);
    store.setHoverSelection(4);
    store.setPageStartTime(400);
    store.resetHistory();
    expect(store.data).toEqual([]);
    expect(store.selection).toBe(-1);
    expect(store.hoverSelection).toBe(-1);
    expect(store.pageStartTime).toBe(-1);
  });

  it('computes last end time based on most recent query', () => {
    const store = useQueryStore();
    expect(store.lastEndTime).toBe(0);
    store.setPageStartTime(40000000);
    store.addNewQuery(initialData[0]);
    expect(store.lastEndTime).toBe(initialData[0].payload.endTime - 40000000)
    store.addNewQuery(initialData[1]);
    expect(store.lastEndTime).toBe(initialData[1].payload.endTime - 40000000)
  })

  it('computes queries', () => {
    const store = useQueryStore();
    store.addNewQuery(initialData[0]);
    store.addNewQuery(initialData[1]);
    expect(store.queries.length).toBe(2);
  })

  it('computes filtered queries', () => {
    const store = useQueryStore();
    for(const query of initialData){
      store.addNewQuery(query);
    }
    expect(store.endQueries.length).toBe(4);
    expect(store.cacheQueries.length).toBe(2);
  })

  it('computes unique keys', () => {
    const store = useQueryStore();
    for(const query of initialData){
      store.addNewQuery(query);
    }
    expect(store.keys.length).toBe(4);
  })
})