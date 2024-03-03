//get DOM elements 
const mainNavbar = document.querySelectorAll(".left-side-nav")
const loginNav = document.querySelector("#user-crediential")
const userProfileNav = document.querySelector("#user-profile-nav")
const userProfileInfo = document.querySelector(".user-profile-Info")
const brandNav = document.querySelector("#brand")

/*=======================================================================================*/
// hide almost all elements of the page and redisplay just what we want to display to make the page dynamic.
function hidePageComponetes(){
   const componentsList = [
        allStoriesList,
        favoritesList,
        myOwnStoryList,
        submitForm,
        loginForm,
        signupForm,
        userProfileInfo,
    ]
    componentsList.forEach(hiddenElements => hiddenElements.style.display="none")
    
}

/*=======================================================================================*/
// used as a home of the webpage, hide all the elements and redisplay all the stories 
function brandNavClick (){
    hidePageComponetes();
    putStoriesOnWebPage();
}
brandNav.addEventListener("click", brandNavClick)

/*=======================================================================================*/
// display the login and signup form for the user to login or sign up into the pages using their credentials 
function loginSignupNav(){

    hidePageComponetes();
    signupForm.style.display = "flex";
    loginForm.style.display = "flex";
    storiesContainer.style.display = "none";
}
loginNav.addEventListener("click", loginSignupNav);

/*=======================================================================================*/
/*update navs on user login these includes 
    display the main navs (submit, favorites and myStories)
    hide login/signup nav
    display logout nav
    diaplay current user profile/username nav
    */
function updateNavOnLogin(){
    mainNavbar.forEach(anchor =>{anchor.style.display = 'flex';})

    loginNav.style.display = "none";
    logoutNav.style.display = "flex";
    userProfileNav.textContent = (`${currentUser.username}`);
    userProfileNav.style.display = "block";
}
/*=======================================================================================*/
//handle a click on "sumbit" stories nav
// hide every element except submit stories form and all stories list.
const submitNav = document.querySelector("#submit-story");

//handle a click on "sumbit" stories nav
function submitStoryNav(event){
    event.preventDefault();
    hidePageComponetes()
    allStoriesList.style.display = "block"
    submitForm.style.display = "flex"

}
submitNav.addEventListener("click", submitStoryNav)

/*=======================================================================================*/

//handle a click event on "favorites" nav 
//show all favorites list 
const favoriteStoriesNavb = document.querySelector("#user-favorite")
function favoriteStoriesNav(event){
    event.preventDefault()

    hidePageComponetes()
    addFavoritesListOnWebpage()
}
favoriteStoriesNavb.addEventListener("click", favoriteStoriesNav)

/*=======================================================================================*/

//handle a click on "my stories" nav
// display all the stories which are posted by the current user.
const myStoryNav = document.querySelector("#my-own-Story");

function myStoriesNav (event){
    event.preventDefault();

    hidePageComponetes();
    addMyOwnStoryListOnWebpage();
    myOwnStoryList.style.display = "block";
    
}
myStoryNav.addEventListener("click", myStoriesNav)

/*=======================================================================================*/
//handles a click on user profile nav 
//display only current user profile/ information
function userProfileNavbar(event){
    event.preventDefault();
    hidePageComponetes();
    userProfileInfo.style.display = "block";
}
userProfileNav.addEventListener("click", userProfileNavbar);

