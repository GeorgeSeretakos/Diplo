import dotenv from "dotenv";
dotenv.config();

const WIKIDATA_URL = process.env.NEXT_PUBLIC_WIKIDATA_URL;

export const executeSparqlQuery = async (query) => {
  const url = `${WIKIDATA_URL}?query=${encodeURIComponent(query)}&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`SPARQL query failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("SPARQL Response JSON:", data); // Log raw JSON response
    return data.results.bindings; // Return only the bindings (query results)
  } catch (error) {
    console.error("Error executing SPARQL query:", error);
    return null;
  }
};
