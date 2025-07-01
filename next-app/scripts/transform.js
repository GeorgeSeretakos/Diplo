import { parseStringPromise } from "xml2js";
import fs from "fs";


export async function transform(xmlPath) {
  // Perform XML to JSON transformation
  const xmlData = fs.readFileSync(xmlPath, 'utf-8');
  const jsonData = await parseStringPromise(xmlData, {
    explicitArray: true,
    preserveChildrenOrder: true,
  });

  return jsonData;
}