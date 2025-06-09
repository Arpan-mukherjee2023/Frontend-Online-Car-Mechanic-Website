import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Car, Eye, X, AlertCircle } from 'lucide-react';
import GarageNavBar from './GarageNavBar';
import AppointmentDetailsModal from './AppointmentDetailsModal';

function GarageAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for the custom confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [appointmentToCancelId, setAppointmentToCancelId] = useState(null);

  // Retrieve garageId from local storage
  const garage = JSON.parse(localStorage.getItem('garageData'));
  const garageId = garage ? garage.garageId : 'default-garage-id'; // Fallback for safety

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        setError(null); // Clear any previous errors
        console.log("Fetching appointments for garageId:", garageId);

        // Fetch data from the specified API endpoint using the garageId
        const response = await fetch(`http://localhost:8080/api/appointments/garage/${garageId}`);

        if (!response.ok) {
          // If the response is not OK (e.g., 404, 500), throw an error
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' })); // Try to parse error, fallback if not JSON
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse the JSON response
        setAppointments(data); // Update state with the fetched data
      } catch (err) {
        setError(`Failed to fetch appointments: ${err.message}. Please ensure the backend is running and the endpoint is correct.`);
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false); // Always set loading to false when done
      }
    };

    // Only fetch if garageId is available
    if (garageId && garageId !== 'default-garage-id') {
      fetchAppointments();
    } else {
      setError("Garage ID not found in local storage. Cannot fetch appointments.");
      setLoading(false);
    }
  }, [garageId]); // Dependency array: re-fetch if garageId changes

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  // Function to show the confirmation modal for cancellation
  const handleCancelAppointment = (appointmentId) => {
    setAppointmentToCancelId(appointmentId); // Store the ID of the appointment to cancel
    setShowConfirmModal(true); // Show the custom confirmation modal
  };

  // Function to execute the cancellation after user confirmation
  const confirmCancellation = async () => {
    setShowConfirmModal(false); // Close the confirmation modal immediately
    if (!appointmentToCancelId) return; // Safeguard if no ID is set

    try {
      // Make a DELETE API call to the backend for the specific appointment
      console.log(appointmentToCancelId)
      const response = await fetch(`http://localhost:8080/api/appointments/${appointmentToCancelId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add any necessary authentication headers here if your backend requires them
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
      });

      if (!response.ok) {
        // If the deletion fails, get the error response
        const errorResponseText = await response.text();
        throw new Error(`Server responded with status ${response.status}: ${errorResponseText}`);
      }

      // If deletion is successful, update the UI by filtering out the cancelled appointment
      setAppointments(prevAppointments =>
        prevAppointments.filter(apt => apt.appointmentId !== appointmentToCancelId)
      );

      // Note: The prompt mentioned sending an email to the user after deletion.
      // This action (sending an email) should typically be handled by your backend
      // upon successful deletion of the appointment. The frontend's role is to
      // trigger the deletion.

      fetchAppointments();

    } catch (err) {
      console.error('Error during cancellation:', err);
      // Display the error to the user using the existing error state
      setError(`Failed to cancel appointment: ${err.message}. Please try again.`);
    } finally {
      setAppointmentToCancelId(null); // Clear the stored ID after operation
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'SCHEDULED': return 'status-scheduled';
      case 'IN_PROGRESS': return 'status-in-progress';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      default: return 'bg-secondary text-white';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-vh-100 bg-light dashboard-container">
      {/* Assuming GarageNavBar is available */}
      <GarageNavBar />

      <div className="py-4 content-area mt-2 px-2">
        <div className="row">
          <div className="col-12">
            <div className="mb-4">
              <h1 className="display-6 fw-bold text-dark">Appointments</h1>
              <p className="text-muted">Manage your garage appointments and schedules</p>
            </div>

            {loading && (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger text-center" role="alert">
                <AlertCircle className="me-2" size={24} />
                {error}
              </div>
            )}

            {!loading && !error && appointments.length === 0 ? (
              <div className="text-center py-5">
                <Calendar className="text-muted mb-3" size={48} />
                <p className="text-muted fs-5">No appointments scheduled</p>
              </div>
            ) : (
              !loading && !error && (
                <div className="row g-4">
                  {appointments.map((appointment, key) => (
                    // Use appointmentId as the key as per your entity
                    <div key={appointment.appointmentId} className="col-lg-4 col-md-6">
                      <div className="card appointment-card card-hover h-100">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-center">
                              <User className="me-2 text-primary" size={20} />
                              <h6 className="card-title mb-0 fw-semibold text-truncate">
                                {/* Access user name via appointment.user.name */}
                                {appointment.customerName ? appointment.customerName : 'N/A'}
                              </h6>
                            </div>
                            <span className={`badge status-badge ${getStatusClass(appointment.status)}`}>
                              {appointment.status ? appointment.status.replace('_', ' ') : 'N/A'}
                            </span>
                          </div>

                          <div className="mb-3">
                            <div className="d-flex align-items-center mb-2 text-muted">
                              <Calendar className="me-2" size={16} />
                              <small>{formatDate(appointment.appointmentDate)}</small>
                            </div>
                            <div className="d-flex align-items-center mb-2 text-muted">
                              <Clock className="me-2" size={16} />
                              <small>{appointment.appointmentTime}</small>
                            </div>
                            <div className="d-flex align-items-center mb-2 text-muted">
                              <Car className="me-2" size={16} />
                              {/* Access vehicle details via appointment.vehicle */}
                              <small>{appointment ? `${appointment.vehicleYear} ${appointment.vehicleMake} ${appointment.vehicleModel}` : 'N/A'}</small>
                            </div>
                            <div className="d-flex align-items-center text-muted">
                              <Phone className="me-2" size={16} />
                              {/* Access user phone number via appointment.user.phoneNumber */}
                              <small>{appointment.customerPhone ? appointment.customerPhone : 'N/A'}</small>
                            </div>
                          </div>

                          <div className="mb-3">
                            <p className="text-muted mb-1"><small>Service:</small></p>
                            <p className="mb-0 fw-medium">{appointment.serviceType}</p>
                          </div>

                          <div className="d-flex gap-2">
                            <button
                              onClick={() => handleViewDetails(appointment)}
                              className="btn btn-primary btn-sm flex-fill btn-action d-flex align-items-center justify-content-center"
                            >
                              <Eye className="me-1" size={16} />
                              Details
                            </button>

                            {/* Only show cancel button if status allows */}
                            {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
                              <button
                                onClick={() => {
                                  console.log(appointment);
                                  handleCancelAppointment(appointment.id);
                                }} // Pass appointmentId
                                className="btn btn-outline-danger btn-sm btn-action d-flex align-items-center justify-content-center"
                              >
                                <X className="me-1" size={16} />
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Custom Confirmation Modal for Cancellation */}
      {showConfirmModal && (
        <div className="modal d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Cancellation</h5>
                {/* Close button for the modal (optional, if you want one) */}
                {/* <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)} aria-label="Close"></button> */}
              </div>
              <div className="modal-body">
                Are you sure you want to cancel this appointment? This action cannot be undone.
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>No, Keep It</button>
                <button type="button" className="btn btn-danger" onClick={confirmCancellation}>Yes, Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assuming AppointmentDetailsModal is available (commented out as per original)  */}
       <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAppointment(null);
        }}
      />
    </div>
  );
}

export default GarageAppointment;
