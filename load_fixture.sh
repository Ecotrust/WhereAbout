#!/bin/bash

EXPECTED_ARGS=1
E_BADARGS=65

if [ $# -ne $EXPECTED_ARGS ]
then
  echo "Expected argument with fixture file to load from fixtures directory"
  exit $E_BADARGS
fi

export PYTHONPATH=$PYTHONPATH:/usr/local/django-trunk/:/usr/local/django-apps/:.
python manage.py loaddata $1