#!/usr/bin/env bash

set -e
MYDIR=$(cd $(dirname "$0") && pwd)
PROJECTDIR=$(cd "$MYDIR/.." && pwd)
DOCKERFILE="$PROJECTDIR/.dockerfile-local"
IMAGENAME="tvr-local"
export THIN_IMAGE=true
node "$MYDIR/dockerfile.js" > "$DOCKERFILE"

cd "$PROJECTDIR"
docker build -t "$IMAGENAME" -f "$DOCKERFILE" .

CONTAINERNAME=$1
shift
docker run \
  -v "$PROJECTDIR:/usr/app" \
  -v "$HOME/.remote-control-center:/root/.remote-control-center" \
  --net=host \
  --rm -it --name "$CONTAINERNAME" "$IMAGENAME" \
  bin/start.sh "$@"
