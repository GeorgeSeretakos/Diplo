export function mergeDebateIds({
  source,
  esDebateIds,
  strapiDebateIds
}) {
  let mergedDebateIds;

  if (source === "both") {
    mergedDebateIds = new Set([...esDebateIds].filter(id => strapiDebateIds.has(id)));
  } else if (source === "strapiOnly") {
    mergedDebateIds = esDebateIds.size > 0
      ? new Set([...esDebateIds].filter(id => strapiDebateIds.has(id)))
      : strapiDebateIds;
  } else if (source === "elasticOnly") {
    mergedDebateIds = strapiDebateIds.size > 0
      ? new Set([...esDebateIds].filter(id => strapiDebateIds.has(id)))
      : esDebateIds;
  }

  return mergedDebateIds;
}