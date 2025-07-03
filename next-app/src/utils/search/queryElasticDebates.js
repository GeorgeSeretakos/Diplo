import client from "@elasticsearch/client.js";
import preprocessGreekKeyword from "../preprocessGreekKeyword.js";

export async function queryElasticDebates({
  keyPhrase,
  sortBy = "newest",
  sentiment = "",
  rhetoricalIntent = "",
  highIntensity = false,
  }) {
  console.log("Util received: ", keyPhrase, sortBy, sentiment, rhetoricalIntent, highIntensity);

  const noKeyPhrase = !keyPhrase || typeof keyPhrase !== "string" || keyPhrase.trim() === "";
  const noSentiment = !sentiment || typeof sentiment !== "string" || sentiment.trim() === "";
  const noIntent = !rhetoricalIntent || typeof rhetoricalIntent !== "string" || rhetoricalIntent.trim() === "";
  const noIntensity = !highIntensity;

  if (noKeyPhrase && noSentiment && noIntent && noIntensity) {
    console.log("No parameters passed to elastic query, returning ...");
    return [];
  }
  try {
    const { tonedKeyword, untonedKeyword, isIdentical } = preprocessGreekKeyword(keyPhrase);

    const must = [];

    // Keyword search
    if (!noKeyPhrase) {
      const shouldClauses = isIdentical
        ? [{ match_phrase: { content: tonedKeyword } }]
        : [
          { match_phrase: { content: tonedKeyword } },
          { match_phrase: { content: untonedKeyword } },
        ];
      must.push({ bool: { should: shouldClauses } });
    }


    // Sentiment filter (single string)
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
        must.push({
          term: { sentiment: 0 },
        });
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

    // 🔹 Rhetorical Intent
    if (!noIntent) {
      must.push({
        term: { rhetorical_intent: rhetoricalIntent },
      });
    }

    // 🔹 High Emotional Intensity
    if (highIntensity) {
      must.push({
        term: { emotional_intensity: 3 },
      });
    }

    const query = {
      bool: { must },
    };

    console.dir(query, { depth: null });

    const response = await client.search({
      index: "speeches",
      body: {
        query,
        collapse: {
          field: "debate_id",
          inner_hits: {
            name: "top_speech",
            size: 1,
            sort: [{ _score: "desc" }],
            _source: ["speaker_name", "speaker_id", "content", "sentiment", "polarity_strength"],
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
        size: 10000,
        sort: [{ speech_date: sortBy === "oldest" ? "asc" : "desc" }],
      },
    });

    console.log("Response: ", response);

    return (
      response?.hits?.hits.map((hit) => {
        const topSpeech = hit.inner_hits?.top_speech?.hits?.hits?.[0];
        return {
          documentId: hit._source.debate_id,
          top_speech: {
            id: topSpeech._id,
            score: topSpeech._score,
            speaker_name: topSpeech._source.speaker_name,
            speaker_id: topSpeech._source.speaker_id,
            content: topSpeech.highlight?.content?.join(" ") || topSpeech._source.content,
            sentiment_label: sentiment,
            rhetorical_intent: rhetoricalIntent,
            high_intensity: highIntensity
          },
        };
      }) || []
    );
  } catch (error) {
    console.error("Error in queryElasticDebates:", error);
    return [];
  }
}