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

    //when user pass data to textearea field then update state
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    async componentDidMount() {
        const getUser = await axios.get(
            `http://127.0.0.1:8000/api/${sessionStorage.getItem("userId")}`
        );

        this.setState({ loggedInUserEmail: getUser.data.email });
        this.setState({ loggedInUserNickname: getUser.data.nickName });

        //get meeting user limit
        const getCurrentMeetingInfo = await axios.get(
            `http://127.0.0.1:8000/api/meetings/${this.props.meetingId}`
        );
        let meetingLimit = getCurrentMeetingInfo.data.limit;

        //we add users ids, which take part in meeting
        let usersIDs = [];

        //search through all matches in db
        const allMatches = await axios.get(
            `http://127.0.0.1:8000/api/matchUserWithMeeting`
        );

        //store meeting matches
        //how many times matchUSerWithMeeting consist meeting with current id
        let meetingMatched = 0;

        //check all record that contains meeting id
        for (var i = 0; i < allMatches.data.length; i++) {
            if (_.contains(allMatches.data[i], this.props.meetingId)) {
                //for actual meeting id push user id to array
                usersIDs.push(allMatches.data[i].userID);

                // console.log(allMatches.data[i].userID);

                meetingMatched++;

                if (
                    _.contains(
                        allMatches.data[i],
                        sessionStorage.getItem("userId")
                    ) &&
                    this.state.loggedInUserEmail != getCurrentMeetingInfo.author
                ) {
                    //if user took part in the meeting
                    this.setState({ displayCommentsContainer: true });
                    this.setState({ displayResignBtn: true });
                }
            }
        }

        //if meeting is show in table with matches < meeting limit, than display button 'take part'
        if (meetingMatched < meetingLimit) {
            this.setState({ displayTakPartBtn: true });
        }

        //loop through all users which take part in meeting
        usersIDs.map(async (userID, i) => {
            //console.log(userID);

            //search through all users in db
            const allUsers = await axios.get(`http://127.0.0.1:8000/api`);

            //check all record that contains user id
            for (var i = 0; i < allUsers.data.length; i++) {
                if (_.contains(allUsers.data[i], userID)) {
                    //console.log(allUsers.data[i].email);

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

        //we add users which resigned
        let ResignedUsersIDs = [];

        const allDeleted = await axios.get(
            `http://127.0.0.1:8000/api/deleteUserFromMeeting`
        );

        //check all record that contains meeting id
        for (var i = 0; i < allDeleted.data.length; i++) {
            if (_.contains(allDeleted.data[i], this.props.meetingId)) {
                //for actual meeting id push user id to array
                if (!_.contains(ResignedUsersIDs, allDeleted.data[i].userID)) {
                    ResignedUsersIDs.push(allDeleted.data[i].userID);
                }

                console.log(allDeleted.data[i].userID);
            }
        }

        //loop through all users which resigned
        ResignedUsersIDs.map(async (userID, i) => {
            //console.log(userID);

            //search through all users in db
            const allUsers = await axios.get(
                `http://127.0.0.1:8000/api/${userID}`
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

        //get comments
        const allComments = await axios.get(
            `http://127.0.0.1:8000/api/comments?results=1`
        );

        //loop through all comments
        for (var i = 0; i < allComments.data.length; i++) {
            if (allComments.data[i].meetingId == this.props.meetingId) {
                let commentObject = {
                    userID: allComments.data[i].userId,
                    userEmail: allComments.data[i].userEmail,
                    date: allComments.data[i].date,
                    commentBody: allComments.data[i].commentBody
                };

                //console.log(commentObject);

                this.setState(prevState => ({
                    comments: [...prevState.comments, commentObject]
                }));
            }
        }
    }

    async takePartClick() {
        //console.log('take');

        //on the start I think the user take part in the past
        //in next code I will check it
        let takePart = true;

        //search through all matches in db
        const allMatches = await axios.get(
            `http://127.0.0.1:8000/api/matchUserWithMeeting`
        );

        //check all record that contains email and meeting id, if it's exists then change takePart to false
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

        //if takePart is not unique then display alert
        if (takePart === false) {
            alert(
                "user with email " +
                    this.state.loggedInUserEmail +
                    " took part in the past!"
            );
        }

        //if takePart is unique then try match user with meeting
        else {
            //create match object
            const matchUserWithMeeting = {
                userID: sessionStorage.getItem("userId"),
                meetingID: this.props.meetingId
            };

            //x-www-form
            let formBody = [];
            for (let property in matchUserWithMeeting) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(
                    matchUserWithMeeting[property]
                );
                formBody.push(encodedKey + "=" + encodedValue);
            }

            formBody = formBody.join("&");

            const savedMatchUserWithMeeting = await axios.post(
                `http://127.0.0.1:8000/api/matchUserWithMeeting`,
                formBody,
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

        //check all record that contains email and meeting id, if it's exists then delete user
        for (var i = 0; i < allMatches.data.length; i++) {
            if (
                _.contains(
                    allMatches.data[i],
                    sessionStorage.getItem("userId")
                ) &&
                _.contains(allMatches.data[i], this.props.meetingId)
            ) {
                //first delete user from matchUSerWithMeeting
                const deleteUser = await axios.delete(
                    `http://127.0.0.1:8000/api/matchUserWithMeeting/${
                        allMatches.data[i]._id
                    }`,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }
                );

                if (deleteUser.status == "200") {
                    //now we save user to deleteUserFromMeeting when we store users which resigned
                    const deleteUserWithMeeting = {
                        userID: sessionStorage.getItem("userId"),
                        meetingID: this.props.meetingId
                    };

                    //x-www-form
                    let formBody = [];
                    for (let property in deleteUserWithMeeting) {
                        let encodedKey = encodeURIComponent(property);
                        let encodedValue = encodeURIComponent(
                            deleteUserWithMeeting[property]
                        );
                        formBody.push(encodedKey + "=" + encodedValue);
                    }

                    formBody = formBody.join("&");

                    const savedDeleteUserFromMeeting = await axios.post(
                        `http://127.0.0.1:8000/api/deleteUserFromMeeting`,
                        formBody,
                        {
                            headers: {
                                "Content-Type":
                                    "application/x-www-form-urlencoded"
                            }
                        }
                    );

                    //if successfully matched user with new meeting then display alert
                    if (savedDeleteUserFromMeeting.status == "200") {
                        //reload window to lost data
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

        //create comment object
        const comment = {
            userId: sessionStorage.getItem("userId"),
            userEmail: this.state.loggedInUserEmail,
            meetingId: this.props.meetingId,
            date: commentDate,
            commentBody: this.state.commentBody
        };

        //x-www-form
        let formBody = [];
        for (let property in comment) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(comment[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }

        formBody = formBody.join("&");

        const savedComment = await axios.post(
            `http://127.0.0.1:8000/api/comments`,
            formBody,
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        //if successfully matched user with new meeting then display alert
        if (savedComment.status == "200") {
            //reload window to lost data
            window.location.reload();
            alert("You wrote a comment.");
        } else {
            alert("Sorry we can't handle that. Please repeat for a while.");
        }

        //console.log('submitted');
    }

    render() {
        console.log(sessionStorage.getItem("userId"));
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
                    {/*<p>Latitude: {this.props.lattitude}</p>
          <p>Longitude: {this.props.longitude}</p>*/}

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
