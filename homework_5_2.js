/* Use the following command to import the test dataset
mongoimport -d test -c zips --drop small_zips.json
*/

use test
db.zips.aggregate([
	/* Grouping first as same city might have multiple entries because of different zip codes */
        {$group:
         {_id:{state:"$state", city:"$city"},
          tot_pop: {$sum:"$pop"}
         }
        },
	/* Filter cities with more than 25000 population in state "CA" and "NY"*/
	{$match:
	 {"_id.state":{$in: ["CA", "NY"]},"tot_pop":{$gt:25000}}
	},
	/* Finally, calculating the average population for the filtered dataset*/
        {$group:
	 {_id:{},
	  avg_pop:{$avg:"$tot_pop"}
	 }
	}
])
