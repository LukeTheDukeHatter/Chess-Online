class Test():
	def __init__(self):
		self.Paths = {}

	def route(self, type):
		def decorator(f):		
			self.Paths[type] = f
			return f
		return decorator

	def getf(self, fn):
		return self.Paths[fn]

MyObj = Test()

@MyObj.route('display')
def display(content):
	print(content)

print(MyObj.Paths)
MyObj.getf('display')('Hello World')