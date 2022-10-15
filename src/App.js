import React, { useState } from "react"
import useInterval from "./hooks/useInterval"
import { nanoid } from 'nanoid'

function App() {

  const floors = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4]
  const revFloors = floors.reverse()
  const elevatorButtons = [4,3,2,1,0]
  const elevatorTick = 1000
  const elevatorWaitTime = 5000
  
  const [elevatorLocation, setElevatorLocation] = useState(0)
  const [activeRequest, setActiveRequest] = useState()
  const [isDoorOpen, setIsDoorOpen] = useState(true)
  const [isWaiting, setIsWaiting] = useState(false)
  const [queue, setQueue] = useState([])

  function noActiveRequests(){
    if(!activeRequest && activeRequest !== 0){
      return true
    } else {
      return false
    }
  }

  function callElevator(floorNr) {
    if(isWaiting && noActiveRequests()){
      setTimeout(() => {
        setIsWaiting(false)
      }, elevatorWaitTime)
    }
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
  
  function moveElevator(){
    const currentLocation = elevatorLocation
    const nextLocation = queue.length > 0 ? queue[0] : 0
    setActiveRequest(nextLocation)
    setIsDoorOpen(false)
    setIsWaiting(false)
    let counter = 0
    let difference
    if(currentLocation > nextLocation){
      difference = currentLocation - nextLocation
    } else {
      difference = nextLocation - currentLocation
	  }
    const loop = setInterval(() => {
      if(currentLocation > nextLocation){
        setElevatorLocation(prevLocation => prevLocation - 0.5)
      } else {
        setElevatorLocation(prevLocation => prevLocation + 0.5)
      }

      if(counter === (difference * 2) - 1){
        clearInterval(loop)
        setIsDoorOpen(true)
        setIsWaiting(true)
        setQueue(prevQueue => prevQueue.filter(item => item !== nextLocation))
        setTimeout(() => {
          setActiveRequest()
        }, elevatorWaitTime)

        if(queue.length > 1){
          setTimeout(() => {
            setIsWaiting(false)   
          }, elevatorWaitTime)
        }     
      }
      counter++
    }, elevatorTick)
  }

  useInterval(() => {
    if(queue.length > 0){
        if(noActiveRequests()){
          moveElevator()
        }
    } else if ((noActiveRequests()) && elevatorLocation !== 0){
      callElevator(0)
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
      <section className="building-section">
      <div className="roof"></div>
      <div className="building-cont">
        <div className="floors-cont">
        {revFloors.map(floor => {
            if(Number.isInteger(floor)){
              return (
              <React.Fragment>
              <div key={nanoid()} className="floor">
                <p>{floor}</p>
                <div className="window"></div>
              </div>
			        {floor !== 0 && <div className="shaft"></div>}
              </React.Fragment>)
            } else{ return null}
          })}  
        </div>
        <div className="elevator-cont">
          {revFloors.map(floor => {
          if(Number.isInteger(floor)){
            return (
              <div className="floor">
                <div className="divide" />
                <div className="elevator">
                  <div onClick={() => callElevator(floor)} className="button-cont">
                      <div className=
                      {`button ${queue.includes(floor) ? 'active' : 'inactive'} 
                      ${(floor === activeRequest && isWaiting) ? 'activeRequest' : 'inactiveRequest'}
                      ${((!activeRequest && activeRequest !== 0) && (floor === elevatorLocation && queue.length === 0)) ? 'currentFloor' : ''}`}>
                      </div>
                    </div> 
                    <div className={`cabin ${(isDoorOpen && floor === elevatorLocation) ? 'present' : 'absent'}`} />
                  </div>
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
      </section>
      <div className={`elevator-control ${isDoorOpen ? 'open' : 'closed'}`}>
          {elevatorButtons.map(floor => {
            if(floor !== 0){
              return (
              <div onClick={() => callElevator(floor)} 
              className=
              {`button ${queue.includes(floor) ? 'active' : 'inactive'} 
              ${floor === activeRequest ? 'activeRequest' : 'inactiveRequest'}
              ${((!activeRequest && activeRequest !== 0) && (floor === elevatorLocation && queue.length === 0)) ? 'currentFloor' : ''}`}>
              {floor}</div>
              )
            } else if(floor === 0){
              return (
              <div onClick={() => callElevator(floor)} 
              className=
              {`button groundfloor ${queue.includes(floor) ? 'active' : 'inactive'} 
              ${floor === activeRequest ? 'activeRequest' : 'inactiveRequest'}
              ${((!activeRequest && activeRequest !== 0) && (floor === elevatorLocation && queue.length === 0)) ? 'currentFloor' : ''}`}>
              {floor}</div>
              )
            }
            return null
          })}
      </div>
    </div>
  );
}

export default App;
