/* global AFRAME THREE */

if (typeof AFRAME === 'undefined') {
  throw new Error(
    'Component attempted to register before AFRAME was available.'
  )
}

AFRAME.registerComponent('streaming', {
  schema: {
    fps: { default: 60 },
    dumpTimeFrequency: { default: 500 },
    mimeType: { default: 'video/webm' },
    videoBitsPerSecond: { default: 15000000 },

    service: { default: 'dev' },
    server_url: { default: 'ws://localhost:3000' },
    stream_url: { default: 'rtmp://localhost/live/STREAM_DEV' },
  },

  init: function() {
    const el = this.el

    this.connect = this.connect.bind(this)

    el.addEventListener('startstreaming', () => {
      this.connect(this.data.service)
    })
  },

  update: function() {},

  connect: function(service) {
    // can be used to add services here
    switch (service) {
      case 'fb':
      case 'youtube':
      case 'dev':
        this.stream()
        break
      default:
        this.stream()
        break
    }
  },

  stream: function() {
    const el = this.el

    // Regex checker for passed URLs
    const server_url_regex = /^((ws):\/\/([a-zA-Z]+)|(ws):\/\/([a-zA-Z]+):([0-9]+))$$/
    // It works for any passed protocol (RTMP, ...)
    const stream_url_regex = /^(([a-zA-Z]+):\/\/([a-zA-Z]+):([0-9]+)\/([[:ascii:]]+)|([a-zA-Z]+):\/\/([a-zA-Z]+)\/([[:ascii:]]+))$/

    if (!this.data.server_url.match(server_url_regex))
      throw Error('Encoding server is not a valid one.')
    // if (!this.data.stream_url.match(stream_url_regex))
    //   throw Error('Streaming server is not a valid one.')

    const uri = `${this.data.server_url}/rtmp/${
      this.data.service
    }/${encodeURIComponent(this.data.stream_url)}`

    this.ws = new WebSocket(uri)

    this.ws.addEventListener('open', e => {
      this.stream = el.sceneEl.canvas.captureStream(this.data.fps)

      this.recorder = new MediaRecorder(this.stream, {
        mimeType: this.data.mimeType,
        videoBitsPerSecond: this.data.videoBitsPerSecond,
      })

      this.recorder.addEventListener('dataavailable', e => {
        console.log(
          `Sending data to ${this.data.server_url}. Stream is available at ${
            this.data.stream_url
          }`,
          e.data
        )
        this.ws.send(e.data)
      })

      this.recorder.addEventListener('stop', this.ws.close.bind(this.ws))

      this.recorder.start(this.data.dumpTimeFrequency)
    })

    this.ws.addEventListener('close', e => {
      console.log(e)
      this.recorder.stop()
    })
  },
})
