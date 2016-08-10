
export function pagedAndSortedLocation(location, linkId, sort) {
  return Object.assign({}, location, {
    query: {
      ...location.query,
      linkId,
      sort,
    },
  });
}

export function pagedLocation(location, linkId) {
  return Object.assign({}, location, {
    query: {
      ...location.query,
      linkId,
    },
  });
}

export function filteredLocation(location, snapshotId, timespanId) {
  return Object.assign({}, location, {
    query: {
      ...location.query,
      snapshotId,
      timespanId,
    },
  });
}