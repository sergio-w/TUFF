var home_ScaleFactor = 900;
var play_ScaleFactor = 1000;
var m_inGame = true;
var ad_refresh_update;
var lastWindowSize; 
var m_isPlaying = false;
var toRefresh;
var windowHasFocus = true;
		
// Create a custom event with optional data
const adRefreshEvent = new Event('adRefreshEvent');
		
window.addEventListener('load', mainJs_onLoad);
window.addEventListener('resize', mainJS_onResize);
window.addEventListener('blur', mainJS_onBlur);
window.addEventListener('focus', mainJS_onFocus);

	
function clamp(val, min, max) {  return Math.max(min, Math.min(max, val));  }
function getRandomInt(max) {   return Math.floor(Math.random() * Math.floor(max));  }
	
async function mainJs_onLoad()
{
	//await window.CrazyGames.SDK.init();
	scaleUi();
	// updateTips();
	window.devicePixelRatio = 0.85;
	
	ad_refresh_update = setInterval(ad_Refresh, 30000);
}

function mainJS_onFocus()
{
	windowHasFocus = true;
	if (lastWindowSize  !== clamp(window.innerWidth / home_ScaleFactor, .5, 1))
		scaleUi();
}

function mainJS_onBlur()
{
	windowHasFocus = false;
}

function mainJS_onResize()
{
	scaleUi();
}

function ad_Refresh()
{
	if (windowHasFocus && !m_isPlaying)
		RefreshAds();
	else
		toRefresh = true;
}

async function RefreshAds()
{
	document.dispatchEvent(adRefreshEvent);
}

function scaleUi() {
    var widthRatio = clamp(window.innerWidth / home_ScaleFactor, 0.5, 1);
    var heightRatio = clamp(window.innerHeight / home_ScaleFactor, 0.5, 1);
    var ratio = Math.min(widthRatio, heightRatio);

    if (m_inGame) {
        widthRatio = clamp(window.innerWidth / play_ScaleFactor, 0.5, 1);
        heightRatio = clamp(window.innerHeight / play_ScaleFactor, 0.5, 1);
        ratio = Math.min(widthRatio, heightRatio);
    }
    
    // Apply scaling to ads
	var adDiv = document.getElementById("blocops-io_300x250");
	if(adDiv)
		adDiv.style.transform = 'scale(' + ratio + ', ' + ratio + ')';
	
	adDiv = document.getElementById("blocops-io_300x600");
	if(adDiv)
		adDiv.style.transform = 'translateY(-50%) scale(' + ratio + ', ' + ratio + ')';
    
	var adDiv = document.getElementById("blocops-io_728x90");
	if(adDiv)
		adDiv.style.transform = 'scale(' + ratio + ', ' + ratio + ')';
	
    // Show or hide banners based on height
    /*if (window.innerHeight > 600) {
        // ShowBanner("blocops-io_300x600", true);
        ShowBanner("blocops-io_300x250", false);
    } else {
        ShowBanner("blocops-io_300x250", true);
        // ShowBanner("blocops-io_300x600", false);
    }*/
    
    document.getElementById("featuredContent").style.transform = "scale(" + ratio + ")";
    
    lastWindowSize = ratio;
}


function ShowBanner(adId, show) {
	console.log("Ad: " + adId + ":" + show);
  var adDiv = document.getElementById(adId);
  if (adDiv) {
    if (show === false) {
      adDiv.style.display = "none";
    } else {
      adDiv.style.display = "flex";
    }
  }
  scaleUi();
}

function ShowVideoAd() {
	return;
	    // Show the ad container
    document.getElementById('ad_instream').style.display = 'block';
	
    vitag.Init.push(function () {
      viAPItag.initPowerVideoAds('pw_39285');
    });
  }

function MuteGame(mute)
{
	console.log(unityGameInstance);
	// window.unityGame.SendMessage('!game', 'OnWebMuteGame', mute);
	if (mute === 1)
	{
		unityGameInstance.SendMessage('!game', 'OnWebPreRollStarted');
	} else {
		unityGameInstance.SendMessage('!game', 'OnWebPreRollCompleted');
	}
}
	
function ext_showHomeUi  ()
{
	m_inGame = false;
	game_isLoaded = true;
		m_isPlaying = false;
	
	RefreshAds();
	hideLoadingScreen();
	
	ShowBanner("blocops-io_728x90", true);
	ShowBanner("blocops-io_300x600", true);
	ShowBanner("blocops-io_300x250", false);
	scaleUi();
	
	ShowVideoAd();
	if (yt_isPlaying)
	{
		MuteGame(1);
	}
}

function ext_showLobbyUi ()
{
  	m_inGame = true;
		m_isPlaying = false;
		
	if(toRefresh)
		RefreshAds();
	toRefresh = false;
		
	ShowBanner("blocops-io_300x250", true);
	ShowBanner("blocops-io_300x600", false);
	scaleUi();
}

function ext_play()
{	
	if(m_inGame)
	{
		ShowBanner("blocops-io_300x600", false);
		ShowBanner("blocops-io_300x250", false);
		ShowBanner("blocops-io_728x90", false);
	} else {
		// ShowVideoAd();
	}
	// ShowBanner("blocops-io_300x600", false);
	ShowBanner("blocops-io_300x250", false);
	window.dispatchEvent(evGameStarted);
}

function ext_onPlayerSpawn()
{
		m_isPlaying = true;
		
	ShowBanner("blocops-io_300x600", false);
	ShowBanner("blocops-io_300x250", false);
	ShowBanner("blocops-io_728x90", false);
}

function ext_hideLobbyUi ()
{
	console.log("ext_hideLobbyUi");
	/*// ShowBanner("blocops-io_300x600", false);
	ShowBanner("blocops-io_300x250", false);*/
}

function ext_intermission()
{
/*.<script type='text/javascript'> (vitag.Init = window.vitag.Init || []).push(function () { viAPItag.initPowerVideoAds('pw_39285'); }); 
	function show_videoad() {
		//check if the adslib is loaded correctly or blocked by adblockers etc.
		if (typeof aiptag.adplayer !== 'undefined') {
			aiptag.cmd.player.push(function() { aiptag.adplayer.startVideoAd(); });
		} else {
			//Adlib didnt load this could be due to an adblocker, timeout etc.
			//Please add your script here that starts the content, this usually is the same script as added in AIP_COMPLETE.
			alert("Ad Could not be loaded, load your content here");
			aiptag.adplayer.aipConfig.AIP_COMPLETE();
		}
*/
}

function ext_OnStoreToggled(open){}

function ext_watchRewardedAd(){}