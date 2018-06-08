Please create a small node.js microservice which implements the following. Once you create one, you can choose to deploy this in IBM cloud or AWS. Please send us the link and instructions to invoke these following APIs and your code for the same. You can use any starter kit available  and repurpose it.
·         Create POST /report/generate enpoint with a payload as below. Upon invoking the endpoint, it should return 202 Accepted http code and return a response header[x-process-id] with unique uuid to track this request.
o    Endpoint - POST /report/generate                              
o    Payload = ["11", "22", "33" ] //String Array 
o    User can send only 100 strings per request. 
o    Validations:
§  send 413 if it payload has > 100 strings
§  send 412 if there array size is 0
§  send 400 if the payload is missing
§  send 202 if the request is valid. create an entry in mongo collection with status as processing and send back a response header[x-process-id] with unique uuid.
o    For a valid request, push the payload values into csv file and update the { uuid, status,  file_name, path } in a mongo collection.(create simple mongo data model and use the same to persist data)
o    Status should be an enum ["processing", "done"]
o    Once file is created successfull0y change the status to done
·         Create GET /report/{uuid} -- This endpoint used to return/download excel file
o    Endpoint - GET /report/{uuid}
o    Validations:
§  send 400 if uuid is missing in request param
§  send 204 if there is a record in db for uuid but status is processing
§  send 200 if the staus is done and try to return the generated csv(optional) if not just return whats in the db { uuid, status,  file_name, path } as responae body
#################################################################################

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


