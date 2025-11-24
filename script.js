// ========================================
// API & Config
// ========================================
const TMDB_V4_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOWQ3ZGFjM2QyZDI4OGFiMDFiMTliMDA1YWQzMjIxNCIsIm5iZiI6MTc2MzA4MjI4Mi4wOTYsInN1YiI6IjY5MTY4MDJhMzEzN2M3ZGFmMTg3NjVhNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mNnYHf28DA9OqlRm8Vc6tsVs96b9YrA6eJlnWJbtuXY";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const MOOD_CONFIG = {
    cozy: { genres: [35, 10749], sort: "popularity.desc" },
    excited: { genres: [28, 53, 878], sort: "popularity.desc" },
    sad: { genres: [18, 10749], sort: "vote_average.desc", minVotes: 100 },
    tired: { genres: [35], sort: "popularity.desc", minVotes: 50 },
    curious: { genres: [99, 9648, 18], sort: "vote_average.desc", minVotes: 50 }
};

const RUNTIME_CONFIG = {
    short: { lte: 30 }, medium: { gte: 30, lte: 60 },
    long: { gte: 80, lte: 160 }, binge: null
};

// Map IDs to Names for the Favorites page
const GENRE_NAMES = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
    53: "Thriller", 10752: "War", 37: "Western"
};

// ========================================
// State & Elements
// ========================================
let currentStep = 0;
let selections = { mood: null, time: null, genre: null, platforms: [] };
let favorites = JSON.parse(localStorage.getItem('streamFinderFavs')) || [];

const navQuiz = document.getElementById('nav-quiz');
const navFavs = document.getElementById('nav-favorites');
const viewQuiz = document.getElementById('view-quiz');
const viewFavs = document.getElementById('view-favorites');
const favCountEl = document.getElementById('fav-count');

// ========================================
// Navigation Logic
// ========================================
function switchView(view) {
    if (view === 'quiz') {
        viewQuiz.classList.add('active'); viewFavs.classList.remove('active');
        navQuiz.classList.add('active'); navFavs.classList.remove('active');
    } else {
        viewQuiz.classList.remove('active'); viewFavs.classList.add('active');
        navQuiz.classList.remove('active'); navFavs.classList.add('active');
        renderCategorizedFavorites();
    }
}

navQuiz.addEventListener('click', () => switchView('quiz'));
navFavs.addEventListener('click', () => switchView('favs'));

// ========================================
// Step Transition Logic (Fade Out -> Fade In)
// ========================================
function goToStep(index) {
    const activeStep = document.querySelector('.quiz-step.active');
    const nextStepEl = document.getElementById(`step-${index}`);

    if (activeStep) {
        // Fade out current
        activeStep.classList.add('fading-out');
        activeStep.classList.remove('active');

        // Wait for CSS transition (400ms) then show next
        setTimeout(() => {
            activeStep.classList.remove('fading-out');
            activeStep.style.display = 'none'; // Ensure it's gone
            
            if (nextStepEl) {
                nextStepEl.style.display = 'flex'; // Prep for flex
                // Small timeout to trigger opacity transition
                setTimeout(() => {
                    nextStepEl.classList.add('active');
                }, 50);
            }
        }, 400);
    } else {
        // First load
        nextStepEl.classList.add('active');
    }
    currentStep = index;
}

document.querySelectorAll('.next-btn').forEach(btn => {
    btn.addEventListener('click', () => goToStep(currentStep + 1));
});

document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => goToStep(currentStep - 1));
});

// ========================================
// Selection Logic
// ========================================
function setupSelection(parentId, key) {
    const parent = document.getElementById(parentId);
    if(!parent) return;
    const btns = parent.querySelectorAll('.option-card');
    const nextBtn = parent.closest('.quiz-step').querySelector('.next-btn');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selections[key] = btn.dataset.value;
            if(nextBtn) nextBtn.disabled = false;
        });
    });
}

setupSelection('mood-buttons', 'mood');
setupSelection('time-buttons', 'time');
setupSelection('genre-buttons', 'genre');

// ========================================
// Surprise Button Logic
// ========================================
document.getElementById('surprise-btn').addEventListener('click', () => {
    // 1. Randomize Mood
    const moods = Object.keys(MOOD_CONFIG);
    selections.mood = moods[Math.floor(Math.random() * moods.length)];
    
    // 2. Clear other filters for maximum chaos/fun
    selections.time = null;
    selections.genre = null;
    selections.platforms = []; // Search all platforms

    // 3. Jump to results
    goToStep(5);
    fetchAndDisplayMovies();
});

// ========================================
// Fetch & Render Results
// ========================================
document.getElementById('quiz-form').addEventListener('submit', (e) => {
    e.preventDefault();
    selections.platforms = Array.from(document.querySelectorAll('input[name="platform"]:checked')).map(cb => cb.value);
    goToStep(5);
    fetchAndDisplayMovies();
});

