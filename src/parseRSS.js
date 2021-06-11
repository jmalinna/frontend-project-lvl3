const parseRSS = (xmlString, watchedState) => {
  const outputData = { feed: { info: {}, items: [] } };
  const parser = new DOMParser();
  const document = parser.parseFromString(xmlString, 'application/xml');

  const error = document.querySelector('parsererror');

  if (error && watchedState) {
    watchedState.form.isParsingError = true;
    throw new Error('invalid rss');
  } else if (watchedState) {
    watchedState.form.isParsingError = false;
  }

  const feedDescription = document.querySelector('description').textContent;
  const feedTitle = document.querySelector('title').textContent;
  outputData.feed.info = { title: feedTitle, description: feedDescription };

  const items = document.querySelectorAll('item');
  items.forEach((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;

    outputData.feed.items.push({ title, description, link });
  });

  return outputData;
};
export default parseRSS;
