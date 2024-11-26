import fs from 'fs';
import path from 'path';
import { parseStringPromise } from "xml2js";

export default async function handler(req, res) {
  try {
    const xmlPath = path.join(process.cwd(), 'data', '01031994.doc.xml');
    const xmlData = fs.readFileSync(xmlPath, 'utf-8');

    // Parse XML to JSON
    const jsonResult = await parseStringPromise(xmlData);

    // Send the JSON as a response
    res.status(200).json(jsonResult);
    console.log("JSON result: ", jsonResult);

  } catch (error) {
    console.error("Error parsing XML file: ", error);
    res.status(500).json({error: "Failed to parse XML"});
  }
}