import React from 'react';
import { PhoneCall, XCircle } from 'lucide-react';

function AppointmentCard({ data }) {
  return (
    <tr>
      <td>{data.serviceType}</td>
      <td>{data.garagename}</td>
      <td>{data.appointmentDate}</td>
      <td>{data.appointmentTime}</td>
      <td>{data.mechanicName}</td>
      <td>{data.registrationNumber}</td>
      <td>
        <span className="badge bg-success px-3 py-2 rounded-pill">{data.status}</span>
      </td>
      <td>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-danger btn-sm d-flex align-items-center">
            <XCircle size={16} className="me-1" /> Cancel
          </button>
          <button className="btn btn-outline-primary btn-sm d-flex align-items-center">
            <PhoneCall size={16} className="me-1" /> Call Garage
          </button>
        </div>
      </td>
    </tr>
  );
}

export default AppointmentCard;
