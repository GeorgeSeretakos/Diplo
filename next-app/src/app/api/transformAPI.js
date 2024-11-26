import path from "path";
import {transform} from "../../../scripts/transform.js";

export default async function transformAPI(req, res) {
  const {query} = req;
  const xmlPath = path.join(process.cwd(), 'public', 'data', 'xml_files', '01031994.doc.xml'); // Path to XML file
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