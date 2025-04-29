import { searchInDebate } from "@utils/search/searchInDebate.js";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      debateId,
      keyPhrase = "",
      speakers = [],
      sentiments = [],
      sortBy = "newest",
    } = body;

    if (!debateId) {
      return new Response(JSON.stringify({ error: "debateId is required." }), { status: 400 });
    }

    const hasKeyPhrase = keyPhrase.trim() !== "";
    const hasSpeakerFilter = Array.isArray(speakers) && speakers.length > 0;
    const hasSentimentFilter = Array.isArray(sentiments) && sentiments.length > 0;

    const speeches = await searchInDebate({
      debateId,
      keyPhrase,
      speakerNames: hasSpeakerFilter ? speakers : [],
      sentiments: hasSentimentFilter ? sentiments : [],
      sortBy,
    });

    if (!speeches || speeches.length === 0) {
      return new Response(JSON.stringify({ speeches: [], totalPages: 0 }), { status: 200 });
    }

    const pageSize = 5; // Optional: can be made dynamic via `body.pageSize`
    const totalPages = Math.ceil(speeches.length / pageSize);

    return new Response(
      JSON.stringify({
        speeches,
        totalPages,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in /api/in-debate-search:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch speeches." }), { status: 500 });
  }
}
