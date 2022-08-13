import cv2
import numpy as np
from time import sleep
from datetime import datetime

width_min=50 #Minimum width of the rectangle
height_min=50 #Minimum height of the rectangle

offset=6 #Allowable error between pixel

pos_line=550 #Count Line Position

delay= 60 #Video FPS

detec = []
cartop = 0
carbottom = 0
carleft = 0
carright = 0

object_id_list = []
dtime = dict()
dwell_time = dict()
c = 0

	
def catch_centro(x, y, w, h):
    x1 = int(w / 2)
    y1 = int(h / 2)
    cx = x + x1
    cy = y + y1
    return cx,cy

img = cv2.imread('2017-02-03-image-9.jpg')
cap = cv2.VideoCapture('video.mp4')
subtracao = cv2.bgsegm.createBackgroundSubtractorMOG()

while True:
    ret , frame1 = cap.read()
    tempo = float(1/delay)
    sleep(tempo) 
    grey = cv2.cvtColor(frame1,cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(grey,(3,3),5)
    img_sub = subtracao.apply(blur)
    dilat = cv2.dilate(img_sub,np.ones((5,5)))
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    dilatada = cv2.morphologyEx (dilat, cv2. MORPH_CLOSE , kernel)
    dilatada = cv2.morphologyEx (dilatada, cv2. MORPH_CLOSE , kernel)
    contorno,h=cv2.findContours(dilatada,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
    
   
    cv2.rectangle(frame1, (125, 225), (pos_line, pos_line), (255,127,0), 3) 
   
    for(i,c) in enumerate(contorno):
        (x,y,w,h) = cv2.boundingRect(c)
        validar_contorno = (w >= width_min) and (h >= height_min)
        
        if not validar_contorno:
            continue

        if x > 150 and x < 900:

            cv2.rectangle(frame1,(x,y),(x+w,y+h),(0,255,0),2) 
            z = y+h
            o = x+w
            centro = catch_centro(x, y, w, h)
            detec.append((x,y,z,o))

            #for (i) in detec:
            

            for (x,y,z,o) in detec:
                if y<(pos_line+offset) and y>(pos_line-offset) and x < 550:
                    cartop+=1
                    cv2.rectangle(frame1, (125, 225), (550, pos_line), (0,127,255), 3) 
                    detec.remove((x,y,z,o))
                    #print("car is detected : "+str(cartop))      
                elif (z)<(pos_line+offset) and (z)>(pos_line-offset) and x < 550:
                    carbottom+=1
                    cv2.rectangle(frame1, (125, pos_line+offset), (550, pos_line-offset), (0,127,255), 3) 
                    detec.remove((x,y,z,o))
                    if i not in object_id_list:
                        object_id_list.append(i)
                        dtime[i] = datetime.now()
                        dwell_time[i] = 0
                    else:
                        curr_time = datetime.now()
                        old_time = dtime[i]
                        time_diff = curr_time - old_time
                        dtime[i] = datetime.now()
                        sec = time_diff.total_seconds()
                        dwell_time[i] += sec
                
               
                    cv2.putText(frame1, str(int(dwell_time[i])), (x, y-5), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, (0, 0, 255), 1)
                    print(int(dwell_time[i]))
                elif (o)<(pos_line+offset) and (o)>(pos_line-offset) and z < 550:
                    carright+=1
                    cv2.rectangle(frame1, (125, pos_line+offset), (550, pos_line-offset), (0,127,255), 3) 
                    detec.remove((x,y,z,o))
                elif (y)<(229) and (y)>(221) and z < 550:
                    carleft+=1
                    cv2.rectangle(frame1, (125, pos_line+offset), (550, pos_line-offset), (0,127,255), 3) 
                    detec.remove((x,y,z,o))
                    
                 
       
    cv2.putText(frame1, "VEHICLE COUNT : "+str(cartop) + "(" + str(carbottom) + ")" + "(" + str(carleft) + ")" + "(" + str(carright) + ")", (400, 70), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255),5)
    cv2.imshow("Video Original" , frame1)
    cv2.imshow("Detectar",dilatada)

    if cv2.waitKey(1) == 27:
        break
    
cv2.destroyAllWindows()
cap.release()
