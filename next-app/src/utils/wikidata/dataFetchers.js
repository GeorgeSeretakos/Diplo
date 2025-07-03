import { executeSparqlQuery } from "./fetchData.js";
import { getPositionHeldQuery } from "./queries.js";

export const fetchPositionHeld = async (wikidataUrl) => {
  console.log("Wikidata url: ", wikidataUrl);
  try {
    if (!wikidataUrl || wikidataUrl === "-") return []; // Skip invalid URLs

    const entityId = wikidataUrl.split("/").pop(); // Extract the entity ID
    const query = getPositionHeldQuery(entityId); // Get the SPARQL query
    const results = await executeSparqlQuery(query); // Execute the query

    // Process and format the results
    return results.map((result) => ({
      position: result.positionLabel?.value || null,
      of: result.ofLabel?.value || null,
      startTime: result.startTime?.value || null,
      endTime: result.endTime?.value || null,
    }));
  } catch (error) {
    console.error("Error fetching 'position held' data:", error);
    return [];
  }
};
