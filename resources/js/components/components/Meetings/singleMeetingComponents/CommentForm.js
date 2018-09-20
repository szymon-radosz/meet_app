import React from 'react';

const CommentForm = props => (
    <form onSubmit={props.submitComment}>
        <div className="form-group">
            <label htmlFor="commentBody">Write a comment like a {props.loggedInUserEmail}</label>
            <textarea  maxLength="150" className="form-control" name="commentBody" id="commentBody" rows="3" onChange={props.handleChange}></textarea>
        </div>

        <button type="submit" className="btn btn-default">Send a comment</button>
    </form>
);

export default CommentForm;