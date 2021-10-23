const filterElm = document.querySelector(".search-input");
const submitInput = document.querySelector(".submit-input");
const submitBtn = document.querySelector(".submit-btn");
const tweetListUl = document.querySelector(".collection");
const message = document.querySelector(".message");

let allTweetData = getDataFromLocalStorage();

function setDataToLocalStorage(tweet) {
    let tweets = '';
    if(localStorage.getItem("totalTweets") === null) {
        tweets = [];
        tweets.push(tweet);
        localStorage.setItem("totalTweets", JSON.stringify(tweets))
    } else {
        tweets = JSON.parse(localStorage.getItem("totalTweets"));
        tweets.push(tweet);
        localStorage.setItem("totalTweets", JSON.stringify(tweets))
    }
}

function getDataFromLocalStorage() {
    let tweets = '';
    if(localStorage.getItem("totalTweets") === null) {
        tweets = [];
    } else {
        tweets = JSON.parse(localStorage.getItem("totalTweets"));
    } 
    return tweets;
}

function deleteDataFromLocalStorage(id) {
    let tweets = JSON.parse(localStorage.getItem("totalTweets"));
    let result = tweets.filter(tweet => {
        return tweet.id !== id
    })
    localStorage.setItem("totalTweets", JSON.stringify(result));
    if(result.length === 0) location.reload();
}

// get tweet data from allTweetData
function showTweetData(tweetList) {
    let li = "";
    if(allTweetData.length === 0) {
        message.innerHTML = "Write your tweet"
    }
    tweetList.forEach(tweet => {
        li = document.createElement("li");
        li.className = "collection-item";
        li.id = `tweet-${tweet.id}`
        li.innerHTML = `<strong>${tweet.tweet}</strong>  <button class="delete-tweet"> Delete</button> <span>${tweet.time} </span>`

        tweetListUl.appendChild(li)
        message.innerHTML = '';
    })

}
showTweetData(allTweetData);

function getTweetInput(e) {
    tweetListUl.innerHTML = '';
    const tweet = submitInput.value;
    const getMinutes = new Date().getMinutes();
    const getHour = new Date().getHours();
    const time = getHour + ':' + getMinutes;

    // getting id
    let id;
    if (allTweetData.length === 0) {
        id = 0;
    } else {
        id = allTweetData[allTweetData.length - 1].id + 1;
    }
    // Validation
    if (tweet === '') {
        alert('Please enter your tweet')
    } else {
        const data = {
            id: id,
            tweet: tweet,
            time: time
        }
        allTweetData.push(data);

        setDataToLocalStorage(data)

        showTweetData(allTweetData);
        submitInput.value = '';
        // tweetListUl.innerHTML = '';
    }
}

function deleteTweet(e) {
    /// removing from UI
    if (e.target.classList.contains('delete-tweet')) {
        const target = e.target.parentElement;
        // console.log(target);
        e.target.parentElement.parentElement.removeChild(target);
        /// removing from data store
        // getting ID
        const id = parseInt(target.id.split("-")[1]);

        const result = allTweetData.filter(tweets => {
            return tweets.id !== id;
        })
        allTweetData = result;
        deleteDataFromLocalStorage(id)
    }
}

function filterTweets(e) {
    const text = e.target.value.toLowerCase();

    document.querySelectorAll('.collection .collection-item').forEach(allTweet => {
        const tweetThatLookingFor = allTweet.firstElementChild.textContent.toLowerCase();
        if (tweetThatLookingFor.indexOf(text) === -1) {
            allTweet.style.display = 'none';
            message.innerHTML = 'No tweet found'
        } else {
            allTweet.style.display = 'block'
            message.innerHTML = '';
        }
    })
}

/// event listeners
submitBtn.addEventListener("click", getTweetInput)
tweetListUl.addEventListener("click", deleteTweet)
filterElm.addEventListener('keyup', filterTweets)