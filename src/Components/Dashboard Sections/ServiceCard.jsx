import React from "react";

function ServiceCard({ data }) {
  return (
    <tr className="align-middle">
      <td className="text-dark">{data.serviceType}</td>
      <td>{data.garageName}</td>
      <td>{data.cost}</td>
      <td>{data.registrationNumber}</td>
      <td>{data.mechanicName}</td>
      <td>
        <span className="badge bg-success px-3 py-2 rounded-pill">{data.status}</span>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <span className="badge bg-warning text-dark px-2 py-1 rounded-pill">
            {data.userRating}
          </span>
        </div>
      </td>
    </tr>
  );
}

export default ServiceCard;
