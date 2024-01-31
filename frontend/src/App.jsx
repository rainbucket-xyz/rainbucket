import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './whitespace-reset.css'
import './App.css'
function Header() {
  return (
    <header>
      <h1>RAINBUCKET</h1>
    </header>
  )
}
function Bucketbar() {
  return(
    <section id="bucket-bar">
      <p>Your bucket is: www.rainbucket.xyz/b/dajsndiuSDisfusfdn</p>
      <button>copy</button>
      <button>delete</button>
    </section>
  )
}

function Raindrop() {
  return (
    <div className="raindrop">
      <p className="timestamp">5:34:23 PM</p>
      <p className="raindrop-method">POST</p>
      <p className="raindrop-path">/star/musical</p>
    </div>
  )
}

function RaindropDayGroup() {
  return (
    <div className='raindrops-date'>
      <div className='raindrops-date-header'>
        <p>January 30, 2024</p>
      </div>
      <Raindrop />
      <Raindrop />
      <Raindrop />
    </div>
  )
}

function Raindrops() {
  return(
    <section id="raindrops">
        <h2>raindrops</h2>
        <RaindropDayGroup />
        <RaindropDayGroup />
        <RaindropDayGroup />
      </section>
  )
}

function RaindropDetails() {
  return (
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
  )
}

function Main() {
  return(
    <main>
      <Raindrops />
      <RaindropDetails />
    </main>
  )
}

function Footer() {
  return (
    <footer>
      <a href="">Made with love</a>
    </footer>
  )
}

function RaindropsView() {
  return (
    <>
    <Header/>
    <Bucketbar/>
    <Main/>
    <Footer/>
  </>
  )
}

function NewBucketView() {
  return (
    <>

    </>
  )
}
function App() {
  // use effect to determine if user has a bucket(?)
  const hasBucket = true;
  if (hasBucket) {
    return <RaindropsView/>
  } else {
    return <NewBucketView/>
  }
}

export default App
