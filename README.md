# Olinki

Docker based projects management. Tested on Xubuntu 14.04.

## Setup

Create a .env file with the fields:

    ACCOUNT=<your_username>
    PASSWORD=<your_hashed_password_with_bcrypt>
    SECRET_KEY=<your_secret_key_for_cookies>
    GITUSER=<your_github_username>
    DBHOST=<your_mysql_db_url_usually_localhost>
    DBNAME=<your_mysql_db_name>
    DBUSER=<your_mysql_user>
    DBPASS=<your_mysql_user_password>

<!---
## Run with Docker

Install Docker.

Run

    sudo usermod -a -G docker $USER

to give permissions to Docker.

Then run

    docker build -t <username>/olinki .
    docker run -p 3000:8080 -d <username>/olinki

You can now login in ```localhost:3000``` using the credentials in the .env file. You can omit the ```-d``` flag to debug directly in the terminal.

### Stop

Run ```docker ps``` to list all the running containers and then:

    docker stop <container-name>

-->
## Run with Node

Requires Node 6 and MySQL.

Install dependencies:

    npm install

Build front end:

    npm run build

Run the database migrations with:

    npm run migrate

Then run:

    npm start

And go to ```localhost:8080```
