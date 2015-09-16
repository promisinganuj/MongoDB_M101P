// To import the enron dataset, use the following command
// mongorestore -d enron -c messages <path>/messages.bson

// DB is enron, Collection is messages
use enron

db.messages.aggregate([
	// Unwind the data based on To field
	{$unwind:
	 "$headers.To"
	},
	// Grouping data for each unique mail and sender combination 
	{$group:
         {
          _id:{"mail_id":"$_id",
               "From":"$headers.From"},
	 "To":{$addToSet:"$headers.To"}
         }
	},
        // Now that the duplicated are gone, again unwinding the data
	{$unwind:
         "$To"
        },
	// Counting the mails for unique sender and receiver pair
	{$group:
	 {
	  _id:{"From":"$_id.From",
	       "To":"$To"}, 
	  mail_count:{$sum:1}
         }
        },
        // Sorting based on the number of mail converstation descending
	{$sort:
         {mail_count:-1}
        },
	// Fetching the first record only
        {$limit: 1}
])
