export const getPositionHeldQuery = (entityId) => `
  SELECT ?positionLabel ?ofLabel ?startTime ?endTime WHERE {
    wd:${entityId} p:P39 ?statement.        # "Position held" property
    ?statement ps:P39 ?position.           # Main value for "position held"
    OPTIONAL { ?statement pq:P580 ?startTime. } # Start time qualifier
    OPTIONAL { ?statement pq:P582 ?endTime. }   # End time qualifier
    OPTIONAL { ?statement pq:P642 ?of. ?of rdfs:label ?ofLabel. FILTER (lang(?ofLabel) = "el") } # "of" qualifier
    ?position rdfs:label ?positionLabel.   # Label of the position
    FILTER (lang(?positionLabel) = "el")   # Ensure Greek language for labels
  }
`;
