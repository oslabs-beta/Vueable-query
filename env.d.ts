/// <reference types="vite/client" />

interface InitMessage {
  name: string;
  tabId: number;
}

interface Message {
  source: string;
  payload: Payload;
}

interface Payload {
  startTime: number;
  endTime: number;
  event: Event;
  type: string;
}

interface Event {
  query: Query;
  action: {
    type: String
  }
}

interface Query {
  queryHash: string;
  isStale: () => boolean;
  state: {data: any};
}

interface FormattedQuery {
  queryHash: string;
  startTime: number;
  endTime: number;
  duration: string;
  type: string;
  originalIndex: number;
  data: any;
}
