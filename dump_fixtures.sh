#!/bin/bash
python manage.py dumpdata --indent=2 auth.user gwst_app > gwst_app/fixtures/initial_data.json