import axios from "axios";
import {formatDateToGreek} from "../../src/utils/Date/formatDate.js";
import uploadImageToStrapi from "../utils/uploadImageToStrapi.js";
import findOrCreatePoliticalParty from "./insertPoliticalParty.js";
import {constants} from "../../constants/constants.js";

import Database from "better-sqlite3";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const strapiDbPath = path.join(__dirname, "../../../strapi-app/.tmp/data.db");  // Adjust path based on actual project structure
const db = new Database(strapiDbPath);



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


async function createSpeaker(speakerData, debateId, STRAPI_URL, API_TOKEN) {
  try {
    const politicalPartyIds = [];
    const imageId = await uploadImageToStrapi(speakerData.image, STRAPI_URL, API_TOKEN);
    const validatedData = formatFields(speakerData);

    if (validatedData.political_parties && validatedData.political_parties.length > 0) {
      for (const party of validatedData.political_parties) {
        const partyId = await findOrCreatePoliticalParty(party, STRAPI_URL, API_TOKEN);
        if (partyId) {
          politicalPartyIds.push(partyId);
        }
      }
    }

    const createResponse = await axios.post(
      `${STRAPI_URL}/api/speakers?populate=false`,
      {
        data: {
          ...validatedData,
          image: imageId,
          political_parties: politicalPartyIds,
          debates: debateId
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
    console.error("Error finding or creating speakerId:");
    console.log(error.message);
    console.log(error.response ? error.response.data : error);
  }
}


async function connect(speakerDocId, debate_id) {
  if (!speakerDocId || !debate_id) {
    console.log("Skipping relationship establishment due to missing IDs.");
    return;
  }

  try {
    const speaker = db.prepare("SELECT id FROM speakers WHERE document_id = ?").get(speakerDocId);
    if (!speaker) {
      console.error(`❌ Speaker with documentId ${speakerDocId} not found.`);
      return;
    }

    const existingConnection = db
      .prepare("SELECT * FROM speakers_debates_lnk WHERE speaker_id = ? AND debate_id = ?")
      .get(speaker.id, debate_id);

    if (existingConnection) {
      console.log(`⚠️ Relationship already exists between Speaker ${speakerDocId} and Debate ${debate_id}.`);
      return;
    }

    db.prepare("INSERT INTO speakers_debates_lnk (speaker_id, debate_id) VALUES (?, ?)").run(speaker.id, debate_id);

    console.log(`✅ Speaker ${speakerDocId} successfully linked to Debate ${debate_id}.`);
  } catch (error) {
    console.error("❌ Error inserting relationship:", error);
  }
}


export async function insertSpeaker(jsonData, debateId, STRAPI_URL, API_TOKEN) {
  try {
    // Extract the speakerId data from jsonData
    const speakers = jsonData.akomaNtoso.debate[0].meta[0].references[0].TLCPerson;

    const uniqueSpeakers = Array.from(
      new Map(
        speakers.map(sp => [sp.$.eId, sp])
      ).values()
    );

    const debate = db.prepare("SELECT id FROM debates WHERE document_id = ?").get(debateId);

    for (const speaker of uniqueSpeakers) {
      let speakerId;
      // Attempt to find the speakerId by unique field speaker_id
      const response = await axios.get(
        `${STRAPI_URL}/api/speakers?filters[speaker_id][$eq]=${speaker.$.eId}`,
        {headers: {Authorization: `Bearer ${API_TOKEN}`,},}
      );

      if (response.data.data.length > 0) {
        console.log(`Speaker ${speaker.$.showAs} with documentId ${response.data.data[0].documentId} already exists.`);
        speakerId = response.data.data[0].documentId;
        if (debate) {
          await connect(speakerId, debate.id);
        } else {
          console.error(`❌ Debate with documentId ${debateId} not found.`);
        }

      }
      else {
        const speakerData = await extractSpeakerData(speaker.$, debateId);
        await createSpeaker(speakerData, debateId, STRAPI_URL, API_TOKEN);
      }
    }
    return uniqueSpeakers;

  } catch (error) {
    console.error(`❌ Error inserting or connecting speakerId: ${error}`);
    throw error;
  }
}