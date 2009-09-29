#!/bin/bash

EXPECTED_ARGS=1
E_BADARGS=65

if [ $# -ne $EXPECTED_ARGS ]
then
  echo "Expected argument with fixture file to load from fixtures directory"
  exit $E_BADARGS
fi

python manage.py loaddata fixtures/$1