import React, { Component } from "react";

class CommentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            commentBody: "",
            loggedInUserNickname: "",
            meetingId: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.submitComment = this.submitComment.bind(this);
    }

    componentDidMount() {
        this.setState({
            loggedInUserNickname: this.props.loggedInUserNickname,
            meetingId: this.props.meetingId
        });
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    async submitComment(event) {
        event.preventDefault();

        console.log(this.state.commentBody);

        const time = new Date();
        const year = time.getFullYear();
        const month = time.getMonth() + 1;
        const date1 = time.getDate();
        /*const hour = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();*/

        /*const commentDate =
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
            seconds;*/

        const commentDate = year + "-" + month + "-" + date1;

        const savedComment = await axios.post(
            `http://127.0.0.1:8000/api/comment`,
            {
                userId: sessionStorage.getItem("userId"),
                userNickName: this.state.loggedInUserNickname,
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
            <div>
                <form onSubmit={this.submitComment}>
                    <div className="form-group">
                        <label htmlFor="commentBody">
                            Write a comment like a{" "}
                            {this.props.loggedInUserNickName}
                        </label>
                        <textarea
                            maxLength="150"
                            className="form-control"
                            name="commentBody"
                            id="commentBody"
                            rows="3"
                            onChange={this.handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-default">
                        Send a comment
                    </button>
                </form>
            </div>
        );
    }
}

export default CommentForm;
