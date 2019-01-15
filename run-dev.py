#!/usr/bin/python
from dotenv import load_dotenv
from os.path import join, dirname
dotenv_path = join(dirname(__file__), '.env')

load_dotenv(dotenv_path,verbose=True)

from app import flaskapp
flaskapp.run()
