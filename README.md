# CS554-Final-Project: PlaylistHub

# Our Team
- Robert Brandl
- Areeb Chaudhry
- Linette Santana Encarnacion
- Krystal Hong
- Rivaldo D Silva
# PlaylistHub
Discover, create, and share music playlists with friends. Whether you're searching for curated playlists or eager to share your latest compilation, PlaylistHub has got you covered. With our Single Page Application, you can find songs and create playlists, view playlists and save them to your account, and follow other users to see their custom playlists. You can choose to make your account public (where users can follow you and see/save your playlists) or private!

# Prerequisites
- To run our project, you must have NodeJS, Elasticsearch, Redis, and GraphicsMagick installed.
  1. Follow the steps here to install NodeJS (and npm) based on your system: https://nodejs.org/en/download
  2. For Elasticsearch, follow the instructions here: [Elastic Search](https://www.elastic.co/downloads/elasticsearch?msclkid=f60fbe6acecf172e6690d85d1e5c5da6&utm_campaign=Bing-B-Amer-US&utm_content=Brand-Core-install-EXT&utm_source=bing&utm_medium=cpc&device=c&utm_term=elasticsearch%20install&msclkid=f60fbe6acecf172e6690d85d1e5c5da6) (note for Mac and Windows, you most likely need to install kibana as well, here is the download link: https://www.elastic.co/downloads/kibana)
     - For a quick setup on Ubuntu, try these steps:
     - `wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -`
     -  `sudo sh -c 'echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" > /etc/apt/sources.list.d/elastic-7.x.list'`
     -  `sudo apt-get update`
     -  `sudo apt-get install elasticsearch`
     -  `sudo systemctl start elasticsearch.service`
     - `sudo systemctl enable elasticsearch`
     - `sudo systemctl status elasticsearch` //make sure it says active/running
     - `curl -X GET "localhost:9200/"` // should return json with name, cluster, version, etc.
  3. For redis, use this link and choose your system to install Redis Stack: https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/
  4. For GraphicsMagick, follow this link for general install instructions: http://www.graphicsmagick.org/README.html
     - For a quick install using Ubuntu, run `sudo apt install graphicsmagick`

# Installation
To run our code:
enter or cd into the `CS554-Final-Project` directory
### Backend
1. Open a node command prompt or terminal as an ADMIN/with elevated permissions (if using Windows, search Node.js command prompt and run as administrator; for Linux/Unix, run as sudo)
2. cd to the `backend` directory
3. run the command `npm i`
4. run the command `npm run seed`
5. run the command `npm start` and the server will be running on localhost:3000
### Frontend
1. Open a new node command prompt or terminal
2. cd to the `frontend` directory
3. run the command `npm i`
4. run the command `npm run dev` and the application will be running on localhost:5173, navigate there!!!
# Seed Profiles
