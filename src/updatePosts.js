import axios from 'axios';
import { differenceBy } from 'lodash';
import parseRSS from './parseRSS.js';
import addPostsToState from './addPosts.js';

const addNewRssPosts = (watcher) => {
  const watchedState = watcher;
  const makeRequest = (url) => axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(url)}`);

  watchedState.feedsURLs.forEach((url) => {
    watchedState.posts.newPostsId = url.id;
    makeRequest(url.url)
      .then((response) => parseRSS(response.data.contents))
      .then((data) => differenceBy(data.items, watchedState.posts, 'url'))
      .then((newPosts) => {
        if (newPosts) {
          const id = watchedState.postsInfo.newPostsId;
          addPostsToState(id, { items: newPosts }, 'updatedPosts', watchedState);
          watchedState.state = 'updating';
        }
      });
  });
  setTimeout(() => addNewRssPosts(watchedState), 5000);
};
export default addNewRssPosts;
