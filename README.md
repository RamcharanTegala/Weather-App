
1. **index.html**  
   - Contains the page structure: input box, button, containers for weather details, and an error message area.  
2. **style.css**  
   - Basic styling to keep the interface clean, centered, and responsive. Gradient background, styled inputs/buttons, and hide/show logic via a `.hidden` class.  
3. **script.js**  
   - Core logic: listens for user input, calls the OpenWeatherMap API, handles errors, and updates the DOM with live weather data.  
4. **README.md**  
   - (This file—your guide to getting this project up and running.)  
5. **.gitignore**  
   - Ignore any environment files or local assets you don’t want in version control (e.g., your API key file, if you choose to store it separately).  

---

## 🛠️ Prerequisites

1. **OpenWeatherMap API Key**  
   - Go to [OpenWeatherMap](https://openweathermap.org/), sign up (it’s free), and generate a key from the “API keys” section.  
   - You’ll need to paste this key into `script.js` before the app will fetch data.  

2. **Local Server (To Avoid CORS Errors)**  
   - You cannot just double‐click `index.html`—the browser blocks API calls for file URLs. Use one of the following:  
     - **VSCode Live Server Extension**:  
       1. Open the folder in VSCode.  
       2. Install the “Live Server” extension (search in the Extensions sidebar).  
       3. Right‐click `index.html` → “Open with Live Server.”  
     - **Python HTTP Server** (if you have Python installed):  
       ```bash
       cd path/to/weather-checker
       python -m http.server 5500
       ```  
       Then navigate to `http://localhost:5500` in your browser.  
     - **Node.js “serve” Package** (if you have Node installed):  
       ```bash
       npm install -g serve
       cd path/to/weather-checker
       serve -l 5500
       ```  
       Then open `http://localhost:5500`.  

---

## ⚙️ Installation & Setup

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/RAMCHARANTEGALA/Weather-App.git
   cd Weather App
