import websockets
import asyncio

class SocketHandler:
	def __init__(self, address:str='localhost', port:int=8765):
		self.address = address
		self.port = port
		self.Paths = {}

	def route(self, type):
		def decorator(f):		
			self.Paths[type] = f
			return f
		return decorator

	async def handler(self, websocket):
		async for message in websocket:
			type, content = message.split('|~~|')

			await self.Paths[type](content,websocket)

	async def main(self):
		async with websockets.serve(self.handler, self.address, self.port):
			await asyncio.Future()

	def run(self):
		asyncio.run(self.main())
	

