var Mongoose = require('mongoose');
//console.log('DB_HOST', process.env.DB_HOST, 'DB_NAME', process.env.DB_NAME)
//add database
Mongoose.connect('mongodb://'+process.env.DB_HOST+'/'+process.env.DB_NAME);
var db = Mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log('Connection with database succeeded.');
});

exports.db = db;
