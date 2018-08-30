const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

const url = 'postgres://qfunsrkkdmnrke:796592c8ad62ba2641cb94c4e1b5b5803b6350895c6e9b773849df6b0f9d4875@ec2-174-129-236-147.compute-1.amazonaws.com:5432/d1bdkkg1oldobv'

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
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

// client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });


app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/api/registration', (req, res) => {
  res.send({ express: 'Hello From Express' });

  console.log(req.body);
});

app.post('/api/login', (req, res) => {
console.log('hi');
	jason = req.body;
	console.log(jason);

	client.query('SELECT * FROM userdata WHERE username =;', (err, result) => {
    if (err) throw err;

    let str = "";
    for (let row of result.rows) {
      str += JSON.stringify(row);
      console.log(JSON.stringify(row));
    }

    client.end();

    res.send({ express: str })
  });

});

app.post('/api/register', (req, res) => {
console.log('hi');
  jason = req.body;
  console.log(req.body.username);

  // client.query('INSERT into userdata (username, password, gameData) values($1, $2, $3)',
  //   [jason.username,jason.password,JSON.stringify(jason.gameData)]);

  res.send({ express: "done" })
});



app.get('/api/test', (req, res) => {


	client.query('SELECT * FROM userdata;', (err, result) => {
    if (err) throw err;

    let str = "";
    for (let row of result.rows) {
      str += JSON.stringify(row);
      console.log(JSON.stringify(row));
    }

    client.end();

    res.send({ express: str })
  });

});

app.listen(port, () => console.log(`Listening on port ${port}`));
