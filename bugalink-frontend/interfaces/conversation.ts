// {
// 	"initiator": {
// 		"id": 1,
// 		"email": "federico@bugalink.com",
// 		"first_name": "Federico",
// 		"last_name": "de los Palotes",
// 		"photo": null,
// 		"date_joined": "2023-04-07T21:55:08.338680Z",
// 		"passenger": 1,
// 		"driver": 1
// 	},
// 	"receiver": {
// 		"id": 2,
// 		"email": "ramonantonio@bugalink.com",
// 		"first_name": "Ramón Antonio",
// 		"last_name": "Pérez González",
// 		"photo": null,
// 		"date_joined": "2023-04-07T21:55:08.341981Z",
// 		"passenger": 2,
// 		"driver": 2
// 	},
// 	"message_set": [
// 		{
// 			"id": 2,
// 			"text": "Hello worlda",
// 			"attachment": null,
// 			"timestamp": "2023-04-07T21:59:16.125830Z",
// 			"sender": 1
// 		},
// 		{
// 			"id": 1,
// 			"text": "Hello world",
// 			"attachment": null,
// 			"timestamp": "2023-04-07T21:55:56.942036Z",
// 			"sender": 1
// 		}
// 	]
// }

import MessageI from './message';
import TripI from './trip';
import UserI from './user';

type ConversationI = {
  id: number;
  initiator: UserI;
  receiver: UserI;
  message_set: MessageI[];
  // if the conversation is between two passengers,
  // this will be the most recent trip they shared
  most_recent_trip?: TripI;
};

export default ConversationI;
