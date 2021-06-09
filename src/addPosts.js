const addPostsToState = (id, data, postsName, watchedState) => {
  data.feed.items.forEach((item) => {
    watchedState[postsName].push({
      id,
      postId: watchedState.postsInfo.postId,
      title: item.title,
      description: item.description,
      link: item.link,
    });
    watchedState.postsInfo.postId += 1;
  });
};
export default addPostsToState;
