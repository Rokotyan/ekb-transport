import * as turf from '@turf/turf';

const cheapRuler = require('cheap-ruler');
// const turf = {
//   circle: require('@turf/circle'),
//   point: require('@turf/helpers').point,
//   featureCollection: require('@turf/helpers').featureCollection,
//   truncate: require('@turf/truncate'),
//   destination: require('@turf/destination'),
// };

function isochrone(startingPosition, hexRadius, timeLimit, transportMode, service, apiKey, cb) {
  // validator
  const ruler = cheapRuler(startingPosition[1], 'kilometers');
  const sleep = millis => new Promise(resolve => setTimeout(resolve, millis));
  const googleMapsClient = require('@google/maps').createClient({
    key: apiKey,
  });
  const grid = {
    points: [],
    result: [],
  };
  let requests = 0; // for logging
  const batchSize = 25;

  const bearings = [30, 90, 150, -150, -90, -30]; // clockwise
  const h = 2 * hexRadius;
  const w = Math.sqrt(3) * hexRadius;
  const diagonal = Math.sqrt(Math.pow(h * (3 / 4), 2) + Math.pow(w / 2, 2));
  grid.points.push(startingPosition);
  grid.result.push(0);

  // init beg grid
  pointGrid(startingPosition);
  check();

  function pointGrid(center) {
    for (const bearing of bearings) {
      let distance = diagonal;
      if (bearing % 90 == 0) distance = w;
      const point = turf.truncate(turf.destination(center, distance, bearing)).geometry.coordinates;
      if (!grid.points.some(item => ruler.distance(item, point) < 0.01)) {
        grid.points.push(point);
        grid.result.push(true);
      }
    }
  }
  async function check() {
    const toCheck = [];
    for (const [i, point] of grid.points.entries()) {
      console.log(grid.result[i]);
      if (grid.result[i] == true) toCheck.push(point); // if true or >0
    }
    if (toCheck.length > 0) await makeRequest(toCheck); else hexagonize();
  }

  async function makeRequest(points) {
    // console.log(points.length);
    const formattedCoords = points.map((coord, i) => [coord[1], coord[0]]);
    requests += formattedCoords.length; // debug
    if (service == 'matrix') {
      // let estimated;
      // if (points.length == 25) estimated = 1; else estimated = ((points.length - points.length % 25) / 25) + 1;

      for (let c = 0; c < points.length; c += batchSize) {
        const batch = formattedCoords.slice(c, c + batchSize);
        // estimated--;
        console.log(batch.length);
        // console.log(estimated);
        googleMapsClient.distanceMatrix({
          origins: [[startingPosition[1], startingPosition[0]]],
          destinations: batch,
          mode: transportMode,
        }, (err, response) => {
          if (!err) {
            process(response.json.rows[0].elements, points, service);
            // if (estimated == 0) check();

            check(); // тут уходит в луп на больших размерах
          } else console.log(err);
        });
        // await sleep(250);
      }
    } else {
      let estimated = formattedCoords.length;
      for (const [i, coord] of formattedCoords.entries()) {
        googleMapsClient.directions({
          origin: [startingPosition[1], startingPosition[0]],
          destination: coord,
          mode: transportMode,
          alternatives: true,
        }, (err, response) => {
          if (!err) {
            process(response, [points[i]], service);
            estimated--;
            if (estimated == 0) check();
          } else console.log(err);
        });
        await sleep(20);
      }
    }
  }

  function process(response, points, mode) {
    if (service == 'directions') {
      if (response.status !== 200) grid.result[grid.points.findIndex(p => p == points[0])] = false; else {
        const times = [];
        for (const route of response.json.routes) times.push(route.legs[0].duration.value);
        const mintime = Math.max.apply(null, times);
        // console.log(mintime);
        const index = grid.points.findIndex(p => p == points[0]);
        grid.result[index] = ((mintime < timeLimit) && (mintime > 0)) ? mintime : false;
        if (grid.result[index] > 0) pointGrid(points[0]);
      }
    } else {
      for (const [i, point] of points.entries()) {
        if (response[i].status !== 'OK') grid.result[grid.points.findIndex(p => p == point)] = false; else {
          const time = response[i].duration.value;
          grid.result[grid.points.findIndex(p => p == point)] = time < timeLimit ? time : false;
        }
        if (grid.result[grid.points.findIndex(p => p == point)] > 0) pointGrid(point);
      }
    }
  }

  function hexagonize() {
    console.log(requests);
    const result = grid.points.filter((item, i) => (grid.result[i] != false));
    result.unshift(startingPosition);
    const hexes = result.map(point => turf.circle(point, hexRadius, {
      steps: 6,
      properties: {
        time: grid.result[grid.points.findIndex(p => p == point)],
      },
    }));
    const collection = turf.featureCollection(hexes);
    cb(null, collection);
  }
}

// module.exports = exports = isochrone;
export default isochrone;
