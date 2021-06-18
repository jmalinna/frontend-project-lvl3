import 'bootstrap';
import './style.scss';
import * as yup from 'yup';
import i18n from 'i18next';
import view from './view.js';
import ru from './locales/ru.js';
import render from './render.js';
import addNewRssPosts from './updatePosts.js';
import renderModalWindow from './renderModal.js';

export default () => {
  const state = {
    form: {
      error: '',
      isParsingError: false,
      status: 'neutral',
    },
    posts: [],
    feeds: [],
    updatedPosts: [],
    state: 'inactive',
    viewedPostsIds: [],
    postId: 1,
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
  const commonId = { id: 1 };

  const i18nInstance = i18n.createInstance();
  return i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  })
    .then(() => {
      const watchedState = view(state, i18nInstance, form, inputURL, commonId);

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        render(watchedState, inputURL, schema, i18nInstance, commonId);
        commonId.id += 1;
      });

      posts.addEventListener('click', (event) => {
        const targetType = event.target.getAttribute('type');
        const targetId = event.target.dataset.id;

        renderModalWindow(targetType, targetId, state);

        watchedState.viewedPostsIds.push(targetId);
      });

      setTimeout(() => addNewRssPosts(watchedState), 5000);
    });
};
