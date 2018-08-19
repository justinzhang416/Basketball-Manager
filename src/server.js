const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

const url = 'postgres://qfunsrkkdmnrke:796592c8ad62ba2641cb94c4e1b5b5803b6350895c6e9b773849df6b0f9d4875@ec2-174-129-236-147.compute-1.amazonaws.com:5432/d1bdkkg1oldobv'

// var mysql = require('mysql');
// var con = mysql.createConnection({
// 	  host: "localhost",
// 	  user: "root",
// 	  password: "",
// 	  database: "../userData.db"
// 	});
// con.connect(function(err) {
// 	  if (err) throw err;
// 	  con.query("SELECT * FROM user", function (err, result, fields) {
// 	    if (err) throw err;
// 	    console.log(result);
// 	    res.send({ express: "result" });
	    
// 	  });
// 	});

// con.connect(function(err) {
// 	  if (err) throw err;
// 	  con.query("SELECT * FROM user", function (err, result, fields) {
// 	    if (err) throw err;
// 	    console.log(result);
// 	    res.send({ express: "result" });
	    
// 	  });
// 	});
const { Client } = require('pg');



const client = new Client({
  connectionString: url,
  ssl: true,
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});


app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/api/test', (req, res) => {
	

	

  

});

app.listen(port, () => console.log(`Listening on port ${port}`));