const addPostsToState = (id, data, postsName, watchedState) => {
  data.items.reverse().forEach((item) => {
    watchedState[postsName].push({
      id,
      postId: watchedState.posts.length,
      title: item.title,
      description: item.description,
      link: item.link,
    });
  });
};
export default addPostsToState;
