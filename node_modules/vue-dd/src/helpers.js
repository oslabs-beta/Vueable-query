/**
 * Returns a hash code from a string
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
export function hashCode (str) {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export function isObject (item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export function isPromise (p) {
  return p !== null &&
    typeof p === 'object' &&
    typeof p.then === 'function' &&
    typeof p.catch === 'function';
}

export function makeId (id, name, window) {
  if (id !== '') {
    return id
  } else {
    // auto-generate id
    const locationHash = getLocationHash(window)
    return `${name}_${locationHash}`
  }
}

function getLocationHash (window) {

  // determine router type without importing vue-router package
  // by analyzing the urls
  // hash router will have a forward slash after the # sign #/about
  const isHashRouter = window.location.hash
    && typeof window.location.hash[1] !== 'undefined'
    && window.location.hash[1] === '/'

  let smartLocation = ''
  if (isHashRouter) {
    // use full route path
    smartLocation = window.location.href.toString()
  } else {
    // if hash is not a location hash
    const url = new URL(window.location.href)
    url.hash = "" // strip away hash
    smartLocation = url.toString()
  }

  return hashCode(smartLocation).toString(16).replace('-', '_')
}

export function onFrame(callback, timeout = 0) {
  setTimeout(() => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(callback))
  }, timeout)
}
