from random import choice
import string

def GenPasswd(length=10, chars=string.letters + string.digits):
    return ''.join([choice(chars) for i in range(length)])