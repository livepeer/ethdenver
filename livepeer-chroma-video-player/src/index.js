import React from 'react'
import { render } from 'react-dom'
import { VideoPlayer } from '@livepeer/chroma'

// Change this to 'http://localhost:8935/stream' if you'd like to use
// a local Livepeer node as the source of the video
const STREAM_ROOT_URL = 'https://d194z9vj66yekd.cloudfront.net/stream'

class App extends React.Component {
  state = {
    src: '',
    live: false,
    error: null,
  }
  onLive = () => {
    this.setState({ live: true })
  }
  onDead = () => {
    this.setState({ live: false })
  }
  onError = error => {
    this.setState({ error })
  }
  updateSrc = e => {
    let src = e.clipboardData
      ? e.clipboardData.getData('text/plain')
      : (src = e.target.value)
    console.log(src)
    this.setState({ src })
  }
  render() {
    const { src, live, error } = this.state
    return (
      <div
        style={{
          display: 'flex',
          flexFlow: 'column',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          textAlign: 'center',
          maxWidth: 640,
          margin: '0 auto',
        }}>
        <VideoPlayer
          autoPlay={true}
          src={src ? `${STREAM_ROOT_URL}/${src}.m3u8` : ''}
          onLive={this.onLive}
          onDead={this.onDead}
          onError={this.onError}
        />
        <input
          type="text"
          placeholder="Enter a Manifest or Stream ID"
          onPaste={this.updateSrc}
          onBlur={this.updateSrc}
          onKeyDown={e => {
            if (e.keyCode === 13) this.updateSrc(e)
          }}
          style={{
            display: 'inline-flex',
            width: '100%',
            fontSize: 16,
            border: 0,
            boxShadow: 'rgb(204, 204, 204) 0px 0px 0px 1px',
            margin: '0 auto',
            padding: 16,
            boxSizing: 'border-box',
          }}
        />
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
