# ====================================================================================================
# @file: client/main.py

# the main entry point of the client, which will connect to the server and start the chat loop.

# note: requires the server to be running before starting the client, otherwise it will 
#      fail to connect.
# ====================================================================================================

from network import HarpyStreamClient

# ====================================================================================================
    # @brief: The main function that initializes the HarpyStreamClient, connects to the server, 
    #        and starts the chat loop.
# ====================================================================================================
def main():
    # make sure the host and port match the server's host and port
    client = HarpyStreamClient(host='localhost', port=3012)
    client.connect_to_server()

if __name__ == "__main__":
    main()