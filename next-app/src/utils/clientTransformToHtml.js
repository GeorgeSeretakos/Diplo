export async function fetchAndTransformClientSide() {
  // Directly fetch XML from the public folder
  const xmlResponse = await fetch('/data/01031994.doc.xml');
  const xmlText = await xmlResponse.text();
  const parser = new DOMParser();
  const xmlDocument = parser.parseFromString(xmlText, 'application/xml');
  console.log("xmlDocument: ", xmlDocument);

  // Directly fetch XSLT from the public folder
  const xslResponse = await fetch('/debate.xsl');
  const xslText = await xslResponse.text();
  const xslDocument = parser.parseFromString(xslText, 'application/xml');

  // Apply the XSLT transformation
  const xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xslDocument);
  const resultDocument = xsltProcessor.transformToFragment(xmlDocument, document);

  // Serialize to HTML string
  const serializer = new XMLSerializer();
  return serializer.serializeToString(resultDocument);
}
