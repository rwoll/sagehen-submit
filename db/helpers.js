/**
 * Escaping functions for MongoDB keys.
 * Resolved with the information on
 * [Stackoverflow]{@link http://stackoverflow.com/questions/12397118/mongodb-dot-in-key-name}
 * and the [MongoFAQ]{@link https://docs.mongodb.org/v3.0/faq/developers/}.
 *
 * The functions use the recommendtions from the FAQ replacing the dollar sign
 * [$] and and dot [.] with their longform versions.
 *
 * @module db/helpers
 */

/**
 * Escapes special characters that must be ommitted from keys in MongoDB
 * collections.
 * @param  {String} badMongoKey An unescaped version of the key.
 * @return {String}             Returns an escaped version of the key.
 */
var escape = function (badMongoKey) {
  return badMongoKey
    .replace(/\\/g, '\\\\') // escape the escape character
    .replace(/\$/g, '\uff04') // escape $ operator
    .replace(/\./g, '\uff0e'); // escape . (dot) notation
};

/**
 * Unescapes special characters that must be ommitted from keys in MongoDB
 * collections.
 * @param  {String} escapedKey An escaped version of the key.
 * @return {String}            Returns an unescaped version of the key.
 */
var unescape = function (escapedKey) {
  return escapedKey
    .replace(/\uff0e/g, '.') // unescape . (dot) notation
    .replace(/\uff04/g, '$') // unescape $ operator
    .replace(/\\\\/g, '\\'); // unescape the escape character
};

/**
 * Take an Object that represents a dictionary file structure and with escaped
 * keys and unescape them using their nested values.
 *
 * @param  {Object} obj 'FileObject' type schema.
 * @return {Object}     Returns the unescaped dictionary Object.
 */
var unescapeFileObject = function (obj) {
  if (!Array.isArray(obj) && typeof obj === 'object') {
    for (var escapedName in obj) {
      if (obj.hasOwnProperty(escapedName)) {
        if (!obj[escapedName].hasOwnProperty('filename')) {
          throw new Error('No filename in subobject.')
        } else {
          obj[obj[escapedName].filename] = obj[escapedName];
          delete obj[escapedName];
        }
      }
    }
    return obj;
  } else {
    throw new Error('Not a valid file obect.\n' + obj);
  }
};

module.exports = {
  /** Escape a bad key */
  escape: escape,
  /** Unescape a bad key. */
  unescape: unescape,
  /** Unescape a "file object"-ish */
  unescapeFileObject: unescapeFileObject
};
