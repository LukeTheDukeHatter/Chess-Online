# **JQLServer.py**

## MainDB = DataBase(**Filename**: _string_)

This creates a custom database object,which stores all of its data in a json file with the filename you provide in the initialization call, this will create a new json file if the database doesn't already exist, or load preexisting data if it does
<br>

### <b>The rest of this assumes you have a database called MainDB with information already within it: </b>

### MainDB.UpdateFile()

This will convert all the currently loaded data held in a dictionary, into json and then write that to the aforementioned json file

### MainDB.LoadFile()

This will load all the data from the json file, into the dictionary object that is currently holding it within the code

### MainDB.AddLogin(**Email**: _string_, **Username**: _string_, **Password**: _string_)
Adds a new set of login information into the database, which is indexed using the email as the unique key, and the password is stored in the form of a sha256 hash for privacy

### MainDB.RemoveLogin(**Email**: _string_)
Deletes a set of login information from the database, using the user email as the key

### MainDB.CheckLogin(**Email**: _string_, **Password**: _string_) -> _bool_
Checks to see if the email and password both are correct for an account in the database, returns true or false

# **NewWebServer.py**

## app = SocketHandler(**Hostname**: _string_, **Port**: _int_)

This creates a custom live websocket server, which will listen for connections on the specified port and host, and will then send and receive data from the client

### **The rest of this assumes you have an object called app which is a instantiated SocketHandler class object**

### @app.route(**RouteName**: _string_)

This is a decorator function, which will be used to define a route for the server to listen for, and will then call the function below it when the route is accessed
<br>
#### Example Code:
### Server.py
```python
app = SocketHandler("localhost", 8080)

@app.route('routename')
async def routename(content, websocket):
    # Do stuff
    print(content)
    
    # Send data back to client
    websocket.send('Response to the web client')
    
app.run()
```
With this example above, a client can connect to the hosted socket server on port 8080, and then send a message to it, this can be done from a basic webpage using javascript, shown below:
### Client.js
```javascript
var socket = new WebSocket("ws://localhost:8080");

socket.onopen = () => {
  socket.send("routename|~~|Content to be recieved by the function");
};

socket.onmessage = (event) => {
  console.log(event.data);
};
```
With this javascript code shown above, it will connect to the open websocket on localhost port 8080, and then send a message to the server, which will then be recieved by the function defined in the server code, and printed into the servers console, and then the server will send a response back to the client, which will then be printed to the client-side console.

