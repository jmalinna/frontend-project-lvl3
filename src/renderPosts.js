const renderPosts = (target, watchedState) => {
  const targetId = target.dataset.id;
  const targetType = target.getAttribute('type');

  if (targetId) {
    if (targetType === 'button') {
      watchedState.modalPostId = targetId;
    }
    watchedState.viewedPostsIds.push(targetId);
  }
};
export default renderPosts;
