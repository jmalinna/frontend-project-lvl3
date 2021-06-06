const addProxy = (url) => {
  const createdURL = new URL(url);
  const proxyURL = new URL('https://hexlet-allorigins.herokuapp.com/get');
  proxyURL.searchParams.set('disableCache', 'true');
  proxyURL.searchParams.set('url', createdURL);

  return proxyURL;
};
export default addProxy;
