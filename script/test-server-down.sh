if [ -e .server.pid ]; then
  pid=$(cat .server.pid)
  kill ${pid}
  rm .server.pid
fi
