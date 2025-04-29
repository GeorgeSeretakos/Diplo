import client from "@elasticsearch/client.js";

function preprocessGreekKeyword(keyword) {
  const accentMap = {
    ά: "α", έ: "ε", ή: "η", ί: "ι", ό: "ο", ύ: "υ", ώ: "ω",
    ϊ: "ι", ϋ: "υ", ΐ: "ι", ΰ: "υ", Ά: "Α", Έ: "Ε", Ή: "Η",
    Ί: "Ι", Ό: "Ο", Ύ: "Υ", Ώ: "Ω"
  };

  const untonedKeyword = keyword
    .split("")
    .map((char) => accentMap[char] || char)
    .join("");

  return {
    tonedKeyword: keyword.trim(),
    untonedKeyword: untonedKeyword.trim(),
    isIdentical: keyword.trim() === untonedKeyword.trim(),
  };
}

export async function searchInDebate({
debateId,
keyPhrase = "",
speakerNames = [],
sentiments = [],
}) {
  try {
    const must = [];

    if (!debateId) {
      throw new Error("debateId is required");
    }

    must.push({ term: { debate_id: debateId } });

    const { tonedKeyword, untonedKeyword, isIdentical } = preprocessGreekKeyword(keyPhrase);

    const shouldClauses = tonedKeyword
      ? (isIdentical
        ? [{ match_phrase: { content: tonedKeyword } }]
        : [
          { match_phrase: { content: tonedKeyword } },
          { match_phrase: { content: untonedKeyword } },
        ])
      : [];

    if (shouldClauses.length > 0) {
      must.push({ bool: { should: shouldClauses } });
    }

    if (speakerNames.length > 0) {
      must.push({ terms: { "speaker_name.keyword": speakerNames } });
    }

    if (sentiments.length > 0) {
      must.push({ terms: { sentiment: sentiments } });
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
      score: hit._score,
      speaker_name: hit._source.speaker_name,
      speaker_id: hit._source.speaker_id,
      content: hit.highlight?.content?.join(" ") || hit._source.content,
    }));

  } catch (error) {
    console.error("Error in searchInDebate:", error);
    return [];
  }
}
