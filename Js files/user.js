//currentUser is an instance of currently logged in User.
let currentUser;

/* handles submission of login form (username and password)filled by the User.
if login is successful, 
 - save user crediential in a local storage  
 - update and setup the user interface */
const loginForm = document.getElementById("user-login-form");

async function submitLoginForm(event){
    event.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    currentUser = await User.login(username, password)
    loginForm.reset();
    saveUserCredientialInLocalStorage();
    updateUIOnUserLogin();
}
loginForm.addEventListener("submit", submitLoginForm)

/*=======================================================================================*/

//save the current user username and login token in a local storage, 
//so that the user will still be logged in if the page is refreshed. 
function saveUserCredientialInLocalStorage(){
    if(currentUser){
        localStorage.setItem("username",currentUser.username);
        localStorage.setItem("token", currentUser.token);
    }
}

/*=======================================================================================*/

//when a user login or signup the user interface will be updated as below 
//1. the navbar will be updated and contains submit, favorites, mystories, userProfile and logout buttons.
//2. stories will include favorite stars(for toggle) on the left 

const storiesContainer = document.querySelector(".stories-container")

async function updateUIOnUserLogin(){
    hidePageComponetes();
    putStoriesOnWebPage();
    allStoriesList.style.display = "block"
    updateNavOnLogin();
    generateUserProfile()
    storiesContainer.style.display = "block"

}

/*=======================================================================================*/
/* handles submission of signup form (name, username and password)filled by the User.
 -After new user signed up, his/her credential is saved in a local storage and login automatically, 
 - update and setup the user interface */
const signupForm = document.querySelector("#user-signup-form")
async function submitSignupForm(event){
    event.preventDefault();

    const name = document.querySelector("#signup-name").value;
    const username = document.querySelector("#signup-username").value;
    const password = document.querySelector("#signup-password").value;

    currentUser = await User.Signup(name, username, password)
    
    saveUserCredientialInLocalStorage()
    updateUIOnUserLogin();

    signupForm.reset();
}

signupForm.addEventListener("submit", submitSignupForm)

/*=======================================================================================*/
/*handles the user log out from the hack or snooze webpage
user credential will be removed from local storage and page will be refreshed*/
const logoutNav = document.querySelector("#logout-nav")
function userLogout(){
    localStorage.clear();
    location.reload();
}
logoutNav.addEventListener("click", userLogout);

/*=======================================================================================*/
//generate user prfile, change the text content of the corresponding form with current user profiles 
function generateUserProfile(){
    document.querySelector("#profile-name").textContent = currentUser.name;
    document.querySelector("#profile-username").textContent = currentUser.username;
    document.querySelector("#profile-created-date").textContent = currentUser.createdAt;  
}

/*=======================================================================================*/

//if there are user credientials in local storage, use them to stay logged in the user.
async function checkForRememberedUser(){
    const getUsername = localStorage.getItem("username");
    const getUserToken = localStorage.getItem("token");

    if (!getUserToken || !getUsername) return false;

    currentUser = await User.re_loginUsingSavedCrediantial(getUsername, getUserToken)

}
