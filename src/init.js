/* eslint-disable consistent-return */
import 'bootstrap';
import './style.scss';
import * as yup from 'yup';
import i18n from 'i18next';
import axios from 'axios';
import view from './view.js';
import ru from './locales/ru.js';

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
    },
    state: 'inactive',
  };

  i18n.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  yup.setLocale({
    string: {
      url: () => ('form.errors.invalidURL'),
    },
  });

  const schema = yup.object().shape({
    url: yup.string().url(),
  });

  let i = 1;
  let postId = 1;
  const watchedState = view(state);

  const parseRSS = (xmlString) => {
    const parser = new DOMParser();
    return parser.parseFromString(xmlString, 'application/xml');
  };

  const addFeed = (id, parsedRSS, url) => {
    ru.translation.fiedsURLs.push({ id, url });
    const fiedDescription = parsedRSS.querySelector('description').textContent;
    const fiedTitle = parsedRSS.querySelector('title').textContent;
    ru.translation.fieds.push({
      id, title: fiedTitle, description: fiedDescription, link: url,
    });
  };

  const addPosts = (id, items, postsName) => {
    items.forEach((item) => {
      const title = item.querySelector('title').textContent;
      const description = item.querySelector('description').textContent;
      const link = item.querySelector('link').textContent;
      ru.translation[postsName].push({
        id, postId, title, description, link,
      });
      postId += 1;
    });
  };

  const form = document.querySelector('form');
  const input = document.querySelector('input');
  const posts = document.querySelector('.posts');

  const makeRequest = (url) => axios({
    method: 'get',
    url: `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`,
    responseType: 'json',
  })
    .catch(() => {
      watchedState.form.error = i18n.t('form.errors.networkProblem');
      throw new Error('Network response was not ok.');
    });

  const addNewRssPosts = () => {
    ru.translation.fiedsURLs.forEach((url) => {
      watchedState.posts.newPostsId = url.id;
      makeRequest(url.url)
        .then((response) => parseRSS(response.data))
        .then((parsedRSS) => parsedRSS.querySelectorAll('item'))
        .then((items) => {
        // eslint-disable-next-line array-callback-return
          Array.from(items).filter((item) => {
            const samePost = ru.translation.posts.filter((post) => post.link === item.querySelector('link').textContent);
            if (samePost.length === 0) return item;
          });
        })
        .then((newItems) => {
          if (newItems) {
            const id = watchedState.posts.newPostsId;
            addPosts(id, newItems, 'updatedPosts');
            watchedState.state = 'updating';
          }
        });
    });
    setTimeout(addNewRssPosts, 5000);
  };

  setTimeout(addNewRssPosts, 5000);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.disabledButton = true;
    const inputURL = input.value.trim();
    schema.validate({ url: inputURL })
      .catch((error) => {
        watchedState.form.error = i18n.t(error.errors.join(''));
        watchedState.form.disabledButton = false;
        throw new Error('invalidURL');
      })
      .then(() => ru.translation.fiedsURLs.filter((item) => item.url === inputURL))
      .then((existingURLs) => {
        if (existingURLs.length === 0) {
          watchedState.form.error = '';
        } else {
          watchedState.form.error = i18n.t('form.errors.existingURL');
          watchedState.form.disabledButton = false;
          throw new Error('URL already exists');
        }
      })
      .then(() => makeRequest(inputURL))
      .then((response) => parseRSS(response.data.contents))
      .then((parsedRSS) => {
        if (parsedRSS.querySelectorAll('item').length === 0) {
          watchedState.form.error = i18n.t('form.errors.invalidRSS');
          watchedState.form.disabledButton = false;
          throw new Error('Invalid RSS');
        }
        const id = i;
        watchedState.posts.actualId = i;

        addFeed(id, parsedRSS, inputURL);
        const items = parsedRSS.querySelectorAll('item');
        addPosts(id, items, 'posts');
        i += 1;

        if (ru.translation.fiedsURLs.length === 1) {
          watchedState.state = 'initialization';
        } else {
          watchedState.state = 'adding';
        }
        watchedState.state = 'finished';
        watchedState.form.disabledButton = false;
      });
  });

  posts.addEventListener('click', (e) => {
    watchedState.posts.target = e.target;
    watchedState.posts.viewedPostsIds.push(e.target.id);
  });
};
