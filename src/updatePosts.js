import axios from 'axios';
import { differenceBy } from 'lodash';
import parseRSS from './parseRSS.js';
import addPostsToState from './addPosts.js';
import addProxy from './addProxy.js';

const addNewRssPosts = (watchedState) => {
  watchedState.feedsURLs.forEach((url) => {
    watchedState.posts.newPostsId = url.id;
    const proxy = addProxy(url.url).toString();
    axios.get(proxy)
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
