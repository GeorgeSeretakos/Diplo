import { searchDebatesStrapiFilters } from "@utils/search/searchDebatesStrapiFilters.js";
import { getDetailedStrapiDebates } from "@utils/graphql/getDetailedStrapiDebates.js";
import { getSpeakerDebateIds } from "@utils/graphql/getSpeakerDebateIds.js";
import {searchSpeakerKeyPhrase} from "@utils/search/searchSpeakerKeyPhrase.js";
import {getRandomSpeakerSpeechInDebate} from "@utils/getRandomSpeakerSpeechInDebate.js";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      speakerId,
      keyPhrase = "",
      strapiFilters = {},
      sortBy = "newest",
    } = body;

    if (!speakerId) {
      return new Response(JSON.stringify({ error: "speakerId is required." }), { status: 400 });
    }

    const hasKeyPhrase = keyPhrase.trim() !== "";
    const hasStrapiFilters =
      !!strapiFilters.startDate ||
      !!strapiFilters.endDate ||
      !!strapiFilters.session ||
      !!strapiFilters.meeting ||
      !!strapiFilters.period ||
      !!(Array.isArray(strapiFilters.sentiments) && strapiFilters.sentiments.length > 0) ||
      !!(Array.isArray(strapiFilters.topics) && strapiFilters.topics.length > 0);

    // Step 1: Fetch all debate IDs where the speaker has participated
    let speakerDebateIds = await getSpeakerDebateIds({ speakerId });
    speakerDebateIds = speakerDebateIds.map(d => d.documentId); // Convert to array of strings instead of objects
    // console.log("Speaker Debate Ids: ", speakerDebateIds);

    if (speakerDebateIds.length === 0) {
      return new Response(JSON.stringify({ debates: [], totalPages: 0 }), { status: 200 });
    }

    let debates = [];

    if (hasKeyPhrase) {
      // 2) KEY PHRASE SEARCH PATH
      const esResults = await searchSpeakerKeyPhrase(keyPhrase, speakerId, speakerDebateIds);
      console.log("esResults: ", esResults);

      if (esResults.length === 0) {
        return new Response(JSON.stringify({ debates: [], totalPages: 0 }), { status: 200 });
      }

      let filteredIds = esResults.map(d => d.debateDocumentId);

      if (filteredIds.length === 0) {
        return new Response(JSON.stringify({ debates: [], totalPages: 0 }), { status: 200 });
      }

      if (hasStrapiFilters) {
        const strapiResults = await searchDebatesStrapiFilters(strapiFilters);
        const strapiSet = new Set(strapiResults.map(d => d.documentId));
        filteredIds = filteredIds.filter(id => strapiSet.has(id));
      }

      console.log("Filtered Ids: ", filteredIds);

      if (filteredIds.length === 0) {
        return new Response(JSON.stringify({ debates: [], totalPages: 0 }), { status: 200 });
      }

      const detailedStrapiDebates = await getDetailedStrapiDebates({
        ids: filteredIds,
        offset: 0,
        limit: filteredIds.length,
        sortBy,
      });

      const esMap = new Map(esResults.map(d => [d.debateDocumentId, d]));
      console.log("esMap: ", esMap);

      // Merge results
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

    } else {
      // 1) NO KEY PHRASE SEARCH PATH
      let debateIds = speakerDebateIds;

      if (hasStrapiFilters) {
        const strapiResults = await searchDebatesStrapiFilters(strapiFilters);
        const strapiSet = new Set(strapiResults.map(d => d.documentId));
        debateIds = debateIds.filter(id => strapiSet.has(id));
      }

      if (debateIds.length === 0) {
        return new Response(JSON.stringify({ debates: [], totalPages: 0 }), { status: 200 });
      }

      // 👇 Fetch debates
      const detailedStrapiDebates = await getDetailedStrapiDebates({
        ids: debateIds,
        offset: 0,
        limit: debateIds.length,
        sortBy,
      });

      // For each debate, fetch ONE random speech of this speaker.
      debates = await Promise.all(
        detailedStrapiDebates.map(async (debate) => {
          // Fetch random speech for this speaker inside this debate
          const speech = await getRandomSpeakerSpeechInDebate(speakerId, debate.documentId);

          return {
            documentId: debate.documentId,
            date: debate.date,
            title: debate.title,
            session: debate.session,
            meeting: debate.meeting,
            period: debate.period,
            topics: debate.topics,
            top_speech: speech ? {
              speaker_name: speech.speaker_name,
              content: speech.content,
              speaker_id: speech.speaker_id,
            } : null,
          }
        })
      );
    }

    const totalDebates = debates.length;
    const totalPages = Math.ceil(debates.length / 5); // Or whatever page size you want

    return new Response(
      JSON.stringify({
        debates,
        totalPages,
        totalDebates
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/search-specific-speaker-debates:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch debates." }), { status: 500 });
  }
}
