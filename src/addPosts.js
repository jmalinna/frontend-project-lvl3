const addPostsToState = (id, data, postsName, watchedState) => {
  data.items.forEach((item) => {
    watchedState[postsName].push({
      id,
      postId: watchedState.postsInfo.postId,
      title: item.title,
      description: item.description,
      url: item.url,
    });
    watchedState.postsInfo.postId += 1;
  });
};
export default addPostsToState;
