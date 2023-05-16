'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/* istanbul ignore file */
// eslint-disable-next-line no-shadow
var QueryState;

(function (QueryState) {
  QueryState[QueryState["Fetching"] = 0] = "Fetching";
  QueryState[QueryState["Fresh"] = 1] = "Fresh";
  QueryState[QueryState["Stale"] = 2] = "Stale";
  QueryState[QueryState["Inactive"] = 3] = "Inactive";
  QueryState[QueryState["Paused"] = 4] = "Paused";
})(QueryState || (QueryState = {}));

function getQueryState(query) {
  if (query.state.fetchStatus === 'fetching') {
    return QueryState.Fetching;
  }

  if (query.state.fetchStatus === 'paused') {
    return QueryState.Paused;
  }

  if (!query.getObserversCount()) {
    return QueryState.Inactive;
  }

  if (query.isStale()) {
    return QueryState.Stale;
  }

  return QueryState.Fresh;
}
function getQueryStateLabel(query) {
  const queryState = getQueryState(query);

  if (queryState === QueryState.Fetching) {
    return 'fetching';
  }

  if (queryState === QueryState.Paused) {
    return 'paused';
  }

  if (queryState === QueryState.Stale) {
    return 'stale';
  }

  if (queryState === QueryState.Inactive) {
    return 'inactive';
  }

  return 'fresh';
}
function getQueryStatusFg(query) {
  const queryState = getQueryState(query);

  if (queryState === QueryState.Stale) {
    return 0x000000;
  }

  return 0xffffff;
}
function getQueryStatusBg(query) {
  const queryState = getQueryState(query);

  if (queryState === QueryState.Fetching) {
    return 0x006bff;
  }

  if (queryState === QueryState.Paused) {
    return 0x8c49eb;
  }

  if (queryState === QueryState.Stale) {
    return 0xffb200;
  }

  if (queryState === QueryState.Inactive) {
    return 0x3f4e60;
  }

  return 0x008327;
}

const queryHashSort = (a, b) => a.queryHash.localeCompare(b.queryHash);

const dateSort = (a, b) => a.state.dataUpdatedAt < b.state.dataUpdatedAt ? 1 : -1;

const statusAndDateSort = (a, b) => {
  if (getQueryState(a) === getQueryState(b)) {
    return dateSort(a, b);
  }

  return getQueryState(a) > getQueryState(b) ? 1 : -1;
};

const sortFns = {
  'Status > Last Updated': statusAndDateSort,
  'Query Hash': queryHashSort,
  'Last Updated': dateSort
};

exports.getQueryState = getQueryState;
exports.getQueryStateLabel = getQueryStateLabel;
exports.getQueryStatusBg = getQueryStatusBg;
exports.getQueryStatusFg = getQueryStatusFg;
exports.sortFns = sortFns;
//# sourceMappingURL=utils.js.map
