import { searchDebateKeyPhrase } from "@utils/searchInDebate.js";
import { searchStrapiFilters } from "@utils/queryStrapiDebates.js";
import { mergeDebateIds } from "@utils/mergeDebateIds.js";
import { getDetailedStrapiDebates } from "@utils/graphql/getDetailedStrapiDebates.js";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      source = "both",
      keyPhrase = "",
      strapiFilters = {},
      sortBy = "newest",
      page = 1,
      limit = 5,
      cachedElasticIds = [],
      cachedElasticResults = [],
      cachedStrapiIds = [],
      cachedStrapiResults = [],
    } = body;

    console.log("Search-debates route received body: ", body);

    const offset = 0; // Always default to first page on new filters

    let esResults = [];
    let strapiResults = [];

    if (source === "both" || source === "elasticOnly") {
      esResults = await searchDebateKeyPhrase(keyPhrase);
    }
    if (source === "both" || source === "strapiOnly") {
      strapiResults = await searchStrapiFilters(strapiFilters);
    }

    const esDebateIds = new Set(
      source === "strapiOnly" ? cachedElasticIds : esResults.map(d => d.documentId)
    );
    const strapiDebateIds = new Set(
      source === "elasticOnly" ? cachedStrapiIds : strapiResults.map(d => d.documentId)
    );

    const mergedDebateIds = mergeDebateIds({ source, esDebateIds, strapiDebateIds });

    if (mergedDebateIds.size === 0) {
      return new Response(JSON.stringify({ debates: [], totalPages: 0 }), { status: 200 });
    }

    const totalPages = Math.ceil(mergedDebateIds.size / limit);
    const limitedDebateIds = [...mergedDebateIds].slice(offset, offset + limit);

    let detailedStrapiDebates = [];

    if (source === "elasticOnly") {
      const strapiMap = new Map(cachedStrapiResults.map(d => [d.documentId, d]));
      detailedStrapiDebates = limitedDebateIds.map(id => strapiMap.get(id)).filter(Boolean);
    } else {
      detailedStrapiDebates = await getDetailedStrapiDebates({
        ids: [...mergedDebateIds],
        offset,
        limit,
        sortBy,
      });
    }

    const elasticMap = new Map(
      (source === "strapiOnly" ? cachedElasticResults : esResults).map(d => [d.documentId, d])
    );

    let finalMerged = [];

    if (detailedStrapiDebates.length > 0) {
      finalMerged = detailedStrapiDebates.map(debate => {
        const elastic = elasticMap.get(debate.documentId);
        return {
          ...debate,
          top_speech: elastic?.top_speech || null,
        };
      });
    } else if (source === "elasticOnly") {
      finalMerged = limitedDebateIds.map(id => {
        const elastic = elasticMap.get(id);
        return {
          documentId: elastic?.documentId || id,
          date: null,
          title: null,
          session: null,
          meeting: null,
          period: null,
          topics: [],
          top_speech: elastic?.top_speech || null,
        };
      });
    }

    return new Response(JSON.stringify({
      debates: finalMerged,
      totalPages,
      elasticResults: esResults,
      elasticIds: esResults.map(d => d.documentId),
      strapiIds: strapiResults.map(d => d.documentId),
    }), { status: 200 });

  } catch (error) {
    console.error("Error in speeches-debates handler:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch debates." }), { status: 500 });
  }
}
