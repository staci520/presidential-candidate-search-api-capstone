'use strict';




function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

//VOTESMART API

function getVoteSmart(query, candidateName) {
  const apiKey = "6180b80d1ce369c999188893e5e264ec"
  const searchURL = 'https://api.votesmart.org/Address.getCampaignWebAddress';
  // const searchURL2 = 'http://api.votesmart.org/CandidateBio.getBio';
  const params = {
    key: apiKey,
    candidateId: query,
  };

  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString + '&o=JSON';

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayVoteSmart(responseJson, candidateName))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

//Display VoteSmart

function displayVoteSmart(responseJson, candidateName) {
  // if there are previous results, remove them
  console.log("VS ====>", responseJson);
  console.log(typeof responseJson.error);

  $('#results-VoteSmart-list').empty();
  $('#candidateName').empty();

  if (typeof responseJson.error === 'object') {
    console.log(`Campaign Web address for ${candidateName} no longer available.`)
    $("#candidateName").replaceWith(`<b><h5 id="candidateName">Campaign web address for ${candidateName} no longer available.</h5></b>`)
    return;
  }

  for (let obj in responseJson) {
    console.log(`VoteSmart Bio: ${responseJson[obj].generalInfo.linkBack}`)
    $("#candidateName").replaceWith(`<b><h4 id="candidateName">${responseJson[obj].candidate.firstName} ${responseJson[obj].candidate.lastName}</h4></b>`)
    $('#results-VoteSmart-list').append(
      `<li><a href="${responseJson[obj].generalInfo.linkBack}" target="_blank"> <i class="fas fa-binoculars fa-4x"></i><span>VoteSmart</span></a></li>`)

    for (let i = 0; i < responseJson[obj].address.length; i++) {
      //console.log("VS Candidate Link ===>",responseJson[obj].address[i].webAddress)
      const webAddressType = responseJson[obj].address[i].webAddressType;
      const webAddress = responseJson[obj].address[i].webAddress;
      if (webAddressType === "Email") {
        $('#results-VoteSmart-list').append(`<li><a href="mailto:${webAddress}" target="_blank"> 
          <i class="fas fa-envelope-square fa-4x"></i><span>Mail</span></a></li>`)

      } else if (webAddressType === "Webmail") {
        $('#results-VoteSmart-list').append(`<li><a href="${webAddress}" target="_blank"> 
          <i class="fas fa-envelope-square fa-4x"></i><span>Mail</span></a></li>`)

      } else if (webAddressType === "Website - Twitter" || webAddress === "https://twitter.com/WayneMessam") {
        $('#results-VoteSmart-list').append(`<li><a href="${webAddress}" target="_blank"> 
          <i class="fab fa-twitter-square fa-4x"></i><span>Twitter</span></a></li>`)

      } else if (webAddressType === "Website - Facebook") {
        $('#results-VoteSmart-list').append(`<li><a href="${webAddress}" target="_blank"> 
          <i class="fab fa-facebook-square fa-4x"></i><span>Facebook</span></a></li>`)

      } else if (webAddressType === "Website - Instagram") {
        $('#results-VoteSmart-list').append(`<li><a href="${webAddress}" target="_blank"> 
          <i class="fab fa-instagram fa-4x"></i><span>Instagram</span></a></li>`)

      } else if (webAddressType === "Website - YouTube") {
        $('#results-VoteSmart-list').append(`<li><a href="${webAddress}" target="_blank"> 
          <i class="fab fa-youtube-square fa-4x"></i><span>YouTube</span></a></li>`)

      } else if (webAddressType === "Website - LinkedIn") {
        $('#results-VoteSmart-list').append(`<li><a href="${webAddress}" target="_blank"> 
          <i class="fab fa-linkedin fa-4x"></i><span>LinkedIn</span></a></li>`)

      } else if (webAddress === "https://www.snapchat.com/add/bernie.sanders" || webAddress === "https://www.snapchat.com/add/GovernorBullock") {
        $('#results-VoteSmart-list').append(`<li><a href="${webAddress}" target="_blank"> 
              <i class="fab fa-snapchat-square fa-4x"></i><span>SnapChat</span></a></li>`)

      } else if (webAddress === "https://www.flickr.com/photos/146043801@N08/with/31817149657/") {
        $('#results-VoteSmart-list').append(`<li><a href="${webAddress}" target="_blank"> 
            <i class="fab fa-flickr fa-4x"></i><span>Flickr</span></a></li>`)

      } else if (webAddress === "https://medium.com/@Tom_Steyer" || webAddress === "https://medium.com/@TulsiGabbard" || webAddress === "https://medium.com/@KamalaHarris" || webAddress === "https://medium.com/@stevebullock") {
        $('#results-VoteSmart-list').append(`<li><a href="${webAddress}" target="_blank"> 
          <i class="fab fa-medium fa-4x"></i><span>Medium</span></a></li>`)

      } else  {
        $('#results-VoteSmart-list').append(`<li><a href="${webAddress}" target="_blank"> 
          <i class="fas fa-bullhorn fa-4x"></i><span>Website</span></a></li>`)
      } 
    }
  };
  ;
}

