# Vueable-query
<span align = 'center'>

![Vueable Query Logo](/Extension/assets/Vueable_Query_logo_128.png)

</span>

Vueable Query is an easy to use Chrome Extension that provides visualization and performance metrics for programs using [Tanstack Query for Vue](https://github.com/TanStack/query).

<span align = 'center'>

[![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://github.com/oslabs-beta/Vueable-Query/blob/main/LICENSE)

![Vue](https://img.shields.io/badge/Vue-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![D3](https://img.shields.io/badge/D3-F9A03C?style=for-the-badge&logo=D3.js&logoColor=white)
![Chrome Dev Tool API](https://img.shields.io/badge/Chrome%20Dev%20Tool%20Api-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)

</span>
<hr/>

## Installation
Install Vueable Query from the [Chrome Web Store](https://chrome.google.com/webstore/detail/vueable-query/dnhcogggodnfhnnfimapejbkkihmflaa)

## Developer Installation
- Clone this repository
- Run `npm install` then `npm run build` to build the extension to the dist folder
- Then load the dist folder in Google Chrome as an unpacked Chrome Extension

## Run Demo Program
- Clone this repository
- Run `npm run demo`
- Navigate to localhost:5173
- Open the Chrome developer tool and select Vueable Query Panel

## Features

![demo](demo_img/full_demo_readme.gif)
- A timeline to visualize the query history
- A text panel to display all relevant queries under their query key.
- Highlighting on click and hover
- Tooltip displayed on hover 


## Usage
- View a program running Tanstack Query for Vue or load up the example program above
- Open up the Dev Tools for Chrome
- Navigate to Vueable Query pane
- Hover over a timeline point to view information
- Click a query to highlight it on both views
- Expand the text entry to see more details


