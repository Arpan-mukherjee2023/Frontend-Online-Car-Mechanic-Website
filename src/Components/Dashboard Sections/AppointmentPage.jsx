import React, { useEffect, useState } from 'react';
import SideNavBar from "./SideNavBar";
import {useNavigate} from "react-router-dom";

function AppointmentPage() {

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const user = JSON.parse(localStorage.getItem("userData"));
  const userId = user.userId;
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
  }, [userId])

  return (
    <div className="dashboard-container">
      
          <SideNavBar />

        {/* Main content */}
        <div className="content-area mt-2">
          <div className="m-4">
            <h2 className="mb-4">My Upcoming Appointments</h2>
            <div className="table-responsive">
              <table className="table table-hover table-bordered">
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Garage</th>
                    <th>Vehicle</th>
                    <th>Mechanic</th>


                  </tr>
                </thead>
                <tbody>
                  {data.map((appt, index) => (
                    <tr key={appt.index}>
                      <td>{index + 1}</td>
                      <td>{appt.appointmentDate}</td>
                      <td>{appt.appointmentTime}</td>
                      <td>{appt.serviceType}</td>
                      <td>{appt.status}</td>
                      <td>{appt.garageName}</td>
                      <td>{appt.registrationNumber}</td>
                      <td>{appt.mechanicName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Optional footer or actions */}
            <div className="mt-3">
              <button className="btn btn-success" onClick={() => navigate('/user/book-appointments')}>Book New Appointment</button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default AppointmentPage;
