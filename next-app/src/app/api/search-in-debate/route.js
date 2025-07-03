import { searchInDebate } from "@utils/search/searchInDebate.js";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      debateId,
      keyPhrase = "",
      speakers = [],
      rhetoricalIntent = "",
      sentiment = "",
      highIntensity = false,
      sortBy = "newest",
    } = body;

    if (!debateId) {
      return new Response(JSON.stringify({ error: "debateId is required." }), { status: 400 });
    }

    const filters = {
      keyPhrase,
      speakers,
      rhetoricalIntent,
      sentiment,
      highIntensity,
    }
    console.log("Filters: ", filters);

    const speeches = await searchInDebate({
      ...filters,
      debateId,
      sortBy,
    });

    if (!speeches || speeches.length === 0) {
      return new Response(JSON.stringify({ speeches: [], totalPages: 0 }), { status: 200 });
    }

    return new Response(
      JSON.stringify({
        speeches,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in /api/in-debate-search:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch speeches." }), { status: 500 });
  }
}