document.getElementById('restart-btn').addEventListener('click', () => {
    selections = { mood: null, time: null, genre: null, platforms: [] };
    document.querySelectorAll('.selected').forEach(b => b.classList.remove('selected'));
    document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
    goToStep(0);
});

async function fetchAndDisplayMovies() {
    const container = document.getElementById('results-area');
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Searching archives...</div>';

    try {
        const url = new URL(`${TMDB_BASE_URL}/discover/movie`);
        url.searchParams.append("watch_region", "US");
        if(selections.platforms.length) url.searchParams.append("with_watch_providers", selections.platforms.join("|"));
        
        // Determine Genre/Sort
        let genreStr = selections.genre;
        let sortStr = "popularity.desc";
        
        if(!genreStr && selections.mood) {
            genreStr = MOOD_CONFIG[selections.mood].genres.join(",");
            sortStr = MOOD_CONFIG[selections.mood].sort;
        }

        if(genreStr) url.searchParams.append("with_genres", genreStr);
        url.searchParams.append("sort_by", sortStr);
        url.searchParams.append("vote_count.gte", "50");

        // Runtime
        if(selections.time && RUNTIME_CONFIG[selections.time]) {
            const rt = RUNTIME_CONFIG[selections.time];
            if(rt.gte) url.searchParams.append("with_runtime.gte", rt.gte);
            if(rt.lte) url.searchParams.append("with_runtime.lte", rt.lte);
        }

        const res = await fetch(url, { headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` } });
        const data = await res.json();
        
        displayMovies(data.results || [], container);
    } catch(e) {
        container.innerHTML = '<div class="empty-state">Error connecting to database.</div>';
    }
}

function displayMovies(movies, container) {
    container.innerHTML = "";
    if(!movies.length) {
        container.innerHTML = '<div class="empty-state">No matches found.</div>';
        return;
    }
    // Randomize result order slightly
    const shuffled = movies.sort(() => 0.5 - Math.random()).slice(0, 10);
    shuffled.forEach(m => container.appendChild(createMovieCard(m)));
}

// ========================================
// Card Creation (Click to Expand)
// ========================================
function createMovieCard(movie) {
    const div = document.createElement('div');
    div.className = 'movie-card';
    const isFav = favorites.some(f => f.id === movie.id);
    const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
    
    div.innerHTML = `
        <div class="movie-header">
            <div class="movie-title">${movie.title}</div>
            <div class="movie-meta">
                <span>${year}</span>
                <span>★ ${movie.vote_average.toFixed(1)}</span>
            </div>
            <div class="click-hint">Click for details</div>
        </div>
        <div class="movie-details">
            <p class="movie-desc">${movie.overview || "No description available."}</p>
        </div>
        <button class="fav-btn ${isFav ? 'is-active' : ''}">
            ${isFav ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>'}
        </button>
    `;

    // 1. Handle Expansion (Click anywhere on card)
    div.addEventListener('click', (e) => {
        // Don't expand if clicking the heart
        if(e.target.closest('.fav-btn')) return;
        div.classList.toggle('expanded');
    });

    // 2. Handle Favorite (Click heart only)
    const btn = div.querySelector('.fav-btn');
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop card from expanding
        toggleFavorite(movie);
        
        // Update Icon immediately
        const active = favorites.some(f => f.id === movie.id);
        btn.classList.toggle('is-active', active);
        btn.innerHTML = active ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    });

    return div;
}

// ========================================
// Favorites (Categorized)
// ========================================
function updateFavCount() { favCountEl.innerText = favorites.length; }
updateFavCount();

function toggleFavorite(movie) {
    const idx = favorites.findIndex(f => f.id === movie.id);
    if(idx > -1) favorites.splice(idx, 1);
    else favorites.push(movie);
    localStorage.setItem('streamFinderFavs', JSON.stringify(favorites));
    updateFavCount();
    if(viewFavs.classList.contains('active')) renderCategorizedFavorites();
}

function renderCategorizedFavorites() {
    const container = document.getElementById('favorites-container');
    container.innerHTML = "";
    
    if(favorites.length === 0) {
        container.innerHTML = '<div class="empty-state">Your watchlist is empty.</div>';
        return;
    }

    // Group by Genre ID (First genre listed in array)
    const groups = {};
    
    favorites.forEach(movie => {
        // Get first genre ID or 'Uncategorized'
        const gId = (movie.genre_ids && movie.genre_ids.length > 0) ? movie.genre_ids[0] : 'other';
        if(!groups[gId]) groups[gId] = [];
        groups[gId].push(movie);
    });

    // Render Groups
    for (const [gId, movies] of Object.entries(groups)) {
        const section = document.createElement('div');
        section.className = 'genre-section';
        
        const genreName = GENRE_NAMES[gId] || "Uncategorized";
        
        section.innerHTML = `<h3 class="genre-title">${genreName} (${movies.length})</h3>`;
        
        const grid = document.createElement('div');
        grid.className = 'results-grid';
        
        movies.forEach(m => grid.appendChild(createMovieCard(m)));
        section.appendChild(grid);
        container.appendChild(section);
    }
}