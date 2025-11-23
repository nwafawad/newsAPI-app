const newsGrid = document.getElementById('news-grid');

async function fetchNews(query = 'Technology') {
    const url = `https://${CONFIG.API_HOST}/search?query=${encodeURIComponent(query)}&limit=10&time_published=anytime&country=US&lang=en`;
    
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': CONFIG.API_KEY,
            'x-rapidapi-host': CONFIG.API_HOST
        }
    };
    // Show loading message
    try {
        newsGrid.innerHTML = '<div class="loading">Fetching latest updates...</div>';
        
        const response = await fetch(url, options);
        
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        
        const responseData = await response.json();

        
        renderNews(responseData.data); 
    
    } catch (error) { // Handle errors
        console.error(error);
        newsGrid.innerHTML = `
            <div class="error-message">
                <h3>⚠️ Unable to load news</h3>
                <p>${error.message}. Please check your connection or API limit.</p>
            </div>`;
    }
}
// Render news articles
function renderNews(articles) {
    newsGrid.innerHTML = '';
// Handle no articles case
    if (!articles || articles.length === 0) {
        newsGrid.innerHTML = '<p>No articles found for this topic.</p>';
        return;
    }

    articles.forEach(article => {
        
        const imageUrl = article.photo_url
        const snippet = article.snippet || 'No description available.';
        const date = new Date(article.published_datetime_utc).toLocaleDateString();

        const card = `
            <article class="news-card">
                <img src="${imageUrl}" alt="${article.title}" onerror="this.src='https://via.placeholder.com/400x250?text=Image+Error'">
                <div class="card-content">
                    <span class="source">${article.source_name}</span>
                    <h3><a href="${article.link}" target="_blank">${article.title}</a></h3>
                    <p>${snippet}</p>
                    <div class="card-footer">
                        <small>${date}</small>
                    </div>
                </div>
            </article>
        `;
        newsGrid.innerHTML += card;
    });
}

// Handle search form submission
function handleSearch() {
    const query = document.getElementById('search-input').value;
    if (query.trim()) {
        fetchNews(query);
    }
}

// initial fetch
fetchNews('World News');