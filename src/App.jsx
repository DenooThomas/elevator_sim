import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import useInterval from './hooks/useInterval';

function App() {
  const floors = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];
  const revFloors = floors.reverse();
  const elevatorButtons = [4, 3, 2, 1, 0];
  const elevatorTick = 1000;
  const elevatorWaitTime = 5000;

  const [elevatorLocation, setElevatorLocation] = useState(0);
  const [activeRequest, setActiveRequest] = useState();
  const [isDoorOpen, setIsDoorOpen] = useState(true);
  const [isWaiting, setIsWaiting] = useState(false);
  const [queue, setQueue] = useState([]);

  function noActiveRequests() {
    if (!activeRequest && activeRequest !== 0) {
      return true;
    }
    return false;
  }

  function callElevator(floorNr) {
    if (isWaiting && noActiveRequests()) {
      setTimeout(() => {
        setIsWaiting(false);
      }, elevatorWaitTime);
    } else {
      setQueue((prevQueue) => [...prevQueue, floorNr]);
    }
  }

  function moveElevator() {
    setIsDoorOpen(false);
    setIsWaiting(false);
    const currentLocation = elevatorLocation;
    const nextLocation = queue.length > 0 ? queue[0] : 0;
    setActiveRequest(nextLocation);
    let difference;
    if (currentLocation > nextLocation) {
      difference = currentLocation - nextLocation;
    } else {
      difference = nextLocation - currentLocation;
    }
    let counter = 0;
    const loop = setInterval(() => {
      if (currentLocation > nextLocation) {
        setElevatorLocation((prevLocation) => prevLocation - 0.5);
      } else {
        setElevatorLocation((prevLocation) => prevLocation + 0.5);
      }

      if (counter === (difference * 2) - 1) {
        clearInterval(loop);
        setIsDoorOpen(true);
        setIsWaiting(true);
        setQueue((prevQueue) => prevQueue.filter((item) => item !== nextLocation));
        setTimeout(() => {
          setActiveRequest();
        }, elevatorWaitTime);

        if (queue.length > 1) {
          setTimeout(() => {
            setIsWaiting(false);
          }, elevatorWaitTime);
        }
      }
      counter += 1;
    }, elevatorTick);
  }

  useInterval(() => {
    if (queue.length > 0) {
      if (noActiveRequests()) {
        moveElevator();
      }
    } else if (noActiveRequests() && elevatorLocation !== 0) {
      callElevator(0);
    }
  }, 1000);

  return (
    <div className="main-cont">
      <section className="building-section">
        <div className="roof" />
        <div className="building-cont">
          <div className="floors-cont">
            {revFloors.map((floor) => {
              if (Number.isInteger(floor)) {
                return (
                  <>
                    <div key={nanoid()} className="floor">
                      <p>{floor}</p>
                      <div className="window" />
                    </div>
                    {floor !== 0 && <div className="shaft" />}
                  </>
                );
              } return null;
            })}
          </div>
          <div className="elevator-cont">
            {revFloors.map((floor) => {
              if (Number.isInteger(floor)) {
                return (
                  <div className="floor">
                    <div className="divide" />
                    <div className="elevator">
                      <div
                        role="button"
                        tabIndex={floor}
                        aria-label="Call elevator"
                        className={`button ${queue.includes(floor) ? 'active' : 'inactive'} 
                        ${((!activeRequest && activeRequest !== 0) && (floor === elevatorLocation && queue.length === 0)) ? 'currentFloor' : ''}`}
                        onClick={() => callElevator(floor)}
                        onKeyPress={() => callElevator(floor)}
                      />
                      <div className={`cabin ${(isDoorOpen && floor === elevatorLocation) ? 'present' : 'absent'}`} />
                    </div>
                  </div>
                );
              }
              return (
                <div className="shaft">
                  <div className={`lightbulb ${floor === elevatorLocation ? 'on' : 'off'}`} />
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <div className={`elevator-control ${isDoorOpen ? 'open' : 'closed'}`}>
        {elevatorButtons.map((floor) => (
          <div
            role="button"
            tabIndex={floor + 5}
            aria-label="Call elevator"
            className={`button ${queue.includes(floor) ? 'active' : 'inactive'} 
                ${((!activeRequest && activeRequest !== 0) && (floor === elevatorLocation && queue.length === 0)) ? 'currentFloor' : ''}
                ${floor === 0 && 'groundfloor'}`}
            onClick={() => callElevator(floor)}
            onKeyPress={() => callElevator(floor)}
          >
            {floor}

          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
