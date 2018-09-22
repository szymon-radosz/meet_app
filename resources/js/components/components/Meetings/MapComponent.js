import React, { Component } from "react";
import Map from "pigeon-maps";
import Marker from "pigeon-marker";
import axios from "axios";

class MapComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            meetingsData: []
        };
    }

    async componentDidMount() {
        const allMettings = await axios.get(
            `http://127.0.0.1:8000/api/meetings`
        );

        const meetings = allMettings.data;

        meetings.map((item, i) => {
            let meetingObject = {
                id: item._id,
                title: item.title,
                description: item.description,
                author: item.author,
                lattitude: item.lattitude,
                longitude: item.longitude,
                category: item.category,
                limit: item.limit,
                date: item.date,
                time: item.time
            };

            this.setState(prevState => ({
                meetingsData: [...prevState.meetingsData, meetingObject]
            }));
        });
    }

    render() {
        return (
            <Map
                center={[this.props.latCenter, this.props.lngCenter]}
                zoom={12}
            >
                {this.state.meetingsData.map((meeting, i) => {
                    //console.log(meeting);
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
                })}
            </Map>
        );
    }
}

export default MapComponent;
