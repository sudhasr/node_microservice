INSTRUCTIONS TO INVOKE APIs

Microservices Endpoint URLs:-
 #Endpoint for POST Request:- ec2-13-56-240-167.us-west-1.compute.amazonaws.com:3000/report/generate
 #Endpoint for GET Request:- ec2-13-56-240-167.us-west-1.compute.amazonaws.com:3000/report/:uuid
 #The Database was deployed on MLab:- "mongodb://FlyHigh:webarchitects280@ds231205.mlab.com:31205/flyhigh"


API details:-
1) POST /report/generate
 
 Sample URI: ec2-13-56-240-167.us-west-1.compute.amazonaws.com:3000/report/generate

 Sample Request Body:-
	{ "payload": ["234","12","11"]}

 Sample Response Status:-
 	202 Accepted

 Sample Response Body:-
	"Request is valid"

 Sample Response Headers:-
	x-process-id -> 5b7ebbfa-b51b-4247-b8e8-b08407dc0be5

 DataBase Entry:-
	{
    	   "_id": {
           "$oid": "5b1ade8edab43108688bb496"
    	    },
    	   "uuid": "5b7ebbfa-b51b-4247-b8e8-b08407dc0be5",
    	   "status": "done",
    	   "filename": "reportsData.csv",
    	   "filepath": "/"
	}

2) GET /report/:uuid
  Sample URI:- ec2-13-56-240-167.us-west-1.compute.amazonaws.com:3000/report/21646250-544f-4810-9178-887f8d21a629

  Sample Response Status:- 200 OK
  
  Sample Response Headers:-
	Content-Disposition -> attachment; filename="reportsData.csv"


