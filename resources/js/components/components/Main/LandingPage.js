import React, { Component } from "react";

class LandingPage extends Component {
  render() {
    return (
      <div className="row landing">
        <div className="col-sm-5 col-sm-offset-2 landingForm">
          <h1>Spend your time with valuable people.</h1>

          <form>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="landingLocation"
                placeholder="Type your city and check meetings..."
              />
            </div>

            <button type="submit" className="btn landingBtn">
              Find meetings
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default LandingPage;
