const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/api/test', (req, res) => {
	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "",
	  database: "userData"
	});

	con.connect(function(err) {
	  if (err) throw err;
	  con.query("SELECT * FROM user", function (err, result, fields) {
	    if (err) throw err;
	    console.log(result);
	    res.send({ express: result });
	    
	  });
	});

  

});

app.listen(port, () => console.log(`Listening on port ${port}`));