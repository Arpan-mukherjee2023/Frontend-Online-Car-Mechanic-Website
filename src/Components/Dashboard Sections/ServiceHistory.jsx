import React, { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import { useNavigate } from "react-router-dom";

function ServiceHistory() {
  const navigate = useNavigate();
  const [ historyData, setHistoryData ]= useState([]);
  const [ data, setData ]= useState([]);

  const handleClick = () => {
    navigate("/user/settings/service-history");
  };
  const user = JSON.parse(localStorage.getItem("userData"));
  const userId = user.userId;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('');

  useEffect(() => {
     async function fetchData() {
      try {
        const response = await fetch(`http://localhost:8080/api/service-history/user/${userId}`);
        if(!response.ok) {
          throw new Error("could not find any service history");
        } else {
          const JSONdata = await response.json();
          setData(JSONdata);
          console.log(JSONdata);
        }
      } catch(err) {
        console.log("Error" + err);
      }
    }

    fetchData();
  }, [userId]);

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setDirection('down');
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection('up');
      setCurrentIndex(prev => prev - 1);
    }
  };

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === data.length - 1;

  return (
    <div className="container py-4">
      <div className="card shadow rounded-4">
        <div className="card-header bg-white">
          <h3 className="mb-0 text-dark">Service History</h3>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Service</th>
                  <th>Garage</th>
                  <th>Cost</th>
                  <th>Vehicle</th>
                  <th>Mechanic</th>
                  <th>Status</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody className={`animate__animated ${direction === 'down' ? 'animate__slideInDown' : direction === 'up' ? 'animate__slideInUp' : ''}`}>
                {data.length > 0 ? (
                  <ServiceCard data={data[currentIndex]} />
                ) : (
                  <tr><td colSpan="8">No Service Found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end gap-2">
          <button className="btn btn-outline-secondary"  onClick={handlePrevious} disabled={isFirst}>Previous</button>
          <button className="btn btn-primary" onClick={handleNext} disabled={isLast}>Next</button>
          <button className="btn btn-primary" onClick={handleClick}>View All</button>
        </div>
      </div>
    </div>
  );
}

export default ServiceHistory;
