var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:5000/mydb";


MongoClient.connect(url, {useNewUrlParser: true } ).then(() => {
console.log('mongoDB is connected...')
})
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });
