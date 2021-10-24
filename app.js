const filterElm = document.querySelector(".search-input");
const submitInput = document.querySelector(".submit-input");
const submitBtn = document.querySelector(".submit-btn");
const addOrUpdateBtn = document.querySelector("form")
const tweetListUl = document.querySelector(".collection");
const message = document.querySelector(".message");

let allTweetData = getDataFromLocalStorage();

function setDataToLocalStorage(tweet) {
    let tweets = '';
    if (localStorage.getItem("totalTweets") === null) {
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
    if (localStorage.getItem("totalTweets") === null) {
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
    if (result.length === 0) location.reload();
}

// get tweet data from allTweetData
function showTweetData(tweetList) {
    tweetListUl.innerHTML = '';
    let li = "";
    if (allTweetData.length === 0) {
        message.innerHTML = "Write your tweet"
    }
    tweetList.forEach(tweet => {
        li = document.createElement("li");
        li.className = "collection-item";
        li.id = `tweet-${tweet.id}`
        li.innerHTML = `<strong>${tweet.tweet}</strong>
        <button class="btn btn-danger delete-tweet"> Delete</button> 
        <button class="btn btn-info edit-tweet">Edit</button> 
          <span>${tweet.time} </span>`

        tweetListUl.appendChild(li)
        message.innerHTML = '';
    })

}
// showTweetData(allTweetData);

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


function findTweet(id) {
    return allTweetData.find(tweet => tweet.id === id)
}

function populateTweetData(foundTweet) {
    submitInput.value = foundTweet.tweet;
    // console.log(foundTweet.tweet);

    const idElm = `<input type="hidden" id="id" value=${foundTweet.id} />`
    const editElmBtn = `<button class="btn btn-info edit-tweet ms-5 mt-1">Update</button>`

    if (document.querySelector('#id')) {
        document.querySelector('#id').setAttribute('value', foundTweet.id);
    } else if (document.querySelector('.edit-tweet')) {
        document.forms[0].insertAdjacentHTML('beforeend', idElm)
        document.forms[0].insertAdjacentHTML('beforeend', editElmBtn)
    }

    submitBtn.style.display = 'none';
}


function deleteOrEditTweet(e) {
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
    } else if (e.target.classList.contains('edit-tweet')) {
        const target = e.target.parentElement;
        /// getting ID
        const id = parseInt(target.id.split("-")[1]);

        const foundTweet = findTweet(id)
        console.log(foundTweet);

        populateTweetData(foundTweet);
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

function editTweet(e) {
    const tweet = submitInput.value;

    const id = parseInt(e.target.previousElementSibling.value, 10)
    // console.log(e.target.previousElementSibling);

    const tweetsAfterEdited = allTweetData.map((tweets) => {
        if (tweets.id === id) {
            return {
                ...tweets,
                tweet,
            }
        } else { return tweets }
    })
    allTweetData = tweetsAfterEdited;
    // console.log(allTweetData);
    /// update UI
    showTweetData(allTweetData)
}

function resetUI() {
    // remove update button
    // remove id
    // show submit/tweet button
    submitBtn.style.display = 'block';
    document.querySelector('.edit-tweet').remove();
    document.querySelector('#id').remove();
}
function addOrUpdateTweet(e) {
    e.preventDefault();
    if (e.target.classList.contains("submit-btn")) {
        getTweetInput(e)
    } else if (e.target.classList.contains('edit-tweet')) {
        editTweet(e)
        // reset input
        submitInput.value = '';
        /// reset UI
        resetUI()
    }
}

/// event listeners
// submitBtn.addEventListener("click", getTweetInput)
function loadAllEventListeners() {
    tweetListUl.addEventListener("click", deleteOrEditTweet)
    window.addEventListener("DOMContentLoaded", showTweetData.bind(null, allTweetData))
    addOrUpdateBtn.addEventListener("click", addOrUpdateTweet)

    filterElm.addEventListener('keyup', filterTweets)
}

// call all the events
loadAllEventListeners()