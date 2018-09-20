import React, { Component } from "react";
import axios from "axios";
import _ from "underscore";

class AddNewMeeting extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            description: "",
            author: "",
            lattitude: "",
            longitude: "",
            category: "Select",
            limit: "Select",
            date: "",
            time: ""
        };

        // This binding is necessary to make `this` work in the callback - react documentation
        //function call 'thi's inside which is 'this' from constructor
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //when user pass data to text field then update state
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    //when user submit the form
    async handleSubmit(event) {
        event.preventDefault();

        //check if user select some value from dropdown list
        if (this.state.limit == "Select") {
            alert("Please choose the limit of users.");
        } else if (this.state.category == "Select") {
            alert("Please choose the category.");
        } else {
            const getUser = await axios.get(
                `http://127.0.0.1:8000/api/user/${sessionStorage.getItem(
                    "userId"
                )}`
            );

            //create new meeting object with actual state
            const newMeeting = {
                title: this.state.title,
                description: this.state.description,
                author: getUser.data.nickName,
                lattitude: this.state.lattitude,
                longitude: this.state.longitude,
                category: this.state.category,
                limit: this.state.limit,
                date: this.state.date,
                time: this.state.time
            };

            //x-www-form
            let formBody = [];
            for (let property in newMeeting) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(newMeeting[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }

            formBody = formBody.join("&");
            //console.log(formBody);

            const savedMeeting = await axios.post(
                `http://127.0.0.1:8000/api/meetings`,
                formBody,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );
            //console.log(savedMeeting);
            //console.log(savedMeeting.data);

            //if successfully registered then display alert
            if (savedMeeting.status == "200") {
                //match logged user ID with new meeting ID
                const matchUserWithMeeting = {
                    userID: sessionStorage.getItem("userId"),
                    meetingID: savedMeeting.data._id
                };

                //x-www-form
                let formBodyMatchUserWithMeeting = [];
                for (let property in matchUserWithMeeting) {
                    let encodedKey = encodeURIComponent(property);
                    let encodedValue = encodeURIComponent(
                        matchUserWithMeeting[property]
                    );
                    formBodyMatchUserWithMeeting.push(
                        encodedKey + "=" + encodedValue
                    );
                }

                formBodyMatchUserWithMeeting = formBodyMatchUserWithMeeting.join(
                    "&"
                );

                const savedMatchUserWithMeeting = await axios.post(
                    `http://127.0.0.1:8000/api/matchUserWithMeeting`,
                    formBodyMatchUserWithMeeting,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }
                );

                //if successfully matched user with new meeting then display alert
                if (savedMatchUserWithMeeting.status == "200") {
                    //reload window to lost data
                    window.location.reload();
                    alert("You added new meeting");
                } else {
                    alert(
                        "Sorry we can't handle that. Please repeat for a while."
                    );
                }
            } else {
                alert("Sorry we can't handle that. Please repeat for a while.");
            }
        }
    }

    render() {
        return (
            <div className="addNewMeeting row addNewMeetingRow">
                <div className="col-sm-6 col-sm-offset-3 addNewMeetingCol">
                    <h2>Add new meeting</h2>

                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title">Title:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                name="title"
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="description"
                                name="description"
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lattitude">Lattitude:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="lattitude"
                                name="lattitude"
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="longitude">Longitude:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="longitude"
                                name="longitude"
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Category:</label>
                            <div className="form-group">
                                <select
                                    className="form-control"
                                    name="category"
                                    id="category"
                                    onChange={this.handleChange}
                                    required
                                >
                                    <option>Select</option>
                                    <option>Party</option>
                                    <option>Lifestyle</option>
                                    <option>Sport</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="limit">Limit:</label>
                            <div className="form-group">
                                <select
                                    className="form-control"
                                    name="limit"
                                    id="limit"
                                    onChange={this.handleChange}
                                    required
                                >
                                    <option>Select</option>
                                    <option>3</option>
                                    <option>5</option>
                                    <option>No limit</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="date">Date:</label>
                            <input
                                type="date"
                                className="form-control"
                                id="date"
                                name="date"
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="time">Time:</label>
                            <input
                                type="time"
                                className="form-control"
                                id="time"
                                name="time"
                                onChange={this.handleChange}
                                required
                            />
                        </div>

                        <input
                            type="submit"
                            className="btn btn-default"
                            id="addNewMeetingBtn"
                            value="Add new meeting"
                        />
                    </form>
                </div>
            </div>
        );
    }
}

export default AddNewMeeting;
