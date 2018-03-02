#!/usr/bin/env bash

set -e
MYDIR=$(cd $(dirname "$0") && pwd)
cd $MYDIR/..

if [ ! -d "node_modules" ]; then
    npm install
fi
"$@"
