import React, { useState, useEffect } from 'react';
import AppointmentCard from './AppointmentCard';

function UpcomingAppointments() {
  const user = JSON.parse(localStorage.getItem("userData"));
  const userId = user.userId;
  const [ data, setData ] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('');


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:8080/api/appointments/user/${userId}`);
        if(!response.ok) {
          throw new Error("could not find any upcoming appointments");
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
          <h3 className="mb-0 text-dark">Upcoming Appointments</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Service</th>
                  <th>Garage</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Mechanic</th>
                  <th>Vehicle Number</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className={`animate__animated ${direction === 'down' ? 'animate__slideInDown' : direction === 'up' ? 'animate__slideInUp' : ''}`}>
                {data.length > 0 ? (
                  <AppointmentCard data={data[currentIndex]} />
                ) : (
                  <tr><td colSpan="8">No appointments found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end gap-2">
          <button className="btn btn-outline-secondary"  onClick={handlePrevious} disabled={isFirst}>Previous</button>
          <button className="btn btn-primary" onClick={handleNext} disabled={isLast}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default UpcomingAppointments;
