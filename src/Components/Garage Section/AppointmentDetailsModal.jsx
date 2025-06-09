import React from 'react';
import { X, Calendar, Clock, User, Car, Phone, Mail, FileText } from 'lucide-react';

function AppointmentDetailsModal({ appointment, isOpen, onClose }) {
  if (!isOpen || !appointment) return null;

  const getStatusClass = (status) => {
    switch (status) {
      case 'SCHEDULED': return 'status-scheduled';
      case 'IN_PROGRESS': return 'status-in-progress';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      default: return 'bg-secondary text-white';
    }
  };

  return (
    <div className="modal show d-block modal-backdrop-blur" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold">Appointment Details</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <Calendar className="me-2 text-primary" size={20} />
                <h6 className="mb-0 fw-semibold">{appointment.customerName}</h6>
              </div>
              <span className={`badge status-badge ${getStatusClass(appointment.status)}`}>
                {appointment.status.replace('_', ' ')}
              </span>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="detail-section">
                  <h6 className="fw-semibold mb-3">Customer Information</h6>
                  <div className="mb-2 d-flex align-items-center">
                    <User className="me-2 text-muted" size={16} />
                    <span>{appointment.customerName}</span>
                  </div>
                  <div className="mb-2 d-flex align-items-center">
                    <Mail className="me-2 text-muted" size={16} />
                    <span>{appointment.customerEmail}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <Phone className="me-2 text-muted" size={16} />
                    <span>{appointment.customerPhone}</span>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="detail-section">
                  <h6 className="fw-semibold mb-3">Vehicle Information</h6>
                  <div className="mb-2 d-flex align-items-center">
                    <Car className="me-2 text-muted" size={16} />
                    <span>{appointment.vehicleYear} {appointment.vehicleMake} {appointment.vehicleModel}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="text-muted me-2">Plate:</span>
                    <span className="font-monospace fw-bold">{appointment.vehiclePlateNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h6 className="fw-semibold mb-3">Appointment Details</h6>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-2 d-flex align-items-center">
                    <Calendar className="me-2 text-muted" size={16} />
                    <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <Clock className="me-2 text-muted" size={16} />
                    <span>{appointment.appointmentTime}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-2">
                    <span className="text-muted">Service Type:</span>
                    <div className="fw-medium">{appointment.serviceType}</div>
                  </div>
                  <div>
                    <span className="text-muted">Duration:</span>
                    <div>{appointment.estimatedDuration} minutes</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h6 className="fw-semibold mb-3">Description</h6>
              <div className="d-flex align-items-start">
                <FileText className="me-2 text-muted mt-1" size={16} />
                <p className="mb-0">{appointment.description}</p>
              </div>
            </div>

            {appointment.notes && (
              <div className="notes-section">
                <h6 className="fw-semibold mb-2">Notes</h6>
                <p className="mb-0">{appointment.notes}</p>
              </div>
            )}

            <div className="border-top pt-3 mt-3">
              <small className="text-muted">
                <div>Created: {new Date(appointment.createdAt).toLocaleString()}</div>
                <div>Last Updated: {new Date(appointment.updatedAt).toLocaleString()}</div>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetailsModal;
