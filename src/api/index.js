import { people, planets } from "./mock-data";

function randomizedDelay(maxDelay, callback) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(callback());
    }, Math.random() * maxDelay);
  });
}

function randomizedError(errorRate, callback) {
  if (Math.random() < errorRate) {
    return Promise.reject(
      "500 Error!  I sense a great disturbance in the network."
    );
  } else {
    return Promise.resolve(callback());
  }
}

const DEFAULT_MAX_DELAY = 3000;
const DEFAULT_ERROR_RATE = 0.5;

export function mockFetch(
  { maxDelay, errorRate } = {
    maxDelay: DEFAULT_MAX_DELAY,
    errorRate: DEFAULT_ERROR_RATE,
  },
  callback
) {
  console.log("Starting mockFetch of " + callback.name);
  return randomizedDelay(maxDelay, () => callback())
    .then((result) => randomizedError(errorRate, () => result))
    .then(
      (result) => {
        console.log("Successful fetch of " + callback.name);
        return result;
      },
      (error) => {
        console.log("Error fetching " + callback.name);
        throw error;
      }
    );
}

export function fetchPeople(
  { maxDelay, errorRate } = {
    maxDelay: DEFAULT_MAX_DELAY,
    errorRate: DEFAULT_ERROR_RATE,
  }
) {
  function getPeople() {
    return people;
  }

  return mockFetch({ maxDelay: 500, errorRate: 0 }, getPeople);
}

export function fetchPlanets(
  { maxDelay, errorRate } = {
    maxDelay: DEFAULT_MAX_DELAY,
    errorRate: DEFAULT_ERROR_RATE,
  }
) {
  function getPlanets() {
    return planets;
  }

  return mockFetch({ maxDelay: 500, errorRate: 0 }, getPlanets);
}
