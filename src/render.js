import i18n from 'i18next';
import axios from 'axios';
import view from './view.js';
import ru from './locales/ru.js';
import parseRSS from './parseRSS.js';
import addPosts from './addPosts.js';

export default (state, input, schema) => {
  const watchedState = view(state);
  const addFeed = (id, parsedRSS, url) => {
    ru.translation.fiedsURLs.push({ id, url });
    const fiedDescription = parsedRSS.querySelector('description').textContent;
    const fiedTitle = parsedRSS.querySelector('title').textContent;
    ru.translation.fieds.push({
      id, title: fiedTitle, description: fiedDescription, link: url,
    });
  };

  const makeRequest = (url) => axios({
    method: 'get',
    url: `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`,
    responseType: 'json',
  })
    .catch(() => {
      watchedState.form.error = i18n.t('form.errors.networkProblem');
      watchedState.form.disabledButton = false;
      throw new Error(i18n.t('form.errors.networkProblem'));
    });

  watchedState.form.disabledButton = true;
  const inputURL = input.value.trim();
  console.log('inputURL = ', inputURL);
  schema.validate({ url: inputURL })
    .catch((error) => {
      watchedState.form.error = i18n.t(error.errors.join(''));
      watchedState.form.disabledButton = false;
      throw new Error(i18n.t(error.errors.join('')));
    })
    .then(() => ru.translation.fiedsURLs.filter((item) => item.url === inputURL))
    .then((existingURLs) => {
      if (existingURLs.length === 0) {
        watchedState.form.error = '';
      } else {
        watchedState.form.error = i18n.t('form.errors.existingURL');
        watchedState.form.disabledButton = false;
        throw new Error(i18n.t('form.errors.existingURL'));
      }
    })
    .then(() => makeRequest(inputURL))
    .then((response) => parseRSS(response.data.contents))
    .then((parsedRSS) => {
      if (parsedRSS.querySelectorAll('item').length === 0) {
        watchedState.form.error = i18n.t('form.errors.invalidRSS');
        watchedState.form.disabledButton = false;
        throw new Error(i18n.t('form.errors.invalidRSS'));
      }
      const id = watchedState.posts.commonId;
      watchedState.posts.actualId = id;
      addFeed(id, parsedRSS, inputURL);
      const items = parsedRSS.querySelectorAll('item');
      addPosts(id, items, 'posts', state);
      watchedState.posts.commonId += 1;
      if (ru.translation.fiedsURLs.length === 1) {
        watchedState.state = 'initialization';
      } else {
        watchedState.state = 'adding';
      }
      watchedState.state = 'finished';
      watchedState.form.disabledButton = false;
    })
    .catch(() => console.log);
};
