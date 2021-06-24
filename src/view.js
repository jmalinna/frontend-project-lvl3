import onChange from 'on-change';

export default (state, i18n, form, inputURL) => {
  const feedbackContainer = document.querySelector('.feedback');
  const buttonAdd = document.querySelector('button[aria-label="add"]');

  const createLiFeedElement = (innerState) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');

    const h3 = document.createElement('h3');
    const actualFeed = innerState.feeds[innerState.feeds.length - 1];
    h3.textContent = actualFeed.title;

    const p = document.createElement('p');
    p.textContent = actualFeed.description;
    li.prepend(h3, p);
    return li;
  };

  const createLiPostElement = (post, ulElement) => {
    const liElement = document.createElement('li');
    liElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');

    const link = document.createElement('a');
    link.setAttribute('href', post.link);
    link.setAttribute('data-id', post.postId);
    link.setAttribute('rel', 'noopener noreferrer');
    link.setAttribute('target', '_blank');
    link.classList.add('fw-bold', 'text-decoration-none', 'my-auto');
    link.textContent = post.title;

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('data-id', post.postId);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.textContent = i18n.t('postsButtonText');

    liElement.append(link, button);
    ulElement.prepend(liElement);

    return ulElement;
  };

  const renderLoadingStatus = (value) => {
    if (value === 'initialization' && state.feeds.length === 0) {
      const feeds = document.querySelector('.feeds');
      const h2 = document.createElement('h2');
      h2.textContent = i18n.t('feedsHeader');
      const ul = document.createElement('ul');
      ul.classList.add('list-group', 'mb-5');

      feeds.prepend(h2, ul);

      const posts = document.querySelector('.posts');
      const h2Element = document.createElement('h2');
      h2Element.textContent = i18n.t('postsHeader');
      const ulElement = document.createElement('ul');
      ulElement.classList.add('list-group');

      posts.prepend(h2Element, ulElement);
    }

    if (value === 'finished') {
      buttonAdd.disabled = false;
      inputURL.removeAttribute('readonly');
      feedbackContainer.classList.add('text-success');
      feedbackContainer.textContent = i18n.t('form.notifications.rssSuccess');
      form.reset();
    }
  };

  const renderFormStatus = (value) => {
    if (value === 'sending') {
      buttonAdd.disabled = true;
      inputURL.setAttribute('readonly', true);
    } else {
      buttonAdd.disabled = false;
      inputURL.removeAttribute('readonly');
    }
  };

  const renderError = (value) => {
    if (!value) {
      inputURL.classList.remove('is-invalid');
      feedbackContainer.classList.remove('text-danger');
    } else {
      inputURL.classList.add('is-invalid');
      feedbackContainer.classList.add('text-danger');
    }
    buttonAdd.disabled = false;
    inputURL.removeAttribute('readonly');
    feedbackContainer.textContent = i18n.t(value);
  };

  const renderFeeds = () => {
    const feeds = document.querySelector('.feeds');
    const ulElementFeeds = feeds.querySelector('ul');

    const liElementFeeds = createLiFeedElement(state);
    ulElementFeeds.prepend(liElementFeeds);
  };

  const renderPosts = () => {
    const posts = document.querySelector('.posts');
    const ulElementPosts = posts.querySelector('ul');
    const post = state.posts[state.posts.length - 1];

    createLiPostElement(post, ulElementPosts);
  };

  const renderPostsUpdating = () => {
    const posts = document.querySelector('.posts');
    const ulElementPosts = posts.querySelector('ul');
    const newPost = state.updatedPosts[state.updatedPosts.length - 1];

    if (newPost) {
      createLiPostElement(newPost, ulElementPosts);
    }
  };

  const renderViewedPosts = () => {
    const targetId = state.viewedPostsIds[state.viewedPostsIds.length - 1];
    const link = document.querySelector(`a[data-id="${targetId}"]`);

    if (link) {
      link.classList.replace('fw-bold', 'fw-normal');
    }
  };

  const renderModal = (innerState) => {
    const targetId = innerState.modalPostId;

    const activePost = innerState.posts.find((post) => post.postId === Number(targetId));
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
  };

  return onChange(state, (path, value) => {
    switch (path) {
      case 'feeds':
        renderFeeds();
        break;
      case 'posts':
        renderPosts();
        break;
      case 'updatedPosts':
        renderPostsUpdating();
        break;
      case 'modalPostId':
        renderModal(state);
        break;
      case 'form.status':
        renderFormStatus(value);
        break;
      case 'form.error':
        renderError(value);
        break;
      case 'loadingProcess.status':
        renderLoadingStatus(value);
        break;
      case 'viewedPostsIds':
        renderViewedPosts();
        break;
      default:
    }
  });
};
