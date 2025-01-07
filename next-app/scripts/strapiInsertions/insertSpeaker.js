import axios from "axios";
import FormData from "form-data";
import {formatDateToGreek} from "../../src/utils/Date/formatDate.js";
import uploadImageToStrapi from "../utils/uploadImageToStrapi.js";
import findOrCreatePoliticalParty from "./insertPoliticalParty.js";
import {constants} from "../../constants/constants.js";

async function fetchSpeakerData(wikidataUrl) {
  try {
    if (!wikidataUrl || wikidataUrl === "-") return null; // Skip invalid URLs

    const entityId = wikidataUrl.split("/").pop(); // Extract the Wikidata entity ID
    const sparqlQuery = `
  SELECT ?image ?descriptionEl ?descriptionEn ?genderLabel ?dob ?dod ?pobLabel ?website ?occupationLabel ?languageLabel ?partyLabel ?partyImage ?eduLabel ?degreeLabel ?majorLabel WHERE {
    OPTIONAL { wd:${entityId} wdt:P18 ?image. }
    OPTIONAL { wd:${entityId} schema:description ?descriptionEl. FILTER (lang(?descriptionEl) = "el") }
    OPTIONAL { wd:${entityId} schema:description ?descriptionEn. FILTER (lang(?descriptionEn) = "en") }
    OPTIONAL { wd:${entityId} wdt:P21 ?gender. ?gender rdfs:label ?genderLabel. FILTER (lang(?genderLabel) = "el") }
    OPTIONAL { wd:${entityId} wdt:P569 ?dob. }
    OPTIONAL { wd:${entityId} wdt:P570 ?dod. }
    OPTIONAL { wd:${entityId} wdt:P19 ?pob. ?pob rdfs:label ?pobLabel. FILTER (lang(?pobLabel) = "el") }
    OPTIONAL { wd:${entityId} wdt:P69 ?edu. ?edu rdfs:label ?eduLabel. FILTER (lang(?eduLabel) = "en") }
    OPTIONAL {
      wd:${entityId} p:P69 ?educationStatement.  # Property statement for "educated at"
      ?educationStatement ps:P69 ?edu.          # The institution
      OPTIONAL {
        ?educationStatement pq:P512 ?degree.    # Academic degree qualifier
        ?degree rdfs:label ?degreeLabel.
        FILTER (lang(?degreeLabel) = "en")
      }
      OPTIONAL {
        ?educationStatement pq:P812 ?major.     # Academic major qualifier
        ?major rdfs:label ?majorLabel.
        FILTER (lang(?majorLabel) = "en")
      }
    }
    OPTIONAL { wd:${entityId} wdt:P856 ?website. }
    OPTIONAL { wd:${entityId} wdt:P106 ?occupation. ?occupation rdfs:label ?occupationLabel. FILTER (lang(?occupationLabel) = "el") }
    OPTIONAL { wd:${entityId} wdt:P1412 ?language. ?language rdfs:label ?languageLabel. FILTER (lang(?languageLabel) = "el") }
    OPTIONAL {
      wd:${entityId} wdt:P102 ?party.
      OPTIONAL { ?party rdfs:label ?partyLabel. FILTER (lang(?partyLabel) = "el") }
      OPTIONAL { ?party wdt:P154 ?partyImage. }
    }
  }
`;

    const endpoint = constants.WIKIDATA_URL; // No quotes needed

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

    // Handle educational data
    const educationData = bindings
      .filter((b) => b.eduLabel) // Ensure only rows with an institution
      .map((b) => ({
        institution: b.eduLabel?.value || null,
        degree: b.degreeLabel?.value || null,
        major: b.majorLabel?.value || null,
      }));

    // Remove duplicates based on all three fields (institution, degree, major)
    const uniqueEducationData = [
      ...new Map(
        educationData.map((item) => [
          `${item.institution}-${item.degree}-${item.major}`, // Create unique key
          item,
        ])
      ).values(),
    ];

    // Format the educational data as readable strings
    const formattedEducation = uniqueEducationData.map((edu) => {
      const details = [];
      if (edu.degree) details.push(edu.degree);
      if (edu.major) details.push(edu.major);

      return details.length > 0
        ? `${edu.institution} (${details?.join(" in ")})`
        : edu.institution;
    });



    if (bindings.length > 0) {
      const parties = bindings
        .filter((b) => b.partyLabel) // Ensure valid party labels
        .map((b) => ({
          name: b.partyLabel?.value || null,
          image: b.partyImage?.value || null,
        }));

      const result = bindings[0]; // Assume single row for simplicity
      return {
        image: result.image?.value || null,
        description: result.descriptionEl?.value || result.descriptionEn?.value || null,
        gender: result.genderLabel?.value || null,
        date_of_birth: result.dob?.value || null,
        date_of_death: result.dod?.value || null,
        place_of_birth: result.pobLabel?.value || null,
        education: formattedEducation || null,
        website: result.website?.value || null,
        occupation: bindings.map((b) => b.occupationLabel?.value).filter(Boolean) || [],
        languages: bindings.map((b) => b.languageLabel?.value).filter(Boolean) || [],
        political_parties: parties, // Include all parties
      };
    }

    return null; // No data found
  } catch (error) {
    console.error("Error fetching speakerId data: ", error.response ? error.response.data : error);
    return null;
  }
}


