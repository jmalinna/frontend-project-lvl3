import 'bootstrap';
import './style.scss';
import * as yup from 'yup';
import i18n from 'i18next';
import watchedState from './view.js';
import ru from './locales/ru.js';
// import css from './style.css';

const parseRSS = (xmlString) => {
  const parser = new DOMParser();
  return parser.parseFromString(xmlString, 'application/xml');
};

export default () => {
  i18n.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  const schema = yup.object().shape({
    url: yup.string().required().url(),
  });

  let i = 1;

  const form = document.querySelector('form');
  const input = document.querySelector('input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    schema.isValid({ url: input.value }).then((validURL) => {
      if (!validURL || ru.translation.fiedsURLs.includes(input.value)) {
        watchedState.form.error = !validURL ? i18n.t('form.errors.invalidURL') : i18n.t('form.errors.existingURL');
        watchedState.form.valid = false;
      } else {
        watchedState.form.error = '';
        watchedState.form.valid = true;
        fetch(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(input.value)}`)
          .then((response) => {
            if (response.ok) return response.json();
            throw new Error('Network response was not ok.');
          })
          .then((data) => parseRSS(data.contents))
          .then((parsedRSS) => {
            const id = i;
            watchedState.actualId = i;

            ru.translation.documents.push({ id, document: parsedRSS });
            ru.translation.fiedsURLs.push(input.value);

            const items = parsedRSS.querySelectorAll('item');
            const fiedDescription = parsedRSS.querySelector('description').textContent;
            const fiedTitle = parsedRSS.querySelector('title').textContent;

            ru.translation.fieds.push({
              id, title: fiedTitle, description: fiedDescription, link: input.value,
            });

            items.forEach((item) => {
              const title = item.querySelector('title').textContent;
              const description = item.querySelector('description').textContent;
              const link = item.querySelector('link').textContent;
              ru.translation.posts.push({
                id, title, description, link,
              });
            });
            i += 1;
            if (ru.translation.fiedsURLs.length === 1) {
              watchedState.form.state = 'initialization';
            } else {
              watchedState.form.state = 'adding';
            }
            watchedState.form.state = 'finished';
          })
          .catch(() => {
            watchedState.form.error = i18n.t('form.errors.invalidRSS');
            watchedState.form.valid = false;
            throw new Error(i18n.t('form.errors.invalidRSS'));
          });
      }
    });
  });
};
