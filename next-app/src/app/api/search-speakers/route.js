import {searchDebatesKeyPhrase} from "@utils/search/searchDebatesKeyPhrase.js";
import {getDetailedStrapiSpeakers} from "@utils/graphql/getDetailedStrapiSpeakers.js";
import {getDetailedStrapiDebates} from "@utils/graphql/getDetailedStrapiDebates.js";
import { queryStrapiSpeakers } from "@utils/search/queryStrapiSpeakers.js";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      keyPhrase = "",
      strapiFilters = {},
      sortBy = "newest",
      page = 1,
      pageSize = 45
    } = body;

    const offset = (page - 1) * pageSize;

    const hasKeyPhrase = keyPhrase.trim() !== "";
    const hasStrapiFilters =
      !!strapiFilters.speakerName ||
      (strapiFilters.ageRange && (strapiFilters.ageRange.min !== 18 || strapiFilters.ageRange.max !== 100)) ||
      !!strapiFilters.gender ||
      !!(Array.isArray(strapiFilters.parties) && strapiFilters.parties.length > 0);

    let result = [];
    let total = 0;

    if (hasKeyPhrase) {
      const esResults = await searchDebatesKeyPhrase(keyPhrase);
      console.log("esResults: ", esResults);

      if(esResults.length === 0) {
        return new Response(JSON.stringify({result: [], totalPages: 0}), {status: 200});
      }

      // 1️⃣ Map of speaker_id -> top speech info from ES
      const esMap = new Map(
        esResults.map(e => [
          e.top_speech.speaker_id,
          {
            top_speech: e.top_speech,
            debateDocumentId: e.documentId
          }
        ])
      );

      console.log("esMap: ", esMap);

      const allowedSpeakerIds = [...esMap.keys()];

      // Apply Strapi filters AND restrict to speakers matched in ES
      const { speakers: strapiSpeakers, total: strapiTotal } = await queryStrapiSpeakers({
        ...strapiFilters,
        allowedIds: allowedSpeakerIds,
        offset,
        limit: pageSize,
      })

      total = strapiTotal;

      if (strapiSpeakers.length === 0) {
        return new Response(JSON.stringify({ result: [], totalPages: 0 }), { status: 200 });
      }

      // Extract relevant debate IDs (to enrich each result with debate info)
      const uniqueDebateIds = [
        ...new Set(
          strapiSpeakers
            .map(s => esMap.get(s.documentId)?.debateDocumentId)
            .filter(Boolean)
        ),
      ];
      console.log("Unique Debate Ids: ", uniqueDebateIds);

      // Fetch full debate info (Strapi)
      const detailedStrapiDebates = await getDetailedStrapiDebates({
        ids: uniqueDebateIds,
      });
      console.log("detailedStrapiDebates: ", detailedStrapiDebates);

      const debateMap = new Map(detailedStrapiDebates.map(d => [d.documentId, d]));
      console.log("debateMap: ", debateMap);

      // Enrich final speaker results with top_speech and debate info
      result = strapiSpeakers.map(speaker => {
        console.log("Speaker: ", speaker);
        const esData = esMap.get(speaker.documentId);
        const debate = esData ? debateMap.get(esData.debateDocumentId) : null;

        return {
          ...speaker,
          top_speech: esData?.top_speech || null,
          debate: debate
            ? {
              documentId: debate.documentId,
              date: debate.date,
              title: debate.title,
              session: debate.session,
              period: debate.period,
              topics: debate.topics,
            }
            : null,
        };
      });

    } else if (hasStrapiFilters) {
      const { speakers: strapiSpeakers, total: strapiTotal } = await queryStrapiSpeakers({
        ...strapiFilters,
        offset,
        limit: pageSize,
        sortBy
      });

      total = strapiTotal;

      result = strapiSpeakers.map(speaker => ({
        ...speaker,
        top_speech: null,
        debate: null,
      }));

      console.log("Detailed speakers: ", result);
    } else {
      const { speakers: strapiSpeakers, total: strapiTotal } = await queryStrapiSpeakers({
        offset,
        limit: pageSize,
        sortBy
      });

      total = strapiTotal

      result = strapiSpeakers.map(speaker => ({
        ...speaker,
        top_speech: null,
        debate: null,
      }));
    }

    const totalPages = Math.ceil(total / pageSize);

    return new Response(
      JSON.stringify({
        result,
        totalPages,
        totalSpeakers: total,
      }),
      {status: 200}
    );

  } catch (error) {
    console.error("Error in /api/speeches-speakers: ", error);
    return new Response(JSON.stringify({error: "Failed to fetch speakers."}), {status: 500});
  }
}