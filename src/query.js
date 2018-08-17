var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bballusera"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("SELECT * FROM logins", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
});
//
// con.connect(function(err) {
//   if (err) throw err;
//   con.query("SELECT * FROM logins", function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//   });
// });
