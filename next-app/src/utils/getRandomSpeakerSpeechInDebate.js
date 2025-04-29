import client from "@elasticsearch/client.js";

export async function getRandomSpeakerSpeechInDebate(speakerId, debateId) {
  if (!speakerId || !debateId) return null;

  try {
    const esQuery = {
      index: "speeches",
      body: {
        query: {
          bool: {
            must: [
              { term: { debate_id: debateId } },
              { term: { speaker_id: speakerId } }
            ]
          }
        },
        size: 1,
        sort: [
          { _script: { // 👈 random sort
              type: "number",
              script: "Math.random()",
              order: "asc"
            }}
        ]
      }
    };

    const response = await client.search(esQuery);

    const hit = response?.hits?.hits?.[0];
    if (!hit) return null;

    return {
      speaker_name: hit._source.speaker_name,
      content: hit._source.content,
      speaker_id: hit._source.speaker_id,
    };
  } catch (error) {
    console.error("Failed to fetch random speaker speech:", error);
    return null;
  }
}
