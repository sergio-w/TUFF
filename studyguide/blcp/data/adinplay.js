window.addEventListener('load', adinplayJs_onLoad);

window.aiptag = window.aiptag || {cmd: []};
aiptag.cmd.display = aiptag.cmd.display || [];
aiptag.cmd.player = aiptag.cmd.player || [];

//CMP tool settings
aiptag.cmp = {
	show: true,
	position: "centered",  //centered, bottom
	button: true,
	buttonText: "Privacy settings",
	buttonPosition: "bottom-left" //bottom-left, bottom-right, bottom-center, top-left, top-right
}
aiptag.cmd.player.push(function() {
	aiptag.adplayer = new aipPlayer({
		AIP_REWARDEDNOTGRANTED: function (state)  {
			//This event is fired when a rewarded ad is:
			//timed out, empty, unsupported or closed by the user.
			//don't grand the reward here
			// alert("Rewarded ad state: " + state); //state can be: timeout, empty, unsupported or closed.
			unityGameInstance.SendMessage('!game', 'OnWebRewardedAdResult', 'cancel');
		},
		AIP_REWARDEDGRANTED: function ()  {
			// This event is called whenever a reward is granted for a rewarded ad
			if (event && "isTrusted" in event && event.isTrusted) {
				unityGameInstance.SendMessage('!game', 'OnWebRewardedAdResult', 'success');
			} else {
				unityGameInstance.SendMessage('!game', 'OnWebRewardedAdResult', 'failed');
			}
		},
		AD_WIDTH: 960,
		AD_HEIGHT: 540,
		AD_DISPLAY: 'default', //default, fullscreen, fill, center, modal-center
		LOADING_TEXT: 'loading advertisement',
		PREROLL_ELEM: function(){return document.getElementById('videoad')},
		AIP_COMPLETE: function (state)  {
			/*******************
			 ***** WARNING *****
			 *******************
			 Please do not remove the PREROLL_ELEM
			 from the page, it will be hidden automaticly.
			*/
			
			//alert("Video Ad Completed: " + state);
			unityGameInstance.SendMessage('!game', 'OnWebAdResult', 'complete');
		}
	});
});

function show_videoad() {
	//check if the adslib is loaded correctly or blocked by adblockers etc.
	if (typeof aiptag.adplayer !== 'undefined') {
		aiptag.cmd.player.push(function() { aiptag.adplayer.startVideoAd(); });
	} else {
		//Adlib didnt load this could be due to an adblocker, timeout etc.
		//Please add your script here that starts the content, this usually is the same script as added in AIP_COMPLETE.
		// alert("Ad Could not be loaded, load your content here");
		aiptag.adplayer.aipConfig.AIP_COMPLETE();
	}
}

function adinplayJs_onLoad()
{
	document.addEventListener('myEvent', () => {
		refreshAd();
	});
}

function refreshAd()
{
	aiptag.cmd.display.push(function() { aipDisplayTag.display('blocops-io_300x250'); });
	aiptag.cmd.display.push(function() { aipDisplayTag.display('blocops-io_728x90'); });
aiptag.cmd.display.push(function() { aipDisplayTag.display('blocops-io_300x600'); });
}

function show_videoad() {
	//check if the adslib is loaded correctly or blocked by adblockers etc.
	if (typeof aiptag.adplayer !== 'undefined') {
		aiptag.cmd.player.push(function() { aiptag.adplayer.startVideoAd(); });
	} else {
		//Adlib didnt load this could be due to an adblocker, timeout etc.
		//Please add your script here that starts the content, this usually is the same script as added in AIP_COMPLETE.
		//alert("Ad Could not be loaded, load your content here");
		aiptag.adplayer.aipConfig.AIP_COMPLETE();
	}
}

function show_rewarded() {
	//check if the adslib is loaded correctly or blocked by adblockers etc.
	if (typeof aiptag.adplayer !== 'undefined') {
		aiptag.cmd.player.push(function() { aiptag.adplayer.startRewardedAd({preload: false, showLoading: true}); });
	} else {
		//Adlib didnt load this could be due to an adblocker, timeout etc.
		//Please add your script here that starts the content.
		//alert("Rewarded Ad Could not be loaded, load your content here");
	}
}



function ext_RequestRewardedAd()
{
	show_rewarded();
}

function ext_RequestIntermissionAd()
{
	show_videoad();
}