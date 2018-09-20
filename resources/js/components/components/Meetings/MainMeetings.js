import React, { Component } from "react";
import axios from "axios";
import SingleMeetingOnList from "./SingleMeetingOnList.js";
import MapComponent from "./MapComponent.js";

class MainMeetings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            meetingsData: [],
            lat: "",
            lng: ""
        };

        this.setCoordinates = this.setCoordinates.bind(this);
    }

    componentDidMount() {
        axios.get(`http://127.0.0.1:8000/api/meetings`).then(res => {
            //console.log(res.data);

            const meetings = res.data;

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
        });
    }

    //after click locate on map button set state with data from singleMeetingOnList
    setCoordinates(childLat, childLng) {
        this.setState({
            lat: childLat,
            lng: childLng
        });

        console.log(childLat);
    }

    render() {
        return (
            <div className="row listOfMeetingsRow">
                <div className="col-sm-6 listOfMeetingsCol">
                    {this.state.meetingsData.map((item, i) => {
                        return (
                            <SingleMeetingOnList
                                key={i}
                                changeMarker={this.changeMarker}
                                id={item.id}
                                title={item.title}
                                description={item.description}
                                author={item.author}
                                lattitude={item.lattitude}
                                longitude={item.longitude}
                                category={item.category}
                                limit={item.limit}
                                date={item.date}
                                time={item.time}
                                setCoordinates={this.setCoordinates}
                            />
                        );
                    })}
                </div>
                <div
                    className="col-sm-6 mainMeetingsMap"
                    style={{ height: "calc(100vh - 60px)" }}
                >
                    <MapComponent
                        latCenter={this.state.lat}
                        lngCenter={this.state.lng}
                    />
                </div>
            </div>
        );
    }
}

export default MainMeetings;
