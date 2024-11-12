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

export async function handler(req, res) {
  const {query} = req;
  const xmlPath = path.join(process.cwd(), 'public', 'data', '01031994.doc.xml'); // Path to XML file
  const xsltPath = path.join(process.cwd(), 'public', 'debate.xsl'); // Path to XSLT file

  try {
    const { jsonData, htmlData } = await transform(xmlPath, xsltPath);

    if (query.format === 'html') {
      // Return HTML format
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(htmlData);
    } else if (query.format === 'json') {
      // Return XML format
      res.status(200).json({
        message: "Data transformed to JSON and sent to Strapi successfully.",
        jsonData,
        htmlData
      });
    } else {
      res.status(400).json({ error: 'Invalid format. Use format=html or format=json.' });
    }

  } catch (error) {
    console.error('Transformation error:', error);
    res.status(500).json({ error: 'Failed to transform XML' });
  }
}
