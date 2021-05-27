import 'bootstrap';
import './style.scss';
import * as yup from 'yup';
import i18n from 'i18next';
import view from './view.js';
import ru from './locales/ru.js';
import render from './render.js';
import addNewRssPosts from './updatePosts.js';

export default () => {
  const state = {
    form: {
      error: '',
      disabledButton: false,
    },
    postsInfo: {
      actualId: '',
      newPostsId: '',
      target: {},
      viewedPostsIds: [],
      commonId: 1,
      postId: 1,
    },
    posts: [],
    updatedPosts: [],
    feeds: [],
    feedsURLs: [],
    state: 'inactive',
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
  i18nInstance.init({
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
        render(watchedState, inputURL, schema, i18nInstance);
      });

      posts.addEventListener('click', (event) => {
        watchedState.postsInfo.target.type = event.target.getAttribute('type');
        watchedState.postsInfo.target.id = event.target.dataset.id;
        watchedState.postsInfo.viewedPostsIds.push(event.target.id);
      });

      setTimeout(() => addNewRssPosts(watchedState), 5000);
    });
};
