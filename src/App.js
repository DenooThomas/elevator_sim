import React, { useEffect, useState, useRef } from "react"
import { nanoid } from 'nanoid'

function App() {

  const floors = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4]
  const revFloors = floors.reverse()

  const intervalRef = useRef(null)

  const [elevatorLocation, setElevatorLocation] = useState(0)
  const [isOpen, setIsOpen] = useState(true)
  const [activeRequest, setActiveRequest] = useState(null)
  const [queue, setQueue] = useState([])
  console.log("queue => ", queue)




  function callElevator(floor) {
    if(floor === elevatorLocation){
      return console.log("Elevator already at location!")
    } else {
      if(queue.includes(floor)){
        return console.log("Called floor already in queue!")
      } else {
        if(queue.length === 0 && !activeRequest){
          const currentLocation = elevatorLocation
          const nextLocation = floor
          setActiveRequest(floor)
          moveElevator(currentLocation, nextLocation)
        } else {
          setQueue(prevQueue => [...prevQueue, floor])
        }
      }
    }
  }

  function checkQueue() {
    if(queue.length === 0 && !activeRequest){
      console.log("No items in queue & no activeRequest, interval cleared!")
      clearInterval(intervalRef.current)
    } else {
      const currentLocation = elevatorLocation
      const nextLocation = queue[0]
      moveElevator(currentLocation, nextLocation)
    }
  }


  function moveElevator(currentLocation, nextLocation){
    let counter = 0
    if(currentLocation > nextLocation){
      const difference = currentLocation - nextLocation
      const loop = setInterval(() => {
        if(counter === (difference * 2) - 1){
          clearInterval(loop)
        }
        setElevatorLocation(prevLocation => prevLocation - 0.5)
        counter++
      }, 2000)
    } else {
      const difference = nextLocation - currentLocation
      const loop = setInterval(() => {
        if(counter === (difference * 2) - 1){
          clearInterval(loop)
        }
        setElevatorLocation(prevLocation => prevLocation + 0.5)
        counter++
      }, 2000)
    }
    setQueue(prevQueue => prevQueue.filter(item => item !== nextLocation))
  }
  
  useEffect(() => {
    const queueInterval = setInterval(() => {
      console.log("useEffect | Checking queue and moving elevator accoridingly!")
      checkQueue()
    }, 2000);
    intervalRef.current = queueInterval
    return () => {
      clearInterval(intervalRef.current)
    }
  }, [])

 

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
