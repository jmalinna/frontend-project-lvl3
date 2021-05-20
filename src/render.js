import axios from 'axios';
import view from './view.js';
import parseRSS from './parseRSS.js';
import addPosts from './addPosts.js';

export default (state, input, schema, i18n) => {
  const watchedState = view(state, i18n);

  const addFeed = (id, parsedRSS, url) => {
    watchedState.fiedsURLs.push({ id, url });
    const fiedDescription = parsedRSS.querySelector('description').textContent;
    const fiedTitle = parsedRSS.querySelector('title').textContent;
    watchedState.fieds.push({
      id, title: fiedTitle, description: fiedDescription, link: url,
    });
  };

  const makeRequest = (url) => axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .catch(() => {
      watchedState.form.error = i18n.t('form.errors.networkProblem');
      throw new Error(i18n.t('form.errors.networkProblem'));
    });

  watchedState.form.disabledButton = true;
  const inputURL = input.value.trim();

  console.log('inputURL =', inputURL);
  console.log('state=', state);

  schema.validate({ url: inputURL })
    .catch((error) => {
      watchedState.form.error = i18n.t(error.errors.join(''));
      throw new Error(i18n.t(error.errors.join('')));
    })
    .then(() => watchedState.fiedsURLs.filter((item) => item.url === inputURL))
    .then((existingURLs) => {
      if (existingURLs.length === 0) {
        watchedState.form.error = '';
      } else {
        watchedState.form.error = i18n.t('form.errors.existingURL');
        throw new Error(i18n.t('form.errors.existingURL'));
      }
    })
    .then(() => makeRequest(inputURL))
    .then((response) => parseRSS(response.data.contents))
    .then((parsedRSS) => {
      if (parsedRSS.querySelectorAll('item').length === 0) {
        watchedState.form.error = i18n.t('form.errors.invalidRSS');
        throw new Error(i18n.t('form.errors.invalidRSS'));
      }
      const id = watchedState.postsInfo.commonId;
      watchedState.postsInfo.actualId = id;
      console.log('id = ', id);
      addFeed(id, parsedRSS, inputURL);
      const items = parsedRSS.querySelectorAll('item');
      console.log('items = ', items);
      addPosts(id, items, 'posts', state);
      watchedState.postsInfo.commonId += 1;

      if (watchedState.fiedsURLs.length === 1) {
        watchedState.state = 'initialization';
      } else {
        watchedState.state = 'adding';
      }
      watchedState.state = 'finished';
    })
    .catch((error) => {
      console.log(error);
      watchedState.form.disabledButton = false;
    });
};
