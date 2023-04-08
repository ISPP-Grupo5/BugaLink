// {
//   "initiator": {
//     "id": 1,
//     "email": "federico@bugalink.com",
//     "first_name": "Federico",
//     "last_name": "de los Palotes",
//     "photo": null,
//     "date_joined": "2023-04-08T00:26:47.389956Z",
//     "passenger": 1,
//     "driver": 1
//   },
//   "receiver": {
//     "id": 2,
//     "email": "ramonantonio@bugalink.com",
//     "first_name": "Ramón Antonio",
//     "last_name": "Pérez González",
//     "photo": null,
//     "date_joined": "2023-04-08T00:26:47.408362Z",
//     "passenger": 2,
//     "driver": 2
//   },
//   "last_message": {
//     "id": 61,
//     "text": "we",
//     "attachment": null,
//     "timestamp": "2023-04-08T02:15:56.185727Z",
//     "sender": 1
//   }
// }

import MessageI from './message';
import UserI from './user';

// NOTE: This the preview of a conversation that appears on the Conversations page
type ConversationPreviewI = {
  id: number;
  initiator: UserI;
  receiver: UserI;
  last_message: MessageI;
};

export default ConversationPreviewI;
