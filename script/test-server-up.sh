if [ -e .server.pid ]; then
  echo "Server seems to already be running (PID $(cat .server.pid))" >&2
  exit 1
fi
http-server -p 38000 build &
echo $! > .server.pid
