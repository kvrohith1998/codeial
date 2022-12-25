const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/codieal_development');

const db = mongoose.connection;

db.on('error',console.error.bind(console,"Error connecting to MongoDB"));

db.prependOnceListener('open',function(){
    console.log('Connected to Database :: MongoDB');
});

module.exports = db;