# import required libraries
import pymongo
import sys

# connection to the mongodb server
connection = pymongo.MongoClient("mongodb://localhost")

# function to update student record
def update_students():

# get handle for the database and collection
	db=connection.school
	students=db.students
	
# open cursor with the required filter (not present in this case)
	cur_student=students.find()

# loop through each record
	for rec in cur_student:
# initialise a list to contain all the "homework" scores
		homework_score=[]
# get the complete "scores" in a temporary list
		temp_scores=rec["scores"]
# loop through all the elements in the list (dictionaries in this case)
		for scores in rec["scores"]:
# if the score is for "homework" type, append the score to the "homework_score" list
			if (scores["type"] == "homework"):
				homework_score.append(scores["score"])
# now sort the scores and pick-up the least one, this has to be replaced
		lowest_hw_score=sorted(homework_score)[0]
# get the index of this dictionary entry in the list
		idx=temp_scores.index({"type":"homework","score":lowest_hw_score})
# delete this index entry from the temporary list
		del temp_scores[idx]
# replace the value in the loop variable
		rec["scores"]=temp_scores
# finally, replace the record in main collection with the above record based on id
		students.replace_one({'_id': rec['_id']}, rec)
		
# Execute the procedure
update_students()
