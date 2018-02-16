# Livepeer at ETHDenver

Livepeer is going to be at [ETHDenver](http://ethdenver.com) presenting and helping developers get started building video enabled DApps.

## Getting Started Building on Livepeer

The instructions below will help you learn how to hack on
Livepeer. Before diving in, it's worth understanding the high level of
what the steps will be to get a hack working.

1. Run a Livepeer node. Simply download the binaries, get some testnet
ETH, and run `livepeer -testnet`.
2. Broadcast into the node using [OBS](http://obsproject.com) or a
   mobile app like [ManyCam](http://manycam.com) by setting the RTMP
   output to rtmp://localhost:1935/
3. Build your DApp and have it pull video from the Livepeer
   network. The example player in the
   [player-example](player-example) directory can be used as a
   starting point, or if you prefer a React.js component player check out the [livepeer-chroma-video-player example](https://github.com/livepeer/ethdenver/tree/master/livepeer-chroma-video-player).

Check out the
[Getting Started Section in the Livepeer Docs](http://livepeer.readthedocs.io/en/latest/getting_started.html)
for more specific directions as to how to do the above.

![Livepeer Screenshot](https://discourse-cdn-sjc2.com/standard13/uploads/livepeer/original/1X/526d008ab75a28fa143c1db6fa7183e0dd8c9919.jpg)

## DApp/Hack Ideas

- Mobile Player Android App
- Mobile Player iOS App
- Payment channel based payments micropayments for pay-as-you-go streaming
- Tip With Eth via Metamask
- "Report this content to the community" Mechanism
- Livestream Your Own Desktop
- Interactive chat
- Incentivized live coding
- 24-hr live Ethereum talk show
- Decentralized object detection on video streams
- Decentralized reputation system for broadcasters and/or transcoders

## Need Help? Get in Touch

Doug and Yondon from Livepeer will be on site. Find us on the [Livepeer Gitter Chatroom](https://gitter.im/livepeer/Lobby) as @dob and @yondonfu.
