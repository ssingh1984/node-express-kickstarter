//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
var config = require('./config.js');
var jwt = require('jsonwebtoken');
exports.auth = function(req, res, next){
        var token = req.body.token || req.headers['x-access-token'];
        // decode token
        if (token) {
          // verifies secret and checks exp
          jwt.verify(token, config.jwtSecret, function(err, decoded) {
            if (err) {
              return res.json({ code: 403, message: 'Failed to authenticate token.', keyValue: false});
            } else {
              // if everything is good, save to request for use in other routes
              req.decoded = decoded;
              next();
            }
          });

        } else {
          // if there is no token
          // return an error
          return res.status(403).send({
              success: false,
              message: 'No token provided.'
          });

        }
};
