"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">

      ${favHeartHTML(story,currentUser)}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


//submit new story
async function submitNewStory(e){
  console.debug(`submitNewStory`);
  e.preventDefault();

  //get data from table
  const author = $(`#new-author`).val();
  const title = $(`#new-title`).val();
  const url = $(`#new-url`).val();
  const newStory = { title, author, url};

  const story = await storyList.addStory(currentUser,newStory);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  //reset form after submit
  $submitForm.slideUp(`slow`);
  $submitForm.trigger(`reset`);

}

$submitForm.on(`submit`,submitNewStory);

//delete story
async function deleteStoryClick(e){
  console.debug(`deleteStory`);

  const $target = $(e.target);
  const $storyId = $target.closest(`li`).attr(`id`);

  //delete story when click on trash can
  if($target.hasClass(`fas fa-trash`)){
    await storyList.deleteStory(currentUser,$storyId);
    $target.parent().remove();
  }

}

$myStory.on(`click`,deleteStoryClick);



//handle favorite stories
async function handleFavStories(e){
  console.debug(`handleFavStory`);

  // get the select story
  const $target = $(e.target);
  const $storyId = $target.closest(`li`).attr(`id`);
  const story = storyList.stories.find(s => s.storyId === $storyId);

  // like fav story
  if($target.hasClass(`fa-heart far`)){
    await currentUser.addFavorite(story);
    $target.closest(`i`).toggleClass(`far fas`);
    console.log('like fav story')
  }
  //delete fav story
  else if($target.hasClass(`fa-heart fas`)){
    await currentUser.deleteFavorite(story); 
    $target.closest(`i`).toggleClass(`far fas`);
    console.log('delete fav story')
  }
}

$storiesList.on(`click`,handleFavStories);

//show favorite story page
function showFavoritePage(){
  console.debug(`showFavoritePage`);

  $favoriteStory.empty();
  for(let story of currentUser.favorites){
    const $story = generateStoryMarkup(story);
    $favoriteStory.append($story);
  }

  $favoriteStory.show();
}

//show my story page
function showMyPage(){
  console.debug(`showMyPage`);

  $myStory.empty();
  for(let story of currentUser.ownStories){
    const $story = generateStoryMarkup(story);
    $story.prepend(deleteStoryHTML());
    $myStory.append($story);
  }
  $myStory.show();
  //show all trash symbol
  // $(`#my-story li i`).show();
}


//append favorite symbol
function favHeartHTML(story,user){
  //avoid error if user not login
  if(!currentUser) return ``;

  //check story is favorite before 
  const isFav = user.checkFav(story);
  const type = isFav ? "fas" : `far`;
  return `
  <span><i class="fa-heart ${type}"></i></span>
  `
}

//append delete symbol
function deleteStoryHTML(){
  return `<i class="fas fa-trash"></i>`
}