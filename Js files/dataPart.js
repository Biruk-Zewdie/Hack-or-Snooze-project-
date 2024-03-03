/* This Js file handles the communication between Hack or Snooze API and our webpage. It has 3 classes 
    1. Users 
    2. Story &
    3. Stories */

/*=============================================================================================================================*/
class User {
    constructor({ name, username, createdAt, favorites = [], myStories = [] },token) {
        this.token = token;  //generate and store a login token for a spacific user to get into the API.
        this.name = name;
        this.username = username;
        this.createdAt = createdAt;

//instantiate a story object since we put favorite story form storylist in the array
        this.favorites = favorites.map(newStory => new Story(newStory)); 
// instantiate a story object since our own story will appear on the story array, then we dislay on story tab
        this.myStories = myStories.map(newStory => new Story(newStory)); 
    }

/*=======================================================================================*/
//The signup method doesn't depend on any instance-specific data or behavior. 
//It operates solely on the parameters passed to it (i.e. username, password, name) and the response data from the server. 
//Therefore, declaring it as a static method makes sense because it doesn't need access to instance variables or methods.
// handles signup of a new user 

    static async Signup(name, username, password) {
        const signupResult = await axios({
            url:"https://hack-or-snooze-v3.herokuapp.com/signup",
            method:"POST",
            data:{ user: { name, username, password } }
        });

        /* create a new user instance and put the data like name, username, createdAt, 
        their favorites and their stories submitted by themselves on the API */
        let {user} = signupResult.data;
        return new User(
            {
                name: user.name,
                username: user.username,
                createdAt: user.createdAt,
                favorites: user.favorites,
                myStories: user.myStories
            },signupResult.data.token)
    }
/*=======================================================================================*/
/* handles logging in  of user using their crediential on the API, make user instance and 
return the neccessary data form the API */
    static async login(username, password) {
        const loginResult = await axios({
            url:"https://hack-or-snooze-v3.herokuapp.com/login", 
            method:"POST", 
            data: {user: { username, password }}
        })

        let {user} = loginResult.data;
        return new User(
            {
                name: user.name,
                username: user.username,
                createdAt: user.createdAt,
                favorites: user.favorites,
                myStories: user.myStories
            },
            loginResult.data.token);
    }

/*=======================================================================================*/
/*handles the situation when the user is relog in using saved username and password
if the user closes the page before logged out, the user can relogin directly without using credential */ 

    static async re_loginUsingSavedCrediantial(username, token) {
        try {
            const reLoginResult = await axios({
                url:`https://hack-or-snooze-v3.herokuapp.com/users/${username}`, 
                method:"GET",
                params: {token} 
            })

            let {user} = reLoginResult.data

            return new User(token,
                {
                    name: user.name,
                    username: user.username,
                    createAt: user.createdAt,
                    favorites: user.favorites,
                    myStories: user.myStories
                })
        } catch (err) {
            console.log("relogin using saved crediantials failed", err)
            return null;
        }
    }
/*=======================================================================================*/
/*This method is an instance method  - means it operates on instance spacific data and called 
on individual instances of class in this case on favorites 
handles addition of favorite stories of the user on the API*/

    async addFavorites(story) {
        this.favorites.push(story)
        const token = this.token;
        await axios.post({
            url:`https://hack-or-snooze-v3.herokuapp.com/users/${this.username}/favorites/${story.storyId}`,
            method:"POST", 
            data:{ token }})

    }

/*=======================================================================================*/
/* removeFavorites method handles removing of favorite stories from the API*/

    async removeFavorites(story) {
        this.favorites = this.favorites.filter(newStory => newStory.storyId !== story.storyId)
        const token = this.token;
        const removeStoryFromFav = await axios({
            url:`https://hack-or-snooze-v3.herokuapp.com/users/${this.username}/favorites/${story.storyId}`, 
            method:"DELETE",
            data:{ token }})

    }
/*=======================================================================================*/

/* I will use it in stories.js to generate a starButton
to know whether the story is selected as favorite or not.
this method checks if a story clicked is exist in the list of favorite stories or not.
if the story id of story is the same as the story id of new story. that means the story is available in favorites */

    isfavorite(story) {
        return (this.favorites.some(newStory => newStory.storyId === story.storyId));
    }

}

/*=============================================================================================================================*/
/*Story class instantiate properties(attributes) form the data object about story from the API */
class Story {
    constructor({author, createdAt, storyId, title, url, username}) {
        this.author = author;
        this.createdAt = createdAt;
        this.storyId = storyId;
        this.title = title;
        this.url = url;
        this.username = username;
    }

    //separate out the host name from the url
    getHostname() {
        const url = new URL(this.url)
        return (url.host)
    }

}
/*=============================================================================================================================*/
/* List of Story instances: used by UI to show story lists in DOM.*/
class StoryList {
    constructor(stories) {
        this.stories = stories;
    }
/*=======================================================================================*/

// returning every story in stories array which is plain object from the a API in to an instance of stories.
    static async getStories() {
        const storiesResult = await axios({
            url:'https://hack-or-snooze-v3.herokuapp.com/stories',
            method:"GET"
         });
        const stories = storiesResult.data.stories.map(story => new Story(story))
        return new StoryList(stories);
    }

/*=======================================================================================*/
// addStory method is to add/post a story on the API by the user
    async addStory(user, { author, title, url }) {
        const token = user.token;
        const addStory_result = await axios({
            url:'https://hack-or-snooze-v3.herokuapp.com/stories',
            method:"POST",
            data: {token, story: { author, title, url } }
        });

        //create a story instance and add at the top of all stories list as well as mystories .
        const story = new Story(addStory_result.data.story);
        this.stories.unshift(story);
        user.myStories.unshift(story); 
        return (story)
    }
/*=======================================================================================*/
//removeStory method delete story what we have posted earlier using their storyId when it is clicked on the trash-can icon.
    async removeStory(user, storyId) {
        const token = user.token;
        const remove_result = await axios({
            url:`https://hack-or-snooze-v3.herokuapp.com/stories/${storyId}`,
            method:"DELETE", 
            data:{token}
        })

//filtering out the stories array from the story that is to be removed and put remaining stories in the new "story" array.  
//story id is used to filter a the array
        this.stories = this.stories.filter(story => story.storyId !== storyId);

// filtering out favorites list using story Id and remove story form the list
        user.favorites = user.favorites.filter(story => story.storyId !== storyId);
//filtering out myStories list using story Id and remove form myStories list.
        user.myStories = user.myStories.filter(story => story.storyId !== storyId);

    }

}

