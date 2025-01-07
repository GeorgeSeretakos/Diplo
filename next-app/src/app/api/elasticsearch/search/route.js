import client from "../../../../../elasticsearch/client.js"; // Elasticsearch client

export async function POST(req) {
  try {
    // Parse the request body for search parameters
    const { keyword, debate_id } = await req.json();

    if (!keyword) {
      return new Response(
        JSON.stringify({ error: "Keyword is required for search." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Build the Elasticsearch query
    const query = {
      index: "speeches",
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  content: keyword, // Full-text search on 'content'
                },
              },
            ],
            ...(debate_id && {
              filter: [
                {
                  term: {
                    debate_id: debate_id, // Filter by 'debate_id' if provided
                  },
                },
              ],
            }),
          },
        },
      },
    };

    // Execute the search query
    const response = await client.search(query);

    // Extract and format the results
    const results = response.hits.hits.map((hit) => ({
      id: hit._id,
      score: hit._score,
      speaker_name: hit._source.speaker_name,
      content: hit._source.content,
      debate_id: hit._source.debate_id,
      speaker_id: hit._source.speaker_id,
    }));

    // Return the search results
    return new Response(
      JSON.stringify({
        total: response.hits.total.value,
        results,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error performing search:", error.message);
    return new Response(
      JSON.stringify({ error: "An error occurred while performing the search." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}