const parseXML = (xmlString) => {
  const outputData = [];
  const parser = new DOMParser();
  const document = parser.parseFromString(xmlString, 'application/xml');

  const error = document.querySelector('parsererror');
  if (error) throw new Error('invalid rss');

  const feedDescription = document.querySelector('description').textContent;
  const feedTitle = document.querySelector('title').textContent;
  outputData.push({ title: feedTitle, description: feedDescription, role: 'feed' });

  const items = document.querySelectorAll('item');
  items.forEach((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const url = item.querySelector('link').textContent;

    outputData.push({ title, description, url });
  });

  return outputData;
};
export default parseXML;
