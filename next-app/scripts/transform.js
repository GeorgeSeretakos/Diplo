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


export async function transform(xmlPath, xsltPath) {
  // Perform XML to JSON transformation
  const xmlData = fs.readFileSync(xmlPath, 'utf-8');
  const jsonData = await parseStringPromise(xmlData, {
    explicitArray: true,
    preserveChildrenOrder: true,
  });

  // Perform XML to HTML transformation
  const config = {
    sourcePath: xmlPath, // Path to XML file
    xsltPath, // Path to XSLT file
    result: String, // Return result as a string
  };

  const htmlData = await new Promise((resolve, reject) => {
    xslt4node.transform(config, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });

  console.log()

  return { jsonData, htmlData };
}

