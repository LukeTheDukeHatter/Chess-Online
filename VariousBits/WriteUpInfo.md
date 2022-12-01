# JQLServer.py

## MainDB = DataBase(filename)

This creates a custom database object,which stores all of its data in a json file with the filename you provide in the initialization call, this will create a new json file if the database doesn't already exist, or load prexisting data if it does

<br>

### <b>The rest of this assumes you have a database called MainDB with information already within it: </b>

<br><br>

## MainDB.UpdateFile()

This will convert all the currently loaded data held in a dictionary, into json and then write that to the aforementioned json file

## MainDB.LoadFile()

This will load all of the data from the json file, into the dictionary object that is currently holding it within the code

## MainDB.AddLogin(email,username,password)
Adds a new set of login information into the database, which is indexed using the email as the unique key, and the password is stored in the form of an sha256 hash for privacy

## MainDB.RemoveLogin(email)
Deletes a set of login information from the database, using the user email as the key

## MainDB.CheckLogin(email,password)
Checks to see if the email and password both are correct for an account in the database, returns true or false

In: email,password
<br>
Out: true or false