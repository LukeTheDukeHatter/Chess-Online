from hashlib import sha256
from json import dumps,loads
from os.path import exists

class Login():
	def __init__(self,email:str="",username:str="",password:str="",JSONData:dict=None):
		if JSONData == None:
			self.uuid = sha256((email).encode('utf-8')).hexdigest()
			self.Email = email
			self.Username = username
			self.Password = sha256(password.encode('utf-8')).hexdigest()
		else:
			self.uuid = JSONData['uuid']
			self.Email = JSONData['Email']
			self.Username = JSONData['Username']
			self.Password = JSONData['Password']
	
	def CheckLogin(self,password:str) -> bool:
		if self.Password == sha256(password.encode('utf-8')).hexdigest():
			return True
		else:
			return False

	def Serialize(self) -> dict:
		return {'Email':self.Email,'Username':self.Username,'Password':self.Password,'uuid':self.uuid}

	def SafeSerialize(self) -> dict:
		return {k:v for k,v in self.Serialize().items() if k not in ['Password','uuid']}

class DataBase():
	def __init__(self,filename:str):
		self.Logins = {}
		self.Filename = filename
		if exists(f"./Databases/{self.Filename}.json"):
			self.LoadFile()
		else:
			self.UpdateFile()

	def UpdateFile(self) -> dict:
		with open(f"./Databases/{self.Filename}.json",'w') as f:
			f.write(dumps({k:v.Serialize() for k,v in self.Logins.items()}))

	def LoadFile(self) -> dict:
		with open(f"./Databases/{self.Filename}.json",'r') as f:
			self.Logins = {k:Login(JSONData=v) for k,v in loads(f.read()).items()}

	def AddLogin(self,email:str,username:str,password:str) -> bool:
		self.Logins[email] = (Login(email=email,username=username,password=password))
		self.UpdateFile()

	def RemoveLogin(self,email:str,password:str) -> bool:
		if email in self.Logins:
			if self.CheckLogin(email,password): 
				del self.Logins[email]
				self.UpdateFile()
				return True

	def CheckLogin(self,email:str,password:str) -> bool:
		if email in self.Logins:
			return self.Logins[email].CheckLogin(password)
		else:
			return False

	def GetLogin(self,type:str,value:str) -> Login:           
		if type == 'email':
			return self.Logins[value]
		elif type == 'uuid':
			for k,v in self.Logins.items():
				if v.uuid == value:
					return v.Serialize()
		else:
			return False

	def LoginExists(self,email:str) -> bool:
	    if email in self.Logins.keys():
	        return True
	    else:
	        return False