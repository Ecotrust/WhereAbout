#!/bin/bash

EXPECTED_ARGS=1
E_BADARGS=65

if [ $# -ne $EXPECTED_ARGS ]
then
  echo "Expected argument with file to save fixture as"
  exit $E_BADARGS
fi

python manage.py dumpdata --indent=2 auth.User gwst_app.InterviewGroupMembership gwst_app.GroupMemberResource gwst_app.InterviewAnswer gwst_app.InterviewStatus gwst_app.InterviewShape > gwst_app/fixtures/$1