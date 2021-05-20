import onChange from 'on-change';

export default (state, i18n) => onChange(state, (path, value) => {
  const form = document.querySelector('form');
  const input = document.querySelector('input');
  const div = document.querySelector('.feedback');
  const button = document.querySelector('button[type="submit"]');

  const createLiFeedElement = (innerState) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const h3 = document.createElement('h3');
    const actualFeed = innerState.feeds.filter(
      (feed) => feed.id === innerState.postsInfo.actualId,
    );
    const [feed] = actualFeed;
    h3.textContent = feed.title;
    const p = document.createElement('p');
    p.textContent = feed.description;
    li.prepend(h3, p);
    return li;
  };

  const createLiPostElements = (actualPosts, ulElement) => {
    actualPosts.reverse().forEach((post) => {
      const liElement = document.createElement('li');
      liElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
      liElement.innerHTML = `<a href="${post.link}" class="font-weight-bold" data-id="${post.postId}" target="_blank"rel="noopenernoreferrer"></a><button type="button" class="btn btn-primary btn-sm" data-id="${post.postId}" data-toggle="modal" data-target="#modal">Просмотр</button>`;
      const aElement = liElement.querySelector('a');
      aElement.textContent = post.title;
      ulElement.prepend(liElement);
    });
    return ulElement;
  };

  const render = (eventTarget) => {
    const type = eventTarget.getAttribute('type');

    const markLinkAsViewed = (target) => {
      target.classList.replace('font-weight-bold', 'font-weight-normal');
    };

    const showModalWindow = (target) => {
      const { id } = target.dataset;
      const activePost = state.posts.filter((post) => post.postId === Number(id));
      const [post] = activePost;

      const h5 = document.querySelector('.modal-title');
      h5.textContent = post.title;
      const modalBody = document.querySelector('.modal-body');
      modalBody.textContent = post.description;
      const aFooterElement = document.querySelector('.modal-footer').querySelector('a');
      aFooterElement.setAttribute('href', post.link);

      const container = document.querySelector('.fade');
      container.classList.add('show');
      container.setAttribute('aria-modal', 'true');
      container.setAttribute('style', 'display: block; padding-right: 15px;');
      container.removeAttribute('aria-hidden');
      const aPostElement = target.previousElementSibling;
      markLinkAsViewed(aPostElement);
    };
    return type === 'button' ? showModalWindow(eventTarget) : markLinkAsViewed(eventTarget);
  };

  if (path === 'form.disabledButton') {
    if (value === true) {
      button.disabled = true;
      input.setAttribute('readonly', true);
    } else {
      button.disabled = false;
      input.removeAttribute('readonly');
    }
  }

  if (path === 'form.error') {
    if (value === '') {
      input.classList.remove('is-invalid');
      div.classList.remove('text-danger');
    } else {
      input.classList.add('is-invalid');
      div.classList.add('text-danger');
    }
    button.disabled = false;
    input.removeAttribute('readonly');
    div.textContent = value;
  }

  if (path === 'postsInfo.target') {
    render(state.postsInfo.target);
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
      button.disabled = false;
      input.removeAttribute('readonly');
      div.classList.add('text-success');
      div.textContent = i18n.t('form.notifications.rssSuccess');
      form.reset();
    }
  }
});
