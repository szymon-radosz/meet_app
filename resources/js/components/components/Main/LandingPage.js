import React, { Component } from "react";
import MainMeetings from "./../Meetings/MainMeetings";
import Main from "./Main";

class LandingPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userLocationPrompt: ""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit(event) {
        event.preventDefault();

        console.log(this.state.userLocationPrompt);

        if (this.state.userLocationPrompt) {
            this.props.changeStateOfSearchInLocation(
                this.state.userLocationPrompt
            );
        }
    }

    render() {
        return (
            <div>
                {this.props.searchInLocation ? (
                    <MainMeetings
                        searchInLocation={this.props.searchInLocation}
                    />
                ) : (
                    <div className="row landing">
                        <div className="col-sm-5 col-sm-offset-2 landingForm">
                            <h1>Spend your time with valuable people.</h1>

                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <input
                                        name="userLocationPrompt"
                                        type="text"
                                        className="form-control"
                                        id="landingLocation"
                                        placeholder="Type your city and check meetings..."
                                        onChange={this.handleChange}
                                    />
                                </div>

                                <input
                                    type="submit"
                                    className="btn landingBtn"
                                    value="Find meetings"
                                />
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default LandingPage;
