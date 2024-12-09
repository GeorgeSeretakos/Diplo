// utils/wikidata/fetchData.js

export const executeSparqlQuery = async (query) => {
  const endpointUrl = "https://query.wikidata.org/sparql";
  const url = `${endpointUrl}?query=${encodeURIComponent(query)}&format=json`;

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
