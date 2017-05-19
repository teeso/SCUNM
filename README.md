﻿# SCUNM

This is Script Creation Utility for Nodejs Maniacs; a text adventure game engine and Telegram bot as host, writen in node.js. The engine aims to be easily consumed by a Telegram ChatBot through standarized output that allows text and images (even animated gifs).

Instead of free text input, telegram chat bot will show custom keyboards for verbs and inline buttons for interactive things that the user will use to send commands to the game engine.

The engine also allows you to keep in memory shared game assets for all players and just load and unload the state for each player on request. This is perfect for host the engine on the cloud and use it through stateless protocols.

Game assets are defined in JSON with embedded game scrips and images will be references from any CDN (google drive, dropbox, ms onedrive, etc should work).

WARNING : I am still prototyping and changing everything every days so no pullrequest yet. If you want to discuss something open issue.