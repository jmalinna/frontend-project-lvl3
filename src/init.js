import 'bootstrap';
import './style.scss';
import * as yup from 'yup';
import i18n from 'i18next';
import view from './view.js';
import ru from './locales/ru.js';
import render from './render.js';
// import addNewRssPosts from './updatePosts.js';

export default () => {
  const state = {
    form: {
      error: '',
      disabledButton: false,
    },
    posts: {
      actualId: '',
      newPostsId: '',
      target: '',
      viewedPostsIds: [],
      commonId: 1,
      postId: 1,
    },
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

  const form = document.querySelector('form');
  const input = document.querySelector('input');
  const posts = document.querySelector('.posts');

  i18n.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  })
    .then(() => {
      const watchedState = view(state);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        render(state, input, schema);
      });

      posts.addEventListener('click', (e) => {
        watchedState.posts.target = e.target;
        watchedState.posts.viewedPostsIds.push(e.target.id);
      });
    });

  // setTimeout(() => addNewRssPosts(state), 5000);
};
