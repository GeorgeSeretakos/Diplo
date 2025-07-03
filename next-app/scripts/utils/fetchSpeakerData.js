import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export default async function fetchSpeakerData(wikidataUrl) {
  try {
    if (!wikidataUrl || wikidataUrl === "-" || wikidataUrl === "") return null;
    const entityId = wikidataUrl.split("/").pop();

    const sparqlQuery = `
      SELECT ?image ?descriptionEl ?descriptionEn ?genderLabel ?dob ?dod ?pobLabel ?website ?occupationLabel ?languageLabel 
      ?partyLabel ?partyImage ?eduLabel ?degreeLabel ?majorLabel 
      
      WHERE {
        OPTIONAL { wd:${entityId} wdt:P18 ?image. }
        OPTIONAL { wd:${entityId} schema:description ?descriptionEl. FILTER (lang(?descriptionEl) = "el") }
        OPTIONAL { wd:${entityId} schema:description ?descriptionEn. FILTER (lang(?descriptionEn) = "en") }
        OPTIONAL { wd:${entityId} wdt:P21 ?gender. ?gender rdfs:label ?genderLabel. FILTER (lang(?genderLabel) = "el") }
        OPTIONAL { wd:${entityId} wdt:P569 ?dob. }
        OPTIONAL { wd:${entityId} wdt:P570 ?dod. }
        OPTIONAL { wd:${entityId} wdt:P19 ?pob. ?pob rdfs:label ?pobLabel. FILTER (lang(?pobLabel) = "el") }
        OPTIONAL { wd:${entityId} wdt:P69 ?edu. ?edu rdfs:label ?eduLabel. FILTER (lang(?eduLabel) = "en") }
        OPTIONAL {
          wd:${entityId} p:P69 ?educationStatement.
          ?educationStatement ps:P69 ?edu.
          OPTIONAL {
            ?educationStatement pq:P512 ?degree.
            ?degree rdfs:label ?degreeLabel.
            FILTER (lang(?degreeLabel) = "en")
          }
          OPTIONAL {
            ?educationStatement pq:P812 ?major.
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

    const response = await axios.get(process.env.WIKIDATA_URL, {
      headers: { Accept: "application/sparql-results+json" },
      params: { query: sparqlQuery, format: "json" },
    });

    const bindings = response.data.results.bindings;

    const educationData = bindings
      .filter((b) => b.eduLabel)
      .map((b) => ({
        institution: b.eduLabel?.value || null,
        degree: b.degreeLabel?.value || null,
        major: b.majorLabel?.value || null,
      }));

    const uniqueEducationData = [
      ...new Map(
        educationData.map((item) => [
          `${item.institution}-${item.degree}-${item.major}`,
          item,
        ])
      ).values(),
    ];

    const formattedEducation = uniqueEducationData.map((edu) => {
      const details = [];
      if (edu.degree) details.push(edu.degree);
      if (edu.major) details.push(edu.major);
      return details.length > 0
        ? `${edu.institution} (${details.join(" in ")})`
        : edu.institution;
    });

    if (bindings.length > 0) {
      const parties = bindings
        .filter((b) => b.partyLabel)
        .map((b) => ({
          name: b.partyLabel?.value || null,
          image: b.partyImage?.value || null,
        }));

      const result = bindings[0];
      return {
        image: result.image?.value || null,
        description: result.descriptionEl?.value || result.descriptionEn?.value || null,
        gender: result.genderLabel?.value || null,
        date_of_birth: result.dob?.value || null,
        date_of_death: result.dod?.value || null,
        place_of_birth: result.pobLabel?.value || null,
        educated_at: formattedEducation,
        website: result.website?.value || null,
        occupation: bindings.map((b) => b.occupationLabel?.value).filter(Boolean),
        languages: bindings.map((b) => b.languageLabel?.value).filter(Boolean),
        political_parties: parties,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching speaker data:", error.response?.data || error.message);
    return null;
  }
}
