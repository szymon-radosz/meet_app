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

        //check if nickname don't have a whitespaces
        if (_.contains(this.state.nickName, " ")) {
            window.location.reload();
            alert("You can't use whitespace in your nickname");
        }

        //on the start I think the user has unique email
        //in next code I will check it
        let uniqueEmail = true;
        let uniqueNickname = true;

        //search through all users in db
        const allUsers = await axios.get(`http://127.0.0.1:8000/api/users`);

        //console.log(this.state.email);
        //console.log(res.data);

        //check all record that contains email used in the form, if it's exists then change uniqueEmail to false
        for (var i = 0; i < allUsers.data.length; i++) {
            if (_.contains(allUsers.data[i], this.state.email)) {
                uniqueEmail = false;
                //console.log(uniqueEmail);
            } else if (_.contains(allUsers.data[i], this.state.nickName)) {
                uniqueNickname = false;
            }
        }

        //if email is not unique then display alert
        if (uniqueEmail === false) {
            alert("user with email " + this.state.email + " already exists");
        } else if (uniqueNickname === false) {
            alert(
                "user with nickname " + this.state.nickName + " already exists"
            );
        }

        //if email is unique then try register user
        //we'll check if password and confirmation match
        else {
            //create user object with actual state
            const user = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                age: this.state.age,
                email: this.state.email,
                description: this.state.description,
                nickName: this.state.nickName,
                location: this.state.location,
                password: this.state.password,
                passwordConfirmation: this.state.passwordConfirmation
            };

            //x-www-form
            let formBody = [];
            for (let property in user) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(user[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }

            formBody = formBody.join("&");
            //console.log(formBody);

            //if password matches confirmation and email is unique
            //then save user to db
            if (user.password === user.passwordConfirmation) {
                const savedUser = await axios.post(
                    `http://127.0.0.1:8000/api/user`,
                    formBody,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }
                );

                //console.log(res);
                //console.log(res.data);

                //if successfully registered then display alert
                if (savedUser.status == "200") {
                    //after successful register login user, store values in the session
                    sessionStorage.setItem("userId", "");
                    sessionStorage.setItem("userId", savedUser.data["_id"]);

                    //reload window to lost data
                    window.location.reload();
                    alert(
                        "Thank you " +
                            savedUser.data.firstName +
                            ". You created an account"
                    );
                } else {
                    alert(
                        "Sorry we can't handle that. Please repeat for a while."
                    );
                }
            } else {
                alert("Sorry password and confirmation doesn't match ");
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
