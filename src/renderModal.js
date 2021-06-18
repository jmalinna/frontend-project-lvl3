const renderModalWindow = (targetType, targetId, state) => {
//   const { type, id } = state.postsInfo.target;
  const link = document.querySelector(`a[data-id="${targetId}"]`);
  const markLinkAsViewed = (element) => {
    if (element) {
      element.classList.replace('fw-bold', 'fw-normal');
    }
  };
  const showModalWindow = (elementId) => {
    const activePost = state.posts.find((post) => post.postId === Number(elementId));
    const h5 = document.querySelector('.modal-title');
    h5.textContent = activePost.title;
    const modalBody = document.querySelector('.modal-body');
    modalBody.textContent = activePost.description;
    const aFooterElement = document.querySelector('.modal-footer').querySelector('a');
    aFooterElement.setAttribute('href', activePost.link);
    const container = document.querySelector('.modal');
    container.classList.add('show');
    container.setAttribute('aria-modal', 'true');
    container.setAttribute('style', 'display: block');
    container.removeAttribute('aria-hidden');
    markLinkAsViewed(link);
  };
  return targetType === 'button' ? showModalWindow(targetId) : markLinkAsViewed(link);
};
export default renderModalWindow;
