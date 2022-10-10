import React, { useState } from "react"
import useInterval from "./hooks/useInterval"
import { nanoid } from 'nanoid'

function App() {

  const floors = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4]
  const revFloors = floors.reverse()
  const elevatorButtons = [0,1,2,3,4]
  const elevatorTick = 1000
  const elevatorWaitTime = 5000
  
  const [elevatorLocation, setElevatorLocation] = useState(0)
  const [activeRequest, setActiveRequest] = useState()
  const [isDoorOpen, setIsDoorOpen] = useState(true)
  const [isWaiting, setIsWaiting] = useState(false)
  const [queue, setQueue] = useState([])

  function callElevator(floorNr, origin) {
    if(isWaiting && !activeRequest){
      setIsWaiting(false)
    }
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
    const nextLocation = queue[0]
    setActiveRequest(nextLocation)
    setIsDoorOpen(false)
    let counter = 0
    if(currentLocation > nextLocation){
      const difference = currentLocation - nextLocation
      const loop = setInterval(() => {
        if(counter === (difference * 2) - 1){
          clearInterval(loop)
          setIsDoorOpen(true) 
          setIsWaiting(true)

          setTimeout(() => {
            setActiveRequest()
          }, elevatorWaitTime)

          if(queue.length > 1){
            setTimeout(() => {
              setIsWaiting(false)
            }, elevatorWaitTime)
          }
          setQueue(prevQueue => prevQueue.filter(item => item !== nextLocation))    
        }
        setElevatorLocation(prevLocation => prevLocation - 0.5)
        counter++
      }, elevatorTick)
    } else {
      const difference = nextLocation - currentLocation
      const loop = setInterval(() => {
        if(counter === (difference * 2) - 1){
          clearInterval(loop)
          setIsDoorOpen(true)
          setIsWaiting(true)

          setTimeout(() => {
            setActiveRequest()
          }, elevatorWaitTime)

          if(queue.length > 1){
            setTimeout(() => {
              setIsWaiting(false)   
            }, elevatorWaitTime)
          }    
          setQueue(prevQueue => prevQueue.filter(item => item !== nextLocation))
        }
        setElevatorLocation(prevLocation => prevLocation + 0.5)
        counter++
      }, elevatorTick)
    }
  }

  function clearQueue(){
    setQueue([])
  }
 
  useInterval(() => {
    console.log("useInterval() ran")
    if(queue.length > 0){
        if(!activeRequest && activeRequest !== 0){
          console.log("useInterval() | no activeRequest, moving elevator!")
          moveElevator()
        } else if(activeRequest) {
          console.log("useInterval() | Active request already being handled")
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
      <div className="building-cont">
        <div className="floors-cont">
        {revFloors.map(floor => {
            if(Number.isInteger(floor)){
              return (
              <React.Fragment>
              <div key={nanoid()} className="floor">
                <p>{floor}</p>
                
              </div>
			        {floor !== 0 && <div className="shaft"></div>}
              </React.Fragment>)
            } else{ return null}
          })}  
        </div>
        <div className="elevator">
          {revFloors.map(floor => {
          if(Number.isInteger(floor)){
            return (
              <div className="floor">
              <div onClick={() => callElevator(floor, 'floor')} className="button-cont">
                  <div className={`button ${queue.includes(floor) && 'on'}`}></div>
                </div> 
                <div className={`cabin ${(isDoorOpen && floor === elevatorLocation) ? 'present' : 'absent'}`} />
              </div>)
          } else {
            return (
              <div className="shaft">
                <div className={`lightbulb ${floor === elevatorLocation ? 'on' : 'off'}`}></div>
              </div>)
          }
        })}
        </div>
      </div>
      <div className={`elevator-control ${isDoorOpen ? 'open' : 'closed'}`}>
        <button onClick={clearQueue}>Clear queue</button>
        <div>
          {elevatorButtons.map(floor => {
            return (<div onClick={() => callElevator(floor, 'elevator')} className={`button ${queue.includes(floor) ? 'open' : 'closed'} ${floor === activeRequest && 'activeRequest'}`}>{floor}</div>)
          })}
          <p>{elevatorLocation}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
