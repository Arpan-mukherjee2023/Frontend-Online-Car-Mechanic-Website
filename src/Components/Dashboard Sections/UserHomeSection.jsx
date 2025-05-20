import React, { useContext }from 'react'
import {UserContext} from '../../Context/UserContext';
import UpcomingAppointments from './UpcomingAppointments';
import background from '../../Media/bg-2.jpg';
import ServiceHistory from './ServiceHistory';

function UserHomeSection() {
    const user = JSON.parse(localStorage.getItem('userData'));
  return (
    <>
      <div className='h-25 d-flex align-items-center p-2' style={{backgroundImage: `url(${background})`, backgroundSize: 'cover'}}>
        <h1 className='text-white'>Hello {user.name}</h1>
      </div>
      <div className='d-flex mt-4 p-2 flex-column shadow-lg' style={{ height: '40%' ,background: "linear-gradient(to right, #0d6efd, white)"}}>
        <UpcomingAppointments />
      </div>
      <div className='d-flex mt-4 p-2 flex-column shadow-lg' style={{ height: '40%', background: "linear-gradient(to right, #2980b9, #6dd5fa, #ffffff)"}}>
        <ServiceHistory />
      </div>
    </>
  )
}

export default UserHomeSection;
