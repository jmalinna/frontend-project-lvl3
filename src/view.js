import onChange from 'on-change';

export default (state, i18n) => onChange(state, (path, value) => {
  const form = document.querySelector('.rss-form');
  const inputURL = document.querySelector('input[aria-label="url"]');
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
      liElement.innerHTML = `<a href="${post.url}" class="font-weight-bold" data-id="${post.postId}" target="_blank"rel="noopenernoreferrer"></a><button type="button" class="btn btn-primary btn-sm" data-id="${post.postId}" data-toggle="modal" data-target="#modal">Просмотр</button>`;
      const aElement = liElement.querySelector('a');
      aElement.textContent = post.title;
      ulElement.prepend(liElement);
    });
    return ulElement;
  };

  const render = () => {
    const { type, id } = state.postsInfo.target;
    const aElement = document.querySelector(`a[data-id="${id}"]`);

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

      markUrlAsViewed(aElement);
    };
    return type === 'button' ? showModalWindow(id) : markUrlAsViewed(aElement);
  };

  if (path === 'form.disabledButton') {
    if (value === true) {
      addButton.disabled = true;
      inputURL.setAttribute('readonly', true);
    } else {
      addButton.disabled = false;
      inputURL.removeAttribute('readonly');
    }
  }

  if (path === 'form.error') {
    if (value === '') {
      inputURL.classList.remove('is-invalid');
      containerFeedback.classList.remove('text-danger');
    } else {
      inputURL.classList.add('is-invalid');
      containerFeedback.classList.add('text-danger');
    }
    addButton.disabled = false;
    inputURL.removeAttribute('readonly');
    containerFeedback.textContent = value;
  }

  if (path === 'postsInfo.target.id') {
    render();
  }

  if (path === 'state') {
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
  }
});
