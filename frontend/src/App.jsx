import { useState, useEffect } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Highlight from 'react-highlight'
// import 'highlight.js/styles/default.css';
import 'highlight.js/styles/base16/humanoid-light.min.css';
import './whitespace-reset.css'
import './App.css'

const APIGETBUCKET = "http://localhost:3000/"; // Replace with the correct API endpoint
const BASEBUCKET = "http://localhost:3000/b"
// const SOCKETURL = "wss://localhost:8888";

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
        { headersArr.map((header, idx) => {
          let value = headers[header]
          return <RaindropHeader key={idx} header={header} value={value} />
        }) }
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

function RaindropDetails({ activeRaindropId, bucketPath }) {
  const [ raindrop, setRaindrop ] = useState(null);
  
  useEffect(() => {
    console.log("raindropdetails: ",activeRaindropId);
    if (activeRaindropId) {     
      const subpath = `api/bucket/${bucketPath}/raindrop/${activeRaindropId}`;
      (async () => {
        const res = await fetch(APIGETBUCKET + subpath, { credentials: "include"});
        const data = await res.json();
        console.log(data)
        setRaindrop(data); // {headers: {}, payload: {}}
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

/* [
  "1/24/24 5:55:33AM"
    { jan 24, 2024: [{timestamp: "5:55:33pm", method:"GET", path: "/"}, {}, {}]}
    { jan 25, 2024: [{}, {}, {}]}
    ]

  // SELECT * FROM raindrops
     WHERE bucket_id = bucketId

*/

function Main({ bucketPath }) {
  const [ raindrops, setRaindrops ] = useState([]);
  const [ activeRaindropId, setActiveRaindropId ] = useState(null); // mongo_id of a specific raindrop
  // const { sendMessage, lastMessage, readyState } = useWebSocket("wss://localhost:8888"); // use "onOpen" option to send bucketPath
  const ws = new WebSocket("ws://localhost:8888");
  // sendMessage(bucketPath)
  function clickHandler(e) {
    setActiveRaindropId(e.currentTarget.dataset.id);
  }

  useEffect(() => {
    const subpath = `api/bucket/${bucketPath}/raindrop/all`;
    (async () => {
      const res = await fetch(APIGETBUCKET + subpath, {credentials: 'include'});
      const data = await res.json();
      setRaindrops(data.raindrops);
    })()
  }, []); 

  useEffect(() => {
    ws.addEventListener("open", () => {
      console.log("We are connected!");
      ws.send(bucketPath);
    })
  
    ws.addEventListener("message", (e) => {
      // e.data == data
      let raindrop = JSON.parse(e.data);
      console.log(raindrop);
      console.log(raindrops);
      setRaindrops([raindrop, ...raindrops]);
      console.log('raindrop received');
    })
  }, [])
  
  // OLD REACT WEBSOCKET BULLSHIT
  // useEffect(() => {
  //   if (lastMessage !== null) {
  //     setRaindrops(raindrops.concat(lastMessage));
  //   }
  // }, [lastMessage]);


  // headers: {
  //   'Bucket-Path': 'fhsiuhfsdius'
  // }
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
      <a href="">Made with love 👋</a>
    </footer>
  )
}

function RaindropsView({ bucketPath }) {
  return (
    <>
    <Header/>
    <Bucketbar bucketPath={bucketPath}/>
    <Main bucketPath={bucketPath}/>
    {/* <Footer/> */}
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
      // redirect: 'follow'
      console.log(res)
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
