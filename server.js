const express = require('express');
const app = express();
const port = 8000;

// app.get('/', (req, res) => res.send('Hello World!'))
app.use('/api/departures/:megallo', function(req, res, next) {
  res.send(req.params.megallo);
});
app.use(express.static('www'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
