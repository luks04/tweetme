function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


export function backendLookup(method, endpoint, callback, data){
    let fetchStatus;
    let jsonData;
    if(data){
        jsonData = JSON.stringify(data)
    }
    const csrftoken = getCookie('csrftoken');

    let params;
    if(csrftoken){
        params = {
            method: method, 
            body: jsonData,
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            }
        }
    } else{
        params = {
            method: method,
        }
    }

    fetch('http://localhost:8000/api' + endpoint, params)
    .then((response) => {
        fetchStatus = response.status
        return response.json()
    })
    .then((jsonR) => {
        //console.log(jsonR)
        if(fetchStatus === 403){
            const detail = jsonR.detail
            if(detail === "Authentication credentials were not provided."){
                window.location.href = "/login?showLoginRequired=true"
            }
        }
        callback(jsonR, fetchStatus)
    })
    .catch(function(error) {
        console.log("error", error)
        callback({"message": "The request was an error"}, 400)
    })
}

/*
export function backendLookup(method, endpoint, callback, data){
    let jsonData;
    if(data){
        jsonData = JSON.stringify(data)
    }
    const xhr = new XMLHttpRequest()
    const url = 'http://localhost:8000/api' + endpoint
    xhr.responseType = 'json'
    const csrftoken = getCookie('csrftoken');
    xhr.open(method, url)
    xhr.setRequestHeader("Content-Type", "application/json")
    if(csrftoken){
        xhr.setRequestHeader("X-CSRFToken", csrftoken) // JWT token
    }
    xhr.onload = function(){
        if(xhr.status === 403){
            const detail = xhr.response.detail
            if(detail === "Authentication credentials were not provided."){
                window.location.href = "/login?showLoginRequired=true"
            }
        }
        callback(xhr.response, xhr.status)
    }
    xhr.onerror = function (e) {
        console.log("error", e)
        callback({"message": "The request was an error"}, 400)
    }
    xhr.send(jsonData)
}
*/