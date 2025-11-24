// ========================================
// TMDb API Configuration (SECURE v4 Token)
// ========================================
const TMDB_V4_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOWQ3ZGFjM2QyZDI4OGFiMDFiMTliMDA1YWQzMjIxNCIsIm5iZiI6MTc2MzA4MjI4Mi4wOTYsInN1YiI6IjY5MTY4MDJhMzEzN2M3ZGFmMTg3NjVhNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mNnYHf28DA9OqlRm8Vc6tsVs96b9YrA6eJlnWJbtuXY";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// ========================================
// Mood Configuration
// ========================================
const MOOD_CONFIG = {
    cozy: { genres: [35, 10749], sort: "popularity.desc" },
    excited: { genres: [28, 53, 878], sort: "popularity.desc" },
    sad: { genres: [18, 10749], sort: "vote_average.desc", minVotes: 100 },
    tired: { genres: [35], sort: "popularity.desc", minVotes: 50 },
    curious: { genres: [99, 9648, 18], sort: "vote_average.desc", minVotes: 50 }
};

// ========================================
// Runtime Configuration
// ========================================
const RUNTIME_CONFIG = {
    short: { lte: 30 },
    medium: { gte: 30, lte: 60 },
    long: { gte: 80, lte: 160 },
    binge: null
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
// Button Groups
// ========================================
function setupButtonGroup(buttons, callback) {
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            callback(button.dataset.value);
        });
    });
}

setupButtonGroup(moodButtons, v => selectedMood = v);
setupButtonGroup(timeButtons, v => selectedTime = v);
setupButtonGroup(genreButtons, v => selectedGenre = v);

// ========================================
// Theme Toggle
// ========================================
function applyStoredTheme() {
    const stored = localStorage.getItem('streamfinder-theme');
    if (stored === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀︎';
    } else {
        themeToggle.textContent = '☾';
    }
}
themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    themeToggle.textContent = isDark ? '☀︎' : '☾';
    localStorage.setItem('streamfinder-theme', isDark ? 'dark' : 'light');
});
applyStoredTheme();

// ========================================
// Build TMDb API URL (NO v3 KEY ANYMORE)
// ========================================
function buildApiUrl(mood, time, genre, platforms) {
    const url = new URL(`${TMDB_BASE_URL}/discover/movie`);
    const params = url.searchParams;

    params.append("watch_region", "US");

    if (platforms.length > 0) {
        params.append("with_watch_providers", platforms.join("|"));
    }

    let genreToUse = null;
    let sortBy = "popularity.desc";
    let minVotes = null;

    if (genre) {
        genreToUse = genre;
    } else if (mood && MOOD_CONFIG[mood]) {
        const config = MOOD_CONFIG[mood];
        genreToUse = config.genres.join(",");
        sortBy = config.sort;
        minVotes = config.minVotes;
    }

    if (genreToUse) params.append("with_genres", genreToUse);
    if (time && RUNTIME_CONFIG[time]) {
        const rt = RUNTIME_CONFIG[time];
        if (rt?.gte) params.append("with_runtime.gte", rt.gte);
        if (rt?.lte) params.append("with_runtime.lte", rt.lte);
    }

    params.append("sort_by", sortBy);
    if (minVotes) params.append("vote_count.gte", minVotes);
    params.append("vote_count.gte", "10");

    return url.toString();
}

// ========================================
// Fetch Movies (SECURE v4 TOKEN)
// ========================================
async function fetchMovies(mood, time, genre, platforms) {
    const apiUrl = buildApiUrl(mood, time, genre, platforms);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${TMDB_V4_TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error(`TMDb error: ${response.status}`);
        }

        const data = await response.json();
        return data.results || [];
    } catch (err) {
        console.error("Error fetching movies:", err);
        throw err;
    }
}

// ========================================
// Display Results
// ========================================
function displayResults(movies, single = false) {
    resultsContainer.innerHTML = "";

    if (movies.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <p>No matches found.</p>
                <small>Try adjusting your filters.</small>
            </div>
        `;
        resultsContainer.classList.add("show");
        return;
    }

    let displayMovies = single
        ? [movies[Math.floor(Math.random() * movies.length)]]
        : movies.slice(0, 10);

    const header = document.createElement("h2");
    header.className = "results-header";
    header.textContent = single
        ? "Here's your surprise pick:"
        : `Here are ${displayMovies.length} matches:`;
    resultsContainer.appendChild(header);

    displayMovies.forEach(movie => {
        const card = document.createElement("div");
        card.className = "result-card";
        const year = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";

        let overview = movie.overview || "No description available.";
        if (overview.length > 150) overview = overview.slice(0, 150) + "...";

        const rating = movie.vote_average ? `★ ${movie.vote_average.toFixed(1)}/10` : "No rating";

        card.innerHTML = `
            <h3>${movie.title}</h3>
            <div class="meta">${year}</div>
            <div class="overview">${overview}</div>
            <div class="rating">${rating}</div>
        `;
        resultsContainer.appendChild(card);
    });

    resultsContainer.classList.add("show");
}

// ========================================
// Loading + Error States
// ========================================
function showLoading(msg = "Searching...") {
    resultsContainer.innerHTML = `<div class="loading">${msg}</div>`;
    resultsContainer.classList.add("show");
}

function showError() {
    resultsContainer.innerHTML = `
        <div class="no-results">
            <p>Something went wrong.</p>
            <small>Check your API token or try again.</small>
        </div>
    `;
    resultsContainer.classList.add("show");
}

// ========================================
// Form Submit Handler (Normal Search)
// ========================================
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedPlatforms = Array.from(
        document.querySelectorAll('input[name="platform"]:checked')
    ).map(cb => cb.value);

    submitButton.disabled = true;
    submitButton.textContent = "Searching...";
    showLoading();

    try {
        const movies = await fetchMovies(selectedMood, selectedTime, selectedGenre, selectedPlatforms);
        displayResults(movies);
    } catch {
        showError();
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Find something to watch";
    }
});

// ========================================
// Surprise Me Button
// ========================================
surpriseButton.addEventListener("click", async () => {
    const selectedPlatforms = Array.from(
        document.querySelectorAll('input[name="platform"]:checked')
    ).map(cb => cb.value);

    showLoading("Picking something fun...");
    submitButton.disabled = true;
    surpriseButton.disabled = true;

    try {
        const movies = await fetchMovies(selectedMood, selectedTime, selectedGenre, selectedPlatforms);
        displayResults(movies, true);
    } catch {
        showError();
    } finally {
        submitButton.disabled = false;
        surpriseButton.disabled = false;
    }
});
