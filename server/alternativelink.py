import requests
import os
from urllib.parse import urlparse

missing_files = [
    "http://localhost:1007/_nuxt/0de3360.js",
    "http://localhost:1007/_nuxt/19f0066.js",
    "http://localhost:1007/_nuxt/2f0d964.js",
    "http://localhost:1007/_nuxt/4713b37.js",
    "http://localhost:1007/_nuxt/5a077ab.js",
    "http://localhost:1007/_nuxt/6bc66ba.js",
    "http://localhost:1007/_nuxt/6cc3a1b.js",
    "http://localhost:1007/_nuxt/784317b.js",
    "http://localhost:1007/_nuxt/86b5f88.js",
    "http://localhost:1007/_nuxt/8efcf6d.js",
    "http://localhost:1007/_nuxt/bf2ed42.js",
    "http://localhost:1007/_nuxt/bf5e505.js",
    "http://localhost:1007/_nuxt/d29a3d9.js",
    "http://localhost:1007/_nuxt/ed57499.js",
    "http://localhost:1007/_nuxt/f77b3d6.js",
    "http://localhost:1007/_nuxt/ff90393.js",
    "http://localhost:1007/_nuxt/fonts/RobotoCondensed-Light.f982e4a.woff2",
    "http://localhost:1007/_nuxt/static/1710125415/absurd-trolley-problems/payload.js",
    "http://localhost:1007/_nuxt/static/1710125415/ambient-chaos/payload.js",
    "http://localhost:1007/_nuxt/static/1710125415/auction-game/payload.js",
    "http://localhost:1007/_nuxt/static/1710125415/days-since-incident/payload.js",
    "http://localhost:1007/_nuxt/static/1710125415/earth-reviews/payload.js",
    "http://localhost:1007/_nuxt/static/1710125415/lets-settle-this/payload.js",
    "http://localhost:1007/_nuxt/static/1710125415/perfect-circle/payload.js",
    "http://localhost:1007/_nuxt/static/1710125415/printing-money/payload.js",
    "http://localhost:1007/_nuxt/static/1710125415/sell-sell-sell/payload.js",
    "http://localhost:1007/_nuxt/static/1710125415/space-elevator/payload.js",
    "http://localhost:1007/_nuxt/static/1710125415/universe-forecast/payload.js",
    "http://localhost:1007/_nuxt/static/1710125415/wonders-of-street-view/payload.js"
]

base_url = "http://neal.fun/"

download_dir = "./downloaded_files"
os.makedirs(download_dir, exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/90.0.4430.93 Safari/537.36"
}

for url in missing_files:
    try:

        parsed_url = urlparse(url)
        file_path = os.path.join(download_dir, parsed_url.path.lstrip('/'))
        file_dir = os.path.dirname(file_path)

        os.makedirs(file_dir, exist_ok=True)

        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        content_type = response.headers.get('Content-Type', '')
        if 'text/html' in content_type:
            print(f"Skipped downloading {url} because it returned an HTML page.")
            continue

        with open(file_path, "wb") as file:
            file.write(response.content)

        print(f"Downloaded: {file_path}")

    except requests.HTTPError as http_err:
        print(f"HTTP error occurred while downloading {url}: {http_err}")
    except requests.ConnectionError as conn_err:
        print(f"Connection error occurred while downloading {url}: {conn_err}")
    except requests.Timeout as timeout_err:
        print(f"Timeout occurred while downloading {url}: {timeout_err}")
    except requests.RequestException as req_err:
        print(f"An error occurred while downloading {url}: {req_err}")
    except Exception as e:
        print(f"Unexpected error for {url}: {e}")
