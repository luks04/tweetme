import React, { useState, useEffect } from "react";
import {TweetList} from './list'
import {TweetsCreate} from './create'
import {apiTweetDetail} from './lookup'
import {Tweet} from './detail'

export function TweetsComponent(props){
    const [newTweets, setNewTweets] = useState([])

    const canTweet = props.canTweet === "false" ? false : true
    const handleNewTweet = (newTweet) => {
        // Backend api response handler
        let tempNewTweets = [...newTweets]
        tempNewTweets.unshift(newTweet)
        setNewTweets(tempNewTweets)
    }

    return(
        <div className={props.className}>
            {canTweet === true && <TweetsCreate didTweet={handleNewTweet} className='col-12 mb-3' />}
            <TweetList newTweets={newTweets} {...props}/> 
        </div>
    )
    //{...props} pass in all the props that the component has itself
}

export function TweetsDetailComponent(props){
    const {tweetId} = props
    const [didLookup, setDidLookup] = useState(false)
    const [tweet, setTweet] = useState(null)

    const handleBackendLookup = (response, status) => {
        if(status === 200){
            setTweet(response)
        }else{
            alert("There was an error finding your tweet.")
        }
    }
    useEffect(() => {
        if(didLookup === false){
            apiTweetDetail(tweetId, handleBackendLookup)
            setDidLookup(true)
        }
    }, [tweetId, didLookup, setDidLookup])

    return tweet === null ? null : <Tweet tweet={tweet} className={props.className} />
}