import React, { Component } from "react";
import axios from "axios";
import SingleMeetingOnList from "./MeetingsListComponents/SingleMeetingOnList.js";
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

    async componentDidMount() {
        const allMeetings = await axios.get(
            `http://127.0.0.1:8000/api/meetings`
        );

        allMeetings.data.map((item, i) => {
            let meetingObject = {
                id: item.id,
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

    setCoordinates(childLat, childLng) {
        this.setState({
            lat: childLat,
            lng: childLng
        });
    }

    render() {
        return (
            <div className="row listOfMeetingsRow">
                {this.props.searchInLocation ? (
                    "searchInLocation istnieje"
                ) : (
                    <div>
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
                                meetingsData={this.state.meetingsData}
                                latCenter={this.state.lat}
                                lngCenter={this.state.lng}
                            />
                        </div>{" "}
                    </div>
                )}
            </div>
        );
    }
}

export default MainMeetings;
