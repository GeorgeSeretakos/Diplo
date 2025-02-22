import client from "../../../../elasticsearch/client.js"; // Elasticsearch client
import axios from "axios";
import { constants } from "../../../../constants/constants.js";

const STRAPI_URL = constants.STRAPI_URL;
const API_TOKEN = constants.API_TOKEN;

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      keyPhrase,
      startDate,
      endDate,
      session,
      meeting,
      period,
      topics,
      speakers,
      sortBy,
      page,
      limit
    } = body;
    console.log("Body: ", body);
    console.log("Keyphrase: ", keyPhrase);

    const offset = (page - 1)*limit;

    const preprocessGreekKeyword = (keyword) => {
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
    };

    // Elasticsearch Query for Full-Text Search + Date Filtering
    let esQuery = null;
    if (keyPhrase) {
      const { tonedKeyword, untonedKeyword, isIdentical } = preprocessGreekKeyword(keyPhrase);

      const shouldClauses = isIdentical
        ? [{ match_phrase: { content: tonedKeyword } }]
        : [
          { match_phrase: { content: tonedKeyword } },
          { match_phrase: { content: untonedKeyword } },
        ];

      esQuery = {
        index: "speeches",
        body: {
          query: {
            bool: {
              must: [{ bool: { should: shouldClauses } }],
              filter: [],
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
                    pre_tags: ['<span style="font-weight: bold; color: #f9d342;">',],
                    post_tags: ["</span>"],
                  },
                }
              }
            },
          },
          sort: [{_score: "desc"}],
        },
      };
    }

    // Strapi GraphQL Filters for Date Range + Structured Filters
    const filters = [];
    if (startDate) filters.push(`date: { gte: "${startDate}" }`);
    if (endDate) filters.push(`date: { lte: "${endDate}" }`);
    if (session) filters.push(`session: { eq: "${session}" }`);
    if (meeting) filters.push(`meeting: { eq: "${meeting}" }`);
    if (period) filters.push(`period: { eq: "${period}" }`);
    if (topics?.length) filters.push(`topics: { topic: { in: [${topics.map(t => `"${t}"`).join(", ")}] } }`);
    if (speakers?.length) filters.push(`speakers: { speaker_name: { in: [${speakers.map(s => `"${s}"`).join(", ")}] } }`);

    const strapiQuery = `
            query {
                debates(filters: { ${filters.join(", ")} }) {
                    documentId
                }
            }
        `;

    // Parallel API Calls
    const [esResponse, strapiResponse] = await Promise.all([
      esQuery ? client.search(esQuery) : null,
      axios.post(`${STRAPI_URL}/graphql`, { query: strapiQuery }, {
        headers: { Authorization: `Bearer ${API_TOKEN}`, "Content-Type": "application/json" },
      }),
    ]);

    // Process Elasticsearch Response
    const esDebates = esResponse?.hits?.hits.map(hit => {
      const topSpeech = hit.inner_hits.top_speech.hits.hits[0];
      return {
        documentId: hit._source.debate_id,
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
    }) || [];
    console.log("Es Debates: ", esDebates);

    // Process Strapi Response
    const strapiDebates = strapiResponse?.data?.data?.debates || [];
    console.log("Strapi Debates: ", strapiDebates);

    // Get Set of Debate IDs from Both Responses
    const esDebateIds = new Set(esDebates.map(d => d.documentId));
    const strapiDebateIds = new Set(strapiDebates.map(d => d.documentId));

    console.log("esDebateIds: ", esDebateIds);
    console.log("strapiDebateIds: ", strapiDebateIds);

    let mergedDebateIds;

    // **Check if both queries have input values**
    const hasElasticSearchInput = Boolean(keyPhrase);
    const hasStrapiInput = Boolean(
      startDate || endDate || session || meeting || period ||
      (Array.isArray(topics) && topics.length > 0) ||
      (Array.isArray(speakers) && speakers.length > 0));

    console.log("hasElasticSearchInput: ", hasElasticSearchInput);
    console.log("hasStrapiInput: ", hasStrapiInput);

    if (hasElasticSearchInput && hasStrapiInput) {
      mergedDebateIds = new Set([...esDebateIds].filter(id => strapiDebateIds.has(id)));
    } else if (hasElasticSearchInput) {
      mergedDebateIds = esDebateIds;
    } else if (hasStrapiInput) {
      mergedDebateIds = strapiDebateIds;
    } else {
      mergedDebateIds = new Set([...esDebateIds, ...strapiDebateIds]);
    }

    console.log("Merged IDs: ", mergedDebateIds);

    // If there are no merged debate IDs, return an empty array immediately
    if (mergedDebateIds.size === 0) {
      console.log("⚠️ No merged debate IDs found, returning empty result.");
      return new Response(JSON.stringify({
        debates: [],
        totalPages: 0
      }), { status: 200 });
    }

    const totalPages = Math.ceil(mergedDebateIds.size / limit);

    const detailedStrapiQuery = `
    query {
        debates(
          filters: { documentId: { in: [${[...mergedDebateIds].map(id => `"${id}"`).join(", ")}] } }
          pagination: { start: ${offset}, limit: ${limit} }
          sort: "date:${sortBy === "oldest" ? "asc" : "desc"}"
          ) {
            documentId
            date
            session_date
            session
            meeting
            period
            topics { topic }
        }
    }
    `;

    const detailedStrapiResponse = await axios.post(`${STRAPI_URL}/graphql`, { query: detailedStrapiQuery }, {
      headers: { Authorization: `Bearer ${API_TOKEN}`, "Content-Type": "application/json" },
    });

    const detailedStrapiDebates = detailedStrapiResponse?.data?.data?.debates || [];
    console.log("Detailed Debates: ", detailedStrapiDebates);

    const esDebateMap = new Map(esDebates.map(debate => [debate.documentId, debate]));

    const mergedDebates = detailedStrapiDebates.map(strapiDebate => {
      const esDebate = esDebateMap.get(strapiDebate.documentId);

      return {
        documentId: strapiDebate.documentId,
        date: strapiDebate.date,
        session_date: strapiDebate.session_date,
        session: strapiDebate.session,
        meeting: strapiDebate.meeting,
        period: strapiDebate.period,
        topics: strapiDebate.topics,
        // ✅ Add Elasticsearch data if available
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

    console.log("Final Merged Debates: ", mergedDebates);
    return new Response(JSON.stringify({
      debates: mergedDebates,
      totalPages
    }), { status: 200 });

  } catch (error) {
    console.error("Error fetching filtered debates:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch debates." }), { status: 500 });
  }
}
