# import required libraries
import pymongo
import sys
import subprocess

# Load the "albums" and "images" documents
subprocess.call('mongoimport --db test --collection images --drop images.json', shell = True)
subprocess.call('mongoimport --db test --collection albums --drop albums.json', shell = True)

# connection to the mongodb server
connection = pymongo.MongoClient("mongodb://localhost")

# function to remove orphan images 
def remove_orphan_images():

# get handle for the database and collections
	db=connection.test
	albums=db.albums
	images=db.images

# Create index on the "images" key of albums collection for better performance
	albums.create_index("images")

# Get the image cursor
	cur_images=images.find()

# Loop through all the images
	for image in cur_images:
# Check if the image is present in any album
		cnt=albums.find({"images": image["_id"]}).count()
# If the count is 0, the image is orphan and should be deleted
		if (cnt == 0):
			images.delete_one({"_id": image["_id"]})

# Remaining records count
	record_count=images.count()
	print "Remainging records: " + str(record_count)

# Remainging records count with tags "kittens"
	cntTagKitten=images.find({"tags": "kittens"}).count()
	print "Remaining images with tags kittens: " + str(cntTagKitten)

# Call the function
remove_orphan_images()
