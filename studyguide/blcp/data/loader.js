window.addEventListener('load', loaderJs_onLoad);

// List of tips to display
const tips = [
	"Tip: Try using <span style='color: yellow;'>vehicles</span> to travel faster.",
	"Tip: Remember to use <span style='color: orange;'>throwables</span> like grenades.",
	"Tip: Respawn on <span style='color: yellow;'>captured points</span> to get back in the fight quicker.",
	"Tip: The <span style='color: blue;'>engineer's</span> <span style='color: orange;'>rocket launcher</span> is perfect for taking out vehicles.",
	"Tip: Remember to <span style='color: green;'>sprint</span> to move faster.",
	"Tip: <span style='color: blue;'>Medics</span> can use med-kits to heal teammates.",
	"Tip: <span style='color: blue;'>Assault class</span> can give ammo to teammates.",
	"Tip: A <span style='color: blue;'>sniper</span> can <span style='color: green;'>mark targets</span> by aiming at them.",
	"Tip: The <span style='color: orange;'>flare</span> marks all targets in its range.",
	"Tip: <span style='color: green;'>Fire in bursts</span> for better accuracy.",
	"Tip: Official site <a href='https://blocops.io' style='color: cyan;'>blocops.io</a> is updated earlier."
];

let currentTipIndex = 0;
let tipsInterval;
let longLoadTimeout;

// Function to update the tips
function loaderJs_onLoad() {
	const tipsElement = document.getElementById('tips');

	// Display tips at intervals
	tipsInterval = setInterval(() => {
		const randomIndex = Math.floor(Math.random() * tips.length);
		tipsElement.innerHTML = tips[randomIndex];
	}, 5000);

	// Set a timeout to detect long load times (60 seconds)
	longLoadTimeout = setTimeout(() => {
		clearInterval(tipsInterval); // Stop updating tips
		tipsElement.innerHTML = `<span style="color: yellow;">Loading is taking longer than usual.</span> <a onclick="forceReload()" style="color: red; cursor: pointer; ">CLICK HERE</a> to reload the page.`;
	}, 45000);
}

// Function to hide the entire loading screen and disable tips
function hideLoadingScreen() {
	clearInterval(tipsInterval); // Stop the tips from updating
	clearTimeout(longLoadTimeout); // Clear the long load timeout
	document.getElementById('loadingScreen').style.display = 'none'; // Hide the loading screen
}

// Function to reload the page without cache
function forceReload() {
	// Cache-busting by adding a random query parameter to the URL
	window.location.href = window.location.href.split('?')[0] + '?nocache=' + new Date().getTime();
}
