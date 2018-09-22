import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import LocateOnMapBtn from "./LocateOnMapBtn";

class SingleMeetingOnList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lat: "",
            lng: ""
        };

        this.sendCoordinatesToMainMeetings = this.sendCoordinatesToMainMeetings.bind(
            this
        );
    }

    sendCoordinatesToMainMeetings() {
        this.props.setCoordinates(this.props.lattitude, this.props.longitude);
    }

    render() {
        return (
            <div className="panel-group">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h4 className="panel-title bold">
                            {this.props.title} - {this.props.category}
                        </h4>
                    </div>
                    <div className="panel-body">
                        <p>
                            <span className="bold">Date: </span>
                            {this.props.date} {this.props.time}
                        </p>
                        <p>
                            <span className="bold">Description: </span>
                            {this.props.description}
                        </p>
                        <p>
                            <span className="bold">Created by: </span>
                            {this.props.author}
                        </p>
                        <p>
                            <span className="bold">Limit: </span>
                            {this.props.limit}
                        </p>
                        <Link to={`/meeting/${this.props.id}`}>
                            <div className="btn meetingDetailsBtn">Details</div>
                        </Link>
                        <LocateOnMapBtn
                            setCoordinate={this.sendCoordinatesToMainMeetings}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
export default SingleMeetingOnList;
