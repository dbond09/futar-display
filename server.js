const express = require('express');
const fetch = require('node-fetch');
const ejs = require('ejs');
const app = express();
const port = 8000;

const shortNames = {
  "moszkva": "BKK_CS073099",
  "astoria": "BKK_CSF01108",
  "kalvin": "BKK_CSF01289"
};

app.use('/:megallo', async function(req, res, next) {
  var megallo = req.params.megallo;
  if (!Object.keys(shortNames).includes(megallo)) {
    next();
    return;
  }
  var f = await ejs.renderFile('www/index.html', { stopId: shortNames[megallo], stopName: megallo });
  res.send(f);
});

app.use('/api/stop/:id', async function(req, res, next) {
  try  {
    var he = await fetch('https://futar.bkk.hu/api/query/v1/ws/otp/api/where/arrivals-and-departures-for-stop.json?includeReferences=agencies,routes,trips,stops&stopId=' + req.params.id + '&minutesBefore=1&minutesAfter=30&key=bkk-web&version=3&appVersion=3.2.4-19639-9a6d560c');
    var hmm = await he.json();
    res.send(hmm);
  } catch(error) {
    console.log(error);
  }
});

app.use('/api/departures/:megallo', function(req, res, next) {
  res.send(req.params.megallo);
});

app.use(express.static('www'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
