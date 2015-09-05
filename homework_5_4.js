/*
To imort the test dataset, use the following command
mongoimport -d test -c zips --drop zips.json

There are in total 29467 documents, check it after import using "db.zips.count()"
*/

use test

db.zips.aggregate([
  /* Get the first charater out of the city name*/
	{$project:
	 {pop:1,
	  first_char: {$substr : ["$city",0,1]}}
	},
	/* Filter for the documents with city starting with digit*/
	{$match:
	 {first_char:{$in:["0","1","2","3","4","5","6","7","8","9"]}}
	},
	/* Sum-up the population*/
	{$group:
	 {"_id":{},
	  "tot_count":{$sum:"$pop"}}
	}
])
