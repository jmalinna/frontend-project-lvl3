// import _ from 'lodash';
import 'bootstrap';
import './style.scss';
// import css from './style.css';
import onChange from 'on-change';
import * as yup from 'yup';

const parseRSS = (htmlString) => {
  const parser = new DOMParser();
  return parser.parseFromString(htmlString, 'text/html');
};

const app = () => {
  const state = {
    form: {
      state: 'inactive',
      fiedsURLs: [],
      valid: true,
      error: '',
    },
    documents: '',
    posts: [],
    fieds: [],
    activeId: '',
  };

  const form = document.querySelector('form');
  const input = document.querySelector('input');
  const div = document.querySelector('.feedback');

  const watchedState = onChange(state, (path, value) => {
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

    if (path === 'form.state' && value === 'initialization') {
      const feeds = document.querySelector('.feeds');
      const posts = document.querySelector('.posts');
      const h2 = document.createElement('h2');
      h2.textContent = 'Фиды';
      const ul = document.createElement('ul');
      ul.classList.add('list-group', 'mb-5');
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      const h3 = document.createElement('h3');
      const fiedArray = state.fieds.filter((fied) => fied.id === state.activeId);
      const [fied] = fiedArray;

      h3.textContent = fied.title;
      const p = document.createElement('p');
      p.textContent = fied.description;

      li.prepend(h3, p);
      ul.prepend(li);
      feeds.prepend(h2, ul);

      const h2Element = document.createElement('h2');
      h2Element.textContent = 'Посты';
      const ulElement = document.createElement('ul');
      ulElement.classList.add('list-group');
      const actualPosts = state.posts.filter((post) => post.id === state.activeId);

      actualPosts.forEach((post) => {
        const liElement = document.createElement('li');
        liElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
        liElement.innerHTML = `<a href="${post.link}" class="font-weight-bold" data-id="2" target="_blank" rel="noopener noreferrer"></a><button type="button" class="btn btn-primary btn-sm" data-id="2" data-toggle="modal" data-target="#modal">Просмотр</button>`;
        const aElement = liElement.querySelector('a');
        aElement.textContent = post.title;
        ulElement.append(liElement);
      });

      posts.prepend(h2Element, ulElement);
    }

    if (path === 'form.state' && value === 'finished') {
      form.reset();
      div.classList.add('text-success');
      div.textContent = 'RSS успешно загружен';
    }
  });

  const schema = yup.object().shape({
    url: yup.string().required().url(),
  });

  let i = 1;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    schema.isValid({ url: input.value }).then((validURL) => {
      if (!validURL || state.form.fiedsURLs.includes(input.value)) {
        watchedState.form.error = !validURL ? 'Ссылка должна быть валидным URL' : 'RSS уже существует';
        watchedState.form.valid = false;
      } else {
        watchedState.form.error = '';
        watchedState.form.valid = true;
        fetch(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(input.value)}`)
          .then((response) => {
            if (response.ok) return response.json();
            throw new Error('Network response was not ok.');
          })
          .then((data) => {
            const parsedRSS = parseRSS(data.contents);
            watchedState.documents = parsedRSS;
            watchedState.form.fiedsURLs.push(input.value);

            const items = parsedRSS.querySelectorAll('item');
            const fiedDescription = parsedRSS.querySelector('description').textContent;
            const fiedTitle = parsedRSS.querySelector('title').textContent;
            const id = i;

            watchedState.fieds.push({
              id, title: fiedTitle, description: fiedDescription, link: input.value,
            });

            watchedState.activeId = i;

            items.forEach((item) => {
              const title = item.querySelector('title').textContent;
              const description = item.querySelector('description').textContent;
              const link = item.querySelector('link').nextSibling.data;
              watchedState.posts.push({
                id, title, description, link,
              });
            });
            i += 1;
            watchedState.form.state = 'initialization';
            watchedState.form.state = 'finished';
          });
      }
    });
  });
};
app();
export default app;
