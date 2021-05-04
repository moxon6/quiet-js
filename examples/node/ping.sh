#!/bin/bash

curl --request POST 'http://localhost:3000/output' \
--header 'Content-Type: application/json' \
--data-raw '{
    "message": "This is my node-express sample message"
}'