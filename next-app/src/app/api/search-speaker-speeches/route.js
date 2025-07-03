import { queryStrapiDebates } from "@utils/search/queryStrapiDebates.js";
import { getSpeakerDebateIds } from "@utils/graphql/getSpeakerDebateIds.js";
import { queryElasticSpeakers } from "@utils/search/queryElasticSpeakers.js";
import {getRandomSpeakerSpeechInDebate} from "@utils/getRandomSpeakerSpeechInDebate.js";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      speakerId,
      keyPhrase = "",
      startDate,
      endDate,
      session,
      topics = [],
      sentiment = "",
      rhetoricalIntent = "",
      highIntensity = false,
      page = 1,
      pageSize = 25,
      sortBy = "newest",
    } = body;

    if (!speakerId) {
      return new Response(JSON.stringify({ error: "speakerId is required." }), { status: 400 });
    }

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
      topics
    }
    console.log("ElasticFilters: ", elasticFilters);
    console.log("StrapiFilters: ", strapiFilters);

    const hasElasticFilters =
      elasticFilters.keyPhrase.trim() !== "" ||
      elasticFilters.highIntensity === true ||
      !!elasticFilters.sentiment ||
      !!elasticFilters.rhetoricalIntent;

    let debates = [];
    let total = 0;

    // Find all debate Ids where speaker has participated
    const speakerDebatesRaw = getSpeakerDebateIds(speakerId);
    const speakerDebateIds = speakerDebatesRaw.map(d => d.documentId);
    const speakerName = speakerDebatesRaw[0]?.speakerName || "Άγνωστος Ομιλητής";

    if (speakerDebateIds.length === 0) {
      return new Response(JSON.stringify({ debates: [], totalPages: 0 }), { status: 200 });
    }

    if (hasElasticFilters) {
      const esResults = await queryElasticSpeakers({
        ...elasticFilters,
        speakerId,
        speakerDebateIds
      });

      if (esResults.length === 0) {
        return new Response(JSON.stringify({ debates: [], totalPages: 0 }), { status: 200 });
      }

      let filteredIds = esResults.map(d => d.debateDocumentId);

      const { debates: strapiDebates, total: strapiTotal } = queryStrapiDebates({
        ...strapiFilters,
        allowedIds: filteredIds,
        offset,
        limit: pageSize,
        sortBy,
      });

      total = strapiTotal;

      const esMap = new Map(esResults.map(d => [d.debateDocumentId, d]));

      debates = strapiDebates.map(strapiDebate => {
        const esDebate = esMap.get(strapiDebate.documentId);
        const top = esDebate?.top_speech;

        return {
          ...strapiDebate,
          top_speech: top
            ? {
              ...top,
            }
            : null
        };
      });

    } else {
      const { debates: strapiDebates, total: strapiTotal } = queryStrapiDebates({
        ...strapiFilters,
        allowedIds: speakerDebateIds,
        offset,
        limit: pageSize,
        sortBy,
      });

      total = strapiTotal;

      if (strapiDebates.length === 0) {
        return new Response(JSON.stringify({ debates: [], totalPages: 0 }), { status: 200 });
      }

      debates = await Promise.all(
        strapiDebates.map(async (debate) => {
          const speech = await getRandomSpeakerSpeechInDebate(speakerId, debate.documentId);
          return {
            ...debate,
            top_speech: speech
              ? {
                ...speech,
              }
              : null
          };
        })
      );
    }

    const totalPages = Math.ceil(total / pageSize);

    return new Response(
      JSON.stringify({
        debates,
        totalPages,
        totalDebates: total,
        speaker_name: speakerName
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/search-specific-speaker-debates:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch debates." }), { status: 500 });
  }
}