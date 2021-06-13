import axios from 'axios';
import parseRSS from './parseRSS.js';
import addPostsToState from './addPosts.js';
import addProxy from './addProxy.js';

export default (watchedState, input, schema, i18n) => {
  watchedState.form.status = 'sending';
  const url = input.value.trim();

  const addFeedToState = (id, data, link) => {
    watchedState.feeds.push({
      id, title: data.feed.info.title, description: data.feed.info.description, link,
    });
  };

  schema.validate({ url })
    .catch((error) => {
      watchedState.form.error = i18n.t(error.errors.join(''));
      throw new Error(i18n.t(error.errors.join('')));
    })
    .then(() => watchedState.feeds.filter((feed) => feed.link === url))
    .then((existingURLs) => {
      if (existingURLs.length === 0) {
        watchedState.form.error = '';
      } else {
        watchedState.form.error = i18n.t('form.errors.existingURL');
        throw new Error(i18n.t('form.errors.existingURL'));
      }
    })
    .then(() => addProxy(url))
    .then((proxy) => axios.get(proxy)
      .catch(() => {
        watchedState.form.error = i18n.t('form.errors.networkProblem');
      }))
    .then((response) => parseRSS(response.data.contents, watchedState))
    .then((data) => {
      const id = watchedState.postsInfo.commonId;
      watchedState.postsInfo.actualId = id;

      addFeedToState(id, data, url);
      addPostsToState(id, data, 'posts', watchedState);

      watchedState.postsInfo.commonId += 1;

      if (watchedState.feeds.length === 1) {
        watchedState.state = 'initialization';
      } else {
        watchedState.state = 'adding';
      }
      watchedState.state = 'finished';
    })
    .catch(() => {
      if (watchedState.form.isParsingError) watchedState.form.error = i18n.t('form.errors.invalidRSS');
      watchedState.form.status = 'finished';
    });
};
