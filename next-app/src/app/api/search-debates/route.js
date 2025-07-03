import { queryElasticDebates } from "@utils/search/queryElasticDebates.js";
import { queryStrapiDebates, getSpeakerImages } from "@utils/search/queryStrapiDebates.js";

export async function POST(req) {

  try {
    const body = await req.json();
    const {
      keyPhrase = "",
      rhetoricalIntent = "",
      sentiment = "",
      highIntensity = false,
      startDate,
      endDate,
      session,
      topics = [],
      speakers = [],
      sortBy = "newest",
      page = 1,
      pageSize = 30
    } = body;

    const offset = (page - 1) * pageSize;
    const elasticFilters = {
      keyPhrase,
      rhetoricalIntent,
      sentiment,
      highIntensity,
    }
    const strapiFilters = {
      startDate,
      endDate,
      session,
      topics,
      speakers,
    }
    console.log("ElasticFilters: ", elasticFilters);
    console.log("StrapiFilters: ", strapiFilters);

    const hasElasticFilters =
      elasticFilters.keyPhrase.trim() !== "" ||
      elasticFilters.highIntensity === true ||
      !!elasticFilters.sentiment ||
      !!elasticFilters.rhetoricalIntent;

    const hasStrapiFilters =
      !!strapiFilters.startDate ||
      !!strapiFilters.endDate ||
      !!strapiFilters.session ||
      (Array.isArray(strapiFilters.topics) && strapiFilters.topics.length > 0) ||
      (Array.isArray(strapiFilters.speakers) && strapiFilters.speakers.length > 0);

    let debates = [];
    let total = 0;

  if (hasElasticFilters) {
    const esResults = await queryElasticDebates({
      ...elasticFilters,
      sortBy
    });

    if (esResults.length === 0) {
      return new Response(JSON.stringify({ debates: [], totalPages: 0 }), { status: 200 });
    }

    // Preserve elastic order and attach top speech info
    const esMap = new Map(esResults.map(d => [d.documentId, d]));
    let sortedIds = esResults.map(d => d.documentId); // already sorted by elastic query

    // Apply Strapi filters on top of ES if present, or else fetch full strapi details from the elastic ids
    const { debates: strapiDebates, total: strapiTotal } = await queryStrapiDebates({
      ...strapiFilters, // may be empty if no extra filters
      allowedIds: sortedIds,
      offset,
      limit: pageSize,
      sortBy
    });

    total = strapiTotal;

    if (strapiDebates.length === 0) {
      return new Response(JSON.stringify({ debates: [], totalPages: 0 }), { status: 200 });
    }

    const speakerIds = strapiDebates
      .map(d => esMap.get(d.documentId)?.top_speech?.speaker_id)
      .filter(Boolean);

    const speakerImageMap = getSpeakerImages([...new Set(speakerIds)]);


    debates = strapiDebates.map(strapiDebate => {
      const esDebate = esMap.get(strapiDebate.documentId);
      const top = esDebate?.top_speech;

      return {
        ...strapiDebate,
        top_speech: top
          ? {
            ...top,
            imageUrl: speakerImageMap.get(top.speaker_id) ?? null
          }
          : null
      };
      });

    } else if (hasStrapiFilters) {
      // Only strapi filters
      const { debates: strapiDebates, total: strapiTotal } = await queryStrapiDebates({
        ...strapiFilters,
        offset,
        limit: pageSize,
        sortBy
      });

      total = strapiTotal;

      if (strapiDebates.length === 0) {
        return new Response(JSON.stringify({ debates: [], totalPages: 0 }), { status: 200 });
      }

      debates = strapiDebates.map(debate => ({
        ...debate,
        top_speech: null, // No elastic data
      }));

    } else {
      // Initial load – No filters applied
      const { debates: strapiDebates, total: strapiTotal } = await queryStrapiDebates({
        offset,
        limit: pageSize,
        sortBy,
      });

      total = strapiTotal;

      debates = strapiDebates.map(debate => ({
        ...debate,
        top_speech: null,
      }));
    }

    const totalPages = Math.ceil(total / pageSize);

    return new Response(
      JSON.stringify({
        debates,
        totalPages,
        totalDebates: total,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/speeches-debates:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch debates." }), { status: 500 });
  }
}