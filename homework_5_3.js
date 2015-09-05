/*
To imort the test dataset, use the following command
mongoimport -d test -c grades --drop grades.json
*/

use test
db.grades.aggregate([
  /* First, unwind the scores to get separate collection for each score type*/
	{$unwind: "$scores"
	},
	/* Now, filter the documents for picking up "exam" and "homework" score types only */
	{$match:
	 {"scores.type":{$in: ["exam", "homework"]}}
	},
	/* Projecting the result to get only the scores (removing the "type" and "scores" format)*/
	{$project:
	 {_id:0,
	 student_id:1,
	 class_id:1,
	 scores:"$scores.score"}
	},
	/* Averaging the each students score in particular class*/
  {$group:
   {_id:{class_id: "$class_id", student_id:"$student_id"},
    'average':{"$avg":"$scores"}}
  },
  /* Getting class average*/
  {$group:
   {_id:"$_id.class_id",
   'class_average':{"$avg":"$average"}}
  },
  /* Sorting the class average in descending order*/
  {$sort:
   {'class_average':-1}
  },
  /* Picking up the first record (highest average)*/
  {$limit:1}
])
