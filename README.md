# Global News Explorer

**🔴 Live Demo:** [http://3.92.185.255](http://3.92.185.255)  
**🎥 Video Demo:** [Watch on Loom](https://www.loom.com/share/21dc5e77b3534fc6a2970bf158ac5126)

A responsive, real-time news aggregation dashboard that fetches live articles using the **Real-Time News Data API**. This project demonstrates modern frontend development practices, secure API handling, and a high-availability deployment architecture using Nginx and HAProxy.

---

## 🚀 Features
* **Real-Time Search:** Users can search for any topic (e.g., "Tesla", "Technology") to get instant results.
* **Responsive Design:** Fully optimized for mobile, tablet, and desktop devices using CSS Grid.
* **High Availability:** Deployed across two web servers behind a Load Balancer to ensure uptime and traffic distribution.
* **Security:** API keys are secured via a strict `.gitignore` policy and are never exposed in the codebase.

---

## 💻 How to Run Locally (Localhost)
To test the application on your own machine, follow these steps.

### 1. Clone the Repository
```bash
git clone https://github.com/nwafawad/newsAPI-app.git
cd newsAPI-app
````

### 2. Configure API Keys (Critical)

The `config.js` file is ignored by Git for security. You must create it manually.

1. Create a file named `config.js` in the root folder.
2. Paste the following code:

```javascript
const CONFIG = {
    API_KEY: 'YOUR_RAPIDAPI_KEY_HERE',
    API_HOST: 'real-time-news-data.p.rapidapi.com'
};
```

### 3. Start a Local Server

Running a local server is recommended to avoid CORS issues.

**Option A: Using Python**
```bash
python3 -m http.server 8000
```

Then open: `http://localhost:8000`

**Option B: Using Node.js**
```bash
npx serve
```

**Option C: VS Code Live Server**

Right-click `index.html` and select **"Open with Live Server"**.

---

## 🏗️ Deployment Documentation

This application is deployed on a 3-tier architecture designed for redundancy and scalability.

### 1. Web Servers Configuration (Web-01 & Web-02)

I provisioned two Ubuntu servers (`13.218.200.225` and `44.211.41.114`) to act as the backend.

**Steps Taken:**

1. **Environment Setup:** Updated package lists and installed Nginx.
   ```bash
   sudo apt-get update && sudo apt-get install nginx -y
   ```

2. **Code Deployment:** Cloned the repository directly to the servers to ensure version consistency.
   ```bash
   git clone https://github.com/nwafawad/newsAPI-app.git
   ```

3. **File Placement:** Cleared the default Nginx landing page and moved the application files to the web root.
   ```bash
   sudo rm -rf /var/www/html/*
   sudo cp -r newsAPI-app/* /var/www/html/
   ```

4. **Security Configuration:** The `config.js` file containing the API key was **manually created** on the server using `vi` (`sudo vi /var/www/html/config.js`). This ensures the secret key was never committed to GitHub.

5. **Service Management:** Restarted Nginx to apply changes.
   ```bash
   sudo systemctl restart nginx
   ```

### 2. Load Balancer Configuration (Lb-01)

I configured a third server (`3.92.185.255`) using **HAProxy** to distribute incoming traffic.

**Configuration Steps:**

1. Installed HAProxy:
   ```bash
   sudo apt-get install haproxy -y
   ```

2. Modified the configuration file `/etc/haproxy/haproxy.cfg` to include a frontend listener and a backend server group.

**The Configuration Block:**

```haproxy
frontend http_front
    bind *:80
    default_backend web-backend

backend web-backend
    balance roundrobin
    server web-01 13.218.200.225:80 check
    server web-02 44.211.41.114:80 check
```

**Key Configurations Explained:**

* **`frontend http_front`**: Defines that the Load Balancer listens on **Port 80** for incoming HTTP traffic.
* **`balance roundrobin`**: This algorithm was chosen to ensure fair distribution. It cycles requests sequentially (Server A → Server B → Server A), preventing one server from being overwhelmed.
* **`check`**: This is a critical setting. It tells HAProxy to periodically "ping" the web servers to ensure they are healthy. If a server goes down, HAProxy detects it via this check and stops sending traffic to it.

---

## 🧪 Testing & Verification

To ensure the architecture functions as intended, the following tests were performed:

### 1. Functional Testing via Load Balancer

* **Action:** Accessed the application via the Load Balancer IP (`http://3.92.185.255`).
* **Result:** The application loaded instantly, confirming that Lb-01 is successfully forwarding requests to the backend servers. Search functionality performed correctly.

### 2. Load Balancing Verification

* **Objective:** Verify that traffic is being split between Web-01 and Web-02.
* **Method:**
  1. Opened the application in a browser.
  2. Refreshed the page multiple times.
  3. Checked the server access logs on the web servers.
* **Observation:** Requests appeared in the logs of **both** Web-01 and Web-02, confirming that the **Round Robin** algorithm is active and working correctly.

---

## 📂 Project Structure

```text
newsAPI-app/
├── index.html      # Main HTML structure
├── style.css       # Responsive styling
├── script.js       # API fetch logic and DOM manipulation
├── config.js       # (Ignored) Contains sensitive API keys
├── .gitignore      # Ensures config.js is not uploaded
└── README.md       # Project documentation
```

---

## ⚖️ Attribution

* **Data Provider:** [Real-Time News Data API](https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-news-data) by RapidAPI.