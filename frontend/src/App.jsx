import { useState, useEffect } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Highlight from 'react-highlight'
import 'highlight.js/styles/base16/humanoid-light.min.css';
import timeFormatter from '../utils/timeFormatter';
import './whitespace-reset.css'
import './App.css'

const APIGETBUCKET = "https://rainbucket.xyz/";
const BASEBUCKET = "https://rainbucket.xyz/b"

function Header() {
  return (
    <header>
      {/* <h1>RAINBUCKET</h1> */}
      <img src='rainbucket-header.svg' alt="rainbucket-logo"></img>
    </header>
  )
}
function Bucketbar({bucketPath}) {
  const copyHandler = (e) => {
    navigator.clipboard.writeText(BASEBUCKET + "/" + bucketPath);
  }
  return(
    <section id="bucket-bar">
      <img src='bucket.svg' alt="bucket"></img>
      <p><span>Your bucket is: </span> <span id="bucketurl">{BASEBUCKET}/{bucketPath}</span></p>
      <button onClick={copyHandler}>copy</button>
      <button>delete</button>
    </section>
  )
}

function Raindrop({ clickHandler, raindrop, activeRaindropId }) {

  return (
    <div className={`raindrop ${activeRaindropId === raindrop.mongo_id ? "active" : ""}`} data-id={raindrop.mongo_id} onClick={clickHandler}>
      <div className='sidebar'></div>
      <p className="timestamp" data-timestamp={raindrop.timestamp}>{raindrop.timestamp}</p>
      <p className="raindrop-method" data-http-method={raindrop.http_method}>{raindrop.http_method}</p>
      <p className="raindrop-path" data-path={raindrop.path}>{raindrop.path}</p>
    </div>
  )
}

function RaindropDayGroup({clickHandler, raindrops, activeRaindropId}) {
  let raindropsList = raindrops.map((raindrop, index) => {
    return <Raindrop key={index} raindrop={raindrop} clickHandler={clickHandler} activeRaindropId={activeRaindropId}/>
  })

  return (
    <div className='raindrops-date'>
      {/* <div className='raindrops-date-header'>
        <p>January 30, 2024</p>
      </div> */}
      
      {raindropsList}

    </div>
  )
}

function Raindrops({clickHandler, raindrops, activeRaindropId}) {
  return(
    <section id="raindrops">
      <h2>raindrops</h2>
      <RaindropDayGroup clickHandler={clickHandler} raindrops={raindrops} activeRaindropId={activeRaindropId}/>
    </section>
  )
}

function RaindropMethodPathSection({method, path}) {
  return (
    <div id="raindrop-details">
      <p className="raindrop-detail-heading">Details</p>
      <p id="rd-method">{method}</p>
      <p>{path}</p>
    </div>
  )
}

function RaindropHeader({header, value}){
  return (
    <tr>
      <td>{header}</td>
      <td>{value}</td>
    </tr>
  )
}
function RaindropHeadersSection({headers}) {
  let headersArr = Object.keys(headers);
  return(
    <div id='raindrop-headers'>
      <p className="raindrop-detail-heading">Headers</p>
      
      <table>
        <tbody>
          { headersArr.map((header, idx) => {
            let value = headers[header]
            return <RaindropHeader key={idx} header={header} value={value} />
          }) }
        </tbody>
      </table>
    </div>
  )
}
function RaindropBodySection({payload}) {
  return (
    <div id='raindrop-body'>
      <p className="raindrop-detail-heading">Body</p>
      <Highlight>
        {JSON.stringify(payload)}
      </Highlight>
  </div>
  )
}

function RaindropDetails({ activeRaindropId, bucketPath, footerClickHandler, aboutVisible }) {
  const [ raindrop, setRaindrop ] = useState(null);
  
  useEffect(() => {
    if (activeRaindropId) {     
      const subpath = `api/bucket/${bucketPath}/raindrop/${activeRaindropId}`;
      (async () => {
        const res = await fetch(APIGETBUCKET + subpath, { credentials: "include"});
        const data = await res.json();
        setRaindrop(data);
      })()
    }
  }, [activeRaindropId]); 

  if (activeRaindropId && raindrop){
    return (
        <div id="rightSection">
          <section id="raindrop-detail-container">
            <RaindropMethodPathSection method={raindrop.method} path={raindrop.path}/>
            {console.log(raindrop.method)}
            <RaindropHeadersSection headers={raindrop.headers}/>
            <RaindropBodySection payload={raindrop.payload} />
          </section> 
          <Footer footerClickHandler={footerClickHandler} aboutVisible={aboutVisible}/>
        </div>
    )
  } else {
    return (
      <div id="rightSection">
        <section id="raindrop-detail-container">
        <p>Click on a raindrop to inspect it.</p>
        </section> 
        <Footer footerClickHandler={footerClickHandler} aboutVisible={aboutVisible}/>
      </div>
    )
  }
 
}

