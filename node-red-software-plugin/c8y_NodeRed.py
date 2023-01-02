#!/usr/bin/python3
# coding=utf-8
import logging

logger = logging.getLogger(__name__)
logFile = f'/var/log/{__name__}.log'
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

logger.info(f'Logger for {__name__} was initialised')

import sys
import base64
from api import Connector
from paho.mqtt import client as mqtt_client

broker = 'localhost'
port = 1883
client_id = f'{__name__}-operation-client'

url = 'http://localhost:1880'


array = sys.argv[1].split(",")
data = base64(array[2]).decode('utf-8')
client = mqtt_client.Client(client_id)
client.connect(broker, port)

#10,mqttx_00e62094,BASE64(data)

try:
    client.publish('c8y/s/us',f'501,{__name__}')
    nodeRed = Connector(url)
    logger.debug(nodeRed.check_node_red())
    if nodeRed.check_node_red():
        if nodeRed.get_flow("someid"):
            logger.debug("received flow")
            nodeRed.update_flow("someid","body")
        else:
            nodeRed.create_flow("body")
    else:
        client.publish('c8y/s/us',f'502,{__name__},"Error: Node-Red not running."')
    client.publish('c8y/s/us',f'503,{__name__},')
except Exception as e:
    #client.publish('c8y/s/us',f'502,{__name__},"Error: {e}"')
    pass
