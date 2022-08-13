import face_recognition
import cv2
import os
import pickle
import mysql.connector
import pyttsx3

engine = pyttsx3.init()
engine.setProperty('rate', 150)     # setting up new voice rate

engine.setProperty('volume',1)    # setting up volume level  between 0 and 1

voices= engine.getProperty('voices')
engine.setProperty('voice', voices[1].id)   #changing index, changes voices. 1 for female 0 for male


mydb = mysql.connector.connect(user="default@c300",
                                   password="@Republic1",
                                   database='integration',
                                   host="c300.mysql.database.azure.com",
                                   ssl_ca='./BaltimoreCyberTrustRoot.crt.pem')



mycursor=mydb.cursor()

mycursor.execute("select fullname from integration.user")
staff = mycursor.fetchall()

mycursor.execute("select fullname from guest")
guest= mycursor.fetchall()
for i in guest:
    print(i)
Encodings=[]
Names=[]
databasename=[]
detected=[]
with open('train.pkl', 'rb') as f:
    Names=pickle.load(f)
    Encodings=pickle.load(f)

font=cv2.FONT_HERSHEY_SIMPLEX
dispW=640
dispH=480
flip=2
camSet='nvarguscamerasrc !  video/x-raw(memory:NVMM), width=3264, height=1848, format=NV12, framerate=28/1 ! nvvidconv flip-method='+str(flip)+' ! video/x-raw, width='+str(dispW)+', height='+str(dispH)+', format=BGRx ! videoconvert ! video/x-raw, format=BGR ! appsink'
cam= cv2.VideoCapture(camSet)
while True:
    _,frame=cam.read()
    frameRGB=cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    facePositions=face_recognition.face_locations(frameRGB,model='CNN')
    allEncodings=face_recognition.face_encodings(frameRGB,facePositions)
    for(top,right,bottom,left),face_encoding in zip(facePositions,allEncodings):
        name='Unknown Person'
        matches=face_recognition.compare_faces(Encodings,face_encoding)
        if True in matches:
            first_match_index=matches.index(True)
            name=Names[first_match_index]
            if(name in staff or guest) and (name not in detected):
                detected.append(name)
                strin="Hello "+name+", please proceed to level 1"
                print(strin)
                engine.say(strin)                
                engine.runAndWait()
                engine.stop()
            
        cv2.rectangle(frame,(left,top), (right,bottom),(0,0,255),2)
        cv2.putText(frame,name,(left,bottom+30), font,.75,(0,0,255),2)
    cv2.imshow('cam',frame)
    cv2.moveWindow('cam',0,0)
    if cv2.waitKey(1)==ord('q'):
        break
cam.release()
cv2.destroyAllWindows()
