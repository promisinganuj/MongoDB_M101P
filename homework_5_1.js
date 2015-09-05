/*
To imort the test dataset, use the following command
mongoimport -d blog -c posts --drop posts.json
*/

db.posts.aggregate([
    /* Create a new documents with all authors on a comment in an array */
	{$project:
	 {"authors": "$comments.author"}
	},
	/* Unwind the authors */
	{$unwind: "$authors"},
	/* Group the authors and get the number of comments made*/
	{$group:
	 {_id: {"author": "$authors"},
	  "comments_posted":{$sum:1}
	 }
	},
	/* Sort them by number of comments descending */
	{$sort:
	 {comments_posted:-1}
	},
	/* Get the first record*/
	{$limit:1}
])
