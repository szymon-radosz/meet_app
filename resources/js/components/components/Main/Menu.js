import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from "axios";
import LandingPage from "./LandingPage.js";
import Login from "./../Account/Login.js";
import Register from "./../Account/Register.js";
import MainMeetings from "./../Meetings/MainMeetings.js";
import AddNewMeeting from "./../Meetings/AddNewMeeting.js";
import MeetingDetails from "./../Meetings/MeetingDetails.js";
import MainProfile from "./../Profile/MainProfile.js";

class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userIsLoggedIn: false,
            loggedInUserEmail: "",
            loggedInUserNickName: "",
            searchInLocation: ""
        };

        this.loginUser = this.loginUser.bind(this);
        this.logout = this.logout.bind(this);
        this.changeStateOfSearchInLocation = this.changeStateOfSearchInLocation.bind(
            this
        );
        this.cleanStateOfSearchInLocation = this.cleanStateOfSearchInLocation.bind(
            this
        );
    }

    async componentDidMount() {
        if (sessionStorage.getItem("userId")) {
            this.setState({ userIsLoggedIn: true });

            const getUser = await axios.get(
                `http://127.0.0.1:8000/api/user/${sessionStorage.getItem(
                    "userId"
                )}`
            );

            this.setState({ loggedInUserEmail: getUser.data[0].email });
            this.setState({ loggedInUserNickName: getUser.data[0].nickName });
        }
    }

    loginUser(nickName) {
        this.setState({ userIsLoggedIn: true });
        this.setState({ loggedInUserNickName: nickName });
    }

    logout() {
        sessionStorage.setItem("userId", "");
        sessionStorage.setItem("userNickName", "");
        alert("You're sucessfully logout");
        this.setState({ userIsLoggedIn: false });
        this.setState({ loggedInUserNickName: "" });
    }

    changeStateOfSearchInLocation(value) {
        this.setState({
            searchInLocation: value
        });
    }

    cleanStateOfSearchInLocation() {
        this.setState({
            searchInLocation: ""
        });
    }

    render() {
        return (
            <Router>
                <div>
                    <nav className="navbar navbar-default">
                        <div className="container-fluid">
                            <div className="navbar-header">
                                <button
                                    type="button"
                                    className="navbar-toggle collapsed"
                                    data-toggle="collapse"
                                    data-target="#navbar"
                                    aria-expanded="false"
                                    aria-controls="navbar"
                                >
                                    <span className="sr-only">
                                        Toggle navigation
                                    </span>
                                    <span className="icon-bar" />
                                    <span className="icon-bar" />
                                    <span className="icon-bar" />
                                </button>
                                <Link
                                    to="/"
                                    className="navbar-brand"
                                    onClick={this.cleanStateOfSearchInLocation}
                                >
                                    Home
                                </Link>
                            </div>
                            <div
                                id="navbar"
                                className="navbar-collapse collapse"
                            >
                                <ul className="nav navbar-nav navbar-right">
                                    {this.state.userIsLoggedIn ? (
                                        <li>
                                            <Link
                                                to="/meetings"
                                                onClick={
                                                    this
                                                        .cleanStateOfSearchInLocation
                                                }
                                            >
                                                Meetings
                                            </Link>
                                        </li>
                                    ) : (
                                        ""
                                    )}
                                    {this.state.userIsLoggedIn ? (
                                        <li>
                                            <Link
                                                to="/add-meeting"
                                                onClick={
                                                    this
                                                        .cleanStateOfSearchInLocation
                                                }
                                            >
                                                Add meetings
                                            </Link>
                                        </li>
                                    ) : (
                                        ""
                                    )}
                                    <li>
                                        <Link
                                            to="/login"
                                            onClick={
                                                this
                                                    .cleanStateOfSearchInLocation
                                            }
                                        >
                                            Login
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/register"
                                            onClick={
                                                this
                                                    .cleanStateOfSearchInLocation
                                            }
                                        >
                                            Register
                                        </Link>
                                    </li>
                                    {this.state.userIsLoggedIn ? (
                                        <li>
                                            <div className="dropdown">
                                                <button
                                                    className="btn btn-secondary dropdown-toggle"
                                                    type="button"
                                                    id="dropdownMenuButton"
                                                    data-toggle="dropdown"
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                >
                                                    Account
                                                </button>
                                                <div
                                                    className="dropdown-menu"
                                                    aria-labelledby="dropdownMenuButton"
                                                >
                                                    <a onClick={this.logout}>
                                                        Sign Out
                                                    </a>
                                                    <Link
                                                        to={`/profile/${
                                                            this.state
                                                                .loggedInUserNickName
                                                        }`}
                                                        onClick={
                                                            this
                                                                .cleanStateOfSearchInLocation
                                                        }
                                                    >
                                                        My profile
                                                    </Link>
                                                </div>
                                            </div>
                                        </li>
                                    ) : (
                                        ""
                                    )}
                                </ul>
                            </div>
                        </div>
                    </nav>

                    <Route
                        exact
                        path="/"
                        render={() => {
                            return (
                                <LandingPage
                                    searchInLocation={
                                        this.state.searchInLocation
                                    }
                                    changeStateOfSearchInLocation={
                                        this.changeStateOfSearchInLocation
                                    }
                                />
                            );
                        }}
                    />
                    <Route
                        exact
                        path="/login"
                        render={() => {
                            return <Login loginUser={this.loginUser} />;
                        }}
                    />
                    <Route
                        exact
                        path="/register"
                        render={() => {
                            return <Register loginUser={this.loginUser} />;
                        }}
                    />

                    <Route
                        exact
                        path="/meetings"
                        render={() => {
                            return (
                                <MainMeetings
                                    searchInLocation={
                                        this.state.searchInLocation
                                    }
                                />
                            );
                        }}
                    />
                    <Route path="/meeting/:id" component={MeetingDetails} />
                    <Route path="/profile/:nickname" component={MainProfile} />
                    <Route path="/add-meeting" component={AddNewMeeting} />
                </div>
            </Router>
        );
    }
}

export default Menu;
