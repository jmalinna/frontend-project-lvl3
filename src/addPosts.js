import view from './view.js';
import ru from './locales/ru.js';

const addPosts = (id, items, postsName, state) => {
  const watchedState = view(state);
  items.forEach((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    ru.translation[postsName].push({
      id,
      postId: watchedState.posts.postId,
      title,
      description,
      link,
    });
    // postId += 1;
    watchedState.posts.postId += 1;
  });
};
export default addPosts;
