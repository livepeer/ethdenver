# Livepeer Player Example

Use the player in this directory as a getting started point for embedding video in your own dapps.

## Install and run the player

`git clone https://github.com/livepeer/ethdenver.git`
`cd ethdenver/player-example`
`npm install -g serve`
`serve .`

Visit the player in your browser at http://localhost:5000/player.html

The player can now pull any stream off the Livepeer network (including your own local node) if you have the stream's manifest ID.

You can also access the player with a specific stream manifest ID in the URL already using the `strmID` param, so for example http://localhost:5000/player.html?strmID=<paste streamID here>

## Streaming into Livepeer

Use the instructions on the [README for this repo](/) and the [Livepeer Docs](http://livepeer.readthedocs.io) to get a Livepeer node up and running, and stream into it using OBS, Manycam, or any broadcasting tool of your choice.

## Modifying the player.

The two main files to edit are player.html and static/js/player.js.

In player.js you'll see that the `start()` function calls `loadNetworkVideo(strmID)` and this method uses the streamID to make a request to your local livepeer node running at http://localhost:8935 in order to pull the stream into the player.

You likely don't even have to edit this unless you want to do custom stuff with the video. You can drop the `<div id="network_video_div"><video id="network-video" style="margin-top: 20px" autoplay></video></div>` from the player into any UI that you like and embed video using these methods.

## Need help?

Drop into the [Livepeer Gitter Chat](https://gitter.im/livepeer/Lobby) and we will be happy to answer questions and help you hack.
