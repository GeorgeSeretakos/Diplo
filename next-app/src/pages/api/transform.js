/**
 * Any function in a Next.js pages/api route or under app/api is automatically run on the server,
 * so it doesn’t depend on the browser. It’s backend code by nature, even if a client triggers it.
 *
 * When you make a fetch call to an API endpoint in Next.js, it’s technically a client-to-server request,
 * even if it’s initiated by client-side code. The server executes any processing, then sends back a response.
 */

import path from 'path';
import xslt4node from 'xslt4node';
import { parseStringPromise } from "xml2js";
import fs from "fs";
import axios from 'axios';
import sendDataToStrapi from "./sendDataToStrapi";

export default async function handler(req, res) {
  const {query} = req;

  try {
    const xmlPath = path.join(process.cwd(), 'public', 'data', '01091994.doc.xml'); // Path to XML file

    // Handle XMl to HTML transformation
    if (query.format === 'html') {
      const xsltPath = path.join(process.cwd(), 'public', 'debate.xsl'); // Path to XSLT file

      // Configure XSLT transformation options
      const config = {
        sourcePath: xmlPath, // Path to XML file
        xsltPath: xsltPath, // Path to XSLT file
        result: String, // Return result as a string
      };

      // Perform transformation
      xslt4node.transform(config, (error, result) => {
        if (error) {
          console.error('Transformation error:', error);
          res.status(500).json({ error: 'Failed to transform XML' });
        } else {
          // Set content type to HTML and return result
          res.setHeader('Content-Type', 'text/html');
          res.status(200).send(result);
        }
      });
    }

    // Handle XML to JSON transformation
    else if (query.format === 'json') {
      let xmlData = fs.readFileSync(xmlPath, 'utf-8');

      const jsonData = await parseStringPromise(xmlData, {
        explicitArray: true,
        preserveChildrenOrder: true,
      });

      // Send the data to Strapi
      await sendDataToStrapi(jsonData);
      res.status(200).json({ message: "Data transformed to JSON and sent to Strapi successfully." });


    }
  } catch (error) {
    console.error('Transformation error:', error);
    res.status(500).json({ error: 'Failed to transform XML' });
  }
}


// Fetch data from Strapi API
async function fetchData (STRAPI_URL, API_TOKEN) {
  const response = await axios.get(
    `${STRAPI_URL}/api/debates`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      }
    }
  );
  console.log("Fetched Data: ", response.data);
}
