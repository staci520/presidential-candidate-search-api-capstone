'use strict';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

//VOTESMART API

function getVoteSmart(query) {
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
    .then(responseJson => displayVoteSmart(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayVoteSmart(responseJson) {
  // if there are previous results, remove them
  console.log("VS ====>", responseJson);
  console.log(typeof responseJson.error);
  $('#results-VoteSmart-list').empty();
  $('#candidateName').empty();
  // iterate through the articles array, stopping at the max number of results
  // for (let i = 0; i < responseJson.articles.length ; i++) {


  for (let obj in responseJson) {
    console.log(`VoteSmart Bio: ${responseJson[obj].generalInfo.linkBack}`)
    $("#candidateName").replaceWith(`<h4 id="candidateName">Links for ${responseJson[obj].candidate.firstName} ${responseJson[obj].candidate.lastName}</h4>`)
    $('#results-VoteSmart-list').append(
      `<li><a href="${responseJson[obj].generalInfo.linkBack}" target="_blank"> <i class="fas fa-vote-yea fa-4x"></i></a></li><br>`)

    for (let i = 0; i < responseJson[obj].address.length; i++) {
      //console.log("VS Candidate Link ===>",responseJson[obj].address[i].webAddress)
      const webAddressType = responseJson[obj].address[i].webAddressType;
      const webAddress = responseJson[obj].address[i].webAddress;
      if (webAddressType === "Email") {
        $('#results-VoteSmart-list').append(`<li><a href="mailto:${webAddress}" target="_blank"> 
          <i class="fas fa-envelope-square fa-4x"></i></a></li>`)
      } else if (webAddressType === "Webmail") {
        $('#results-VoteSmart-list').append(`<li><a href="${webAddress}" target="_blank"> 
          <i class="fas fa-envelope-square fa-4x"></i></a></li>`)
      } else if (webAddressType === "Website - Twitter") {
        $('#results-VoteSmart-list').append(`<li><a href="${webAddress}" target="_blank"> 
          <i class="fab fa-twitter-square fa-4x"></i></a></li>`)
      } else if (webAddressType === "Website - Facebook") {
        $('#results-VoteSmart-list').append(`<li><a href="${webAddress}" target="_blank"> 
          <i class="fab fa-facebook-square fa-4x"></i></a></li>`)
      } else if (webAddressType === "Website - Instagram") {
        $('#results-VoteSmart-list').append(`<li><a href="${webAddress}" target="_blank"> 
          <i class="fab fa-instagram fa-4x"></i></a></li>`)
      } else if (webAddressType === "Website - YouTube") {
        $('#results-VoteSmart-list').append(`<li><a href="${webAddress}" target="_blank"> 
          <i class="fab fa-youtube-square fa-4x"></i></a></li>`)
      } else if (webAddressType === "Website - LinkedIn") {
        $('#results-VoteSmart-list').append(`<li><a href="${webAddress}" target="_blank"> 
          <i class="fab fa-linkedin fa-4x"></i></a></li>`)
      } else if (webAddress === "https://www.snapchat.com/add/bernie.sanders") {
        $('#results-VoteSmart-list').append(`<li><a href="${webAddress}" target="_blank"> 
              <i class="fab fa-snapchat-square fa-4x"></i></a></li>`)
      } else if (webAddress === "https://www.flickr.com/photos/146043801@N08/with/31817149657/") {
        $('#results-VoteSmart-list').append(`<li><a href="${webAddress}" target="_blank"> 
            <i class="fab fa-flickr fa-4x"></i></a></li>`)
      } else if (webAddress === "https://medium.com/@Tom_Steyer" || webAddress === "https://medium.com/@TulsiGabbard" || webAddress === "https://medium.com/@KamalaHarris")  {
        $('#results-VoteSmart-list').append(`<li><a href="${webAddress}" target="_blank"> 
          <i class="fab fa-medium fa-4x"></i></a></li>`)
      } else {
        $('#results-VoteSmart-list').append(`<li><a href="${webAddress}" target="_blank"> 
          <i class="fas fa-home fa-4x"></i>  </a></li>`)
      }
    }
  };
  ;
}

// NEWS API

function getNews(query, maxResults = 5) {
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
      "X-Api-Key": apiKey
    })
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
  for (let i = 0; i < responseJson.articles.length & i < maxResults; i++) {
    $('#results-News-list').append(
      `<li><h4><a href="${responseJson.articles[i].url}" target="_blank" >${responseJson.articles[i].title}</a></h4><br>
      <p>${responseJson.articles[i].source.name} By ${responseJson.articles[i].author}</p><br>
      <p><img src='${responseJson.articles[i].urlToImage}'>
      ${responseJson.articles[i].description}</p>
      
      </li>`
    )
  };

};

// YOUTUBE

function getYouTubeVideos(candidateName) {
  const apiKeyYouTube = 'AIzaSyA_nz1y-bmMAb3SuqMa4HtEyUYY7r5BlI4';
  const searchUrlYouTube = 'https://www.googleapis.com/youtube/v3/search';
  const params = {
    key: apiKeyYouTube,
    q: candidateName,
    part: 'snippet',
    maxResults: '2',
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
    const youTubeUrl = 'https://www.youtube.com/watch?v=' + responseJson.items[i].id.videoId;
    console.log(youTubeUrl);
    $('#results-YouTube-list').append(
      `<li><h4><a href="${youTubeUrl}" target="_blank" ${responseJson.items[i].snippet.title}</a></h4><br>
       <p>${responseJson.items[i].snippet.description}</p><br>
       <p>${responseJson.items[i].snippet.publishedAt}</p><br>
      <img src='${responseJson.items[i].snippet.thumbnails.default.url}'>
      <hr>
      </li>`
    )
  };
};



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
    getVoteSmart(obj.candidateId)
    getYouTubeVideos(candidateName);
    // alert("Candidate Clicked!")
    getNews(candidateName)
  });
}

$(watchCandidate);

