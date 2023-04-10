// {
// 	"id": 1,
// 	"first_name": "Federico",
// 	"last_name": "de los Palotes",
// 	"photo": null,
// 	"total_rides": 0,
// 	"number_ratings": 2,
// 	"rating": 4.75
// }

type UserStatsI = {
  id: number;
  first_name: string;
  last_name: string;
  photo: string | null;
  total_rides: number;
  number_ratings: number;
  rating: number;
};

export default UserStatsI;
