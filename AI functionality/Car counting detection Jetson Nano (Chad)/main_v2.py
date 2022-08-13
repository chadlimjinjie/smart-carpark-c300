
import cv2

import pymongo
import numpy as np
import tensorflow as tf
from datetime import datetime, timezone, timedelta
from object_detection.utils import label_map_util, visualization_utils as viz_utils

mongo = pymongo.MongoClient('mongodb+srv://root:root@cluster0.wmfbe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', tlsAllowInvalidCertificates=True)
car_park_db = mongo['car_park']
traffic_col = car_park_db['traffic']
myquery = { 'cars': {'$gte':0} }

print('loading model...')
model = tf.saved_model.load('./ssd_mobilenet_v2_fpnlite_640x640_coco17_tpu-8/saved_model')
print('model loaded!')
model_fn = model.signatures['serving_default']

# 'F:/videos/1.mp4'
# https://www.youtube.com/watch?v=xX0YZ7DmAxU

video_path = '/videos/7.mp4'
cap = cv2.VideoCapture(video_path)

PATH_TO_LABELS = './models/research/object_detection/data/mscoco_label_map.pbtxt'
category_index = label_map_util.create_category_index_from_labelmap(PATH_TO_LABELS, use_display_name=True)

while True:
    
    ret, frame = cap.read()
    
    if not ret:
        break
    
    input_tensor = tf.convert_to_tensor(frame)
    input_tensor = input_tensor[tf.newaxis, ...]
    
    results = model_fn(input_tensor)
    result = {key:value.numpy() for key, value in results.items()}
    
    detection_classes = [classes.astype(int) for classes in result['detection_classes'][0] if (classes == 3 or classes == 6 or classes == 8)]
    print(detection_classes)
    
    viz_utils.visualize_boxes_and_labels_on_image_array(
        frame,
        result['detection_boxes'][0],
        detection_classes,
        result['detection_scores'][0],
        category_index,
        use_normalized_coordinates=True,
        max_boxes_to_draw=10,
        min_score_thresh=.60,
        agnostic_mode=False
    )
    
    cv2.imshow('window', cv2.resize(frame, (800, 600)))
    
    cars = [score for score in np.squeeze(result['detection_scores'][0]) if score >= 0.6]
    print('Cars > ', len(cars))
    last_update = datetime.now(timezone(timedelta(hours=8)))
    print(last_update)
    #last_update_format = datetime(last_update.year, last_update.month, last_update.day, last_update.hour, last_update.minute, last_update.second)
    #print(last_update_format)
    #print(last_update)
    newvalues = { "$set": { "cars": len(cars), "timestamp": last_update } }
    try:
        traffic_col.update_one(myquery, newvalues)
    except Exception as e:
        #print(e)
        pass
    
    if cv2.waitKey(1) == ord('q'):
        break
    

cap.release()
cv2.destroyAllWindows()
