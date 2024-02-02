import { useState, useEffect } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import timeFormatter from '../utils/timeFormatter';
import './whitespace-reset.css'
import './App.css'

const APIGETBUCKET = "http://localhost:3000/";
const BASEBUCKET = "http://localhost:3000/b"

function Header() {
  return (
    <header>
      <h1>RAINBUCKET</h1>
    </header>
  )
}
function Bucketbar({bucketPath}) {
  return(
    <section id="bucket-bar">
      <p>Your bucket is: {BASEBUCKET}/{bucketPath}</p>
      <button>copy</button>
      <button>delete</button>
    </section>
  )
}

function Raindrop({ clickHandler, raindrop, activeRaindropId }) {

  return (
    <div className={`raindrop ${activeRaindropId === raindrop.mongo_id ? "active" : ""}`} data-id={raindrop.mongo_id} onClick={clickHandler}>
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
      <div className='raindrops-date-header'>
        <p>January 30, 2024</p>
      </div>
      
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
      <p>{method}</p>
      <p>{path}</p>
    </div>
  )
}

function RaindropHeader({header, value}){
  return (
    <p>{header} -- {value}</p>
  )
}
function RaindropHeadersSection({headers}) {
  let headersArr = Object.keys(headers);
  return(
    <div id='raindrop-headers'>
      <p className="raindrop-detail-heading">Headers</p>
      
      <div>
        { headersArr.map((header, idx) => {
          let value = headers[header]
          return <RaindropHeader key={idx} header={header} value={value} />
        }) }
      </div>
    </div>
  )
}
function RaindropBodySection({payload}) {
  return (
    <div id='raindrop-body'>
      <p className="raindrop-detail-heading">Body</p>
      <pre>
        {JSON.stringify(payload)}
      </pre>
  </div>
  )
}

function RaindropDetails({ activeRaindropId, bucketPath }) {
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
      <section id="raindrop-detail-container">
       <RaindropMethodPathSection method={raindrop.method} path={raindrop.path}/>
       <RaindropHeadersSection headers={raindrop.headers}/>
       <RaindropBodySection payload={raindrop.payload} />
      </section> 
    )
  } else {
    return (
      <section id="raindrop-detail-container">
       <p>Click on a raindrop to inspect it.</p>
      </section> 
    )
  }
 
}

function Main({ bucketPath }) {
  const [ raindrops, setRaindrops ] = useState([]);
  const [ activeRaindropId, setActiveRaindropId ] = useState(null); 
  const ws = new WebSocket("ws://localhost:8888");
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
      <RaindropDetails activeRaindropId={activeRaindropId} bucketPath={bucketPath}/>
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

function RaindropsView({ bucketPath }) {
  return (
    <>
    <Header/>
    <Bucketbar bucketPath={bucketPath}/>
    <Main bucketPath={bucketPath}/>
    <Footer/>
  </>
  )
}

function NewBucketView({ setBucket }) {
  async function buttonHandler(e) {
    let res = await fetch(APIGETBUCKET+"api/bucket/new", { method: "POST", credentials: "include"});
    let data = await res.json();
    setBucket(data);
    // send a request to create new bucket
    // setBucket to response 
  }

  return (
    <>
    <button onClick={buttonHandler}>Create New Bucket</button>
      
    </>
  )
}

function App() {
  // use effect to determine if user has a bucket(?)
  const [bucket, setBucket] = useState({});
  // const [messageHistory, setMessageHistory] = useState([]);

  useEffect(() => {
    (async () => {
      let res = await fetch(APIGETBUCKET, {credentials: "include" });
      let data = await res.json(); // Parse the response data
      setBucket(data); // Pass the response data to setBucket
    })();
  }, []);

  if (bucket.bucketPath) {
    return <RaindropsView bucketPath={bucket.bucketPath} />;
  } else {
    return <NewBucketView setBucket={setBucket} />;
  }
}

export default App
