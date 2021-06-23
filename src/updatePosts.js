import axios from 'axios';
import { differenceBy } from 'lodash';
import parseRSS from './parseRSS.js';
import addPostsToState from './addPosts.js';
import addProxy from './addProxy.js';

const addNewRssPosts = (watchedState) => {
  const updatePosts = (feed) => {
    const proxy = addProxy(feed.link);
    const { id } = feed;

    axios.get(proxy)
      .then((response) => parseRSS(response.data.contents))
      .then((data) => differenceBy(data.items, watchedState.posts, 'link'))
      .then((newPosts) => {
        if (newPosts) {
          watchedState.updatedPosts = [];

          addPostsToState(id, { items: newPosts }, 'updatedPosts', watchedState);

          watchedState.updatedPosts.forEach((post) => {
            watchedState.posts.push(post);
          });
        }
      });
  };

  const promises = watchedState.feeds.map((feed) => updatePosts(feed));

  const promise = Promise.all(promises);
  promise.finally(() => setTimeout(() => addNewRssPosts(watchedState), 5000));
};
export default addNewRssPosts;
