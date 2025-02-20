import client from "../../../../../../elasticsearch/client.js"; // Elasticsearch client

export async function POST(req) {
  const preprocessGreekKeyword = (keyword) => {
    const accentMap = {
      ά: "α",
      έ: "ε",
      ή: "η",
      ί: "ι",
      ό: "ο",
      ύ: "υ",
      ώ: "ω",
      ϊ: "ι",
      ϋ: "υ",
      ΐ: "ι",
      ΰ: "υ",
      Ά: "Α",
      Έ: "Ε",
      Ή: "Η",
      Ί: "Ι",
      Ό: "Ο",
      Ύ: "Υ",
      Ώ: "Ω",
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
  };

  try {
    const { keyword, debate_id, fetchAllSpeeches } = await req.json();

    if (!keyword) {
      return new Response(
        JSON.stringify({ error: "Keyword is required for search-debates." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { tonedKeyword, untonedKeyword, isIdentical } =
      preprocessGreekKeyword(keyword);

    const shouldClauses = isIdentical
      ? [{ match: { content: tonedKeyword } }]
      : [
        { match: { content: tonedKeyword } },
        { match: { content: untonedKeyword } },
      ];

    // Determine query based on fetchAllSpeeches
    const query = fetchAllSpeeches
      ? {
        index: "speeches",
        body: {
          query: {
            bool: {
              must: [
                {
                  bool: {
                    should: shouldClauses,
                  },
                },
              ],
              ...(debate_id && {
                filter: [
                  {
                    term: { debate_id: debate_id },
                  },
                ],
              }),
            },
          },
          highlight: {
            fields: {
              content: {
                pre_tags: ['<mark>'],
                post_tags: ['</mark>'],
              },
            },
          },
        },
      }
      : {
        index: "speeches",
        body: {
          query: {
            bool: {
              must: [
                {
                  bool: {
                    should: shouldClauses,
                  },
                },
              ],
              ...(debate_id && {
                filter: [
                  {
                    term: { debate_id: debate_id },
                  },
                ],
              }),
            },
          },
          collapse: {
            field: "debate_id",
            inner_hits: {
              name: "top_speech",
              size: 1,
              sort: [{ _score: "desc" }],
              highlight: {
                fields: {
                  content: {
                    pre_tags: [
                      '<span style="font-weight: bold; color: black;">',
                    ],
                    post_tags: ["</span>"],
                  },
                },
              },
            },
          },
          sort: [{ _score: "desc" }],
        },
      };

    const response = await client.search(query);

    if (fetchAllSpeeches) {
      // Format all speeches with different highlighting
      const speeches = response.hits.hits.map((hit) => ({
        id: hit._id,
        debate_id: hit._source.debate_id,
        score: hit._score,
        speaker_name: hit._source.speaker_name,
        content: hit.highlight?.content?.join(" ") || hit._source.content,
        speaker_id: hit._source.speaker_id,
      }));

      return new Response(
        JSON.stringify({ total: response.hits.total.value, speeches }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      // Format unique debates
      const debates = response.hits.hits.map((hit) => {
        const topSpeech = hit.inner_hits.top_speech.hits.hits[0];
        return {
          debate_id: hit._source.debate_id,
          top_speech: {
            id: topSpeech._id,
            score: topSpeech._score,
            speaker_name: topSpeech._source.speaker_name,
            content:
              topSpeech.highlight?.content?.join(" ") ||
              topSpeech._source.content,
            speaker_id: topSpeech._source.speaker_id,
          },
        };
      });

      return new Response(
        JSON.stringify({ total: response.hits.total.value, debates }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error performing search-debates:", error.message);
    return new Response(
      JSON.stringify({
        error: "An error occurred while performing the search-debates.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
