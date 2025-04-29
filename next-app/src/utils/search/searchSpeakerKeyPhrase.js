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

export async function searchSpeakerKeyPhrase(keyPhrase, speakerId, speakerDebateIds) {
  if (!speakerId || !Array.isArray(speakerDebateIds) || speakerDebateIds.length === 0) {
    throw new Error("Missing speakerId or speakerDebateIds in searchSpeakerKeyPhrase");
  }

  const { tonedKeyword, untonedKeyword, isIdentical } = preprocessGreekKeyword(keyPhrase);

  const shouldClauses = isIdentical
    ? [{ match_phrase: { content: tonedKeyword } }]
    : [
      { match_phrase: { content: tonedKeyword } },
      { match_phrase: { content: untonedKeyword } },
    ];

  const esQuery = {
    index: "speeches",
    body: {
      query: {
        bool: {
          must: [
            { bool: { should: shouldClauses } },
            { terms: { debate_id: speakerDebateIds } },
            { term: { speaker_id: speakerId } },
          ],
        },
      },
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

  return response?.hits?.hits.map(hit => {
    const topSpeech = hit.inner_hits.top_speech.hits.hits[0];
    return {
      speakerDocumentId: hit._source.speaker_id,
      debateDocumentId: hit._source.debate_id, // top document
      top_speech: {
        id: topSpeech._id,
        score: topSpeech._score,
        speaker_name: topSpeech._source.speaker_name,
        content:
          topSpeech.highlight?.content?.join(" ") ||
          topSpeech._source.content,
      },
    };
  }) || [];
}
