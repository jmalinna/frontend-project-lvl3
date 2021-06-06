import axios from 'axios';
import { differenceBy } from 'lodash';
import parseRSS from './parseRSS.js';
import addPostsToState from './addPosts.js';
import addProxy from './addProxy.js';

const addNewRssPosts = (watchedState) => {
  const updatePosts = () => {
    watchedState.feeds.forEach((feed) => {
      watchedState.posts.newPostsId = feed.id;
      const proxy = addProxy(feed.url);
      axios.get(proxy)
        .then((response) => parseRSS(response.data.contents))
        .then((data) => differenceBy(data.items, watchedState.posts, 'url'))
        .then((newPosts) => {
          if (newPosts) {
            const id = watchedState.postsInfo.newPostsId;
            addPostsToState(id, { items: newPosts }, 'updatedPosts', watchedState);
            watchedState.state = 'updating';
          }
        })
        .catch(() => setTimeout(() => addNewRssPosts(watchedState), 5000));
    });
    return Promise.resolve();
  };

  const promise = updatePosts();
  promise.then(() => setTimeout(() => addNewRssPosts(watchedState), 5000));
};
export default addNewRssPosts;
