// utils/wikidata/queries.js

// SPARQL query for personal information
export const getPersonalInfoQuery = (entityId) => `
  SELECT ?fullName ?dateOfBirth ?placeOfBirthLabel ?genderLabel ?nationalityLabel ?image (GROUP_CONCAT(?languagesLabel; separator=", ") AS ?languages) WHERE {
    wd:${entityId} rdfs:label ?fullName;
                 wdt:P569 ?dateOfBirth;
                 wdt:P19 ?placeOfBirth;
                 wdt:P21 ?gender;
                 wdt:P27 ?nationality;
                 wdt:P18 ?image.
    OPTIONAL {
      wd:${entityId} wdt:P1412 ?languages.
      ?languages rdfs:label ?languagesLabel.
      FILTER(LANG(?languagesLabel) = "en")
    }
    FILTER (LANG(?fullName) = "en").
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
  }
  GROUP BY ?fullName ?dateOfBirth ?placeOfBirthLabel ?genderLabel ?nationalityLabel ?image
`;




// SPARQL query for political positions
export const getPoliticalInfoQuery = (entityId) => `
SELECT DISTINCT ?currentPositionLabel ?currentStartDate ?partyLabel ?partyLogo ?previousPositionLabel ?previousStartDate ?previousEndDate WHERE {
  # Current position
  OPTIONAL {
    wd:${entityId} p:P39 ?currentStatement.
    ?currentStatement ps:P39 ?currentPosition;
                       pq:P580 ?currentStartDate.
    FILTER NOT EXISTS { ?currentStatement pq:P582 ?endDate } # Filter positions without an end date (current)
  }

  # Party information
  OPTIONAL {
    wd:${entityId} wdt:P102 ?party.
    OPTIONAL { ?party wdt:P154 ?partyLogo. } # Party logo if available
  }

  # Previous positions
  OPTIONAL {
    wd:${entityId} p:P39 ?previousStatement.
    ?previousStatement ps:P39 ?previousPosition;
                       pq:P580 ?previousStartDate;
                       pq:P582 ?previousEndDate.
  }

  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
`;

export function getEducationQuery(entityId) {
  return `
    SELECT DISTINCT ?eduLabel ?degreeLabel ?majorLabel WHERE {
      OPTIONAL {
        wd:${entityId} wdt:P69 ?edu.  # "educated at" institution
        ?edu rdfs:label ?eduLabel.
        FILTER (lang(?eduLabel) = "el")
      }
      OPTIONAL {
        wd:${entityId} p:P69 ?educationStatement.  # Property statement for "educated at"
        ?educationStatement ps:P69 ?edu.          # The institution
        OPTIONAL {
          ?educationStatement pq:P512 ?degree.    # Academic degree
          ?degree rdfs:label ?degreeLabel.
          FILTER (lang(?degreeLabel) = "el")
        }
        OPTIONAL {
          ?educationStatement pq:P812 ?major.     # Academic major
          ?major rdfs:label ?majorLabel.
          FILTER (lang(?majorLabel) = "el")
        }
      }
    }
  `;
}

