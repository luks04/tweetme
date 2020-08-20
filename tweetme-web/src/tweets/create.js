import React, {createRef } from "react";
import {apiTweetCreate} from './lookup'

export function TweetsCreate(props){
    const textAreaRef = createRef()
    const {didTweet} = props
    const handleBackendUpdate = (response, status) => {
        if(status === 201){
            didTweet(response)
        } else{
            console.log(response)
            alert("An error ocurred, please try again")
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const newVal = textAreaRef.current.value  
        // Backend api request 
        if(newVal.length <= 200){
            apiTweetCreate(newVal, handleBackendUpdate)
        } else{
            alert("Too long")
        }
        
        textAreaRef.current.value = ''
    }

    return(
        <div className={props.className}>
            <form onSubmit={handleSubmit}>
                <textarea ref={textAreaRef} required={true} className='form-control' name='tweet'></textarea>
                <button type='submit' className='btn btn-primary my-3'>Tweet</button>
            </form>
        </div>
    )
}