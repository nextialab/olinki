# Olinki

Tested on Xubuntu 14.04.

## Setup

Install Docker.

Run

    sudo usermod -a -G docker $USER

to give permissions to Docker.

## Run

Run

    docker build -t <username>/olinki .
    docker run -p 3000:8080 -d <username>/olinki

## Stop

Run ```docker ps``` to list all the running containers and then:

    docker stop <container-name>