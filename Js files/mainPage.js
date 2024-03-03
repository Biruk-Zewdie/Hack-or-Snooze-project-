/*start function displays 
    webpage before the user logged in.
    webpage after the user logged in if the user is already logged in didn't logged out.
*/
async function start(){
    await checkForRememberedUser();
    await getAndShowStoriesOnStart()
    if (currentUser) updateUIOnUserLogin();
}
document.addEventListener("DOMContentLoaded", start);