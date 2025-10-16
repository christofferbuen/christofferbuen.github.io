from livereload import Server

server = Server()
server.watch('**/*', delay=1)
server.serve(root='.', port=9999)  # Change port here if needed
