import sys
import base64
import json

print(base64.b64decode(sys.argv[1].split(",")[2]).decode('utf-8'))