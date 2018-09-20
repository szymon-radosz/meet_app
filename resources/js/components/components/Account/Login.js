import React, { Component } from "react";
import axios from "axios";
import _ from "underscore";

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            emailOrNickname: "",
            password: ""
        };

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

        const users = await axios.get(`http://127.0.0.1:8000/api`);

        //check all record that contains email used in the form, if it's exists then change uniqueEmail to false
        for (var i = 0; i < users.data.length; i++) {
            //if we find user with email from email text field
            //next we must check if password match to account
            if (_.contains(users.data[i], this.state.emailOrNickname)) {
                console.log(users.data[i]);

                if (users.data[i].password === this.state.password) {
                    //after successful login user, store values in the session
                    sessionStorage.setItem("userId", "");
                    sessionStorage.setItem("userId", users.data[i]["_id"]);

                    //reload window to lost data
                    window.location.reload();
                    alert(
                        "Thank you " +
                            users.data[i].firstName +
                            ". Let's find new friends"
                    );
                } else {
                    alert("wrong password for that account");
                }
            }
        }
    }

    render() {
        console.log(sessionStorage.getItem("userId"));
        return (
            <div className="login row loginRow">
                <div className="col-sm-6 col-sm-offset-3 loginCol">
                    <h2>Login</h2>

                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="emailOrNickname">
                                Email or nickname:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="emailOrNickname"
                                name="emailOrNickname"
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                onChange={this.handleChange}
                                required
                            />
                        </div>

                        <input
                            type="submit"
                            className="btn btn-default"
                            id="loginBtn"
                            value="Login"
                        />
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;
