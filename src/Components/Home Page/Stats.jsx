import React from 'react'
import customer from '../../Media/customer.png'
import job from '../../Media/job.png'
import experience from '../../Media/experience.png'


function Stats() {
  return (
    <div>
      <div class="container text-center my-4">
        <h2 class="fw-bold text-dark">We Are At</h2>
      </div>
      <div class="stats-container">

        <div class="stats-item">
          <img src={customer} alt="Satisfied Customers" class="stats-icon" />
          <div class="stats-number" data-start="0" data-stop="35480">35480</div>
          <div class="stats-title">Satisfied Customers</div>
        </div>
        <div class="stats-item">
          <img src={job} alt="Customer Jobs" class="stats-icon" />
          <div class="stats-number" data-start="0" data-stop="39133">39133</div>
          <div class="stats-title">Customer Jobs Completed</div>
        </div>
        <div class="stats-item">
          <img src={experience} alt="Experience" class="stats-icon" />
          <div class="stats-number" data-start="0" data-stop="25">25</div>
          <div class="stats-title">Years of Experience</div>
        </div>
      </div>

      <div class="container my-5">
        <div class="row justify-content-center">
          <div class="col-12 col-md-10">
            <div class="card border-0 shadow p-5 text-center" style={{background: '#f8f9fa', borderRadius: '15px'}}>
              <div class="card-body">
                <h2 class="fw-bold text-dark">Why Choose WrenchIt Car Service?</h2>
                <p class="lead text-secondary mt-3">
                  Expect expertise in servicing multi-brand cars, high-quality service, genuine auto parts, and transparent pricing.
                </p>
                <a href="/in/en/about-us/service-promise/" class="btn btn-dark btn-lg mt-3 fw-bold shadow-sm">
                  Our Service Promise
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

  )
}

export default Stats
