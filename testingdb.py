import JQLServer

dbname = input('Enter database name: ')
email = input('Enter email: ')
username = input('Enter username: ')
password = input('Enter password: ')

db = JQLServer.DataBase(dbname)
db.AddLogin(email, username, password)
