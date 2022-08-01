import React, { useEffect, useState } from 'react'

function Percent() {
  const [timePercent, setTimePercent] = useState(0);

  function handleClick () {
    setTimePercent(document.getElementById("percentage").value)
    console.log(document.getElementById("percentage").value)
  };

  return (
    <div>
        <input id="percentage" value={timePercent}/>
        <button onClick={handleClick}>Change Input</button>
    </div>
  )
}

export default Percent