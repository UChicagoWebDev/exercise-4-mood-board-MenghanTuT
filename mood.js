const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

const Maximum_Number_of_Suggestions = 15
const Maximum_Number_of_ResultImage = 18

function runSearch() {

  // Clear the results pane and open new one
  clearResultsPane();
  clearSuggestions();
  openResultsPane();
  // TODO: Build your query by combining the bing_api_endpoint and a query attribute
  const searchTerm = document.querySelector("#SearchArea input").value;
  //  named 'q' that takes the value from the search bar input field.
  const queryUrl = `${bing_api_endpoint}?q=${encodeURIComponent(searchTerm)}`;
        // alert(queryUrl)
  // TODO: Construct the request object and add appropriate event listeners to
  // handle responses. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest

  //   - Look for your data in event.target.response
  //   - When adding headers, also include the commented out line below. See the API docs at:
  // https://docs.microsoft.com/en-us/bing/search-apis/bing-image-search/reference/headers
  //   - When you get your responses, add elements to the DOM in #resultsImageContainer to
  //     display them to the user
  //   - HINT: You'll need to ad even listeners to them after you add them to the DOM
  //
  // request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  let request = new XMLHttpRequest();
  request.open("GET", queryUrl);
  //   - You'll want to specify that you want json as your response type
  request.responseType = 'json';
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  //   - add appropriate event listeners to handle responses
  //   Look for your data in event.target.response
  request.addEventListener("load", function() {
    // console.log(request.response);
    displayResults(request.response); 
    displaySuggestions(request.response);
  });
  request.send();
  return false;  // Keep this; it keeps the browser from sending the event
                  // further up the DOM chain. Here, we don't want to trigger
                  // the default form submission behavior.
}

function displaySuggestions(response) {
  const suggestionsList = document.getElementById("suggestionslist");
  response.relatedSearches.slice(0, Maximum_Number_of_Suggestions).forEach(suggestion => {
    const listItem = document.createElement('li');
    listItem.textContent = suggestion.text;
    listItem.addEventListener('click', () => {
      document.querySelector("#SearchArea input").value = suggestion.text; 
      runSearch(); 
    });
    suggestionsList.appendChild(listItem);
  });
  // for (i,suggestion in response.relatedSearches)
  // {
  //   console.log(suggestion);
  //   const listItem = document.createElement('li');
  //   listItem.textContent = suggestion.text;
  //   listItem.addEventListener('click', () => {
  //     document.querySelector("#SearchArea input").value = suggestion.text; 
  //     runSearch(); 
  //   });
  //   suggestionsList.appendChild(listItem);
  // }
}

function displayResults(response) {
  const resultsContainer = document.getElementById("resultsImageContainer");
  response.value.slice(0, Maximum_Number_of_ResultImage).forEach(image => {
    const wrapperDiv = document.createElement("div");
    wrapperDiv.className = "resultImage";
    const img = document.createElement("img");
    img.src = image.contentUrl;
    img.addEventListener("click", () => addToMoodBoard(image.contentUrl));
    wrapperDiv.appendChild(img);
    resultsContainer.appendChild(wrapperDiv);
  });
}

function addToMoodBoard(imageUrl) {
  const board = document.getElementById("board");
  const wrapperDiv = document.createElement("div");
  wrapperDiv.className = "savedImage";
  const img = document.createElement("img");
  img.src = imageUrl;
  wrapperDiv.appendChild(img);
  board.appendChild(wrapperDiv);
}

//Clear the displayed concept results
function clearSuggestions() { 
  // Select the suggestions list
  const suggestionsList = document.querySelector('.suggestions ul');
  // Remove all child elements
  while (suggestionsList.firstChild) {
    suggestionsList.removeChild(suggestionsList.firstChild);
  }
}

//Clear the displayed img results
function clearResultsPane(){
  const resultsContainer = document.getElementById("resultsImageContainer");
  while (resultsContainer.firstChild) {
    resultsContainer.removeChild(resultsContainer.firstChild);
  }
}

//Clear the selected imgs
function clearSlectedImgboard() {
  const SelectedImgboard = document.getElementById("board");
  while (SelectedImgboard.firstChild) {
    SelectedImgboard.removeChild(SelectedImgboard.firstChild);
  }
}

function openResultsPane() {
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

// This will 
// Clear Suggestion 
clearSuggestions()
// Clear the mood board
clearSlectedImgboard()

document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {runSearch()}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") {closeResultsPane()}
});
