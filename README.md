## About The Project
This is the default fulfillment for a Dialogflow agents using Cloud Functions for Firebase.
In this example a public API is used to retrive weather forecast information and send back to the user


## Getting Started

### Prerequisites
Set up Node.js and the Firebase CLI
Follow the instruction on how to install firebase cli from the official coumentation here
https://firebase.google.com/docs/functions/get-started#set-up-node.js-and-the-firebase-cli

Create a new firebase project and note down the project id

### Installation
1. Get a free API Key at [https://openweathermap.org/](https://openweathermap.org/)
2. Clone the repo
   ```sh
   git clone https://github.com/wondersys/wonder-meteo-bot
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Configure the project
Edit the project name on .firebaserc
   ```sh
   firebase use <PROJECT_ID>
   ```
5. Add your openweathermap API Key to firebase function config
   ```sh
   firebase functions:config:set openweathermap.apikey=<API_KEY>
   ```
6. Deploy
    ```sh
   npm run deploy
   ```

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Simone Bracaloni - simone.bracaloni@wonder-sys.com

Project Link: [https://github.com/wondersys/wonder-meteo-bot](https://github.com/wondersys/wonder-meteo-bot)

Web Site: [https://www.wonder-sys.com](https://www.wonder-sys.com)