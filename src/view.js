import onChange from 'on-change';

export default (state, i18n, form, inputURL) => onChange(state, (path, value) => {
  const feedbackContainer = document.querySelector('.feedback');
  const buttonAdd = document.querySelector('button[aria-label="add"]');

  const createLiFeedElement = (innerState) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const h3 = document.createElement('h3');
    const actualFeed = innerState.feeds.find(
      (feed) => feed.id === innerState.postsInfo.actualId,
    );

    h3.textContent = actualFeed.title;
    const p = document.createElement('p');
    p.textContent = actualFeed.description;
    li.prepend(h3, p);
    return li;
  };

  const createLiPostElements = (actualPosts, ulElement) => {
    actualPosts.reverse().forEach((post) => {
      const liElement = document.createElement('li');
      liElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');

      const link = document.createElement('a');
      link.setAttribute('href', post.url);
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
    });
    return ulElement;
  };

  const renderModalWindow = () => {
    const { type, id } = state.postsInfo.target;
    const link = document.querySelector(`a[data-id="${id}"]`);

    const markUrlAsViewed = (element) => {
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
      aFooterElement.setAttribute('href', activePost.url);

      const container = document.querySelector('.modal');
      container.classList.add('show');
      container.setAttribute('aria-modal', 'true');
      container.setAttribute('style', 'display: block');
      container.removeAttribute('aria-hidden');

      markUrlAsViewed(link);
    };
    return type === 'button' ? showModalWindow(id) : markUrlAsViewed(link);
  };

  const renderState = () => {
    const feeds = document.querySelector('.feeds');
    const posts = document.querySelector('.posts');
    const ulElementPosts = posts.querySelector('ul');

    switch (value) {
      case 'initialization': {
        const h2 = document.createElement('h2');
        h2.textContent = i18n.t('feedsHeader');

        const ul = document.createElement('ul');
        ul.classList.add('list-group', 'mb-5');

        const li = createLiFeedElement(state);
        ul.append(li);
        feeds.prepend(h2, ul);

        const h2Element = document.createElement('h2');
        h2Element.textContent = i18n.t('postsHeader');
        const ulElement = document.createElement('ul');
        ulElement.classList.add('list-group');
        const actualPosts = state.posts.filter((post) => post.id === state.postsInfo.actualId);
        createLiPostElements(actualPosts, ulElement);
        posts.prepend(h2Element, ulElement);
      }
        break;
      case 'adding': {
        const ulElementFeeds = feeds.querySelector('ul');
        const liElementFeeds = createLiFeedElement(state);
        ulElementFeeds.prepend(liElementFeeds);

        const actualPosts2 = state.posts.filter((post) => post.id === state.postsInfo.actualId);
        createLiPostElements(actualPosts2, ulElementPosts);
      }
        break;
      case 'updating': {
        createLiPostElements(state.updatedPosts, ulElementPosts);
        state.updatedPosts.forEach((post) => {
          state.posts.push(post);
        });
        const innerState = state;
        innerState.updatedPosts = [];
      }
        break;
      case 'finished':
        buttonAdd.disabled = false;
        inputURL.removeAttribute('readonly');
        feedbackContainer.classList.add('text-success');
        feedbackContainer.textContent = i18n.t('form.notifications.rssSuccess');
        form.reset();
        break;
      default:
    }
  };

  const disableForm = () => {
    if (value) {
      buttonAdd.disabled = true;
      inputURL.setAttribute('readonly', true);
    } else {
      buttonAdd.disabled = false;
      inputURL.removeAttribute('readonly');
    }
  };

  const renderError = () => {
    if (!value) {
      inputURL.classList.remove('is-invalid');
      feedbackContainer.classList.remove('text-danger');
    } else {
      inputURL.classList.add('is-invalid');
      feedbackContainer.classList.add('text-danger');
    }
    buttonAdd.disabled = false;
    inputURL.removeAttribute('readonly');
    feedbackContainer.textContent = value;
  };

  switch (path) {
    case 'form.disabledButton':
      disableForm();
      break;
    case 'form.error':
      renderError();
      break;
    case 'postsInfo.target.id':
      renderModalWindow();
      break;
    case 'state':
      renderState();
      break;
    default:
  }
});
