import {searchDebatesKeyPhrase} from "@utils/search/searchDebatesKeyPhrase.js";
import {searchSpeakersStrapiFilters} from "@utils/search/searchSpeakersStrapiFilters.js";
import {getDetailedStrapiSpeakers} from "@utils/graphql/getDetailedStrapiSpeakers.js";
import {getDetailedStrapiDebates} from "@utils/graphql/getDetailedStrapiDebates.js";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      keyPhrase = "",
      strapiFilters = {},
    } = body;

    console.log("Calling speeches-speakers api with: ", body);

    const hasKeyPhrase = keyPhrase.trim() !== "";
    const hasStrapiFilters =
      !!strapiFilters.speakerName ||
      (strapiFilters.ageRange && (strapiFilters.ageRange.min !== 18 || strapiFilters.ageRange.max !== 100)) ||
      !!strapiFilters.gender ||
      !!(Array.isArray(strapiFilters.parties) && strapiFilters.parties.length > 0);

    console.log("hasKeyPhrase: ", hasKeyPhrase);
    console.log("hasStrapiFilters: ", hasStrapiFilters);

    let result = [];

    if (hasKeyPhrase) {
      const esResults = await searchDebatesKeyPhrase(keyPhrase);
      console.log("esResults: ", esResults);

      if(esResults.length === 0) {
        return new Response(JSON.stringify({results: [], totalPages: 0}), {status: 200});
      }

      let filteredSpeakerIds = esResults.map(d => d.speakerDocumentId);
      let filteredDebateIds = esResults.map(d => d.debateDocumentId);

      console.log("Filtered Speaker Ids: ", filteredSpeakerIds);
      console.log("Filtered Debate Ids: ", filteredDebateIds);

      if (hasStrapiFilters) {
        const strapiResults = await searchSpeakersStrapiFilters(strapiFilters);
        const strapiSpeakersSet = new Set(strapiResults.map(s => s.documentId));

        filteredSpeakerIds = filteredSpeakerIds.filter(id => strapiSpeakersSet.has(id)).sort();
        // Also filter debates to only keep debates linked to surviving speakers
        filteredDebateIds = esResults
          .filter(e => filteredSpeakerIds.includes(e.speakerDocumentId))
          .map(e => e.debateDocumentId)
          .sort();
      }

      if (filteredSpeakerIds.length === 0) {
        return new Response(JSON.stringify({results: [], totalPages: 0}), {status: 200});
      }

      const detailedStrapiSpeakers = await getDetailedStrapiSpeakers({
        ids: filteredSpeakerIds,
        offset: 0,
        limit: filteredSpeakerIds.length,
      });

      filteredDebateIds = Array.from(new Set(filteredDebateIds));
      console.log("Unique filtered debate ids: ", filteredDebateIds);

      const detailedStrapiDebates = await getDetailedStrapiDebates({
        ids: filteredDebateIds,
        offset: 0,
        limit: filteredDebateIds.length,
      })

      console.log("Detailed strapi debates: ", detailedStrapiDebates);

      // Create easy lookup maps
      const esMap = new Map(esResults.map(d => [d.speakerDocumentId, d]));
      const debateMap = new Map(detailedStrapiDebates.map(d => [d.documentId, d]));

      console.log("esMap: ", esMap);
      console.log("debateMap: ", debateMap);

      result = detailedStrapiSpeakers.map(strapiSpeaker => {
        const esEntry = esMap.get(strapiSpeaker.documentId);
        if (!esEntry) return null; // safety

        const strapiDebate = debateMap.get(esEntry.debateDocumentId);

        console.log("esEntry: ", esEntry);
        console.log("strapiDebate: ", strapiDebate);

        return {
          documentId: strapiSpeaker.documentId,  // speaker documentId
          speaker_name: strapiSpeaker.speaker_name,
          image: strapiSpeaker.image,
          age: strapiSpeaker.age,
          gender: strapiSpeaker.gender,
          // Top speech
          top_speech: {
            score: esEntry.top_speech.score,
            content: esEntry.top_speech.content,
            speaker_name: esEntry.top_speech.speaker_name,
            speech_id: esEntry.top_speech.id,
          },
          // Debate metadata
          debate: strapiDebate
            ? {
              documentId: strapiDebate.documentId,
              date: strapiDebate.date,
              title: strapiDebate.title,
              session: strapiDebate.session,
              meeting: strapiDebate.meeting,
              period: strapiDebate.period,
              topics: strapiDebate.topics,
            }
            : null,
        };
      }).filter(Boolean); // Remove any nulls

    } else if (hasStrapiFilters) {
      const strapiResults = await searchSpeakersStrapiFilters(strapiFilters);
      console.log("Strapi Results: ", strapiResults);
      const allIds = strapiResults.map(d => d.documentId).sort();

      result = await getDetailedStrapiSpeakers({
        ids: allIds,
        offset: 0,
        limit: allIds.length,
      });

      console.log("Detailed speakers: ", result);
    } else {
      result = await getDetailedStrapiSpeakers({
        ids: [],
        offset: 0,
        limit: 1000, // TODO: make dynamic
      })
    }

    const totalPages = Math.ceil(result?.length / 5); // TODO: Set speakers per page number

    return new Response(
      JSON.stringify({
        result,
        totalPages,
      }),
      {status: 200}
    );

  } catch (error) {
    console.error("Error in /api/speeches-speakers: ", error);
    return new Response(JSON.stringify({error: "Failed to fetch speakers."}), {status: 500});
  }
}