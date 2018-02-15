import React from 'react'
import { render } from 'react-dom'
/**
 * Livepeer SDK documentation can be found at...
 * https://livepeer.github.io/livepeerjs/sdk/
 */
import LivepeerSDK from '@livepeer/sdk'

class App extends React.Component {
  state = {
    loading: true,
    transcoders: [],
  }
  async componentDidMount() {
    const sdk = await LivepeerSDK()
    this.setState({
      loading: false,
      transcoders: await sdk.rpc.getTranscoders(),
    })
  }
  render() {
    const { transcoders, loading } = this.state
    const total = transcoders.length
    return (
      <div style={{ fontFamily: 'sans-serif', textAlign: 'left' }}>
        <h1>Livepeer Transcoders {!loading && `(${total})`}</h1>
        <div>
          {/* loading state */}
          {loading && 'Loading transcoders...'}
          {/* transcoder list */}
          {transcoders.map(transcoder => (
            <pre key={transcoder.address}>
              <code>{JSON.stringify(transcoder, null, 2)}</code>
              <hr />
            </pre>
          ))}
        </div>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
