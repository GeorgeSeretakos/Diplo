import client from "@elasticsearch/client.js";
import preprocessGreekKeyword from "../preprocessGreekKeyword.js";

export async function searchInDebate({
debateId,
keyPhrase = "",
speakers = [],
sentiment = "",
rhetoricalIntent = "",
highIntensity = false
}) {
  try {
    if (!debateId) {
      throw new Error("debateId is required");
    }

    const noKeyPhrase = !keyPhrase || typeof keyPhrase !== "string" || keyPhrase.trim() === "";
    const noSpeakerNames = !Array.isArray(speakers) || speakers.length === 0;
    const noSentiment = !sentiment || typeof sentiment !== "string" || sentiment.trim() === "";
    const noIntent = !rhetoricalIntent || typeof rhetoricalIntent !== "string" || rhetoricalIntent.trim() === "";
    const noIntensity = !highIntensity;

    if (noKeyPhrase && noSentiment && noSpeakerNames && noIntent && noIntensity) {
      console.log("No parameters passed to elastic query, returning ...");
      return [];
    }

    const must = [
      { term: { debate_id: debateId } },
    ];

    if (!noKeyPhrase) {
      const { tonedKeyword, untonedKeyword, isIdentical } = preprocessGreekKeyword(keyPhrase);

      const shouldClauses = isIdentical
        ? [{ match_phrase: { content: tonedKeyword } }]
        : [
          { match_phrase: { content: tonedKeyword } },
          { match_phrase: { content: untonedKeyword } },
        ];
      must.push({ bool: { should: shouldClauses } });
    }

    if (!noSpeakerNames) {
      must.push({ terms: { "speaker_name.keyword": speakers } });
    }

    if (!noSentiment) {
      if (sentiment === "very_negative") {
        must.push({
          bool: {
            must: [{ term: { sentiment: -1 } }, { term: { polarity_strength: -1 } }],
          },
        });
      } else if (sentiment === "negative") {
        must.push({
          bool: {
            must: [{ term: { sentiment: -1 } }],
            must_not: [{ term: { polarity_strength: -1 } }],
          },
        });
      } else if (sentiment === "neutral") {
        must.push({ term: { sentiment: 0 } });
      } else if (sentiment === "positive") {
        must.push({
          bool: {
            must: [{ term: { sentiment: 1 } }],
            must_not: [{ term: { polarity_strength: 1 } }],
          },
        });
      } else if (sentiment === "very_positive") {
        must.push({
          bool: {
            must: [{ term: { sentiment: 1 } }, { term: { polarity_strength: 1 } }],
          },
        });
      }
    }

    if (!noIntent) {
      must.push({ term: { rhetorical_intent: rhetoricalIntent } });
    }

    if (!noIntensity) {
      must.push({ term: { emotional_intensity: 3 } });
    }

    const response = await client.search({
      index: "speeches",
      body: {
        query: {
          bool: { must }
        },
        highlight: {
          fields: {
            content: {
              pre_tags: ['<span style="font-weight: bold; color: #f9d342;">'],
              post_tags: ["</span>"],
            },
          },
        },
        sort: [
          { speech_number: { order: "asc" } }
        ],
        size: 1000,
      },
    });

    return response.hits.hits.map(hit => ({
      id: hit._id,
      speaker_name: hit._source.speaker_name,
      speaker_id: hit._source.speaker_id,
      content: hit.highlight?.content?.join(" ") || hit._source.content,
      speech_number: hit._source.speech_number,
      sentiment_label: sentiment,
      rhetorical_intent: rhetoricalIntent,
      high_intensity: highIntensity
    }));

  } catch (error) {
    console.error("Error in searchInDebate:", error);
    return [];
  }
}