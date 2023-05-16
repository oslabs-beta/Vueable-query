/// <reference types="vite/client" />
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
}

interface Query {
  queryHash: string;
}

interface FormattedQuery {
  queryHash: string;
  startTime: number;
  endTime: number;
  duration: string;
  type: string;
  originalIndex: number;
}
