export default function calculateAge(birthDateStr, deathDateStr = null) {
  if (!birthDateStr) return null;

  const birth = new Date(birthDateStr);
  const end = deathDateStr ? new Date(deathDateStr) : new Date();

  if (isNaN(birth.getTime()) || isNaN(end.getTime())) return null;

  const age = end.getFullYear() - birth.getFullYear();

  return age;
}

