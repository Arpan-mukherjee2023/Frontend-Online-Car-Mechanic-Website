import React from "react";
import SideNavBar from "./Dashboard Sections/SideNavBar";
import UpcomingAppointments from "./Garage Section/UpcomingAppointments";
import MechanicsList from "./Garage Section/MechanicsList";

function GarageDashboard() {
  const garage = JSON.parse(localStorage.getItem("garageData"));
  const garageId = garage.garageId;
  const garageName = garage.name;
  return (
    <div className="dashboard-container">
      <SideNavBar />

      <div className="content-area mt-2">
        <div className="d-flex flex-column" style={{ height: "100%" }}>
          {/* Top Header (20%) */}
          <div
            className="w-100 rounded shadow"
            style={{
              height: "20%",
              background:
                "linear-gradient(to right, #e0f7ff, #b3d9ff, #80bfff)",
              color: "#002b5c",
              flexShrink: 0,
            }}
          >
            <div className="h-100 d-flex align-items-center justify-content-center fs-3 fw-semibold">
              Welcome {garageName}
            </div>
          </div>

          {/* Bottom Section (80%) */}
          <div
            className="d-flex w-100 mt-2"
            style={{ height: "80%", overflow: "hidden" }}
          >
            {/* Left Panel (Scrollable Internally) */}
            <div
              className="w-50 border-end p-3"
              style={{
                height: "100%",
                overflowY: "auto",
                background:
                  "linear-gradient(135deg, #e0f7ff 0%, #b3e5fc 50%, #ffffff 100%)",
                padding: "20px",
                borderRadius: "15px",
                color: "#002b5c",
              }}
            >
              <UpcomingAppointments garageId={garageId} />
            </div>

            {/* Right Panel */}
            <div
              className="w-50 p-3"
              style={{
                height: "100%",
                overflowY: "auto",
                background:
                  "linear-gradient(135deg, #e0f0ff 0%, #ffffff 50%, #a8c0ff 100%)",
                padding: "1.5rem",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(168, 192, 255, 0.4)",
                color: "#1a1a1a", // dark text for contrast
                maxHeight: "480px",

                minWidth: "320px",
              }}
            >
              <MechanicsList garageId={garageId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GarageDashboard;
