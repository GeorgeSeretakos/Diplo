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

export async function searchDebatesKeyPhrase(keyPhrase, sortBy="newest") {
  if (!keyPhrase || keyPhrase.trim() === "") return [];

  try {
    const { tonedKeyword, untonedKeyword, isIdentical } = preprocessGreekKeyword(keyPhrase);

    const shouldClauses = isIdentical
      ? [{ match_phrase: { content: tonedKeyword } }]
      : [
        { match_phrase: { content: tonedKeyword } },
        { match_phrase: { content: untonedKeyword } },
      ];

    const query = {
      bool: {
        must: [{ bool: { should: shouldClauses } }]
      }
    };

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
            highlight: {
              fields: {
                content: {
                  pre_tags: ['<span style="font-weight: bold; color: #f9d342;">'],
                  post_tags: ["</span>"],
                },
              },
            },
          },
        },
        size: 10000,
        sort: [{ speech_date: sortBy === "oldest" ? "asc" : "desc" }],
      },
    });

    return response?.hits?.hits.map(hit => {
      const topSpeech = hit.inner_hits?.top_speech?.hits?.hits?.[0];
      return {
        documentId: hit._source.debate_id,
        top_speech: {
          id: topSpeech._id,
          score: topSpeech._score,
          speaker_name: topSpeech._source.speaker_name,
          speaker_id: topSpeech._source.speaker_id,
          content: topSpeech.highlight?.content?.join(" ") || topSpeech._source.content,
        },
      };
    }) || [];

  } catch (error) {
    console.error("Error in searchDebatesKeyPhrase:", error);
    return [];
  }
}
