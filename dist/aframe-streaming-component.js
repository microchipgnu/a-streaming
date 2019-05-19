(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

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
      mimeType: { default: 'video/webm;codecs=h264' },
      videoBitsPerSecond: { default: 15000000 },

      service: { default: 'local' },
      server_url: { default: 'ws://localhost:3000' },
      stream_url: { default: 'rtmp://localhost/live/STREAM_DEV' },
    },

    init: function() {
      const el = this.el;

      this.connect = this.connect.bind(this);

      el.addEventListener('startstreaming', () => {
        this.connect(this.data.service);
      });
    },

    update: function() {},

    connect: function(service) {
      // can be used to add services here
      switch (service) {
        case 'fb':
        case 'youtube':
        case 'local':
          this.stream();
          break
        default:
          this.stream();
          break
      }
    },

    stream: function() {
      const el = this.el;

      // Regex checker for passed URLs
      const server_url_regex = /^((ws):\/\/([a-zA-Z]+)|(ws):\/\/([a-zA-Z]+):([0-9]+))$$/;
      // It works for any passed protocol (RMTP, ...)
      const stream_url_regex = /^(([a-zA-Z]+):\/\/([a-zA-Z]+):([0-9]+)\/([[:ascii:]]+)|([a-zA-Z]+):\/\/([a-zA-Z]+)\/([[:ascii:]]+))$/;

      if (
        this.data.server_url.match(server_url_regex) &&
        this.data.stream_url.match(stream_url_regex)
      )
        console.table(this);

      const uri = `${this.data.server_url}/rtmp/${
      this.data.service
    }/${encodeURIComponent(this.data.stream_url)}`;

      console.log(uri);

      this.ws = new WebSocket(uri);

      this.ws.addEventListener('open', e => {
        /**
         * Canvas will be streamed at a specified framerate.
         */
        this.stream = el.sceneEl.canvas.captureStream(this.data.fps);

        this.recorder = new MediaRecorder(this.stream, {
          mimeType: this.data.mimeType,
          videoBitsPerSecond: this.data.videoBitsPerSecond,
        });

        this.recorder.ondataavailable = e => {
          this.ws.send(e.data);
        };

        this.recorder.onstop = e => this.ws.close.bind(this.ws);

        this.recorder.start(this.data.dumpTimeFrequency);
      });

      this.ws.addEventListener('close', e => {
        this.recorder.stop();
      });
    },
  });

}));
