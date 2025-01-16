from websocket_server import WebsocketServer
import time
import json
import uuid
def new_client(client, server):
    print(uuid.uuid4())
    print("New client connected and was given id %d" % client['id'])
    server.send_message_to_all("Hey all, a new client has joined us")


def client_left(client, server):
	print("Client(%d) disconnected" % client['id'])


def message_received(client, server, message):
    print("got message")
    jsondata = {"id": client['id'], "message": message, "time": str(time.time())}
    server.send_message_to_all(json.dumps(message))

PORT=9001
server = WebsocketServer(port = PORT)
server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(message_received)
server.run_forever()