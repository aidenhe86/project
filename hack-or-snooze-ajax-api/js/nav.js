"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);


/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}


//Show submit story form when click submit
function navSubmitStoryClick(evt){
  console.debug("navSubmitStoryClick", evt);
  hidePageComponents();
  $submitForm.show();
  $allStoriesList.show();
}

$submitStory.on(`click`,navSubmitStoryClick);

//show favorite story when click nav bar
function navFavClick(evt) {
  console.debug("navFavClick", evt);
  hidePageComponents();
  showFavoritePage();
}

$(`#nav-favorite-story`).on("click", navFavClick);

//show my story when click nav bar
function navMyStoryClick(evt) {
  console.debug("navFavClick", evt);
  hidePageComponents();
  showMyPage();
}

$(`#nav-my-story`).on("click", navMyStoryClick);