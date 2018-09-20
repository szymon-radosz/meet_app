import React, { Component } from 'react';
import axios from 'axios';
import SingleMeetingDetails from './SingleMeetingDetails.js';

class MeetingDetails extends Component {
    constructor(props){
        super(props);

        this.state = {
            meetingData: [],
            meetingID: ''
        }
    }

    async componentDidMount() {
        //id z url
        var meetingId = this.props.match.params.id;
        //console.log(meetingId);
        this.setState({meetingID: meetingId})

        const getMeeting = await axios.get(`http://localhost:8000/meetings/${meetingId}`)

        //console.log(getMeeting.data);

        const meeting = getMeeting.data;

        let meetingObject = {
            id: meeting.id,
            title: meeting.title,
            description: meeting.description,
            author: meeting.author,
            lattitude: meeting.lattitude,
            longitude: meeting.longitude,
            category: meeting.category,
            limit: meeting.limit,
            date: meeting.date,
            time: meeting.time
        }
        
        //console.log(meetingObject);

        this.setState(prevState => ({
            meetingData: [...prevState.meetingData, meetingObject]
        }))

        //console.log(this.state.meetingData);
    }

    render() {
        return(
            <div>
                 {
                    this.state.meetingData.map((item, i) => {
                        return(
                            <SingleMeetingDetails key={i} id={item.id} title={item.title} description={item.description} author={item.author} lattitude={item.lattitude} longitude={item.longitude} category={item.category} limit={item.limit} date={item.date} time={item.time} meetingId={this.state.meetingID} />
                        ) 
                    })
                }
            </div>
        )
    }

}
export default MeetingDetails;