function formatFields(data) {
  // Function to convert to uppercase and remove Greek tones
  const removeGreekTones = (input) =>
    input
      .normalize("NFD") // Decompose characters into base and diacritics
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .toUpperCase(); // Convert to uppercase

  return {
    speaker_name: data.speaker_name? removeGreekTones(data.speaker_name).toString() : null, // OK
    speaker_id: data.speaker_id?.toString() || null, // OK
    link: data.link?.toString() || null, // OK
    description: data.description?.toString() || null, // OK
    gender: data.gender?.toString() || null, // OK
    date_of_birth: data.date_of_birth ? formatDateToGreek(data.date_of_birth) : null, // OK
    date_of_death: data.date_of_death ? formatDateToGreek(data.date_of_death) : null, // OK
    place_of_birth: data.place_of_birth?.toString() || null, // OK
    educated_at: data.educated_at ? data.educated_at.join(", ").toString() : null,
    website: data.website?.toString() || null,
    occupation: data.occupation
      ? [
        ...new Set(
          (Array.isArray(data.occupation) // Check if it's already an array
              ? data.occupation
              : data.occupation.split(",")) // Split if it's a string
            .map((item) => item.trim()) // Trim whitespace
            .filter(Boolean) // Remove empty values
        ),
      ].join(", ") // Join unique values with commas
      : null,
    languages: data.languages
      ? [
        ...new Set(
          (Array.isArray(data.languages)
            ? data.languages
            : data.languages.split(","))
            .map((item) => item.trim())
            .filter(Boolean)
        ),
      ].join(", ")
      : null,
    political_parties: data.political_parties
      ? [
        ...new Map(
          data.political_parties.map((party) => [party.name, party]) // Use party name as the unique key
        ).values(),
      ]
      : [],
    debates: data.debates?.toString() || null,
  };
}



// Helper function to extract speech data
export async function extractSpeakerData(speaker, debateId) {
  const wikidata = await fetchSpeakerData(speaker.href);

  return {
    speaker_name: speaker.showAs,
    speaker_id: speaker.eId,
    link: speaker.href,
    image: wikidata?.image || null,
    description: wikidata?.description || null,
    gender: wikidata?.gender || null,
    date_of_birth: wikidata?.date_of_birth || null,
    date_of_death: wikidata?.date_of_death || null,
    place_of_birth: wikidata?.place_of_birth || null,
    educated_at: wikidata?.education || null,
    website: wikidata?.website || null,
    occupation: wikidata?.occupation || [],
    languages: wikidata?.languages || [],
    political_parties: wikidata?.political_parties || null,
    debates: debateId
  }
}


