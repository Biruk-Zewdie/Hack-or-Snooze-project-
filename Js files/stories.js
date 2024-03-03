//This is the global list of the stories, an instance of StoryList
let storyList;

async function getAndShowStoriesOnStart() {
    storyList = await StoryList.getStories();
    const loadingMsg = document.querySelector("#stories-loading-msg");
    loadingMsg.remove();
    putStoriesOnWebPage();
}

/*=======================================================================================*/

function getDeleteBtnHtml() {
    return `
            <span class="trash-can">
              <i class="fas fa-trash-alt"></i>
            </span>`;
}

// use a class starType as a variable to switch a star between solid and regular.
// if it is favorite, it will be solid star, if not it stays regular. used to toggle the star.
function getStarBtnHtml(user, story) {
    const starType = user.isfavorite(story) ? "fas" : "far";
    return `<span class="star">
    <i class="${starType} fa-star"></i>
  </span>`

}
/*=======================================================================================*/

/* write a markup for a story when it's displayed on the page.
    //The mark up includes
        - A delete button - use the above getDeleteBtnHtml function 
        - A star button - get the above getStarBtnHtml function
        - The title of the story which is linked to the url of the story.   //targer = "_blank" in anchor tag means open in new tab
        - hostname 
        - Author 
        - user name 
        */

function markupStoryOnWebpage(story, showDeleteBtn = false) {

    //to verify the user is logged in as a current user 
    //so if their is someone logged in as a current user it will show a star. otherwise, it won't 
    const showStar = Boolean(currentUser);

    const markedUpDiv = `
            <div> 
                ${showDeleteBtn ? getDeleteBtnHtml() : ""}
                ${showStar ? getStarBtnHtml(currentUser, story) : ""}
                <a href="${story.url}" class = "story-title" target = "_blank" >${story.title}</a>
                <small class="story-hostname" >${story.getHostname()}</small>
                <div class="story-author"> by: ${story.author}</div>
                <div class= "story-username"> posted by: ${story.username}</div>
            </div>
        `
    const markedUpLI = document.createElement("li");
    markedUpLI.setAttribute("id", story.storyId);
    markedUpLI.innerHTML = markedUpDiv;
    return markedUpLI;
}
/*=======================================================================================*/

/*get stories from the API and display on a webpage.
iterate for every story we get from the API inorder to be marked up using markupStoryOnWebpage function.*/
const allStoriesList = document.querySelector('#display-stories')

async function putStoriesOnWebPage() {

    //to clear existing story lists from story list. To prevent from unnecesery duplication of stories.
    while (allStoriesList.firstChild) {
        allStoriesList.removeChild(allStoriesList.firstChild);
    }

    storyList = await StoryList.getStories();


    for (let story of storyList.stories) {
        const storyElement = markupStoryOnWebpage(story, false)
        allStoriesList.appendChild(storyElement);
    }
    allStoriesList.style.display = "block";

}
/*=======================================================================================*/
/*removeStoryFromThePage function allows the users to delete the story they have posted 
just by clicking the trashcan icon.*/
async function removeStoryFromThePage(event) {


    //to find the closest <li> ancestor element of the clicked element.
    const closestLi = event.target.closest("li");
    console.log(closestLi)

    // to get the id attribute of the closest <li> element, which represents the story ID.
    const storyId = closestLi.getAttribute("id");

    //use remove story method which is defined on datapart of API to remove the story form the API
    await storyList.removeStory(currentUser, storyId)

    //to update the story list and display remaining my own stories.
    await addMyOwnStoryListOnWebpage()

}

const myStories = document.querySelector("#display-my-stories")
myStories.addEventListener("click", function (event) {
   
    removeStoryFromThePage(event);
})
/*=======================================================================================*/
//display a new story after filling the story form and submit.

const submitForm = document.querySelector("#submit-form")

