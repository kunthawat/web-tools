
// Helper to change solr dates into javascript date ojects
export function cleanDateCounts(countsMap) {
  const countsArray = [];
  for (const k in countsMap) {
    if (k === 'end' || k === 'gap' || k === 'start') continue;
    const v = countsMap[k];
    const ymd = k.substr(0, 10).split('-');
    const timestamp = Date.UTC(ymd[0], ymd[1] - 1, ymd[2]);
    countsArray.push({ date: timestamp, count: v });
  }
  return countsArray;
}