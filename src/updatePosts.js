/* eslint-disable consistent-return */
import axios from 'axios';
import ru from './locales/ru.js';
import view from './view.js';
import parseRSS from './parseRSS.js';
import addPosts from './addPosts.js';

const addNewRssPosts = (state) => {
  const watchedState = view(state);

  ru.translation.fiedsURLs.forEach((url) => {
    watchedState.posts.newPostsId = url.id;
    axios({
      method: 'get',
      url: `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`,
      responseType: 'json',
    })
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
          addPosts(id, newItems, 'updatedPosts', state);
          watchedState.state = 'updating';
        }
      });
  });
  setTimeout(() => addNewRssPosts(state), 5000);
};
export default addNewRssPosts;
