export {};
import { sampleRoutines, sampleTripRequests, sampleTrips, individualRides} from './data';

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const chance = require('chance').Chance();
const cors = require('cors');

// Create express app
const app = express();
app.use(cors());

// Set port for the server to listen on
const port = process.env.PORT || 3030;

// Use body-parser middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define API routes
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to my API!' });
});

// GET /api/users/<userId> -> User (nombre e icono)
// Generate fake data using Chance
router.get('/users/:userId', (req, res) => {
  const userId = req.params.userId;

  const user = {
    id: userId,
    name: chance.name({ nationality: 'en' }).split(' ')[0],
    lastName: chance.last({ nationality: 'es' }),
    photo: chance.avatar({ fileExtension: 'jpg' }),
  };
  res.json(user);
});

router.get('/api/users/:driverId/reviews', (req, res) => {
  const numberReviews = chance.integer({ min: 1, max: 20 });
  let reviews = []
  for(let i = 0; i < numberReviews; i++){
    const review = {
      rating : chance.integer({min:1,max:5}),
      comment : "example comment"
    };
    reviews[i]=review;
  }
  res.json(reviews);
});

router.get('/users/:userId/chats/pending/count', (req, res) => {
  const number = chance.integer({ min: 1, max: 4 });
  res.json(number);
});

router.get('/users/:userId/requests/pending/count', (req, res) => {
  const number = chance.integer({ min: 1, max: 4 });
  res.json(number);
});

// GET /rides/recommendations
router.get('/trips/recommendations', (req, res) => {
  res.json(sampleTrips);
});

// GET /individualRides/<individualRideId>
router.get('/individualRides/:IndividualRideId', (req, res) => {
  const individualRideId = req.params.individualRideId;

  // Ugly filter, should work for now until we have a proper backend
  res.json(
    individualRides.filter((individualRide) => {
      return (!individualRideId || individualRide.individualRideId == individualRideId);
    })
  );
});

// GET /rides/search?origin=...&destination=...&date=...&time=...&price=...&seats=...
router.get('/trips/search', (req, res) => {
  const origin = req.query.origin;
  const destination = req.query.destination;

  // Ugly filter, should work for now until we have a proper backend
  res.json(
    sampleTrips.filter((trip) => {
      return (
        (!origin || trip.origin.includes(origin)) &&
        (!destination || trip.destination.includes(destination))
      );
    })
  );
});

// get(`/users/${userId}/trips?status=pending`);
router.get('/users/:userId/trips', (req, res) => {
  const userId = req.params.userId;
  const status = req.query.status;

  res.json(
    sampleTripRequests.filter(
      (tripRequest) =>
        tripRequest.requestedBy.id === Number.parseInt(userId) && // show only pending trips for the current user
        tripRequest.requestStatus === status // status could be "pending"
    )
  );
});

// get(`/users/${userId}/trips/upcoming`);
router.get('/users/:userId/trips/upcoming', (req, res) => {
  res.json(sampleTrips);
});

// get(`/users/${userId}/trips/history?type=driver`);
router.get('/users/:userId/trips/history', (req, res) => {
  // return trips in random order
  res.json(sampleTrips.sort(() => Math.random() - 0.5));
});

// Register API routes
app.use('/api', router);

// Start the server
app.listen(port);
console.log(`Server listening on port ${port}`);

//get('users/${userId}/routines);
router.get('/users/:userId/routines', (req, res)=>{
  res.json(sampleRoutines)
})