async function addNewStory() {


    const title = document.querySelector("#title").value
    const author = document.querySelector("#author").value
    const url = document.querySelector("#url").value

    const username = currentUser.username
    //get the story data from the form. 
    const storyData = { title, author, url, username }
    console.log(storyData);
    //post the storydata on the API and display markup story.
    console.log(currentUser)

    const newStory = await storyList.addStory(currentUser, storyData)
    const storyElement = markupStoryOnWebpage(newStory, false);

    //prepend the story in a story list.
    const allStoriesList = document.querySelector('#display-stories')
    allStoriesList.insertBefore(storyElement, allStoriesList.firstChild);

    //after submit the story and hide and reset the submit form
    submitForm.style.display = "none";
    submitForm.reset();

}
//add an event listener to listen a form submit.
submitForm.addEventListener("submit", addNewStory)


/*=======================================================================================*/

//add favorites list on a webpage

const favoritesList = document.querySelector("#favorite-stories-list")

async function addFavoritesListOnWebpage() {

    //to clear the existing contents from favorite story list. To prevent from unnecesery duplications of stories.
    while (favoritesList.firstChild) {
        favoritesList.removeChild(favoritesList.firstChild);
    }


    //if the user has no list of favorites, display that there is no stories in the list
    if (currentUser.favorites.length === 0) {
        const noFavStoryH3 = document.createElement("h3");
        noFavStoryH3.innerHTML = "no favorite story added yet!"
        favoritesList.appendChild(noFavStoryH3)
    } else {

        // iterate over a list of user favorites stories and display them on the page.
        for (let favStory of currentUser.favorites) {
            const favoriteStories = markupStoryOnWebpage(favStory)
            favoritesList.appendChild(favoriteStories)
        }
    }
    favoritesList.style.display = 'block';

}
/*=======================================================================================*/

/*toggleStarBtn function toggles the star between solid star and regular star */

const storiesListContainer = document.querySelector(".stories-list-container")

    storiesListContainer.addEventListener("click", async function (event) {
        
        const starElement = event.target.closest(".star");
        if (starElement) {

            const closestLi = event.target.closest("li");
            const storyId = closestLi.getAttribute("id");    //targeted story ID

            //get the story from the array of stories just by clicking the star button
            //test each element of the array.
            // checks if the storyId property of the current story object (s) matches the target storyId.
            // If a matching story object is found, .find() returns that object.
            const story = storyList.stories.find(s => s.storyId === storyId);

            //if the class contains "fas" means solid star which is the story is in favorites list
            //so clicking on the star removes from favorites list and regular star.

            if (event.target.classList.contains("fas")) {
                await currentUser.removeFavorites(story);
                event.target.classList.remove("fas")
                event.target.classList.add("far")
                
                
                /* we can use toggle method
                event.target.closest("i").classList.toggle("fas", false)
                event.target.closest("i").classList.toggle("far", true) */
                
            } else {
                await currentUser.addFavorites(story)
                event.target.classList.remove("far")
                event.target.classList.add("fas")

                /* we can use toggle method on <i> element(star)
                event.target.closest("i").classList.toggle("fas", false)
                event.target.closest("i").classList.toggle("far", true) */
            }
        }
});

/*=======================================================================================*/
//add a story submited by a user in my stories list.
//add a delete button infront of the story, so showDeleteBtn attribute in markupStoryOnWebpage function will be true.
const myOwnStoryList = document.querySelector("#display-my-stories")
async function addMyOwnStoryListOnWebpage() {

    while (myOwnStoryList.firstChild) {
        myOwnStoryList.removeChild(myOwnStoryList.firstChild)
    }
    console.log(currentUser.myStories);


    //if the user didn't submit his own story, the list show "no story added yet"
    if (currentUser.myStories.length === 0) {
        const noStoryH3 = document.createElement("h3");
        noStoryH3.innerHTML = "no story added yet!";
        myOwnStoryList.appendChild(noStoryH3)

    } else {
        //iterate over list of own stories and display markup list 
        for (let ownStory of currentUser.myStories) {
            const newOwnStory = markupStoryOnWebpage(ownStory, true);
            myOwnStoryList.appendChild(newOwnStory);
        }
    }
    myOwnStoryList.style.display = "block";
}