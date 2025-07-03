import client from "@elasticsearch/client.js";
import preprocessGreekKeyword from "../preprocessGreekKeyword.js";

export async function queryElasticSpeakers({
keyPhrase,
speakerId,
speakerDebateIds,
sentiment = "",
rhetoricalIntent = "",
highIntensity = false
}) {
  console.log("Util received: ", keyPhrase, speakerId, speakerDebateIds, sentiment, rhetoricalIntent, highIntensity);

  const noKeyPhrase = !keyPhrase || typeof keyPhrase !== "string" || keyPhrase.trim() === "";
  const noSentiment = !sentiment || typeof sentiment !== "string" || sentiment.trim() === "";
  const noIntent = !rhetoricalIntent || typeof rhetoricalIntent !== "string" || rhetoricalIntent.trim() === "";
  const noIntensity = !highIntensity;

  if (noKeyPhrase && noSentiment && noIntent && noIntensity) {
    console.log("No parameters passed to elastic query, returning ...");
    return [];
  }

  const must = [];

  // If targeting specific speaker and debates
  if (speakerId) {
    must.push({ term: { speaker_id: speakerId } });
  }

  if (speakerDebateIds && speakerDebateIds.length > 0) {
    must.push({ terms: { debate_id: speakerDebateIds } });
  }

  if (!noKeyPhrase) {
    const { tonedKeyword, untonedKeyword, isIdentical } = preprocessGreekKeyword(keyPhrase);
    console.log("Preprocess: ", tonedKeyword, untonedKeyword, isIdentical);

    const shouldClauses = isIdentical
      ? [{ match_phrase: { content: tonedKeyword } }]
      : [
        { match_phrase: { content: tonedKeyword } },
        { match_phrase: { content: untonedKeyword } },
      ];
    must.push({ bool: { should: shouldClauses } });
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

  const query = {
    bool: { must },
  };

  const esQuery = {
    index: "speeches",
    body: {
      query,
      collapse: {
        field: "debate_id",
        inner_hits: {
          size: 1,
          name: "top_speech",
          sort: [{ _score: "desc" }],
          highlight: {
            fields: {
              content: {
                pre_tags: ['<span style="font-weight: bold; color: #f9d342;">'],
                post_tags: ["</span>"],
                fragment_size: 600,
              },
            },
          },
        },
      },
      size: 10000, // or however many debates you expect
      sort: [{ _score: "desc" }],
    },
  };

  const response = await client.search(esQuery);
  console.log("Elastic Response: ", response);

  return response?.hits?.hits.map(hit => {
    const topSpeech = hit.inner_hits.top_speech.hits.hits[0];
    return {
      speakerDocumentId: hit._source.speaker_id,
      debateDocumentId: hit._source.debate_id,
      top_speech: {
        id: topSpeech._id,
        score: topSpeech._score,
        speaker_name: topSpeech._source.speaker_name,
        content:
          topSpeech.highlight?.content?.join(" ") ||
          topSpeech._source.content,
        sentiment_label: sentiment,
        rhetorical_intent: rhetoricalIntent,
        high_intensity: highIntensity,
      },
    };
  }) || [];
}