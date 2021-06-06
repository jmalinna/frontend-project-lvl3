const addProxy = (url) => {
  const proxyURL = new URL('https://hexlet-allorigins.herokuapp.com/get');
  proxyURL.searchParams.set('disableCache', 'true');
  proxyURL.searchParams.set('url', url);

  return proxyURL;
};
export default addProxy;
