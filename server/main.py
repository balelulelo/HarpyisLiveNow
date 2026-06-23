# ====================================================================================================
# @file: server/main.py

# the main entry point of the server, which will start the server 
# and listen for incoming requests.
# ====================================================================================================

from server import HarpyStreamServer

# ====================================================================================================
    # @brief: The main function that initializes and starts the WarkopServer.
# ====================================================================================================
def main():
    harpy_server = HarpyStreamServer(host='localhost', port=3012)
    harpy_server.start_server()

if __name__ == "__main__":
    main()