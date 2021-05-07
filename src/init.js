import 'bootstrap';
import './style.scss';
import * as yup from 'yup';
import watchedState from './view.js';
// import css from './style.css';

const parseRSS = (xmlString) => {
  const parser = new DOMParser();
  return parser.parseFromString(xmlString, 'application/xml');
};

export default () => {
  const schema = yup.object().shape({
    url: yup.string().required().url(),
  });

  let i = 1;

  const form = document.querySelector('form');
  const input = document.querySelector('input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    schema.isValid({ url: input.value }).then((validURL) => {
      if (!validURL || watchedState.form.fiedsURLs.includes(input.value)) {
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
            const id = i;
            watchedState.actualId = i;

            watchedState.documents.push({ id, document: parsedRSS });
            watchedState.form.fiedsURLs.push(input.value);

            const items = parsedRSS.querySelectorAll('item');
            const fiedDescription = parsedRSS.querySelector('description').textContent;
            const fiedTitle = parsedRSS.querySelector('title').textContent;

            watchedState.fieds.push({
              id, title: fiedTitle, description: fiedDescription, link: input.value,
            });

            items.forEach((item) => {
              const title = item.querySelector('title').textContent;
              const description = item.querySelector('description').textContent;
              const link = item.querySelector('link').textContent;
              watchedState.posts.push({
                id, title, description, link,
              });
            });
            i += 1;
            if (watchedState.form.fiedsURLs.length === 1) {
              watchedState.form.state = 'initialization';
            } else {
              watchedState.form.state = 'adding';
            }
            watchedState.form.state = 'finished';
          });
      }
    });
  });
};
// последовательность выведения постов на страницу
