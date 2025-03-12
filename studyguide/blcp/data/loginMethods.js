      var client;
	  var isLinking = false;
	  
      function initClient() {
          console.log("Initializing Google token client on page load");
          client = google.accounts.oauth2.initTokenClient({
              client_id: "670152106166-ablek3m2c5cb9p6b3fa6emqgr2gubq3v.apps.googleusercontent.com", // TODO: PUT YOUR GOOGLE CLIENT_ID HERE!
              callback: "onTokenResponse",
              scope: "https://www.googleapis.com/auth/userinfo.profile",
              callback: (tokenResponse) => {
                  access_token = tokenResponse.access_token;
				  console.log(tokenResponse.access_token);
				  // logLine("Response: " + JSON.stringify(tokenResponse));
                   onSignIn();
              }
          });
      }
	  
	  function GameEvent_InitSocialLogin(id)
	  {
		  isLinking = false;
		  client.requestAccessToken();
		  		  console.log("CLIENT REQUEST LOGIN");
	  }
	  
	  	  function GameEvent_InitSocialLink(id)
	  {
		  isLinking = true;
		  client.requestAccessToken();
		  console.log("CLIENT REQUEST LINK");
	  }

      // Invoked after user has signed in with Google
      function onSignIn() {
          // Execute LoginWithGoogleAccount API call using the Google access token. Please replace TitleId.
          
		  
		if(isLinking == true){
			console.log("Attempting PlayFab Link using LinkWithGoogleAccount: " + access_token);
		  unityGameInstance.SendMessage('!game', 'WebEvent_LinkWithGoogle', access_token);
		}
	  else {
		  console.log("Attempting PlayFab Sign-in using LoginWithGoogleAccount: " + access_token);
		  	unityGameInstance.SendMessage('!game', 'WebEvent_LoginWithGoogle', access_token);
	  }

		  
          /*PlayFabClientSDK.LoginWithGoogleAccount({
              AccessToken: access_token, // This access token is generated after a user has signed into Google
              CreateAccount: true,
              TitleId: "7DB31", // TODO: PUT YOUR TITLE ID HERE!
          }, onPlayFabResponse);*/
      }

      // Handles response from PlayFab
      /*function onPlayFabResponse(response, error) {
          if (response)
              logLine("Response: " + JSON.stringify(response));
          if (error)
              logLine("Error: " + JSON.stringify(error));
      }

      function logLine(message) {
          var textnode = document.createTextNode(message);
          document.body.appendChild(textnode);
          var br = document.createElement("br");
          document.body.appendChild(br);
      }*/