// NEWS API

function getNews(query, maxResults = 2) {
  const apiKey = "5d34f3b1e65347169f2b4a651b8fd8ea"
  const searchURL1 = 'https://newsapi.org/v2/top-headlines';
  const searchURL2 = 'https://newsapi.org/v2/everything'
  const params = {
    q: query,
    language: "en",
  }; 
  const queryString = formatQueryParams(params)
  const url1 = searchURL1 + '?' + queryString;
  const url2 = searchURL2 + '?' + queryString;

  $('#results-News-list').empty()
  console.log(url1, url2);

  const options = {
    headers: new Headers({
      "X-Api-Key": apiKey
    })
  };

  //fetch top headlines
  fetch(url1, options)
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
  //fetch everything
  fetch(url2, options)
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

//Display News API

function displayNews(responseJson, maxResults) {
  // if there are previous results, remove them
  console.log(responseJson);
  // $('#results-News-list').empty();
  // iterate through the articles array, stopping at the max number of results
  for (let i = 0; i < responseJson.articles.length & i < maxResults; i++) {
    let publishedAt = responseJson.articles[i].publishedAt.substring(0, 10);
    $('#results-News-list').append(
      `<li><h4><a href="${responseJson.articles[i].url}" target="_blank" >${responseJson.articles[i].title}</a></h4><br>
      <p>${responseJson.articles[i].source.name} by ${responseJson.articles[i].author}, ${publishedAt}</p><br>
      <p><img src='${responseJson.articles[i].urlToImage}'>
      ${responseJson.articles[i].description}</p>
      </li>`
    )
  };
};

// YOUTUBE

function getYouTubeVideos(candidateName) {

  const apiKeyYouTube = 'AIzaSyAIB_3mci8kbpTsvczAENat_5w-HwYgF00';
  const searchUrlYouTube = 'https://www.googleapis.com/youtube/v3/search';
  const params = {
    key: apiKeyYouTube,
    q: candidateName,
    part: 'snippet',
    maxResults: '3',
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

//Display YouTube

function displayYouTubeVideos(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-YouTube-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.items.length; i++) {
    const youTubeUrl = 'https://www.youtube.com/watch?v=' + responseJson.items[i].id.videoId;
    let publishedAt = responseJson.items[i].snippet.publishedAt.substring(0, 10);
    console.log(publishedAt);
    console.log(youTubeUrl);
    $('#results-YouTube-list').append(
      `<li><h4><a href="${youTubeUrl}" target="_blank"> ${responseJson.items[i].snippet.title}</a></h4><br>
      <p>${publishedAt}</p>
      <p><img src='${responseJson.items[i].snippet.thumbnails.default.url}'>
      ${responseJson.items[i].snippet.description}</p>
      </li>`
    )
  };
};


//Watch click 

function watchCandidate() {

  $('.Image').click(function (event) {
    event.preventDefault();

    // console.log('Image clicked: ' + $(this).attr('alt'));
    const candidateName = $(this).attr('alt')
    // get candidate object from STORE 
    let obj = STORE.find(data => data.candidateName === candidateName);
    console.log(obj);
    // getNews();
    $('.results-container').get(0).scrollIntoView()
    getVoteSmart(obj.candidateId, candidateName)
    getYouTubeVideos(candidateName);
    // alert("Candidate Clicked!")
    getNews(candidateName)
  });
}

$(watchCandidate);

//Hover effect on image 

$(document).ready(function () {
  $(".Image").css("opacity", 1.0);
  $(".Image").hover(function () {
    $(this).animate({ opacity: 0.65 }, 500);
  }, function () {
    $(this).animate({ opacity: 1.0 }, 500);
  });
});
