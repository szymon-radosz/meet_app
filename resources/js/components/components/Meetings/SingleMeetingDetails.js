import React, { Component } from "react";
import axios from "axios";
import _ from "underscore";
import Comment from "./singleMeetingComponents/Comment";
import CommentForm from "./singleMeetingComponents/CommentForm";
import MapComponent from "./MapComponent.js";

class SingleMeetingDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            usersEmails: [],
            resignedUsersEmails: [],
            loggedInUserEmail: "",
            loggedInUserNickname: "",
            displayTakPartBtn: false,
            displayResignBtn: false,
            displayCommentsContainer: false,
            comments: [],
            commentBody: ""
        };

        this.takePartClick = this.takePartClick.bind(this);
        this.submitComment = this.submitComment.bind(this);
        this.resignClick = this.resignClick.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    async componentDidMount() {
        const getUser = await axios.get(
            `http://127.0.0.1:8000/api/user/${sessionStorage.getItem("userId")}`
        );

        this.setState({ loggedInUserEmail: getUser.data.email });
        this.setState({ loggedInUserNickname: getUser.data.nickName });

        const getCurrentMeetingInfo = await axios.get(
            `http://127.0.0.1:8000/api/meeting/${this.props.meetingId}`
        );
        let meetingLimit = getCurrentMeetingInfo.data.limit;

        let usersIDs = [];

        const allMatches = await axios.get(
            `http://127.0.0.1:8000/api/matchUserWithMeetings`
        );

        let meetingMatched = 0;

        for (var i = 0; i < allMatches.data.length; i++) {
            if (_.contains(allMatches.data[i], this.props.meetingId)) {
                usersIDs.push(allMatches.data[i].userID);

                meetingMatched++;

                if (
                    _.contains(
                        allMatches.data[i],
                        sessionStorage.getItem("userId")
                    ) &&
                    this.state.loggedInUserEmail != getCurrentMeetingInfo.author
                ) {
                    this.setState({ displayCommentsContainer: true });
                    this.setState({ displayResignBtn: true });
                }
            }
        }

        if (meetingMatched < meetingLimit) {
            this.setState({ displayTakPartBtn: true });
        }

        usersIDs.map(async (userID, i) => {
            const allUsers = await axios.get(`http://127.0.0.1:8000/api/users`);

            for (var i = 0; i < allUsers.data.length; i++) {
                if (_.contains(allUsers.data[i], userID)) {
                    let userObject = {
                        email: allUsers.data[i].email,
                        id: allUsers.data[i].id
                    };

                    this.setState(prevState => ({
                        usersEmails: [...prevState.usersEmails, userObject]
                    }));
                }
            }
        });

        let ResignedUsersIDs = [];

        const allDeleted = await axios.get(
            `http://127.0.0.1:8000/api/deleteUserFromMeeting`
        );

        for (var i = 0; i < allDeleted.data.length; i++) {
            if (_.contains(allDeleted.data[i], this.props.meetingId)) {
                if (!_.contains(ResignedUsersIDs, allDeleted.data[i].userID)) {
                    ResignedUsersIDs.push(allDeleted.data[i].userID);
                }

                console.log(allDeleted.data[i].userID);
            }
        }

        ResignedUsersIDs.map(async (userID, i) => {
            const allUsers = await axios.get(
                `http://127.0.0.1:8000/api/user/${userID}`
            );

            let userObject = {
                email: allUsers.data.email,
                id: allUsers.data.id
            };

            this.setState(prevState => ({
                resignedUsersEmails: [
                    ...prevState.resignedUsersEmails,
                    userObject
                ]
            }));
        });

        const allComments = await axios.get(
            `http://127.0.0.1:8000/api/comments?results=1`
        );

        for (var i = 0; i < allComments.data.length; i++) {
            if (allComments.data[i].meetingId == this.props.meetingId) {
                let commentObject = {
                    userID: allComments.data[i].userId,
                    userEmail: allComments.data[i].userEmail,
                    date: allComments.data[i].date,
                    commentBody: allComments.data[i].commentBody
                };

                this.setState(prevState => ({
                    comments: [...prevState.comments, commentObject]
                }));
            }
        }
    }

    async takePartClick() {
        let takePart = true;

        const allMatches = await axios.get(
            `http://127.0.0.1:8000/api/matchUserWithMeeting`
        );

        for (var i = 0; i < allMatches.data.length; i++) {
            if (
                _.contains(
                    allMatches.data[i],
                    sessionStorage.getItem("userId")
                ) &&
                _.contains(allMatches.data[i], this.props.meetingId)
            ) {
                takePart = false;
            }
        }

        if (takePart === false) {
            alert(
                "user with email " +
                    this.state.loggedInUserEmail +
                    " took part in the past!"
            );
        } else {
            const savedMatchUserWithMeeting = await axios.post(
                `http://127.0.0.1:8000/api/matchUserWithMeeting`,
                {
                    userID: sessionStorage.getItem("userId"),
                    meetingID: this.props.meetingId
                }
            );

            if (savedMatchUserWithMeeting.status == "200") {
                //reload window to lost data
                window.location.reload();
                alert(
                    "You are saved to that meeting. Now you can write comments."
                );
            } else {
                alert("Sorry we can't handle that. Please repeat for a while.");
            }
        }
    }

    async resignClick() {
        const allMatches = await axios.get(
            `http://127.0.0.1:8000/api/matchUserWithMeeting`
        );

        for (var i = 0; i < allMatches.data.length; i++) {
            if (
                _.contains(
                    allMatches.data[i],
                    sessionStorage.getItem("userId")
                ) &&
                _.contains(allMatches.data[i], this.props.meetingId)
            ) {
                const deleteUser = await axios.delete(
                    `http://127.0.0.1:8000/api/matchUserWithMeeting/${
                        allMatches.data[i].id
                    }`,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }
                );

                if (deleteUser.status == "200") {
                    const savedDeleteUserFromMeeting = await axios.post(
                        `http://127.0.0.1:8000/api/deleteUserFromMeeting`,
                        {
                            userID: sessionStorage.getItem("userId"),
                            meetingID: this.props.meetingId
                        }
                    );

                    if (savedDeleteUserFromMeeting.status == "200") {
                        window.location.reload();
                        alert("we are sad that you resigned.");
                    } else {
                        alert(
                            "Some problems occured with delete you from meeting."
                        );
                    }
                } else {
                    alert(
                        "Some problems occured with delete you from meeting."
                    );
                }
            }
        }
    }

    async submitComment(event) {
        event.preventDefault();

        const time = new Date();
        const year = time.getFullYear();
        const month = time.getMonth() + 1;
        const date1 = time.getDate();
        const hour = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();

        const commentDate =
            date1 +
            "-" +
            month +
            "-" +
            year +
            " " +
            hour +
            ":" +
            minutes +
            ":" +
            seconds;

        const savedComment = await axios.post(
            `http://127.0.0.1:8000/api/comments`,
            {
                userId: sessionStorage.getItem("userId"),
                userEmail: this.state.loggedInUserEmail,
                meetingId: this.props.meetingId,
                date: commentDate,
                commentBody: this.state.commentBody
            }
        );

        if (savedComment.status == "200") {
            window.location.reload();
            alert("You wrote a comment.");
        } else {
            alert("Sorry we can't handle that. Please repeat for a while.");
        }
    }

    render() {
        return (
            <div className="register row singleMeetingDetailsDataRow">
                <div className="col-sm-8 singleMeetingDetailsDataCol">
                    <h2>
                        {this.props.title} - {this.props.date} {this.props.time}{" "}
                        - {this.props.category}
                    </h2>

                    <p>Description: {this.props.description}</p>
                    <p>Created by: {this.props.author}</p>
                    <p>
                        Limit: {this.props.limit} (
                        {this.state.usersEmails.length}/{this.props.limit})
                    </p>

                    <p>
                        <strong>Users take part:</strong>
                    </p>
                    {this.state.usersEmails.map((user, i) => {
                        return <p key={i}>{user.email}</p>;
                    })}

                    <p>
                        <strong>Users which resigned in the past:</strong>
                    </p>
                    {this.state.resignedUsersEmails.map((user, i) => {
                        return <p key={i}>{user.email}</p>;
                    })}

                    {this.state.displayTakPartBtn ? (
                        <div
                            className="btn btn-default"
                            onClick={this.takePartClick}
                        >
                            Take part
                        </div>
                    ) : (
                        ""
                    )}

                    {this.state.displayResignBtn ? (
                        <div
                            className="btn btn-default"
                            onClick={this.resignClick}
                        >
                            Resign
                        </div>
                    ) : (
                        ""
                    )}

                    <p>
                        <strong>Comments</strong>
                    </p>

                    {/* in db comments are stored from the oldest to the newest, render reverse*/}
                    {this.state.displayCommentsContainer
                        ? this.state.comments
                              .slice(0)
                              .reverse()
                              .map((comment, i) => {
                                  return (
                                      <Comment
                                          key={i}
                                          userNickname={
                                              this.state.loggedInUserNickname
                                          }
                                          userEmail={
                                              this.state.loggedInUserEmail
                                          }
                                          date={comment.date}
                                          commentBody={comment.commentBody}
                                      />
                                  );
                              })
                        : ""}

                    {this.state.displayCommentsContainer ? (
                        <CommentForm
                            submitComment={this.submitComment}
                            loggedInUserEmail={this.state.loggedInUserEmail}
                            handleChange={this.handleChange}
                        />
                    ) : (
                        ""
                    )}
                </div>

                <div
                    className="col-sm-4 mainMeetingsMap"
                    style={{ height: "calc(100vh - 60px)" }}
                >
                    <MapComponent
                        latCenter={this.props.lattitude}
                        lngCenter={this.props.longitude}
                    />
                </div>
            </div>
        );
    }
}
export default SingleMeetingDetails;
