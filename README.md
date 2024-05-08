# CS554-Final-Project: PlaylistHub
### Link to our Repo: [PlaylistHub](https://github.com/robertbrandl/CS554-Final-Project)

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
  5. For authentication, we used Firebase to perform email/password sign in and social sign in. The .env file is included in our project submission in the frontend folder but not the github repository. Similarly, we used Cloudinary for storage of our playlist cover images that users can enter; this .env file is included in our project submission in the backend folder but not in the repo.

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
## How to Use Our Project
- On the homepage (at localhost:5173), you can choose to browse through songs, using the search bars to find songs you like (by either the track name, artist name, album name, and/or label name) and clicking on songs in the results to find out more about the song, including other songs by the same artist. Or, you can see the list of all public playlists (playlists from users who have a public profile) and find out more information about each playlist. However, to save a playlist or create your own, you must login or create an account, either by email and password, or through social sign in with either Google, Facebook, or Github!
- Once you are logged in, you will be able to see your account details in your account, which includes your list of followed users and your list of saved playlists, as well as reset your password through an email (through Firebase). You can also set your account to public or private, where public means you can be followed by other users and your playlists will be available in the main sharing list and private means you can't be followed and your playlists remain hidden.
- You can once again browse songs, but this time you can add a song to a playlist, either an existing playlist or to create your own. When you create a playlist, you must add a title, a playlist cover image, and a genre (or choose "No Genre"). Then, you can add a song to the new playlist!
- On the all playlists page, you can see all playlists created by users with public profiles. You can search through them using the search bar, sort them in ascending or descending order by title, user name, or date created, or filter them by genre. For all playlists that you did not make, you can save them to your list of saved playlists, or unsave them.
  - When you click on a playlist, you will get more details about them, such as genre, runtime, and a list of songs with links to view each song page. The save/unsave button can also be used here.
  - Each playlist also has a link for the user profile where their name is. When you click the link, you can see the user's public profile, their full list of playlists, and the follow/unfollow button. When you follow a user, they will appear in your followed users list in your account, and their playlists will appear on the page with playlists from your followed accounts!
- When you view the playlists page from followed accounts, you will have all the same options as the all playlists page.
- On the page to view your playlists, you can see the full list of playlists you created with the option to create a new playlist, or edit a playlist or delete a playlist. When you click on a playlist that you made, you can still edit or delete the playlist, but you can also delete songs from the playlist!
- Finally, on the user statistics page, you can find information about how many playlists you've made, how many followers you have, how many songs per artist you have added to a playlist, and more! 
## Sample User Accounts (seeded)
- User 1 - email: robert@email.com; password: password123!
- User 2 - email: krystal@email.com; password: password123!
- User 3 - email: linette@email.com; password: password123!
- User 4 - email: rivaldo@email.com; password: password123!
- User 5 - email: areeb@email.com; password: password123!
