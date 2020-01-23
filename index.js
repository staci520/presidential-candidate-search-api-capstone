'use strict';



function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}
// NEWS API

function getNews(query, maxResults=10) {
    const apiKey = "5d34f3b1e65347169f2b4a651b8fd8ea"
    const searchURL = 'https://newsapi.org/v2/everything';
    const params = {
    q: query,
    language: "en",
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  const options = {
    headers: new Headers({
      "X-Api-Key": apiKey})
  };

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayNews(responseJson, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayNews(responseJson, maxResults) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-News-list').empty();
  // iterate through the articles array, stopping at the max number of results
  for (let i = 0; i < responseJson.articles.length & i<maxResults ; i++){
    // for each video object in the articles
    //array, add a list item to the results 
    //list with the article title, source, author,
    //description, and image
    $('#results-News-list').append(
      `<li><h3><a href="${responseJson.articles[i].url}">${responseJson.articles[i].title}</a></h3>
      <p>${responseJson.articles[i].source.name}</p>
      <p>By ${responseJson.articles[i].author}</p>
      <p>${responseJson.articles[i].description}</p>
      <img src='${responseJson.articles[i].urlToImage}'>
      </li>`
    )};
  //display the results section  
//   $('#results').removeClass('hidden');
};



// YOUTUBE

function getYouTubeVideos(candidateName) {
    const apiKeyYouTube = 'AIzaSyA_nz1y-bmMAb3SuqMa4HtEyUYY7r5BlI4';
    const searchUrlYouTube = 'https://www.googleapis.com/youtube/v3/search';
    const params = {
        key: apiKeyYouTube,
        q: candidateName,
        part: 'snippet',
        maxResults: '5',
        type: 'video'
    };
    const queryString = formatQueryParams(params)
    const url = searchUrlYouTube + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayYouTubeVideos(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function displayYouTubeVideos(responseJson) {
    // if there are previous results, remove them
    console.log(responseJson);
    $('#results-YouTube-list').empty();
    // iterate through the items array
    for (let i = 0; i < responseJson.items.length; i++) {
        // for each video object in the items 
        //array, add a list item to the results 
        //list with the video title, description,
        //and thumbnail
        $('#results-YouTube-list').append(
            `<li><h3>${responseJson.items[i].snippet.title}</h3>
      <p>${responseJson.items[i].snippet.description}</p>
      <img src='${responseJson.items[i].snippet.thumbnails.default.url}'>
      </li>`
        )
    };
    //display the results section  
    $('#results').removeClass('hidden');
};



function watchCandidate() {
    $('.Image').click(function (event) {
        event.preventDefault();
        // console.log('Image clicked: ' + $(this).attr('alt'));
        const candidateName = $(this).attr('alt')
        // getNews();
        getYouTubeVideos(candidateName);
        // alert("Candidate Clicked!")
        getNews(candidateName)
    });
}

$(watchCandidate);