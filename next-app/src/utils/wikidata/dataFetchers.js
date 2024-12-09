// utils/wikidata/dataFetchers.js
import { executeSparqlQuery } from "./fetchData";
import { getPersonalInfoQuery, getPoliticalInfoQuery } from "./queries";

// Fetch personal information
export const fetchPersonalInfo = async (entityId) => {
  const query = getPersonalInfoQuery(entityId);
  console.log("SPARQL Query:", query); // Log the generated query
  const results = await executeSparqlQuery(query);

  console.log("SPARQL Results:", results); // Log the raw results


  if (results && results.length > 0) {
    const data = results[0]; // Extract the first result
    return {
      fullName: data.fullName?.value || "Name not available",
      dateOfBirth: data.dateOfBirth?.value || "Date of birth not available",
      placeOfBirth: data.placeOfBirthLabel?.value || "Place of birth not available",
      gender: data.genderLabel?.value || "Gender not specified",
      nationality: data.nationalityLabel?.value || "Nationality not specified",
      image: data.image?.value || null, // Null if no image
      languages: data.languages?.value ? data.languages.value.split(", ") : [], // Convert to array
    };
  } else {
    console.error("No personal information found.");
    return null;
  }
};

// Fetch political positions
export const fetchPoliticalInfo = async (entityId) => {
  const query = getPoliticalInfoQuery(entityId);
  const results = await executeSparqlQuery(query);

  if (results && results.length > 0) {
    const currentPosition = results.find((item) => item.currentPositionLabel) || null;
    const party = results.find((item) => item.partyLabel) || null;

    const previousPositions = results
      .filter((item) => item.previousPositionLabel)
      .map((item) => ({
        title: item.previousPositionLabel.value,
        startDate: item.previousStartDate?.value || "Unknown",
        endDate: item.previousEndDate?.value || "Present",
      }));

    return {
      currentPosition: currentPosition //
        ? {
          title: currentPosition.currentPositionLabel.value,
          startDate: currentPosition.currentStartDate?.value || "Unknown",
        }
        : null,
      party: party
        ? {
          name: party.partyLabel.value,
          logo: party.partyLogo?.value || null,
        }
        : null,
      previousPositions,
    };
  } else {
    console.error("No political information found.");
    return null;
  }
};

import axios from "axios";

export async function fetchEducationData(wikidataUrl) {
  try {
    if (!wikidataUrl || wikidataUrl === "-") return [];

    const entityId = wikidataUrl.split("/").pop(); // Extract entity ID from the URL
    const sparqlQuery = getEducationQuery(entityId); // Get the SPARQL query

    const endpoint = "https://query.wikidata.org/sparql";
    const response = await axios.get(endpoint, {
      headers: {
        Accept: "application/sparql-results+json",
      },
      params: {
        query: sparqlQuery,
        format: "json",
      },
    });

    const bindings = response.data.results.bindings;

    // Map and format the results
    const educationData = bindings.map((b) => ({
      institution: b.eduLabel?.value || null,
      degree: b.degreeLabel?.value || null,
      major: b.majorLabel?.value || null,
    }));

    return educationData;
  } catch (error) {
    console.error("Error fetching education data:", error.response?.data || error.message);
    return [];
  }
}

