export default function formatSpeakerFields(data) {
  const removeGreekTones = (input) =>
    input.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

  return {
    speaker_name: data.speaker_name ? removeGreekTones(data.speaker_name) : null,
    speaker_id: data.speaker_id?.toString() || null,
    link: data.link?.toString() || null,
    description: data.description?.toString() || null,
    gender: data.gender?.toString() || null,
    date_of_birth: data.date_of_birth || null,
    date_of_death: data.date_of_death || null,
    place_of_birth: data.place_of_birth?.toString() || null,
    educated_at: data.educated_at ? data.educated_at.join(", ") : null,
    website: data.website?.toString() || null,
    occupation: data.occupation
      ? [...new Set(data.occupation.map((item) => item.trim()))].join(", ")
      : null,
    languages: data.languages
      ? [...new Set(data.languages.map((item) => item.trim()))].join(", ")
      : null,
    political_parties: data.political_parties
      ? [...new Map(data.political_parties.map((p) => [p.name, p])).values()]
      : [],
    debates: data.debates?.toString() || null,
  };
}
