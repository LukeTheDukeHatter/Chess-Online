
######## NOTE: This is not in use. It is a placeholder for future development. ########

from websockets import serve
from asyncio import Future, run

class WebServer():
	def __init__(self, hostname, port):
		self.hostname = hostname
		self.port = port

	async def IOWS(self):
		async with serve(self.ProcessMessage, self.hostname, self.port):
			await Future()

	async def open_web_socket(self):
		run(self.IOWS())

	def set_message_handler(self, func):
		self.messageHandler = func
	
	async def process_message(self, message):
		await self.messageHandler(message)
