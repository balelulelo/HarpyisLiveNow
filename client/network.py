# ====================================================================================================
# @file: network.py

# Handles connecting to the server, sending messages, and receiving responses.

# ====================================================================================================
import socket
import sys
import threading
import time
# add parent directory so we can import from shared/protocol.py
sys.path.append('..')
from shared.protocol import (
    send_message, receive_message, MESSAGE_NAMES,
    MESSAGE_WELCOME, MESSAGE_SELECT, MESSAGE_SELECT_ACK,
    MESSAGE_CHAT, MESSAGE_REPLY, MESSAGE_EVENT, 
    MESSAGE_QUIT, MESSAGE_ERROR
)

class WarkopClient:
    # ====================================================================================================
        # @brief: Initialize the client with a host and port. The default is localhost:3012.
        # @attr host: The IP address or hostname of the server to connect to (default 'localhost')
        # @attr port: The TCP port number of the server to connect to 
        # @attr client_socket: The TCP socket object that will be used to communicate with the server
    # ====================================================================================================
    def __init__(self, host: str = 'localhost', port: int = 3012):
        self.host = host
        self.port = port
        self.client_socket = None

    # ====================================================================================================
        # @brief: Connect to the server by creating a socket and connecting to the specified host and port.
    # ====================================================================================================
    def connect_to_server(self):
        try:
            # Create the socket and connect to the server. starts the TCP three-way handshake 
            # Three way handshake:
                # 1. Client → Server:  SYN        (I want to connect)
                # 2. Server → Client:  SYN-ACK    (Acknowledged, I'm ready too)
                # 3. Client → Server:  ACK        (Great, let's go)
            self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            print(f"[CLIENT] Visiting Warkop at {self.host}:{self.port}...")
            self.client_socket.connect((self.host, self.port))
            print(f"[CLIENT] Arrived at Warkop!")
       
            # start a thread to receive messages from the server in the background
            receive_thread = threading.Thread(target=self.receive_loop, daemon=True)
            receive_thread.start()

            # start the chat loop (this blocks until the user quits)
            self.main_chat_loop()
    
        # case where the server isn't running, connect() raises ConnectionRefusedError
        except ConnectionRefusedError:
            print(f"[CLIENT] Could not connect. Is the Warkop server running?")
        except Exception as e:
            print(f"[CLIENT] Error connecting to server: {e}")
        finally:
            self.disconnect()

    # ====================================================================================================
        # @brief: Continuously receive messages from the server in a background thread.
        #         Handles ALL incoming data: welcome message, chat responses, broadcast events.
    # ====================================================================================================
    def receive_loop(self):
        try:
            while True:
                message_type, payload = receive_message(self.client_socket)
                # (None, None) = connection closed
                if message_type is None:
                    print("\n[CLIENT] Server closed the connection.")
                    break
 
                message_content = payload.get("message", "")
 
                # 1. display welcome
                if message_type == MESSAGE_WELCOME:
                    print(f"{message_content}")
                # 2. display reply and select ack
                elif message_type in (MESSAGE_REPLY, MESSAGE_SELECT_ACK):
                    print(f"{message_content}")
                # 3. display event
                elif message_type == MESSAGE_EVENT:
                    print(f"\n[Warkop] {message_content}")
                # 4. display error message
                elif message_type == MESSAGE_ERROR:
                    print(f"\n[ERROR] {message_content}")
                # 4. other than that, it's unknown
                else:
                    readable_type = MESSAGE_NAMES.get(message_type, f"UNKNOWN({message_type})")
                    print(f"\n[{readable_type}] {message_content}")
 
                # reprint prompt after displaying server message
                print("You: ", end="", flush=True)
 
        except ConnectionResetError:
            print("\n[CLIENT] Lost connection to server.")
        except OSError:
            # socket closed by disconnect(), expected on quit
            pass

    # ====================================================================================================
        # @brief: the main interaction loop with the server. It will send a message to the server and wait for 
        # a response

    # ====================================================================================================
    def main_chat_loop(self):
        try:
            while True:
                # input from user
                message = input().strip()
                # skip empty messages
                if not message:
                    continue

                self.send_message(message)
                # if the user types "quit", we break the loop and disconnect
                if message.lower() == "quit":
                    send_message(self.client_socket, MESSAGE_TYPE_QUIT, {"message": "quit"})
                    time.sleep(0.5)
                    break
                else:
                    send_message(self.client_socket, MESSAGE_TYPE_CHAT, {"message": message})

        # exit gracefully on Ctrl+C (SIGINT)
        except KeyboardInterrupt:
            print("\n[CLIENT] Leaving from warkop...")

    # ====================================================================================================
    # @brief: Close the client socket to disconnect from the server.
    # ====================================================================================================
    def disconnect(self):
        if self.client_socket:
            self.client_socket.close()
            print("[CLIENT] Disconnected from Warkop. See you next time!\n")
    # Note:
    # close() sends a FIN packet to the server, signaling that we're done.The server's recv() will then 
    # return b"", which it detects as a disconnect.


    
# NOT NEEDED

    # # ====================================================================================================
    # # @brief: Send a message to the server by encoding it to bytes and using the socket's send() method.
    # # @param:
    # #     message: The string message to send to the server.
    # # ====================================================================================================
    # def send_message(self, message: str):
    #     # use sendall() to ensure the entire message is sent 
    #     # (even though size is not an issue for short chat messages)
    #     self.client_socket.sendall(encode(message))

    # # ====================================================================================================
    # # @brief: Receive a message from the server by using the socket's recv() method and decoding 
    # #         the bytes to a string.
    # # @return: The received message as a string, or None if the connection is closed.
    # # ====================================================================================================
    # def receive_message(self) -> str | None:
    #     data = self.client_socket.recv(BUFFER_SIZE)
    #     # if recv() returns empty bytes, the connection is closed
    #     if not data:
    #         return None
    #     return decode(data)
    
