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

  const feedDescription = document.querySelector('description');
  const feedTitle = document.querySelector('title');

  outputData.feed.info = {
    title: feedTitle.textContent,
    description: feedDescription.textContent,
  };

  const items = document.querySelectorAll('item');
  items.forEach((item) => {
    const title = item.querySelector('title');
    const description = item.querySelector('description');
    const link = item.querySelector('link');

    outputData.feed.items.push({
      title: title.textContent,
      description: description.textContent,
      link: link.textContent,
    });
  });

  return outputData;
};
export default parseRSS;
