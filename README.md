![GitHub logo](https://user-images.githubusercontent.com/42558699/189666190-f5db907f-aba8-4f2c-8229-b918a1c0e96e.svg)
### An open source, freely deployable League of Legends tournament solution



## Local Compilation Instructions
1. Clone or fork this repository to your local environment
2. Open your terminal of choice and navigate to the /client directory
3. Execute `npm install` and wait for it to finish
4. Execute `next dev` within the same directory
5. Open http://localhost:3000 in your web browser
6. Tournamint should load in your browser. To use your own Upstash and Riot Games API keys, please see the **Deployment Instructions** section
## Deployment Instructions
1. Fork this repository
2. Create [Vercel](https://vercel.com/) Account
3. Create [Upstash](https://upstash.com/) Account
4. Create [Riot Games Developer Account](https://developer.riotgames.com/) and apply for an API key

Create a new project with Vercel by importing your Tournamint fork directly through the provided dialog box.
Navigate to your new project's settings and find the "Environment Variables" tab.
Add your Upstash data to the requested fields
Next, add your Riot Games API key to your fork's /globals/riot_consts.tsx file. This key should start with `'RGAPI-`

Your Tournamint distribution is now live. Edit your fork's code to make changes to your deployment. If you encounter bugs or wish to leave feedback, please open a [Pull Request](https://github.com/Khazoda/tournamint/pulls) or add an issue to the [Issue Tracker](https://github.com/Khazoda/tournamint/issues)

