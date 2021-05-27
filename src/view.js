import onChange from 'on-change';

export default (state, i18n, form, inputURL) => onChange(state, (path, value) => {
  const containerFeedback = document.querySelector('.feedback');
  const addButton = document.querySelector('button[type="submit"]');

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
      link.classList.add('font-weight-bold');
      link.textContent = post.title;

      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.setAttribute('data-id', post.postId);
      button.setAttribute('data-toggle', 'modal');
      button.setAttribute('data-target', '#modal');
      button.classList.add('btn', 'btn-primary', 'btn-sm');
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
      element.classList.replace('font-weight-bold', 'font-weight-normal');
    };

    const showModalWindow = (elementId) => {
      const activePost = state.posts.find((post) => post.postId === Number(elementId));

      const h5 = document.querySelector('.modal-title');
      h5.textContent = activePost.title;
      const modalBody = document.querySelector('.modal-body');
      modalBody.textContent = activePost.description;
      const aFooterElement = document.querySelector('.modal-footer').querySelector('a');
      aFooterElement.setAttribute('href', activePost.url);

      const container = document.querySelector('.fade');
      container.classList.add('show');
      container.setAttribute('aria-modal', 'true');
      container.setAttribute('style', 'display: block; padding-right: 15px;');
      container.removeAttribute('aria-hidden');

      markUrlAsViewed(link);
    };
    return type === 'button' ? showModalWindow(id) : markUrlAsViewed(link);
  };

  const renderState = () => {
    const feeds = document.querySelector('.feeds');
    const posts = document.querySelector('.posts');

    if (value === 'initialization') {
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

    const ulElPosts = posts.querySelector('ul');

    if (value === 'adding') {
      const ulElFeeds = feeds.querySelector('ul');
      const liElFeeds = createLiFeedElement(state);
      ulElFeeds.prepend(liElFeeds);

      const actualPosts2 = state.posts.filter((post) => post.id === state.postsInfo.actualId);
      createLiPostElements(actualPosts2, ulElPosts);
    }

    if (value === 'updating') {
      createLiPostElements(state.updatedPosts, ulElPosts);
      state.updatedPosts.forEach((post) => {
        state.posts.push(post);
      });
      const innerState = state;
      innerState.updatedPosts = [];
    }

    if (value === 'finished') {
      addButton.disabled = false;
      inputURL.removeAttribute('readonly');
      containerFeedback.classList.add('text-success');
      containerFeedback.textContent = i18n.t('form.notifications.rssSuccess');
      form.reset();
    }
  };

  const disableForm = () => {
    if (value) {
      addButton.disabled = true;
      inputURL.setAttribute('readonly', true);
    } else {
      addButton.disabled = false;
      inputURL.removeAttribute('readonly');
    }
  };

  const renderError = () => {
    if (!value) {
      inputURL.classList.remove('is-invalid');
      containerFeedback.classList.remove('text-danger');
    } else {
      inputURL.classList.add('is-invalid');
      containerFeedback.classList.add('text-danger');
    }
    addButton.disabled = false;
    inputURL.removeAttribute('readonly');
    containerFeedback.textContent = value;
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
