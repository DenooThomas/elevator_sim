import React, { useEffect, useState, useRef } from "react"
import { nanoid } from 'nanoid'

function App() {

  const floors = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4]
  const revFloors = floors.reverse()

  const intervalRef = useRef(null)

  const [elevatorLocation, setElevatorLocation] = useState(0)
  const [activeRequest, setActiveRequest] = useState()
  const [queue, setQueue] = useState([])




  function callElevator(floorNr) {
    if(floorNr === elevatorLocation){
      return null
    } else {
      if(queue.includes(floorNr)){
        return null
      } else {
        setQueue(prevQueue => [...prevQueue, floorNr])
      }
    }
  }
  console.log("queue => ", queue)


  function moveElevator(currentLocation, nextLocation){
    setActiveRequest(nextLocation)
    let counter = 0
    if(currentLocation > nextLocation){
      const difference = currentLocation - nextLocation
      const loop = setInterval(() => {
        if(counter === (difference * 2) - 1){
          clearInterval(loop)
          cleanupQueue()      
        }
        setElevatorLocation(prevLocation => prevLocation - 0.5)
        counter++
      }, 2000)
    } else {
      const difference = nextLocation - currentLocation
      const loop = setInterval(() => {
        if(counter === (difference * 2) - 1){
          clearInterval(loop)
          cleanupQueue()
        }
        setElevatorLocation(prevLocation => prevLocation + 0.5)
        counter++
      }, 2000)
    }
  }

  function checkQueue() {
    // if(activeRequest){
    //   const currentLocation = elevatorLocation
    //   const nextLocation = activeRequest
    //   moveElevator(currentLocation, nextLocation)
    // }
    if(queue.length === 0) {
      console.log("No requests in queue")
    } else {
      const currentLocation = elevatorLocation
      const nextLocation = queue[0]
      setActiveRequest(nextLocation)
      moveElevator(currentLocation, nextLocation)
    }
  }

  function cleanupQueue(){
    const prevRequest = queue[0]
    setQueue(prevQueue => prevQueue.filter(item => item !== prevRequest))
    setActiveRequest()
  }
  
  useEffect(() => {
    if(queue.length > 0){
      const queueInterval = setInterval(() => {
        checkQueue()
      }, 2500);
  
      intervalRef.current = queueInterval
      return () => {
        clearInterval(intervalRef.current)
      }
    }
  }, [queue])

 

  return (
    <div className="main-cont">
      <div className="elevator-control">
        <div>
          <div onClick={() => callElevator(3)} className="button">3</div>
          <div onClick={() => callElevator(4)} className="button">4</div>
          <div onClick={() => callElevator(1)} className="button">1</div>
          <div onClick={() => callElevator(2)} className="button">2</div>
          <div onClick={() => callElevator(0)} className="button ground">0</div>
          <p>{elevatorLocation}</p>
        </div>
      </div>
      <div className="elevator-cont">
        <div className="elevator">
          {revFloors.map(floor => {
          if(Number.isInteger(floor)){
            return (<div className="floor">{floor === elevatorLocation && <div className="cabin"/>}</div>)
          } else {
            return (<div className="shaft">{floor === elevatorLocation && <div className="cabin"/>}</div>)
          }
        })}
        </div>
        <div className="floors-cont">
        {revFloors.map(floor => {
            if(Number.isInteger(floor)){
              return (
              <React.Fragment>
              <div key={nanoid()} className="floor">
                <div onClick={() => callElevator(floor)} className="button-cont">
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
