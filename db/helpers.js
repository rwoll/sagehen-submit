/**
 * Escaping functions for MongoDB keys.
 * Resolved with the information at:
 * - http://stackoverflow.com/questions/12397118/mongodb-dot-in-key-name
 * - https://docs.mongodb.org/v3.0/faq/developers/
 *
 * @todo add unit tests and resolve unescape
 */

var escape = function (badMongoKey) {
  return badMongoKey
    .replace(/\\/g, '\\\\') // escape the escape character
    .replace(/\$/g, '\uff04') // escape $ operator
    .replace(/\./g, '\uff0e'); // escape . (dot) notation
};

var unescape = function (escapedKey) {
  return escapedKey
    .replace(/\uff0e/g, '.') // unescape . (dot) notation
    .replace(/\uff04/g, '$') // unescape $ operator
    .replace(/\\\\/g, '\\'); // unescape the escape character
};

module.exports = {
  escape: escape,
  unescape: unescape
};
