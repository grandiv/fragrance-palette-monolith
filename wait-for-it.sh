#!/bin/sh
# wait-for-it.sh

set -e

# Parse the host:port parameter
hostport="$1"
host=$(echo $hostport | cut -d : -f 1)
port=$(echo $hostport | cut -d : -f 2)

shift
cmd="$@"

echo "Waiting for $host:$port to be ready..."

# Keep trying until the connection succeeds
until nc -z $host $port; do
  echo "Waiting for $host:$port to be ready..."
  sleep 1
done

echo "$host:$port is up - executing command"
exec $cmd