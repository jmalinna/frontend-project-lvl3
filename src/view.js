import onChange from 'on-change';
import i18n from 'i18next';
import ru from './locales/ru.js';

const form = document.querySelector('form');
const input = document.querySelector('input');
const div = document.querySelector('.feedback');

const state = {
  form: {
    state: 'inactive',
    valid: true,
    error: '',
  },
  actualId: '',
};

const createLiFiedElement = (innerState) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item');
  const h3 = document.createElement('h3');
  const fiedArray = ru.translation.fieds.filter((fied) => fied.id === innerState.actualId);
  const [fied] = fiedArray;

  h3.textContent = fied.title;
  const p = document.createElement('p');
  p.textContent = fied.description;
  li.prepend(h3, p);
  return li;
};

const createLiPostElements = (actualPosts, ulElement, id) => {
  actualPosts.reverse().forEach((post) => {
    const liElement = document.createElement('li');
    liElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
    liElement.innerHTML = `<a href="${post.link}" class="font-weight-bold" data-id="${id}" target="_blank"rel="noopenernoreferrer"></a><button type="button" class="btn btn-primary btn-sm" data-id="${id}" data-toggle="modal" data-target="#modal">Просмотр</button>`;
    const aElement = liElement.querySelector('a');
    aElement.textContent = post.title;
    ulElement.prepend(liElement);
  });
  return ulElement;
};

export default onChange(state, (path, value) => {
  if (path === 'form.valid') {
    if (value) {
      input.classList.remove('is-invalid');
      div.classList.remove('text-danger');
    } else {
      input.classList.add('is-invalid');
      div.classList.add('text-danger');
    }
    div.textContent = state.form.error;
  }

  const feeds = document.querySelector('.feeds');
  const posts = document.querySelector('.posts');

  if (path === 'form.state' && value === 'initialization') {
    const h2 = document.createElement('h2');
    h2.textContent = i18n.t('fiedsHeader');
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'mb-5');
    const li = createLiFiedElement(state);

    ul.append(li);
    feeds.prepend(h2, ul);

    const h2Element = document.createElement('h2');
    h2Element.textContent = i18n.t('postsHeader');
    const ulElement = document.createElement('ul');
    ulElement.classList.add('list-group');

    const actualPosts = ru.translation.posts.filter((post) => post.id === state.actualId);
    createLiPostElements(actualPosts, ulElement, state.actualId);

    posts.prepend(h2Element, ulElement);
  }

  if (path === 'form.state' && value === 'adding') {
    const ulEl = feeds.querySelector('ul');
    const liEl = createLiFiedElement(state);
    ulEl.prepend(liEl);

    const ulElPosts = posts.querySelector('ul');
    const actualPosts2 = ru.translation.posts.filter((post) => post.id === state.actualId);
    createLiPostElements(actualPosts2, ulElPosts);
  }

  if (path === 'form.state' && value === 'finished') {
    form.reset();
    div.classList.add('text-success');
    div.textContent = i18n.t('form.notifications.rssSuccess');
  }
});
