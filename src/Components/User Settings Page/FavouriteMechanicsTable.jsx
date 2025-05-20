import React, { useEffect, useState } from "react";
import SideNavBar from "../Dashboard Sections/SideNavBar";
function FavouriteMechanicsTable() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("userData"));
  const userId = user.userId;

  useEffect(() => {
    async function fetchMechanics() {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/users/${userId}/favourite-mechanics`
        );

        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        console.log(data);
        setMechanics(data);
      } catch (err) {
        setError(err.message);
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMechanics();
  }, [userId]);

  const handleRemove = async (mechanicId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/users/${userId}/favourite-mechanics/${mechanicId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to remove mechanic");
      setMechanics(mechanics.filter((m) => m.mechanicId !== mechanicId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading favourite mechanics...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (mechanics.length === 0) return <p>No favourite mechanics found.</p>;

  return (
    <div className="dashboard-container">
      <SideNavBar />
      <div className="content-area mt-2 m-2">
        <div className="table-responsive">
          <h1>Favourite Mechanics</h1>
          <hr />
          <table className="table table-striped table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th>Mechanic Name</th>
                <th>Garage Name</th>
                <th>Phone Number</th>
                <th>Specialization</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mechanics.map((mech) => (
                <tr key={mech.mechanicId}>
                  <td>{mech.mechanicName}</td>
                  <td>{mech.garageName}</td>
                  <td>{mech.phoneNumber}</td>
                  <td>{mech.specialization}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemove(mech.mechanicId)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FavouriteMechanicsTable;
