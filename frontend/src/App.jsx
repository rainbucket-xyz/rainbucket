import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './whitespace-reset.css'
import './App.css'

function App() {
  // const [count, setCount] = useState(0)
  const hasBucket = true;
  // use effect to determine if user has a bucket(?)
  if (hasBucket) {
    return (
      <>
        <header>
          <h1>RAINBUCKET</h1>
        </header>
        <section id="bucket-bar">
            <p>Your bucket is: www.rainbucket.xyz/b/dajsndiuSDisfusfdn</p>
            <button>copy</button>
            <button>delete</button>
        </section>
        <main>
          <section id="raindrops">
            <h2>raindrops</h2>
            <div className='raindrops-date'>
              <div className='raindrops-date-header'>
                <p>January 30, 2024</p>
              </div>
              <div className="raindrop">
                <p className="timestamp">5:34:23 PM</p>
                <p className="raindrop-method">POST</p>
                <p className="raindrop-path">/star/musical</p>
              </div>
              <div className="raindrop">
                <p className="timestamp">4:00:23 PM</p>
                <p className="raindrop-method">GET</p>
                <p className="raindrop-path">/</p>
              </div>
            </div>
           
          </section>
          <section id="raindrop-detail-container">
            <div id="raindrop-details">
              <p className="raindrop-detail-heading">Details</p>
              <p>POST</p>
              <p>/star/musical</p>
            </div>
            <div id='raindrop-headers'>
              <p className="raindrop-detail-heading">Headers</p>
              <div>
                Some headers here
              </div>
            </div>
            <div id='raindrop-body'>
              <p className="raindrop-detail-heading">Body</p>
              <pre>
                some stuff here
              </pre>
            </div>
          </section>
        </main>
        <footer>
          <a>Made with love</a>
        </footer>
      </>
    ) 
  } else {
    return (
      <>
      
      </>
    )
  }
 
    // <>
    //   <div>
    //     <a href="https://vitejs.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.jsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    // </>
}

export default App
