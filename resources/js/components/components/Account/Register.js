import React, { Component } from "react";
import axios from "axios";
import _ from "underscore";

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            age: "",
            email: "",
            description: "",
            nickName: "",
            location: "",
            password: "",
            passwordConfirmation: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (_.contains(this.state.nickName, " ")) {
            this.props.showAlertWarning(
                "You can't use whitespace in your nickname"
            );
        } else {
            let uniqueEmail = true;
            let uniqueNickname = true;

            if (this.state.password === this.state.passwordConfirmation) {
                const allUsers = await axios.get(
                    `http://127.0.0.1:8000/api/users`
                );

                for (var i = 0; i < allUsers.data.length; i++) {
                    if (_.contains(allUsers.data[i], this.state.email)) {
                        uniqueEmail = false;
                    } else if (
                        _.contains(allUsers.data[i], this.state.nickName)
                    ) {
                        uniqueNickname = false;
                    }
                }

                if (uniqueEmail === false) {
                    this.props.showAlertWarning(
                        "user with email " +
                            this.state.email +
                            " already exists"
                    );
                } else if (uniqueNickname === false) {
                    this.props.showAlertWarning(
                        "user with nickname " +
                            this.state.nickName +
                            " already exists"
                    );
                } else {
                    const savedUser = await axios.post(
                        `http://127.0.0.1:8000/api/user`,
                        {
                            firstName: this.state.firstName,
                            lastName: this.state.lastName,
                            age: this.state.age,
                            email: this.state.email,
                            description: this.state.description,
                            nickName: this.state.nickName,
                            location: this.state.location,
                            password: this.state.password,
                            passwordConfirmation: this.state
                                .passwordConfirmation
                        }
                    );

                    if (savedUser.status == "200") {
                        sessionStorage.setItem("userId", "");
                        sessionStorage.setItem("userNickName", "");
                        sessionStorage.setItem("userId", savedUser.data.userId);
                        sessionStorage.setItem(
                            "userNickName",
                            savedUser.data.userNickName
                        );
                        this.props.loginUser(savedUser.data.userNickName);
                        this.props.showAlertSuccess(
                            "Thank you. You created an account"
                        );
                    } else {
                        this.props.showAlertWarning(
                            "Sorry we can't handle that. Please repeat for a while."
                        );
                    }
                }
            } else {
                this.props.showAlertWarning(
                    "Sorry password and confirmation doesn't match "
                );
            }
        }
    }

    render() {
        return (
            <div className="register row registerRow">
                <div className="col-sm-6 col-sm-offset-3 registerCol">
                    <h2>Register</h2>

                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="firstName"
                                name="firstName"
                                onChange={this.handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Last Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="lastName"
                                name="lastName"
                                onChange={this.handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                onChange={this.handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="nickName">Nick name:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nickName"
                                name="nickName"
                                onChange={this.handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="age">Age:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="age"
                                name="age"
                                onChange={this.handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">
                                Description of myself:
                            </label>
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
                            <label htmlFor="location">Location:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="location"
                                name="location"
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

                        <div className="form-group">
                            <label htmlFor="passwordConfirmation">
                                Password confirmation:
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="passwordConfirmation"
                                name="passwordConfirmation"
                                onChange={this.handleChange}
                                required
                            />
                        </div>

                        <input
                            type="submit"
                            className="btn btn-default"
                            id="registerBtn"
                            value="Register"
                        />
                    </form>
                </div>
            </div>
        );
    }
}

export default Register;
