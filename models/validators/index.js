var helpers = require('../../db/helpers');

var subDocValidator = function (fileObj) {
  if (helpers.isHashLike(fileObj) && Object.keys(fileObj).length > 0) {
    for (var i in fileObj) {
      if (fileObj.hasOwnProperty(i)) {
        var valResult = fileObj[i].validateSync();
        if (valResult) return false;
      }
    }
    return true; // made it through all iterations
  }
  return false;
};

module.exports = { subDocValidator: subDocValidator };
