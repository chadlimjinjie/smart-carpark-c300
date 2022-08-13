import  math
import pymongo
import numpy as np
import jetson.utils
import jetson.inference
from datetime import datetime, timezone, timedelta

# Mongo Client and filter
try:
	mongo = pymongo.MongoClient('mongodb+srv://root:root@cluster0.wmfbe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', tlsAllowInvalidCertificates=True)
	car_park_db = mongo['car_park']
	traffic_col = car_park_db['traffic']
	myquery = { 'cars': {'$gte':0} }
except Exception as e:
	print('Can\'t connect to MongoDB')
	print(e)
	exit()

net = jetson.inference.detectNet("ssd-mobilenet-v2", threshold=0.6)
camera = jetson.utils.videoSource("./videos/7.mp4") # csi://0, ./Videos/7.mp4, /dev/video0 for V4L2,
display = jetson.utils.videoOutput("display://0") # 'my_video.mp4' for file

while display.IsStreaming():
	img = camera.Capture()
	detections = net.Detect(img)
	# https://rawgit.com/dusty-nv/jetson-inference/python/docs/html/python/jetson.inference.html#detectNet
	# 3 cars, 4 motorcycle, 6 bus, 8 truck 
	# print([detection for detection in detections if detection.ClassID in [3, 4, 6, 8]])
	vehicles = [detection for detection in detections if detection.ClassID in [3, 4, 6, 8]]
	widths = [detection.Width for detection in detections if detection.ClassID in [3, 4, 6, 8]]
	num_vehicles = len(vehicles)
	if num_vehicles > 0:
		print(widths)

		third_q = np.quantile(widths, 0.75)
		first_q = np.quantile(widths, 0.25)
		iqr = third_q - first_q
		upper_bound = third_q + (1.5 * iqr)
		print(upper_bound)
		num_vehicles = len([detection for detection in detections if detection.Width <= upper_bound])
		
		print('unfiltered num vehicles > ', len(widths))
		print('filtered num vehicles > ', num_vehicles)
		
	last_update = datetime.now(timezone(timedelta(hours=8)))
	print(last_update)
	newvalues = { "$set": { "cars": num_vehicles, "timestamp": last_update } }
	try:
		traffic_col.update_one(myquery, newvalues)
	except Exception as e:
        #print(e)
		pass
	display.Render(img)
	display.SetStatus("Object Detection | Network {:.0f} FPS".format(net.GetNetworkFPS()))

