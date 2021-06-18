import onChange from 'on-change';

export default (state, i18n, form, inputURL, commonId) => {
  const feedbackContainer = document.querySelector('.feedback');
  const buttonAdd = document.querySelector('button[aria-label="add"]');

  const createLiFeedElement = (innerState, actualID) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');

    const h3 = document.createElement('h3');
    const actualFeed = innerState.feeds.find((feed) => feed.id === actualID);
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
    });
    return ulElement;
  };

  const renderState = (value, actualID) => {
    const feeds = document.querySelector('.feeds');
    const posts = document.querySelector('.posts');
    const ulElementPosts = posts.querySelector('ul');

    switch (value) {
      case 'initialization': {
        const h2 = document.createElement('h2');
        h2.textContent = i18n.t('feedsHeader');

        const ul = document.createElement('ul');
        ul.classList.add('list-group', 'mb-5');

        const li = createLiFeedElement(state, commonId);
        ul.append(li);
        feeds.prepend(h2, ul);

        const h2Element = document.createElement('h2');
        h2Element.textContent = i18n.t('postsHeader');
        const ulElement = document.createElement('ul');
        ulElement.classList.add('list-group');
        const actualPosts = state.posts.filter((post) => post.id === actualID);
        createLiPostElements(actualPosts, ulElement);
        posts.prepend(h2Element, ulElement);
      }
        break;
      case 'adding': {
        const ulElementFeeds = feeds.querySelector('ul');
        const liElementFeeds = createLiFeedElement(state, commonId);
        ulElementFeeds.prepend(liElementFeeds);

        const actualPosts2 = state.posts.filter((post) => post.id === actualID);
        createLiPostElements(actualPosts2, ulElementPosts);
      }
        break;
      case 'updating':
        createLiPostElements(state.updatedPosts, ulElementPosts);
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

  const disableForm = (value) => {
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
    feedbackContainer.textContent = value;
  };

  return onChange(state, (path, value) => {
    switch (path) {
      case 'form.status':
        disableForm(value);
        break;
      case 'form.error':
        renderError(value);
        break;
      case 'state':
        renderState(value, commonId);
        if (value === 'finished') {
          commonId += 1;
        }
        break;
      default:
    }
  });
};
