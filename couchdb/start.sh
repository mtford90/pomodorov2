#!/bin/sh

DIR="$( cd "$( dirname "$0" )" && pwd )"
couchdb -a ${DIR}/config.ini