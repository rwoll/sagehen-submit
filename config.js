/**
 * Config file for easy access to application variables and settings.
 *
 * Note: When adding to this file always prefer to write
 * "MYVAR: process.env.SOMEVAR || `hardcodedvalue`" over only listing a
 * hardcoded config value: "MYVAR: `hardcodedvalue`".
 *
 * @author Ross A. Wollman
 */

var uuid = require('node-uuid');

module.exports = {
  DB: process.env.DB || 'mongodb://localhost:27017/sagesubmit',
  PORT: process.env.PORT || 4747,
  PSW_ROUNDS: process.env.PSW_ROUNDS || 8,
  PSW_SECRET: process.env.PSW_SECRET || 'nonproductionsecret',
  API_SECRET: process.env.API_SECRET || uuid.v4(),
  API_EXP: process.env.API_EXP || '1h'
};
