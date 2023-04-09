// 		{
// 			"id": 2,
// 			"text": "Hello worlda",
// 			"attachment": null,
// 			"timestamp": "2023-04-07T21:59:16.125830Z",
// 			"sender": 1
// 		},

type MessageI = {
  id: number;
  text: string;
  attachment: string;
  timestamp: string;
  sender: number;
};

export default MessageI;
