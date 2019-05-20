# a-streaming

This component allows to stream (video only for now) to potentially any service, like YouTube, Facebook or even Twitch.

![GIF](https://media.giphy.com/media/82YkcQuXHfAVkh6ZeA/giphy.gif)

### Properties
| Property | Description | Default value|
|--|--|--|
|fps| frames per second |60|
|dumpTimeFrequency|The number of milliseconds to record into each [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob "A Blob object represents a file-like object of immutable, raw data. Blobs represent data that isn't necessarily in a JavaScript-native format. The File interface is based on Blob, inheriting blob functionality and expanding it to support files on the user's system.")|500|
|mimeType|The mime type you want to use as the recording container for the new|video/webm|
|videoBitsPerSecond|The chosen bitrate for the video component of the media|15000000|
|service|TO BE IMPLEMENTED|dev|
|server_url|Encoding server URL|ws://localhost:3000|
|stream_url|Streaming URL|rtmp://localhost/live/STREAM_DEV|

### Installation

#### Browser

### Usage

To use with [a-streaming-server](https://github.com/LewisFreitas/a-streaming-server)
