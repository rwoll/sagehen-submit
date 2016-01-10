/**
 * Escaping functions for MongoDB keys.
 * Resolved with the information at:
 * - http://stackoverflow.com/questions/12397118/mongodb-dot-in-key-name
 * - https://docs.mongodb.org/v3.0/faq/developers/
 */

var escape = function (badMongoKey) {
  return badMongoKey
    .replace('\\', '\\\\') // escape the escape character
    .replace('$', '\\U+FF04') // escape $ operator
    .replace('.', '\\U+FF0E'); // escape . (dot) notation
};

var unescape = function (escapedKey) {
  return escapedKey
    .replace('\\U+FF0E', '.') // unescape . (dot) notation
    .replace('\\U+FF04', '$') // unescape $ operator
    .replace('\\\\', '\\'); // unescape the escape character
};

module.exports = {
  escape: escape,
  unescape: unescape
};
