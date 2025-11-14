// ========================================
// TMDb API Configuration
// ========================================
// IMPORTANT: Replace with your actual TMDb API key
const TMDB_API_KEY = "YOUR_TMDB_API_KEY_HERE";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// ========================================
// Mood Configuration
// ========================================
// Maps user moods to genre preferences and sort orders
const MOOD_CONFIG = {
    cozy: {
        genres: [35, 10749], // Comedy, Romance
        sort: "popularity.desc"
    },
    excited: {
        genres: [28, 53, 878], // Action, Thriller, Sci-Fi
        sort: "popularity.desc"
    },
    sad: {
        genres: [18, 10749], // Drama, Romance
        sort: "vote_average.desc",
        minVotes: 100
    },
    tired: {
        genres: [35], // Comedy
        sort: "popularity.desc",
        minVotes: 50
    },
    curious: {
        genres: [99, 9648, 18], // Documentary, Mystery, Drama
        sort: "vote_average.desc",
        minVotes: 50
    }
};

// ========================================
// Runtime Configuration
// ========================================
// Maps time selections to TMDb runtime filters
const RUNTIME_CONFIG = {
    short: { lte: 30 },
    medium: { gte: 30, lte: 60 },
    long: { gte: 80, lte: 160 },
    binge: null // No runtime filter for binging
};

// ========================================
// State Management
// ========================================
let selectedMood = null;
let selectedTime = null;
let selectedGenre = null;

// ========================================
// DOM Elements
// ========================================
const moodButtons = document.querySelectorAll('#mood-buttons .option-btn');
const timeButtons = document.querySelectorAll('#time-buttons .option-btn');
const genreButtons = document.querySelectorAll('#genre-buttons .option-btn');
const form = document.getElementById('finder-form');
const resultsContainer = document.getElementById('results');
const submitButton = document.querySelector('.submit-btn');
const surpriseButton = document.getElementById('surprise-btn');
const themeToggle = document.getElementById('theme-toggle');

// ========================================
// Button Group Handler
// ========================================
// Handles single-select button groups with visual feedback
function setupButtonGroup(buttons, callback) {
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons in this group
            buttons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Store the selected value
            callback(button.dataset.value);
        });
    });
}

// Setup all button groups
setupButtonGroup(moodButtons, (value) => selectedMood = value);
setupButtonGroup(timeButtons, (value) => selectedTime = value);
setupButtonGroup(genreButtons, (value) => selectedGenre = value);

// ========================================
// Dark Mode Toggle
// ========================================
function applyStoredTheme() {
    const stored = localStorage.getItem('streamfinder-theme');
    if (stored === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀︎';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.textContent = '☾';
    }
}

themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('streamfinder-theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀︎' : '☾';
});

// Apply theme on load
applyStoredTheme();

// ========================================
// Build TMDb API URL
// ========================================
function buildApiUrl(mood, time, genre, platforms) {
    // Start with base discover URL
    const url = new URL(`${TMDB_BASE_URL}/discover/movie`);
    const params = url.searchParams;

    // Add API key (required)
    params.append('api_key', TMDB_API_KEY);
    
    // Add region for watch providers (always US)
    params.append('watch_region', 'US');

    // Add streaming platforms if selected
    if (platforms.length > 0) {
        params.append('with_watch_providers', platforms.join('|'));
    }

    // Determine which genre to use:
    // User-selected genre takes priority over mood-based genre
    let genreToUse = null;
    let sortBy = 'popularity.desc'; // Default sort
    let minVotes = null;

    if (genre) {
        // User explicitly selected a genre - use that
        genreToUse = genre;
    } else if (mood && MOOD_CONFIG[mood]) {
        // No explicit genre, use mood's preferred genres
        const moodConfig = MOOD_CONFIG[mood];
        genreToUse = moodConfig.genres.join(',');
        sortBy = moodConfig.sort;
        minVotes = moodConfig.minVotes;
    }

    // Add genre filter
    if (genreToUse) {
        params.append('with_genres', genreToUse);
    }

    // Add runtime filters based on time selection
    if (time && RUNTIME_CONFIG[time]) {
        const runtimeFilter = RUNTIME_CONFIG[time];
        if (runtimeFilter) {
            if (runtimeFilter.gte) {
                params.append('with_runtime.gte', runtimeFilter.gte);
            }
            if (runtimeFilter.lte) {
                params.append('with_runtime.lte', runtimeFilter.lte);
            }
        }
    }

    // Add sorting
    params.append('sort_by', sortBy);

    // Add minimum vote count if specified by mood
    if (minVotes) {
        params.append('vote_count.gte', minVotes);
    }

    // Only include movies with at least some votes (baseline)
    params.append('vote_count.gte', '10');

    return url.toString();
}

