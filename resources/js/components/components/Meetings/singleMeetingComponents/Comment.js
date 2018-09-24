import React from "react";
import { Link } from "react-router-dom";

const Comment = props => (
    <div className="panel panel-default">
        <div className="panel-body">
            <div className="btn-group dropup">
                <button type="button" className="btn btn-secondary">
                    Dropup
                </button>
                <button
                    type="button"
                    className="btn btn-secondary dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                >
                    <span className="sr-only">Toggle Dropdown</span>
                </button>
                <div className="dropdown-menu">
                    <p>{props.userNickname}</p>
                    <li>
                        <Link to={`/profile/${props.userNickname}`}>
                            User profile
                        </Link>
                    </li>
                </div>
            </div>

            <p>
                {props.userNickname} wrote {props.date}:{" "}
            </p>
            <p>{props.commentBody}</p>
        </div>
    </div>
);

export default Comment;
