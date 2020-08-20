import React from "react";
import {apiTweetAction} from './lookup'

export function ActionBtn(props){
    const {tweet, action, didPerformAction} = props
    const likes = tweet.likes ? tweet.likes: 0
    const className = props.className ? props.className: 'btn btn-primary btn-sm'
    
    const handleActionBackendEvent = (response, status) => {
        console.log(response, status)
        if((status === 200 || status === 201) && didPerformAction){
            didPerformAction(response, status)
        }
    }

    const handleClick = (event) => {
        event.preventDefault()
        apiTweetAction(tweet.id, action.type, handleActionBackendEvent)
    }
    const display = action.type === 'like' ? `${likes} ${action.display}` : action.display
    return <button className={className} onClick={handleClick}>{display}</button>
}