// Function to find or create a speakerId
async function findOrCreateSpeaker(speakerData, debateId, STRAPI_URL, API_TOKEN) {
  try {
    const politicalPartyIds = [];

    // Upload the speakerId's image to Strapi and get its ID
    const imageId = await uploadImageToStrapi(speakerData.image, STRAPI_URL, API_TOKEN);

    const validatedData = formatFields(speakerData);

    // console.log("Speaker data: ", validatedData);

    // Process all political parties
    if (validatedData.political_parties && validatedData.political_parties.length > 0) {
      for (const party of validatedData.political_parties) {
        const partyId = await findOrCreatePoliticalParty(party, STRAPI_URL, API_TOKEN);
        if (partyId) {
          politicalPartyIds.push(partyId);
        }
      }
      // // Link political parties of speakerId to debate, problem: what was the party of the speakerId during this debate?
      // await axios.put(
      //   `${STRAPI_URL}/api/debates/${debateId}`,
      //   {
      //     data: {
      //       political_parties: {
      //         connect: politicalPartyIds,
      //       },
      //     },
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${API_TOKEN}`,
      //       'Content-Type': 'application/json',
      //     },
      //   }
      // );
    }


    // Attempt to find the speakerId by unique field (e.g., speaker_id)
    const response = await axios.get(
      `${STRAPI_URL}/api/speakers?filters[speaker_id][$eq]=${validatedData.speaker_id}`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    // If speakerId exists, return its ID
    if (response.data.data.length > 0) {
      console.log(`Speaker ${validatedData.speaker_name} with documentId ${response.data.data} already exists.`);
      return response.data.data[0].documentId;
    }

    // If speakerId does not exist, create a new speakerId
    const createResponse = await axios.post(
      `${STRAPI_URL}/api/speakers`,
      {
        data: {
          ...validatedData,
          image: imageId,
          political_parties: politicalPartyIds, // Link all parties
        }
      },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`Speaker ${validatedData.speaker_name} created successfully.`);
    return createResponse.data.data.documentId;
  } catch (error) {
    console.error("Error finding or creating speakerId:", error.response ? error.response.data : error);
  }
}



async function connect(speakerId, debateId, STRAPI_URL, API_TOKEN) {
  if (!speakerId || !debateId) {
    console.log("Skipping relationship establishment due to missing IDs.");
    return;
  }

  try {
    await axios.put(
      `${STRAPI_URL}/api/speakers/${speakerId}`,
      {
        data: {
          debates: {
            connect: [debateId]
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    await axios.put(
      `${STRAPI_URL}/api/debates/${debateId}`,
      {
        data: {
          speakers: {
            connect: [speakerId]
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`Speaker ${speakerId} successfully connected to Debate ${debateId}`);
  } catch (error) {
    console.error("Error establishing relationship between Speaker and Debate:", error.response ? error.response.data : error);
    throw error;
  }
}

// Main function to handle speakerId insertion or connection
export async function insertSpeaker(jsonData, debateId, STRAPI_URL, API_TOKEN) {
  try {
    // Extract the speakerId data from jsonData
    const speakers = jsonData.akomaNtoso.debate[0].meta[0].references[0].TLCPerson;

    // Iterate over each speakerId and insert/connect it in Strapi
    for (const speaker of speakers) {
      const speakerData = await extractSpeakerData(speaker.$, debateId);

      // Find or create the speakerId, and get the speakerId ID
      const speakerId = await findOrCreateSpeaker(speakerData, debateId, STRAPI_URL, API_TOKEN);

      // Connect the speakerId to the debate, even if they already existed
      await connect(speakerId, debateId, STRAPI_URL, API_TOKEN);
    }
  } catch (error) {
    console.error("Error inserting or connecting speakerId:", error.response ? error.response.data : error);
    throw error;
  }
}