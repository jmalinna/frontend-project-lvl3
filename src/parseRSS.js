const parseRSS = (xmlString) => {
  const outputData = { items: [] };
  const parser = new DOMParser();
  const document = parser.parseFromString(xmlString, 'application/xml');

  const error = document.querySelector('parsererror');
  if (error) {
    error.isRssParsingError = true;
    throw error;
  }

  outputData.title = document.querySelector('channel > title').textContent;
  outputData.description = document.querySelector('channel > description').textContent;

  const items = document.querySelectorAll('item');
  items.forEach((item) => {
    const title = item.querySelector('title');
    const link = item.querySelector('link');
    const description = item.querySelector('description');

    outputData.items.push({
      title: title.textContent,
      link: link.textContent,
      description: description.textContent,
    });
  });

  return outputData;
};
export default parseRSS;
