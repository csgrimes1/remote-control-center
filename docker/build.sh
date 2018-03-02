#!/usr/bin/env bash

set -e
MYDIR=$(cd $(dirname "$0") && pwd)
PROJECTDIR=$(cd "$MYDIR/.." && pwd)
DOCKERFILE="$PROJECTDIR/.dockerfile-build"
IMAGENAME="remote-service"
unset THIN_IMAGE
node "$MYDIR/dockerfile.js" > "$DOCKERFILE"

cd "$PROJECTDIR"
docker build -t "$IMAGENAME" -f "$DOCKERFILE" .
