import React from 'react'

import Vis from './VisWithClass'
import Percent from './Percent'
// import Vis from './VisWithHooks'

const App = () => (
  // let currentTime = Date.now()
  <div className="app">
    <h1>Three JS React Component</h1>
    {/* <input type="number" min="0" max="100"/> */}
    <Vis time="9"/>
  </div>
)

export default App
