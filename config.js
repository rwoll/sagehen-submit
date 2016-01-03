/**
 * Config file for easy access to application variables and settings.
 *
 * Note: When adding to this file always prefer to write
 * "MYVAR: process.env.SOMEVAR || `hardcodedvalue`" over only listing a
 * hardcoded config value: "MYVAR: `hardcodedvalue`".
 *
 * @author Ross A. Wollman
 */

module.exports = {
  DB: process.env.DB || 'mongodb://localhost:27017/sagesubmit',
  PORT: process.env.PORT || 4747
};
