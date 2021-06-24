import 'bootstrap';
import './style.scss';
import * as yup from 'yup';
import i18n from 'i18next';
import view from './view.js';
import ru from './locales/ru.js';
import renderForm from './renderForm.js';
import addNewRssPosts from './updatePosts.js';
import renderPosts from './renderPosts.js';

export default () => {
  const state = {
    form: {
      error: null,
      status: 'neutral',
    },
    loadingProcess: {
      status: 'inactive',
    },
    posts: [],
    feeds: [],
    updatedPosts: [],
    viewedPostsIds: [],
    modalPostId: null,
  };

  yup.setLocale({
    string: {
      url: () => ('form.errors.invalidURL'),
    },
  });

  const schema = yup.object().shape({
    url: yup.string().url(),
  });

  const form = document.querySelector('.rss-form');
  const inputURL = document.querySelector('input[aria-label="url"]');
  const posts = document.querySelector('.posts');

  const i18nInstance = i18n.createInstance();
  return i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  })
    .then(() => {
      const watchedState = view(state, i18nInstance, form, inputURL);

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        renderForm(watchedState, inputURL, schema, i18nInstance);
      });

      posts.addEventListener('click', (event) => {
        renderPosts(event.target, watchedState);
      });

      setTimeout(() => addNewRssPosts(watchedState), 5000);
    });
};
