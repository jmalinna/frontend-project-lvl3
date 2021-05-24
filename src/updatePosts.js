import axios from 'axios';
import { differenceBy } from 'lodash';
import parseXML from './parseXML.js';
import addPostsToState from './addPosts.js';

const addNewRssPosts = (watcher) => {
  const watchedState = watcher;
  const makeRequest = (url) => axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(url)}`);

  watchedState.feedsURLs.forEach((url) => {
    watchedState.posts.newPostsId = url.id;
    makeRequest(url.url)
      .then((response) => parseXML(response.data.contents))
      .then((data) => {
        const posts = data.filter((item) => !item.role);
        return differenceBy(posts, watchedState.posts, 'url');
      })
      .then((newPosts) => {
        if (newPosts) {
          const id = watchedState.postsInfo.newPostsId;
          addPostsToState(id, newPosts, 'updatedPosts', watchedState);
          watchedState.state = 'updating';
        }
      });
  });
  setTimeout(() => addNewRssPosts(watchedState), 5000);
};
export default addNewRssPosts;
