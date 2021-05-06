import 'bootstrap';
import './style.scss';
import * as yup from 'yup';
import watchedState from './view.js';
// import css from './style.css';

const parseRSS = (htmlString) => {
  const parser = new DOMParser();
  return parser.parseFromString(htmlString, 'text/html');
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
