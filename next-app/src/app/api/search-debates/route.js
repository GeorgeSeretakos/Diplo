import { searchDebatesKeyPhrase } from "@utils/search/searchDebatesKeyPhrase.js";
import { searchDebatesStrapiFilters } from "@utils/search/searchDebatesStrapiFilters.js";
import { getDetailedStrapiDebates } from "@utils/graphql/getDetailedStrapiDebates.js";

export async function POST(req) {
  const PAGE_SIZE = 15;

  try {
    const body = await req.json();
    const {
      keyPhrase = "",
      strapiFilters = {},
      sortBy = "newest",
    } = body;

    const hasKeyPhrase = keyPhrase.trim() !== "";
    const hasStrapiFilters =
      !!strapiFilters.startDate ||
      !!strapiFilters.endDate ||
      !!strapiFilters.session ||
      !!strapiFilters.meeting ||
      !!strapiFilters.period ||
      (Array.isArray(strapiFilters.topics) && strapiFilters.topics.length > 0) ||
      (Array.isArray(strapiFilters.speakers) && strapiFilters.speakers.length > 0);

    let debates = [];

  if (hasKeyPhrase) {
    const esResults = await searchDebatesKeyPhrase(keyPhrase);
    console.log("search debate key phrase returned esResults: ", esResults);

    if (esResults.length === 0) {
      return new Response(JSON.stringify({ debates: [], totalPages: 0 }), { status: 200 });
    }

    let filteredIds = esResults.map(d => d.documentId);

    // Apply Strapi filters on top of ES if present
    if (hasStrapiFilters) {
      const strapiResults = await searchDebatesStrapiFilters(strapiFilters);
      const strapiIds = strapiResults.map(d => d.documentId);

      // Intersect ES and Strapi results
      filteredIds = filteredIds.filter(id => strapiIds.includes(id));
    }

    // Empty intersection
    if (filteredIds.length === 0) {
      return new Response(JSON.stringify({ debates: [], totalPages: 0 }), { status: 200 });
    }

    const detailedStrapiDebates = await getDetailedStrapiDebates({
      ids: filteredIds,
      offset: 0,
      limit: filteredIds.length,
      sortBy,
    });

    // Form return object
    const esMap = new Map(esResults.map(d => [d.documentId, d]));

    debates = detailedStrapiDebates.map(strapiDebate => {
      const esDebate = esMap.get(strapiDebate.documentId);

      return {
        documentId: strapiDebate.documentId,
        date: strapiDebate.date,
        title: strapiDebate.title,
        session: strapiDebate.session,
        meeting: strapiDebate.meeting,
        period: strapiDebate.period,
        topics: strapiDebate.topics,
        top_speech: esDebate
          ? {
            score: esDebate.top_speech.score,
            speaker_name: esDebate.top_speech.speaker_name,
            content: esDebate.top_speech.content,
            speaker_id: esDebate.top_speech.speaker_id,
          }
          : null,
        };
      });

    } else if (hasStrapiFilters) {
      // Only strapi filters
      const strapiResults = await searchDebatesStrapiFilters(strapiFilters);
      const allIds = strapiResults.map(d => d.documentId).sort();
      console.log("Strapi query results: ", allIds);

      debates = await getDetailedStrapiDebates({
        ids: allIds,
        offset: 0,
        limit: allIds.length,
        sortBy,
      });

      console.log("Detailed fetch util returned: ", debates);

    } else {
      // Initial load - No filters
      debates = await getDetailedStrapiDebates({
        fetchAll: true,
        offset: 0,
        limit: 10000, // TODO:  ⚡ temporary limit to prevent overloading
        sortBy,
      });
    }

    const totalPages = Math.ceil(debates.length / PAGE_SIZE); // TODO: Dynamic limit debates per page

    return new Response(
      JSON.stringify({
        debates,
        totalPages,
        totalDebates: debates.length,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/speeches-debates:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch debates." }), { status: 500 });
  }
}
