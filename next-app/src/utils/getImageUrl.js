import dotenv from "dotenv";
dotenv.config();

export function getImageUrl(image, type = "speaker") {
  const defaultImage =
    type === "party"
      ? "/icons/parliament_2.png"
      : "/images/politicians/default.jpg";

  // Case 1: No image provided
  if (!image) return defaultImage;

  // Case 2: image is a string (e.g., "/uploads/xyz.jpeg")
  if (typeof image === "string") {
    return `${process.env.NEXT_PUBLIC_STRAPI_URL}${image}`;
  }

  // Case 3: image is an object with formats (Strapi media object)
  const large = image.formats?.large?.url;
  const original = image.url;

  if (large) return `${process.env.NEXT_PUBLIC_STRAPI_URL}${large}`;
  if (original) return `${process.env.NEXT_PUBLIC_STRAPI_URL}${original}`;

  // Fallback
  return defaultImage;
}
