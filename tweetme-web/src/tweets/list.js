import React, { useEffect, useState } from "react";
import {apiTweetList} from './lookup'
import {Tweet} from './detail'


export function TweetList(props){
    const [tweetsInit, setTweetsInit] = useState([])
    const [tweets, setTweets] = useState([])
    const [tweetsDidSet, setTweetsDidSet] = useState(false)
    //setTweetsInit(...props.newTweets.concat(tweetsInit))
    useEffect(() => {
        const final = [...props.newTweets].concat(tweetsInit)
        if(final.length !== tweets.length){
            setTweets(final)
        }
    }, [props.newTweets, tweets, tweetsInit])

    useEffect(() => {  
        if(tweetsDidSet === false){
            const handleTweetListLookup = (response, status) => {
                //console.log(response, status)
                if(status === 200) {
                    setTweetsInit(response)
                    setTweetsDidSet(true)
                }
                else{
                    alert("There was an error")
                }
            }
            apiTweetList(props.username, handleTweetListLookup)
        }
    }, [tweetsInit, tweetsDidSet, setTweetsDidSet, props.username])
    // Maybe the error is here!

    const handleDidRetweet = (newTweet) => {
        const updateTweetInit = [...tweetsInit]
        updateTweetInit.unshift(newTweet)
        setTweetsInit(updateTweetInit)
        const updateFinalTweets = [...tweets]
        updateFinalTweets.unshift(tweets)
        setTweets(updateFinalTweets)
    }
    return tweets.map((item, index) => {
            return <Tweet key={index} didRetweet={handleDidRetweet} tweet={item} className='container'/>
        })
}