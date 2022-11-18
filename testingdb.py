import sys;sys.path.append('./WebServer/')

import JQLServer

Maindb = JQLServer.DataBase('maindb')
Maindb.AddLogin('luke@somedev.com','myusername','stinky123')
