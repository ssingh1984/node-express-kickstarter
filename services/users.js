var users = require('./../models').users;

/*insert query*/
exports.createuser = function(objectToSave, callback) {
    users.create(objectToSave, callback);
}
exports.findusers = function(type, findObj, callback){
    if(type === 1){
      users.findOne(findObj, callback);
    }else {
      users.find(findObj, callback)
    }
}
exports.updateUser = function(matchObj, updateObj, options, callback) {
    users.findOneAndUpdate(matchObj, { $set: updateObj }, options, callback);
}
exports.getUserCount = function(matchObj) {
  return new Promise(function(resolve, reject) {
    users.count(matchObj, function(err, counts) {
      if(err){
        resolve(0);
      }else {
        resolve(counts);
      }
    })
  });
}
