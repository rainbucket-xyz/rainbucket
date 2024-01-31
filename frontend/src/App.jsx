import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './whitespace-reset.css'
import './App.css'
const APIGETBUCKET = "http://localhost:3000/"; // Replace with the correct API endpoint
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

function Raindrop({ raindrop }) {

  return (
    <div className="raindrop" data-id={raindrop.mongo_id}>
      <p className="timestamp" data-timestamp={raindrop.timestamp}>{raindrop.timestamp}</p>
      <p className="raindrop-method" data-http-method={raindrop.http_method}>{raindrop.http_method}</p>
      <p className="raindrop-path" data-path={raindrop.path}>{raindrop.path}</p>
    </div>
  )
}

function RaindropDayGroup({raindrops}) {
  let raindropsList = raindrops.map((raindrop, index) => {
    return <Raindrop key={index} raindrop={raindrop}/>
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

function Raindrops({raindrops}) {
  return(
    <section id="raindrops">
        <h2>raindrops</h2>
        <RaindropDayGroup raindrops={raindrops}/>
      </section>
  )
}

function RaindropDetails({ activeRaindrop }) {
  const [ payload, setPayload ] = useState(null);
  
  useEffect(() => {
    console.log("raindropdetails: ",activeRaindrop.data.id);

    const subpath = `api/bucket/${bucketPath}/raindrop/${activeRaindrop.data.id}`;
    // (async () => {
    //   const res = await fetch(APIGETBUCKET + subpath);
    //   const data = await res.json();
    //   setPayload(data); // {headers: {}, payload: {}}
    // })()
  }, []); 

  if (activeRaindrop){
    return (
      <section id="raindrop-detail-container">
        <div id="raindrop-details">
          <p className="raindrop-detail-heading">Details</p>
          <p>{}</p>
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
  const [ activeRaindrop, setActiveRaindrop ] = useState(null);
  
  function clickHandler(e) {
    // if activeRaindrop isnt null, remove className active from old active raindrop
    // set the className of clicked raindrop
    // set active raindrop to clicked raindrop
  }

  useEffect(() => {
    const subpath = `api/bucket/${bucketPath}/raindrop/all`;
    (async () => {
      const res = await fetch(APIGETBUCKET + subpath);
      const data = await res.json();
      setRaindrops(data.raindrops);
    })()
  }, []); 

  return(
    <main>
      <Raindrops clickHandler={clickHandler} raindrops={raindrops}/>
      <RaindropDetails activeRaindrop={activeRaindrop}/>
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
    let res = await fetch(APIGETBUCKET+"api/bucket/new", { method: "POST"});
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

  useEffect(() => {
    (async () => {
      let res = await fetch(APIGETBUCKET, { redirect: 'follow' });
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
