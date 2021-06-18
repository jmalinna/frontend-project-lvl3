import axios from 'axios';
import { differenceBy } from 'lodash';
import parseRSS from './parseRSS.js';
import addPostsToState from './addPosts.js';
import addProxy from './addProxy.js';

const addNewRssPosts = (watchedState) => {
  const updatePosts = () => {
    watchedState.feeds.forEach((feed) => {
      const proxy = addProxy(feed.link);
      const { id } = feed;
      axios.get(proxy)
        .then((response) => parseRSS(response.data.contents))
        .then((data) => differenceBy(data.feed.items, watchedState.posts, 'link'))
        .then((newPosts) => {
          if (newPosts) {
            watchedState.updatedPosts = [];

            addPostsToState(id, { feed: { items: newPosts } }, 'updatedPosts', watchedState);

            watchedState.updatedPosts.forEach((post) => {
              watchedState.posts.push(post);
            });

            watchedState.loadingProcess.status = 'updating';
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
