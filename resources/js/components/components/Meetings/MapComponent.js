import React, { Component } from "react";
import Map from "pigeon-maps";
import Marker from "pigeon-marker";
import axios from "axios";

class MapComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Map
                center={[this.props.latCenter, this.props.lngCenter]}
                zoom={12}
            >
                {this.props.meetingsData ? (
                    this.props.meetingsData.map((meeting, i) => {
                        return (
                            <Marker
                                key={i}
                                anchor={[
                                    parseFloat(meeting.lattitude),
                                    parseFloat(meeting.longitude)
                                ]}
                                payload={1}
                            />
                        );
                    })
                ) : (
                    <Marker
                        key={this.props.latCenter}
                        anchor={[
                            parseFloat(this.props.latCenter),
                            parseFloat(this.props.lngCenter)
                        ]}
                        payload={1}
                    />
                )}
            </Map>
        );
    }
}

export default MapComponent;
