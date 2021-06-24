import axios from 'axios';
import parseRSS from './parseRSS.js';
import addPostsToState from './addPosts.js';
import addProxy from './addProxy.js';

export default (watchedState, input, schema, i18n) => {
  watchedState.form.status = 'sending';
  const url = input.value.trim();
  const commonId = watchedState.feeds.length;

  const addFeedToState = (id, data, link) => {
    watchedState.feeds.push({
      id, title: data.title, description: data.description, link,
    });
  };

  schema.validate({ url })
    .catch((error) => {
      watchedState.form.error = error.errors.join('');
      throw new Error(i18n.t(error.errors.join('')));
    })
    .then(() => watchedState.feeds.find((feed) => feed.link === url))
    .then((existingURLs) => {
      if (!existingURLs) {
        watchedState.form.error = null;
      } else {
        watchedState.form.error = 'form.errors.existingURL';
        throw new Error(i18n.t('form.errors.existingURL'));
      }
    })
    .then(() => addProxy(url))
    .then((proxy) => axios.get(proxy))
    .then((response) => parseRSS(response.data.contents))
    .then((data) => {
      watchedState.loadingProcess.status = 'initialization';

      addFeedToState(commonId, data, url);
      addPostsToState(commonId, data, 'posts', watchedState);

      watchedState.loadingProcess.status = 'finished';
    })
    .catch((error) => {
      watchedState.form.status = 'finished';

      if (error.isAxiosError) {
        watchedState.form.error = 'form.errors.networkProblem';
      } else if (error.isRssParsingError) {
        watchedState.form.error = 'form.errors.invalidRSS';
      }
    });
};
