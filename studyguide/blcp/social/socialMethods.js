window.addEventListener('load', Social_onLoad);
var featuredVids;	
var activeTab = 0;
var YOUTUBE_API_KEY = "AIzaSyC3-PKI9QF-t_EgNUGb0RkGO2NkayJ7UM4";
var override_featureListId = null;
var streamData = null;
var featuredYtId;
var featuredVideoUpdate;
var yt_isPlaying;

const featureList = [
	{ id: 'Wb31lJwccZc', title: 'Blocops| WeaponUDATE | Grenade Launcher Carnage' },
	{ id: '4aKCAefxPME', title: 'BlocOps| M4 |Casual gameplay day 7' },
	{ id: '3xQESTV-a1g', title: 'BlocOps | Casual gameplay day 6' },
	{ id: 'MUEz4jfMnVw', title: 'BlocOps|Casual gameplay day 5' },
	{ id: 'epR4TRLPdPs', title: 'BlocOps| SHOTGUN | Casual gameplay day 4' },
	{ id: 'p8q9KVAZih0', title: 'Blocops| SNIPER | Casual gameplay day 3' }
];

function getRandomFeature() {
  const allFeatures = [
    ...featureList
  ];
  const randomIndex = Math.floor(Math.random() * allFeatures.length);
  return allFeatures[randomIndex];
}
	
function Social_onLoad()
{
	RefreshFeaturedYoutube();
	featuredVideoUpdate = setInterval(RefreshFeaturedYoutube, 10000);
	
	window.addEventListener('OnGameStarted', function(event) {
		ShowFeaturedContent(false);
	});
}

function RefreshFeaturedYoutube()
{

	featuredYtId = getRandomFeature();
	SetFeatureThumb(`https://img.youtube.com/vi/${featuredYtId.id}/0.jpg`, featuredYtId.title);
}

function SetFeatureThumb(img, title)
{
	document.getElementById("yt_img").src = img;
	document.getElementById("feature_content_title").innerText = title;
}







function GetStreams()
{
  var xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    'https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video&videoCategoryId=20&q=halflife&maxResults=5&key=AIzaSyC3-PKI9QF-t_EgNUGb0RkGO2NkayJ7UM4'
  );
  xhr.onload = function () {
    if (xhr.status === 200) {
		console.log(data);
		var data = JSON.parse(xhr.responseText);
		streamData = data;
		RefreshFeaturedLivestreams();
		// refresh feature preview
		SetFeatureThumb(streamData.items[0].id?.videoId, streamData.items[i].snippet?.title);
    } else {
		SetFeatureThumb(feature_yt_img, feature_yt_title);
		console.log('Error:', xhr);
    }
  };
  xhr.onerror = function () {
    console.log('Request failed');
	SetFeatureThumb(feature_yt_img, feature_yt_title);
  };
  xhr.send();
}

function RefreshFeaturedLivestreams()
{
	if (streamData.items && streamData.items.length > 0) {
		featuredYtId = streamData.items[0].id?.videoId;

		featureList_Live = streamData.items.map(function (item) {
			return item.id.videoId;
		});

		// refresh feature preview
		SetFeatureThumb(streamData.items[0].id?.videoId, streamData.items[i].snippet?.title);
		
	} else {
		// refresh feature preview
		RefreshFeaturedYoutube();
	}
}

function OpenFeaturedVideo()
{
	document.getElementById("yt_vid").src = "https://www.youtube.com/embed/" + featuredYtId.id + "?&autoplay=1&start=0";
}

function ShowFeaturedContent(show)
{
	if( show === true){
        	document.getElementById("featuredContent").style.display = "flex";
	} else {
        	document.getElementById("featuredContent").style.display = "none";
	}
}