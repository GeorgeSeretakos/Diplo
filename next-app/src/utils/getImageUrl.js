import {constants} from "../../constants/constants.js";

export function getImageUrl(image, type = "speaker") {
  const defaultImage =
    type === "party"
      ? "/images/parties/european_union_flag.jpg"
      : "images/politicians/default.avif";

  if (!image) return defaultImage;

  const large = image.formats?.large?.url;
  const original = image.url;

  if (large) return `${constants.STRAPI_URL}${large}`;
  if (original) return `${constants.STRAPI_URL}${original}`;

  return defaultImage;
}