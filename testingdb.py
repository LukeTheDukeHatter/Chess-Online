import sys;sys.path.append('./WebServer/')

import JQLServer

Maindb = JQLServer.DataBase('firstdb')
Maindb.AddLogin('user@tessto.com','myusername','stinky123')
