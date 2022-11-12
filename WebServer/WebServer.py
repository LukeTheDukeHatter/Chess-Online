import asyncio
import websockets




async def process(message):
	print(message)

async def reciever(websocket):
	async for message in websocket:
		await process(message)
		
async def main():
	async with websockets.serve(reciever, 'localhost', 8765):
		await asyncio.Future()  # run forever

asyncio.run(main())

