const addPostsToState = (id, data, postsName, watchedState) => {
  data.feed.items.forEach((item) => {
    watchedState[postsName].push({
      id,
      postId: watchedState.postId,
      title: item.title,
      description: item.description,
      link: item.link,
    });
    watchedState.postId += 1;
  });
};
export default addPostsToState;
