const addProxy = (url) => {
  const createdURL = new URL(url);
  const proxyURL = 'https://hexlet-allorigins.herokuapp.com';

  const pathname = '/get';
  const search = `?disableCache=true&url=${encodeURIComponent(createdURL)}`;
  const myURL = new URL(`${proxyURL}${pathname}${search}`);

  return myURL;
};
export default addProxy;