// ========================================
// Fetch Movies from TMDb
// ========================================
async function fetchMovies(mood, time, genre, platforms) {
    const apiUrl = buildApiUrl(mood, time, genre, platforms);
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
}

// ========================================
// Display Results
// ========================================
function displayResults(movies, single = false) {
    // Clear previous results
    resultsContainer.innerHTML = '';

    // If no results, show a message
    if (movies.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <p>No matches found for those filters.</p>
                <small>Try adjusting your selections or choosing different services</small>
            </div>
        `;
        resultsContainer.classList.add('show');
        return;
    }

    let displayMovies;

    if (single) {
        // Pick one random movie
        const randomIndex = Math.floor(Math.random() * movies.length);
        displayMovies = [movies[randomIndex]];
    } else {
        // Limit to 10 results
        displayMovies = movies.slice(0, 10);
    }

    // Create header
    const header = document.createElement('h2');
    header.className = 'results-header';
    header.textContent = single
        ? "Here's a surprise pick:"
        : (displayMovies.length === 1 
            ? "Here's a match:" 
            : `Here are ${displayMovies.length} matches:`);
    resultsContainer.appendChild(header);

    // Create a card for each movie
    displayMovies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'result-card';

        // Get release year
        const year = movie.release_date 
            ? new Date(movie.release_date).getFullYear() 
            : 'N/A';

        // Truncate overview to ~150 characters
        let overview = movie.overview || 'No description available.';
        if (overview.length > 150) {
            overview = overview.substring(0, 150) + '...';
        }

        // Format rating
        const rating = movie.vote_average 
            ? `★ ${movie.vote_average.toFixed(1)}/10` 
            : 'No rating';

        card.innerHTML = `
            <h3>${movie.title}</h3>
            <div class="meta">${year}</div>
            <div class="overview">${overview}</div>
            <div class="rating">${rating}</div>
        `;

        resultsContainer.appendChild(card);
    });

    // Trigger fade-in animation
    resultsContainer.classList.add('show');
}

// ========================================
// Show Loading State
// ========================================
function showLoading(message = 'Searching...') {
    resultsContainer.innerHTML = `<div class="loading">${message}</div>`;
    resultsContainer.classList.add('show');
}

// ========================================
// Show Error Message
// ========================================
function showError() {
    resultsContainer.innerHTML = `
        <div class="no-results">
            <p>Oops! Something went wrong.</p>
            <small>Please check your API key and try again</small>
        </div>
    `;
    resultsContainer.classList.add('show');
}

// ========================================
// Form Submit Handler (Normal search)
// ========================================
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get selected platforms (checked checkboxes)
    const selectedPlatforms = Array.from(
        document.querySelectorAll('input[name="platform"]:checked')
    ).map(checkbox => checkbox.value);

    // Disable submit button during search
    submitButton.disabled = true;
    submitButton.textContent = 'Searching...';

    // Show loading state
    showLoading();

    try {
        // Fetch movies from TMDb
        const movies = await fetchMovies(
            selectedMood,
            selectedTime,
            selectedGenre,
            selectedPlatforms
        );

        // Display the results
        displayResults(movies, false);
    } catch (error) {
        // Show error message
        showError();
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Find something to watch';
    }
});

// ========================================
// Surprise Me Handler
// ========================================
surpriseButton.addEventListener('click', async () => {
    // Get selected platforms (checked checkboxes)
    const selectedPlatforms = Array.from(
        document.querySelectorAll('input[name="platform"]:checked')
    ).map(checkbox => checkbox.value);

    // Show loading state
    showLoading('Rolling the dice...');

    // Disable both buttons briefly
    surpriseButton.disabled = true;
    submitButton.disabled = true;

    try {
        // Fetch movies from TMDb using current filters
        const movies = await fetchMovies(
            selectedMood,
            selectedTime,
            selectedGenre,
            selectedPlatforms
        );

        // Display a single random result
        displayResults(movies, true);
    } catch (error) {
        showError();
    } finally {
        surpriseButton.disabled = false;
        submitButton.disabled = false;
        submitButton.textContent = 'Find something to watch';
    }
});
