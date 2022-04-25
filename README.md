# In Flames Closet

A simple NextJs project to handle a database of images, about the history of the band "In Flames" through their artworks.

Check it out [here](<https://github.com/KirianCaumes/In-Flames-Closet>) 👈

## How to run the project?

### Setup .env

You only need create a `.env` file according to the `.env.example` file.

### Setup development environment

Run Visual Studio Code

Install "ms-vscode-remote.remote-containers" extension

Open Visual Code in Container : click green icon on bottom left screen, and choose "Open in Container"

Wait for container to setup, and that's it

#### Run in dev

```sh
cd ./front
npm i #Only first name
```

Then, go to debuger (Play Icon with a bug) and choose "Start" (Chrome required).

### Run in prod

After preparing the `.env` file, run this:

```sh
npm run build
npm start
```
