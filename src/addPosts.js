import view from './view.js';

const addPosts = (id, items, postsName, state) => {
  const watchedState = view(state);
  items.forEach((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    console.log('state[postsName] = ', state[postsName]);
    state[postsName].push({
      id,
      postId: watchedState.postsInfo.postId,
      title,
      description,
      link,
    });
    watchedState.postsInfo.postId += 1;
  });
};
export default addPosts;
