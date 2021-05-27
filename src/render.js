import axios from 'axios';
import parseRSS from './parseRSS.js';
import addPostsToState from './addPosts.js';

export default (watcher, input, schema, i18n) => {
  const watchedState = watcher;
  const url = input.value.trim();
  watchedState.form.disabledButton = true;

  const addFeedToState = (id, data, link) => {
    watchedState.feeds.push({
      id, title: data.feed.title, description: data.feed.description, url: link,
    });
  };

  const makeRequest = (URL) => axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(URL)}`)
    .catch(() => {
      watchedState.form.error = i18n.t('form.errors.networkProblem');
      throw new Error(i18n.t('form.errors.networkProblem'));
    });

  schema.validate({ url })
    .catch((error) => {
      watchedState.form.error = i18n.t(error.errors.join(''));
      throw new Error(i18n.t(error.errors.join('')));
    })
    .then(() => watchedState.feedsURLs.filter((item) => item.url === url))
    .then((existingURLs) => {
      if (existingURLs.length === 0) {
        watchedState.form.error = '';
      } else {
        watchedState.form.error = i18n.t('form.errors.existingURL');
        throw new Error(i18n.t('form.errors.existingURL'));
      }
    })
    .then(() => makeRequest(url))
    .then((response) => parseRSS(response.data.contents))
    .then((data) => {
      const id = watchedState.postsInfo.commonId;
      watchedState.postsInfo.actualId = id;
      watchedState.feedsURLs.push({ id, url });

      addFeedToState(id, data, url);
      addPostsToState(id, data, 'posts', watchedState);

      watchedState.postsInfo.commonId += 1;

      if (watchedState.feedsURLs.length === 1) {
        watchedState.state = 'initialization';
      } else {
        watchedState.state = 'adding';
      }
      watchedState.state = 'finished';
    })
    .catch((error) => {
      // console.log(error);
      if (error.message === 'invalid rss') {
        watchedState.form.error = i18n.t('form.errors.invalidRSS');
      }
      watchedState.form.disabledButton = false;
    });
};
