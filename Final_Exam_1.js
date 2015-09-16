// To import the enron dataset, use the following command
// mongorestore -d enron -c messages <path>/messages.bson

// DB is enron, Collection is messages
use enron

db.messages.aggregate([
	// Filter the records based on From field
	{$match:
     	 {"headers.From":"andrew.fastow@enron.com"}
    	},
	// Unwind the data based on To field
	{$unwind:
	 "$headers.To"
	},
	// Match the records based on To field unwinded above
	{$match:
         {"headers.To":"jeff.skilling@enron.com"}
        },
	// Count all the mails sent
	{$group:
	 {
	 _id:{"From":"$headers.From",
	       "To":"$headers.To"}, 
	 mail_count:{$sum:1}
         }
        }
])
