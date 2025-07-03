export default function preprocessGreekKeyword(keyword) {
  const accentMap = {
    ά: "α", έ: "ε", ή: "η", ί: "ι", ό: "ο", ύ: "υ", ώ: "ω",
    ϊ: "ι", ϋ: "υ", ΐ: "ι", ΰ: "υ", Ά: "Α", Έ: "Ε", Ή: "Η",
    Ί: "Ι", Ό: "Ο", Ύ: "Υ", Ώ: "Ω"
  };

  const untonedKeyword = keyword
    .split("")
    .map((char) => accentMap[char] || char)
    .join("");

  return {
    tonedKeyword: keyword.trim(),
    untonedKeyword: untonedKeyword.trim(),
    isIdentical: keyword.trim() === untonedKeyword.trim(),
  };
}