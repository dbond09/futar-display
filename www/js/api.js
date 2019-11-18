var stops;
var names;
var contentObjects = [];
var contentReferences = {routes: [], trips: []};
// var stopId = 'BKK_CSF01108'; // Astoria M

fetch('./ids.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    stops = json;
    queryApi();

  })

fetch('./names.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    names = json;
  })

function queryApi() {
  // generateContent(test.data);
  // return;
  contentObjects = [];
  content = [];
  if (stops[stopId].children) {
    var ids = stops[stopId].children;
  }
  else {
    var ids = [stopId];
  }
  for (var i = 0; i < ids.length; i++) {
    // fetch('https://cors-anywhere.herokuapp.com/https://futar.bkk.hu/api/query/v1/ws/otp/api/where/arrivals-and-departures-for-stop.json?includeReferences=agencies,routes,trips,stops&stopId=' + ids[i] + '&minutesBefore=1&minutesAfter=30&key=bkk-web&version=3&appVersion=3.2.4-19639-9a6d560c')
    fetch("/api/stop/" + ids[i])
    .then(function(response) {
      // console.log(response.status);
      return response.json();
    })
    .then(function(json) {
      generateContent(json.data);
    })
  }
}

function generateContent(data) {
  contentObjects = contentObjects.concat(data.entry.stopTimes);
  contentReferences.routes = Object.assign(contentReferences.routes, data.references.routes);
  contentReferences.trips = Object.assign(contentReferences.trips, data.references.trips);
  contentObjects = contentObjects.sort(function(a, b) {
    if ((a.predictedDepartureTime || a.departureTime) < (b.predictedDepartureTime || b.departureTime)) {
      return -1;
    }
    else {
      return 1;
    }
  });
  var newcontent = [];
  for (var i = 0; i < Math.min(5, contentObjects.length); i++) {
    var entry = contentObjects[i];
    var route = contentReferences.routes[contentReferences.trips[entry.tripId].routeId].shortName;
    if (entry.predictedDepartureTime) {
      var departure = new Date(entry.predictedDepartureTime*1000);
    }
    else {
      var departure = new Date(entry.departureTime*1000);
    }
    var minutes = Math.ceil((departure - new Date()) / (1000 * 60));
    if (minutes > 0) {
      newcontent.push(route + "¥" + entry.stopHeadsign + "†" + minutes + "'");
    }
    else {
      newcontent.push(route + "¥" + entry.stopHeadsign + "†");
    }
  }
  content = newcontent;
  loading = false;
}
