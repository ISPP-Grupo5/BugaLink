// 		{
// 			"id": 2,
// 			"text": "Hello worlda",
// 			"attachment": null,
// 			"timestamp": "2023-04-07T21:59:16.125830Z",
// 			"sender": 1
//      "read_by_recipient": false
// 		},

type MessageI = {
  id: number;
  text: string;
  attachment: string;
  timestamp: string; // 2023-04-20T18:53:54.001266Z
  sender?: number;
  read_by_recipient: boolean;
};

export default MessageI;
