import React, { useEffect, useState, useRef } from "react"
import useInterval from "./hooks/useInterval"
import { nanoid } from 'nanoid'
import { act } from "react-dom/test-utils"

function App() {

  const floors = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4]
  const elevatorButtons = [0,1,2,3,4]
  const revFloors = floors.reverse()

  const [elevatorLocation, setElevatorLocation] = useState(0)
  const [activeRequest, setActiveRequest] = useState()
  const [isDoorOpen, setIsDoorOpen] = useState(true)
  const [isWaiting, setIsWaiting] = useState(false)
  const [queue, setQueue] = useState([])

  function callElevator(floorNr, origin) {
    if(origin === 'elevator'){
      if(isWaiting){
        if(floorNr === elevatorLocation && isDoorOpen){
          return
        } else {
          if(queue.includes(floorNr)){
            return
          } else {
            setQueue(prevQueue => [...prevQueue, floorNr])
          }
        }
      }
    }
    else if(origin === 'floor'){
      if(floorNr === elevatorLocation && isDoorOpen){
        return
      } else {
        if(queue.includes(floorNr)){
          return
        } else {
          setQueue(prevQueue => [...prevQueue, floorNr])
        }
      }
    } 
    
  }
  
  function moveElevator(){
    const currentLocation = elevatorLocation
    const nextLocation = queue.length > 0 ? queue[0] : 0
    setActiveRequest(nextLocation)
    setIsDoorOpen(false)
    console.log("moveElevator() | QueueItem cleared, activeRequest set!")
    let counter = 0
    if(currentLocation > nextLocation){
      const difference = currentLocation - nextLocation
      const loop = setInterval(() => {
        if(counter === (difference * 2) - 1){
          clearInterval(loop)
          setActiveRequest()
          setIsDoorOpen(true) 
          setQueue(prevQueue => prevQueue.filter(item => item !== nextLocation))
          setIsWaiting(true)
          setTimeout(() => {
            setIsWaiting(false)
          }, 5000)   
          console.log("moveElevator() | ActiveRequest cleared")  
        }
        setElevatorLocation(prevLocation => prevLocation - 0.5)
        counter++
      }, 2000)
    } else {
      const difference = nextLocation - currentLocation
      const loop = setInterval(() => {
        if(counter === (difference * 2) - 1){
          clearInterval(loop)
          setActiveRequest()
          setIsDoorOpen(true)
          setQueue(prevQueue => prevQueue.filter(item => item !== nextLocation))
          setIsWaiting(true)
          setTimeout(() => {
            setIsWaiting(false)
          }, 5000)    
          console.log("moveElevator() | ActiveRequest cleared")
        }
        setElevatorLocation(prevLocation => prevLocation + 0.5)
        counter++
      }, 2000)
    }
  }

  function clearQueue(){
    setQueue([])
  }
 
  useInterval(() => {
    if(queue.length > 0){
      if(!isWaiting){
        if(!activeRequest && activeRequest !== 0){
          console.log("useInterval() | no activeRequest, moving elevator!")
          moveElevator()
        } else if(activeRequest) {
          console.log("useInterval() | Active request already being handled")
        }
      }
    }
  }, 1000)

  return (
    <div className="main-cont">
    <div className="queue">
      <p>isWaiting: {isWaiting ? 'true' : 'false'}</p>
      <p>isDoorOpen: {isDoorOpen ? 'true' : 'false'}</p>
      <p>ActiveRequest: {activeRequest}</p>
      <p>Queue: </p>
      {queue.map(item => (<p>{item}</p>))}
    </div>
      <div className={`elevator-control ${isDoorOpen ? 'open' : 'closed'}`}>
        <button onClick={clearQueue}>Clear queue</button>
        <div>
          {/* <div onClick={() => callElevator(3)} className={`button`}>3</div>
          <div onClick={() => setElevatorLocation(4)} className="button">4</div>
          <div onClick={() => callElevator(1)} className="button">1</div>
          <div onClick={() => callElevator(2)} className="button">2</div>
          <div onClick={() => callElevator(0)} className="button ground">0</div> */}
          {elevatorButtons.map(floor => {
            return (<div onClick={() => callElevator(floor, 'elevator')} className={`button ${queue.includes(floor) ? 'open' : 'closed'} ${floor === activeRequest && 'activeRequest'}`}>{floor}</div>)
          })}
          <p>{elevatorLocation}</p>
        </div>
      </div>
      <div className="elevator-cont">
        <div className="elevator">
          {revFloors.map(floor => {
          if(Number.isInteger(floor)){
            return (<div className="floor">{floor === elevatorLocation && <div className={`cabin ${isDoorOpen ? 'open' : 'closed'}`}/>}</div>)
          } else {
            return (<div className="shaft">{floor === elevatorLocation && <div className={`cabin ${isDoorOpen ? 'open' : 'closed'}`}/>}</div>)
          }
        })}
        </div>
        <div className="floors-cont">
        {revFloors.map(floor => {
            if(Number.isInteger(floor)){
              return (
              <React.Fragment>
              <div key={nanoid()} className="floor">
                <div onClick={() => callElevator(floor, 'floor')} className="button-cont">
                  {floor < 4 && <div className="up">↑</div>}
                  {floor > 0 && <div className="down">↓</div>}
                </div>
                {floor}
              </div>
			        <div className="shaft"></div>
              </React.Fragment>)
            }
          })}  
        </div>
      </div>
      
    </div>
  );
}

export default App;
