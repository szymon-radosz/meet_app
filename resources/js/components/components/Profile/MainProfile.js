import React, { Component } from "react";
import axios from "axios";
import _ from "underscore";

class LocateOnMapBtn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            age: "",
            description: "",
            nickName: "",
            location: "",
            userExist: false
        };
    }

    async componentDidMount() {
        const nickname = this.props.match.params.nickname;
        const allUsers = await axios.get(`http://127.0.0.1:8000/api/users`);

        console.log(allUsers.data);

        //check all record that contains user id
        for (var i = 0; i < allUsers.data.length; i++) {
            if (_.contains(allUsers.data[i], nickname)) {
                this.setState({
                    userExist: true,
                    firstName: allUsers.data[i].firstName,
                    lastName: allUsers.data[i].lastName,
                    nickName: allUsers.data[i].nickName,
                    age: allUsers.data[i].age,
                    description: allUsers.data[i].description,
                    location: allUsers.data[i].location
                });
            }
        }
    }

    render() {
        console.log(this.props.match.params.nickname);
        return (
            <div className="col-sm-6 col-sm-offset-3">
                {this.state.userExist ? (
                    <div>
                        <p>{this.state.nickName} profile</p>
                        <p>
                            {this.state.firstName} {this.state.lastName}
                        </p>
                        <p>{this.state.description}</p>
                        <p>
                            {this.state.age} years old, based{" "}
                            {this.state.location}
                        </p>
                    </div>
                ) : (
                    ""
                )}
            </div>
        );
    }
}

export default LocateOnMapBtn;