function Main({ bucketPath, footerClickHandler, aboutVisible }) {
  const [ raindrops, setRaindrops ] = useState([]);
  const [ activeRaindropId, setActiveRaindropId ] = useState(null); 
  const ws = new WebSocket("wss://rainbucket.xyz/websocket-server");
  function clickHandler(e) {
    setActiveRaindropId(e.currentTarget.dataset.id);
  }

  useEffect(() => {
    const subpath = `api/bucket/${bucketPath}/raindrop/all`;
    (async () => {
      const res = await fetch(APIGETBUCKET + subpath, {credentials: 'include'});
      const data = await res.json();
      setRaindrops(timeFormatter(data.raindrops));
    })()
  }, []); 

  useEffect(() => {
		const onOpenHandler = () => {
	    ws.send(bucketPath);
    }

		const onMessageHandler = (e) => {
      let raindrop = JSON.parse(e.data);
      setRaindrops((previousRaindrops) => [timeFormatter(raindrop), ...previousRaindrops]);
    }

	  ws.addEventListener("open", onOpenHandler)
    ws.addEventListener("message", onMessageHandler)

		return () => {
      ws.removeEventListener("open", onOpenHandler);
      ws.removeEventListener("message", onMessageHandler);
  	}
  }, [])

  return(
    <main>
      <Raindrops clickHandler={clickHandler} raindrops={raindrops} activeRaindropId={activeRaindropId}/>
      <RaindropDetails activeRaindropId={activeRaindropId} bucketPath={bucketPath} footerClickHandler={footerClickHandler} aboutVisible={aboutVisible}/>
    </main>
  )
}

function Footer({footerClickHandler, aboutVisible}) {
  let message = aboutVisible ? "Go back" : "Made with love 👋";
  return (
    <footer>
      <a onClick={footerClickHandler}>{message}</a>
    </footer>
  )
}

function RaindropsView({ bucketPath, footerClickHandler, aboutVisible }) {
  return (
    <>
    <Header/>
    <Bucketbar bucketPath={bucketPath}/>
    <Main bucketPath={bucketPath} footerClickHandler={footerClickHandler} aboutVisible={aboutVisible}/>
  </>
  )
}

function NewBucketView({ setBucket, footerClickHandler, aboutVisible }) {
  async function buttonHandler(e) {
    let res = await fetch(APIGETBUCKET+"api/bucket/new", { method: "POST", credentials: "include"});
    let data = await res.json();
    setBucket(data);
    // send a request to create new bucket
    // setBucket to response 
  }

  return (
    <>
      <div id="newPage">
        <div id="np-copyContainer">
          <img src='rainbucket.svg' alt="rainbucket-logo"></img>
          <div id="np-text">
            <h1>RAINBUCKET</h1>
            <p>an endpoint to capture and inspect all your requests</p>
          </div>
        </div>
        <button onClick={buttonHandler}>Create New Bucket</button>
      </div>
      <Footer footerClickHandler={footerClickHandler} aboutVisible={aboutVisible}/>
    </>
  )
}

function About({footerClickHandler, aboutVisible}) {
  return (
    <>
      <Header />
      <div id="about-us">
        <img src="teamphoto.png" alt="aww look at us so cute"></img>
      </div>
      <div id="about-us-blurb">
        <h2>brought to you by the power of ✨ friendship ✨</h2>
        <p>(and caffeine, tears, and heaps on heaps of dorky jokes)</p>
        <a href="https://github.com/rainbucket-xyz/rainbucket" target='new'>read our github page →</a>
      </div>
      <Footer footerClickHandler={footerClickHandler} aboutVisible={aboutVisible}/>
      {/* <a> ← Go back</a> */}
    </>
  )
}

function App() {
  const [bucket, setBucket] = useState({});
  const [aboutVisible, setAboutVisible] = useState(false);
 
  function footerClickHandler() {
    setAboutVisible(!aboutVisible);
  }

  useEffect(() => {
    (async () => {
      let res = await fetch(APIGETBUCKET, {credentials: "include" });
      let data = await res.json(); // Parse the response data
      setBucket(data); // Pass the response data to setBucket
    })();
  }, []);
 
  if (aboutVisible) {  
    return(<About footerClickHandler={footerClickHandler} aboutVisible={aboutVisible} />)
  } else {
    if (bucket.bucketPath) {
      return <RaindropsView bucketPath={bucket.bucketPath} footerClickHandler={footerClickHandler} aboutVisible={aboutVisible} />;
    } else {
      return <NewBucketView setBucket={setBucket} footerClickHandler={footerClickHandler} aboutVisible={aboutVisible} />;
    }
  }
}

export default App
