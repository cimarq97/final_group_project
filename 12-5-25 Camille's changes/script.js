// ========================================
// API & Config
// ========================================
const TMDB_V4_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOWQ3ZGFjM2QyZDI4OGFiMDFiMTliMDA1YWQzMjIxNCIsIm5iZiI6MTc2MzA4MjI4Mi4wOTYsInN1YiI6IjY5MTY4MDJhMzEzN2M3ZGFmMTg3NjVhNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mNnYHf28DA9OqlRm8Vc6tsVs96b9YrA6eJlnWJbtuXY";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342"; // Poster size

// ========================================
// URL Sharing Functions
// ========================================
function encodeSelections() {
    const params = new URLSearchParams();
    if (selections.mood) params.append('mood', selections.mood);
    if (selections.time) params.append('time', selections.time);
    if (selections.genres.length) params.append('genres', selections.genres.join(','));
    if (selections.platforms.length) params.append('platforms', selections.platforms.join(','));
    return params.toString();
}

function decodeSelectionsFromURL() {
    const params = new URLSearchParams(window.location.search);
    const mood = params.get('mood');
    const time = params.get('time');
    const genresStr = params.get('genres');
    const platformsStr = params.get('platforms');
    
    if (mood || time || genresStr || platformsStr) {
        selections.mood = mood;
        selections.time = time;
        selections.genres = genresStr ? genresStr.split(',').map(Number) : [];
        selections.platforms = platformsStr ? platformsStr.split(',') : [];
        return true; // Shared link was used
    }
    return false;
}

function generateShareLink() {
    const encodedParams = encodeSelections();
    const baseURL = window.location.origin + window.location.pathname;
    return encodedParams ? `${baseURL}?${encodedParams}` : baseURL;
}

function copyToClipboard() {
    const shareLink = generateShareLink();
    navigator.clipboard.writeText(shareLink).then(() => {
        alert('Share link copied to clipboard! 🎬');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

function shareViaURL() {
    const shareLink = generateShareLink();
    if (navigator.share) {
        navigator.share({
            title: 'StreamFinder',
            text: 'Check out these movie recommendations from StreamFinder!',
            url: shareLink
        }).catch(err => console.log('Share cancelled'));
    } else {
        copyToClipboard();
    }
}

const MOOD_CONFIG = {
    // Each mood is now a fallback set of genres if user skips the genre step
    cozy: { genres: [35, 10749], sort: "popularity.desc" }, // Comedy, Romance
    excited: { genres: [28, 53, 878], sort: "popularity.desc" }, // Action, Thriller, Sci-Fi
    sad: { genres: [18, 10752], sort: "vote_average.desc", minVotes: 100 }, // Drama, War
    tired: { genres: [35, 10751], sort: "popularity.desc", minVotes: 50 }, // Comedy, Family
    curious: { genres: [99, 9648, 18], sort: "vote_average.desc", minVotes: 50 } // Documentary, Mystery, Drama
};

const RUNTIME_CONFIG = {
    short: { lte: 30 }, medium: { gte: 30, lte: 60 },
    long: { gte: 80, lte: 160 }, binge: null
};

// TMDB Provider IDs mapped to human names
const PLATFORM_NAMES = {
    8: "Netflix", 15: "Hulu", 1899: "Max", 337: "Disney+", 9: "Prime Video", 531: "Paramount+"
};

// Map Genre IDs to Names
const GENRE_NAMES = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
    53: "Thriller", 10752: "War", 37: "Western", 10759: "Action & Adventure", 10765: "Sci-Fi & Fantasy" // Common TV genres
};

// ========================================
// Movie Facts - Cinema & Movie History
// ========================================
const MOVIE_FACTS = [
    "The first feature-length film ever made was 'The Story of the Kelly Gang' from Australia in 1906.",
    "The shortest Oscar-winning live action film is 'The Crescent' at just 39 seconds!",
    "The word 'cinema' comes from the Greek word 'kinema' meaning 'movement'.",
    "In 1927, 'The Jazz Singer' was the first film with synchronized dialogue, revolutionizing cinema forever.",
    "The oldest movie still in existence is 'Roundhay Garden Scene' from 1888, lasting just 2.11 seconds.",
    "Each frame in a typical film is displayed for only 1/24th of a second, creating the illusion of movement.",
    "The most expensive film ever made was 'Avengers: Endgame' at a reported $356-379 million budget.",
    "The longest film ever released was 'Modern Times Forever' at 240 hours (10 days of continuous screening)!",
    "Marilyn Monroe started with a different name: Norma Jeane Mortenson.",
    "The first motion picture was created by Eadweard Muybridge in 1878 using a horse to test if all hooves leave the ground.",
    "Alfred Hitchcock never won an Oscar for Best Director, despite 5 nominations.",
    "The first color motion picture was shot in 1903 using the Kinemacolor process.",
    "Charlie Chaplin's iconic 'Tramp' character was created in his second film in 1914.",
    "In 1895, the Lumière brothers held the first public cinema screening in Paris.",
    "Buster Keaton was known for never smiling during stunts, even when performing dangerous scenes.",
    "The phrase 'That's a wrap!' comes from the practice of wrapping film reels in cloth between scenes.",
    "D.W. Griffith directed over 400 films and is considered a pioneer of cinema storytelling.",
    "The Academy Awards were first held in 1929 with only 15 awards given out (today there are over 20 categories).",
    "It takes approximately 24,000 frames to make an animated film that's 90 minutes long.",
    "The Oscars statuette is 13.5 inches tall and weighs 8.5 pounds.",
    "Orson Welles was only 25 years old when he directed 'Citizen Kane', often considered the greatest film ever made.",
    "The first film to gross over $100 million was 'Jaws' in 1975, revolutionizing the blockbuster era.",
    "The word 'blockbuster' comes from WWII, describing bombs that could destroy entire city blocks.",
    "Stanley Kubrick spent 46 days shooting the famous 'Unchained Melody' scene in 'Eyes Wide Shut'.",
    "The sound barrier breaking in 'The Right Stuff' was achieved using real F-104 Starfighter jets.",
    "Hitchcock's cameo appearances in his films became a signature trademark of his work.",
    "The first film to be shown on an airplane was in 1925, changing entertainment forever.",
    "Spielberg's 'Jaws' accidentally created the summer blockbuster season as we know it today.",
    "The original 'Planet of the Apes' was made for only $5.8 million but became a massive success.",
    "Warner Bros. created the first ever studio system, establishing the factory approach to filmmaking."
];

// ========================================
// State & Elements
// ========================================
let currentStep = 0;
// genres is now an array for multi-selection
let selections = { mood: null, time: null, genres: [], platforms: [] }; 
// Use the TMDb ID as the key for the watch list
let favorites = JSON.parse(localStorage.getItem('streamFinderFavs')) || [];

const navQuiz = document.getElementById('nav-quiz');
const navFavs = document.getElementById('nav-favorites');
const viewQuiz = document.getElementById('view-quiz');
const viewFavs = document.getElementById('view-favorites');
const favCountEl = document.getElementById('fav-count');

// ========================================
// Movie Fact Display
// ========================================
function initializeMovieFact() {
    const movieFactEl = document.getElementById('movie-fact');
    const factTextEl = document.getElementById('fact-text');
    
    if (!movieFactEl) return;
    
    // Select a random fact
    const randomFact = MOVIE_FACTS[Math.floor(Math.random() * MOVIE_FACTS.length)];
    factTextEl.textContent = randomFact;
    
    // Show fact for 8 seconds then fade out
    setTimeout(() => {
        movieFactEl.classList.add('fade-out');
        // Remove the element after animation completes
        setTimeout(() => {
            movieFactEl.style.display = 'none';
        }, 800);
    }, 8000);
}

// Initialize movie fact when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeMovieFact();
});

// ========================================
// Select All Button for Platforms
// ========================================
function initializeSelectAllButton() {
    const selectAllBtn = document.getElementById('select-all-btn');
    const platformCheckboxes = document.querySelectorAll('input[name="platform"]');
    
    if (!selectAllBtn) return;
    
    selectAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Check if all are already selected
        const allChecked = Array.from(platformCheckboxes).every(cb => cb.checked);
        
        // Toggle all checkboxes
        platformCheckboxes.forEach(checkbox => {
            checkbox.checked = !allChecked;
        });
        
        // Update button text based on state
        if (allChecked) {
            selectAllBtn.innerHTML = '<i class="fas fa-check-double"></i> Select All';
        } else {
            selectAllBtn.innerHTML = '<i class="fas fa-times-circle"></i> Deselect All';
        }
    });
}

// Initialize select all button after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeSelectAllButton();
});

// ========================================
// View and Navigation Logic
// ========================================
function switchView(view) {
    if (view === 'quiz') {
        viewQuiz.classList.add('active'); viewFavs.classList.remove('active');
        navQuiz.classList.add('active'); navFavs.classList.remove('active');
    } else {
        viewQuiz.classList.remove('active'); viewFavs.classList.add('active');
        navQuiz.classList.remove('active'); navFavs.classList.add('active');
        renderCategorizedFavorites(); // Always re-render on view switch
    }
}

navQuiz.addEventListener('click', () => switchView('quiz'));
navFavs.addEventListener('click', () => switchView('favs'));

function goToStep(index) {
    // Ensure index is within bounds [0, 5]
    if (index < 0 || index > 5) return; 

    const activeStep = document.querySelector('.quiz-step.active');
    const nextStepEl = document.getElementById(`step-${index}`);

    if (activeStep) {
        // Apply fade-out class
        activeStep.classList.add('fading-out');
        activeStep.classList.remove('active');

        // Wait for CSS transition (400ms) then proceed
        setTimeout(() => {
            activeStep.classList.remove('fading-out');
            activeStep.style.display = 'none';
            
            if (nextStepEl) {
                nextStepEl.style.display = 'flex';
                // Small timeout to trigger opacity transition
                setTimeout(() => {
                    nextStepEl.classList.add('active');
                }, 50);
            }
        }, 400);
    } else {
        // Initial load
        nextStepEl.classList.add('active');
    }
    currentStep = index;
}

// Attach event listeners for navigation buttons
document.querySelectorAll('.next-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Special logic for step 0 (Start button)
        if (currentStep === 0) {
            goToStep(1);
        } else {
            // Standard move forward
            goToStep(currentStep + 1);
        }
    });
});

document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetStep = parseInt(btn.dataset.target || (currentStep - 1), 10);
        goToStep(targetStep);
    });
});

// ========================================
// Selection Logic (Mood/Time: Single Select)
// ========================================
function setupSingleSelection(parentId, key) {
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

setupSingleSelection('mood-buttons', 'mood');
setupSingleSelection('time-buttons', 'time');

// ========================================
// Selection Logic (Genre: Multi-Select)
// ========================================
const genreParent = document.getElementById('genre-buttons');
if (genreParent) {
    const genreBtns = genreParent.querySelectorAll('.option-card');
    genreBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const genreId = parseInt(btn.dataset.genreId, 10);
            const index = selections.genres.indexOf(genreId);

            btn.classList.toggle('selected');

            if (index > -1) {
                // Deselect
                selections.genres.splice(index, 1);
            } else {
                // Select
                selections.genres.push(genreId);
            }
        });
    });
}

// ========================================
// Surprise Button Logic (Categorize by Platform)
// ========================================
document.getElementById('surprise-btn').addEventListener('click', () => {
    // 1. Randomize Mood (to set a tone/sort)
    const moods = Object.keys(MOOD_CONFIG);
    selections.mood = moods[Math.floor(Math.random() * moods.length)];
    
    // 2. Clear filters for broad search
    selections.time = null;
    selections.genres = [];
    
    // 3. Search all major platforms for maximum results
    selections.platforms = Object.keys(PLATFORM_NAMES).map(id => id.toString()); 

    // 4. Jump to results and fetch
    goToStep(5);
    fetchAndDisplayMovies(true); // Pass true to enable platform categorization
});

// ========================================
// Quiz Submission
// ========================================
document.getElementById('quiz-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Gather selected platforms
    selections.platforms = Array.from(document.querySelectorAll('input[name="platform"]:checked')).map(cb => cb.value);
    goToStep(5);
    fetchAndDisplayMovies(false); // Normal quiz mode
});

document.getElementById('restart-btn').addEventListener('click', () => {
    // Reset state
    selections = { mood: null, time: null, genres: [], platforms: [] };
    // Reset UI
    document.querySelectorAll('.selected').forEach(b => b.classList.remove('selected'));
    document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
    goToStep(0);
});

// ========================================
// Fetch & Render Results
// ========================================
async function fetchAndDisplayMovies(isSurpriseMode = false) {
    const container = document.getElementById('results-area');
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Searching archives...</div>';

    try {
        const url = new URL(`${TMDB_BASE_URL}/discover/movie`);
        url.searchParams.append("watch_region", "US");
        
        // 1. Platforms
        if (selections.platforms.length) {
            url.searchParams.append("with_watch_providers", selections.platforms.join("|"));
            url.searchParams.append("watch_monetization_types", "flatrate"); // Only look for subscription services
        }
        
        // 2. Genre/Sort Logic FIX
        let genreStr = "";
        let sortStr = "popularity.desc";

        if (selections.genres.length > 0) {
            // Prioritize explicitly selected genres (Multiple genre fix)
            genreStr = selections.genres.join(",");
        } else if (selections.mood) {
            // Fallback to mood genres
            genreStr = MOOD_CONFIG[selections.mood].genres.join(",");
            sortStr = MOOD_CONFIG[selections.mood].sort;
        }

        if (genreStr) url.searchParams.append("with_genres", genreStr);
        url.searchParams.append("sort_by", sortStr);
        url.searchParams.append("vote_count.gte", "50"); // Quality filter

        // 3. Runtime
        if(selections.time && RUNTIME_CONFIG[selections.time]) {
            const rt = RUNTIME_CONFIG[selections.time];
            if(rt.gte) url.searchParams.append("with_runtime.gte", rt.gte);
            if(rt.lte) url.searchParams.append("with_runtime.lte", rt.lte);
        }

        const res = await fetch(url, { headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` } });
        const data = await res.json();
        
        if (isSurpriseMode) {
            // New: Handle surprise mode categorization
            await displaySurpriseMovies(data.results || [], container);
        } else {
            // Normal display mode
            displayMovies(data.results || [], container);
        }

    } catch(e) {
        console.error("Fetch Error:", e);
        container.innerHTML = '<div class="empty-state">Error connecting to database.</div>';
    }
}

function displayMovies(movies, container) {
    container.innerHTML = "";
    if(!movies.length) {
        container.innerHTML = '<div class="empty-state">No matches found. Try different filters.</div>';
        return;
    }
    
    // Add movies
    const shuffled = movies.sort(() => 0.5 - Math.random()).slice(0, 10);
    shuffled.forEach(m => container.appendChild(createMovieCard(m)));
}

// ========================================
// Surprise Me - Categorization by Platform
// ========================================
async function displaySurpriseMovies(movies, container) {
    container.innerHTML = "";
    if(!movies.length) {
        container.innerHTML = '<div class="empty-state">No surprises found on your selected platforms.</div>';
        return;
    }
    
    // Add Share Section at top
    const shareSection = document.createElement('div');
    shareSection.className = 'share-section';
    shareSection.innerHTML = `
        <div class="share-header">
            <h3>Love the surprise? Share them!</h3>
            <div class="share-buttons">
                <button class="share-btn share-copy" title="Copy link">
                    <i class="fas fa-link"></i> Copy Link
                </button>
                <button class="share-btn share-social" title="Share">
                    <i class="fas fa-share-alt"></i> Share
                </button>
            </div>
        </div>
    `;
    container.appendChild(shareSection);
    
    // Attach share event listeners
    shareSection.querySelector('.share-copy').addEventListener('click', copyToClipboard);
    shareSection.querySelector('.share-social').addEventListener('click', shareViaURL);

    const groups = {};
    const platformIds = selections.platforms;

    // 1. Group movies based on a random platform ID they appear on
    // This requires an additional API call per movie to get the platform details
    const promises = movies.slice(0, 15).map(m => fetchWatchProviders(m.id));

    const providerResults = await Promise.all(promises);

    providerResults.forEach((providers, index) => {
        const movie = movies[index];
        const usProviders = providers?.results?.US?.flatrate;

        if (usProviders && usProviders.length > 0) {
            // Find a common platform ID between the movie's providers and the user's selected platforms
            const commonProviders = usProviders.filter(p => platformIds.includes(p.provider_id.toString()));
            
            if (commonProviders.length > 0) {
                // Select a random platform from the common ones for categorization
                const selectedProvider = commonProviders[Math.floor(Math.random() * commonProviders.length)];
                const platformId = selectedProvider.provider_id;
                
                if (!groups[platformId]) groups[platformId] = { name: PLATFORM_NAMES[platformId], movies: [] };
                
                // Attach platform name for display on card
                movie.platformName = PLATFORM_NAMES[platformId];
                groups[platformId].movies.push(movie);
            }
        }
    });

    // 2. Render Groups
    if (Object.keys(groups).length === 0) {
         container.innerHTML = '<div class="empty-state">Could not verify streaming providers for the results.</div>';
         return;
    }

    for (const group of Object.values(groups)) {
        const section = document.createElement('div');
        section.className = 'platform-section';
        section.innerHTML = `<h3 class="platform-title">${group.name} Picks (${group.movies.length})</h3>`;
        
        const grid = document.createElement('div');
        grid.className = 'results-grid'; // Use the standard grid for Surprise Me
        
        group.movies.forEach(m => grid.appendChild(createMovieCard(m)));
        section.appendChild(grid);
        container.appendChild(section);
    }
}

// API helper to get streaming providers for a single movie
async function fetchWatchProviders(movieId) {
    const url = new URL(`${TMDB_BASE_URL}/movie/${movieId}/watch/providers`);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` } });
    return res.json();
}

// API helper to get IMDB ID for a movie
async function fetchMovieDetails(movieId) {
    const url = new URL(`${TMDB_BASE_URL}/movie/${movieId}`);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` } });
    const data = await res.json();
    return { 
        imdb_id: data.imdb_id,
        runtime: data.runtime,
        genres: data.genres
    };
}

// Share individual movie via URL
function shareMovieCard(movieId, movieTitle) {
    const shareLink = `${window.location.origin}${window.location.pathname}?movieId=${movieId}&movieTitle=${encodeURIComponent(movieTitle)}`;
    if (navigator.share) {
        navigator.share({
            title: `Check out "${movieTitle}" on StreamFinder!`,
            text: `I found "${movieTitle}" on StreamFinder. Check it out!`,
            url: shareLink
        }).catch(err => console.log('Share cancelled'));
    } else {
        navigator.clipboard.writeText(shareLink).then(() => {
            alert(`Movie link copied to clipboard! 🎬\n"${movieTitle}"`);
        }).catch(err => console.error('Failed to copy:', err));
    }
}

// ========================================
// Card Creation (Includes Poster and Details)
// ========================================
function createMovieCard(movie) {
    const div = document.createElement('div');
    div.className = 'movie-card';
    const isFav = favorites.some(f => f.id === movie.id);
    const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
    const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'placeholder.jpg'; // Placeholder needed if poster is missing

    // Start with basic HTML
    div.innerHTML = `
        <img src="${posterUrl}" class="movie-poster" alt="${movie.title} Poster">
        
        <div class="movie-header">
            <div class="movie-title">${movie.title}</div>
            <div class="movie-meta">
                <span>${year}</span>
                <span>★ ${movie.vote_average.toFixed(1)}</span>
                ${movie.platformName ? `<span class="movie-platform">${movie.platformName}</span>` : ''}
            </div>
        </div>

        <div class="movie-details">
            <p class="movie-desc">${movie.overview || "No description available."}</p>
            <div class="movie-platforms-list"></div>
            <p class="click-hint">Click for details</p>
        </div>
        
        <div class="movie-actions">
            <button class="fav-btn" title="Add to watchlist">
                ${isFav ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>'}
            </button>
            <button class="imdb-btn" title="View on IMDB">
                <i class="fas fa-external-link-alt"></i> IMDB
            </button>
            <button class="share-movie-btn" title="Share this movie">
                <i class="fas fa-share-alt"></i>
            </button>
        </div>
    `;

    // Fetch IMDB ID and watch providers asynchronously
    Promise.all([
        fetchMovieDetails(movie.id),
        fetchWatchProviders(movie.id)
    ]).then(([details, providers]) => {
        // Store IMDB ID on the div for later use
        div.dataset.imdbId = details.imdb_id;
        
        // Update IMDB button with link
        const imdbBtn = div.querySelector('.imdb-btn');
        if (details.imdb_id) {
            imdbBtn.onclick = () => window.open(`https://www.imdb.com/title/${details.imdb_id}/`, '_blank');
        } else {
            imdbBtn.style.opacity = '0.5';
            imdbBtn.style.cursor = 'not-allowed';
        }
        
        // Display streaming platforms for this movie
        const usProviders = providers?.results?.US?.flatrate;
        if (usProviders && usProviders.length > 0) {
            const platformsList = div.querySelector('.movie-platforms-list');
            const platformsHTML = usProviders.map(p => 
                `<span class="platform-badge">${PLATFORM_NAMES[p.provider_id] || p.provider_name}</span>`
            ).join('');
            platformsList.innerHTML = `<div class="platforms-label">Available on:</div><div class="platforms-row">${platformsHTML}</div>`;
        }
    }).catch(err => console.error('Error fetching movie details:', err));

    // 1. Handle Expansion (Click anywhere on card)
    div.addEventListener('click', (e) => {
        // Don't expand if clicking buttons
        if(e.target.closest('.fav-btn') || e.target.closest('.imdb-btn') || e.target.closest('.share-movie-btn')) return;
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

    // 3. Handle Share Movie Button
    const shareBtn = div.querySelector('.share-movie-btn');
    shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        shareMovieCard(movie.id, movie.title);
    });

    return div;
}

// ========================================
// Favorites / Watchlist Logic
// ========================================
function updateFavCount() { 
    favCountEl.innerText = favorites.length; 
    // Show count only if > 0
    favCountEl.style.display = favorites.length > 0 ? 'inline' : 'none';
}
updateFavCount();

function toggleFavorite(movie) {
    const idx = favorites.findIndex(f => f.id === movie.id);
    if(idx > -1) {
        // Remove favorite
        favorites.splice(idx, 1);
    } else {
        // Add favorite (Store only necessary data)
        favorites.push({
            id: movie.id,
            title: movie.title,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            poster_path: movie.poster_path,
            overview: movie.overview,
            genre_ids: movie.genre_ids // Important for categorization
        });
    }
    localStorage.setItem('streamFinderFavs', JSON.stringify(favorites));
    updateFavCount();
    // If the favorites view is open, re-render it
    if(viewFavs.classList.contains('active')) renderCategorizedFavorites();
}

function renderCategorizedFavorites() {
    const container = document.getElementById('favorites-container');
    container.innerHTML = "";
    
    if(favorites.length === 0) {
        container.innerHTML = '<div class="empty-state">Your watchlist is empty. Go find some great content!</div>';
        return;
    }

    // Group by Genre ID (The first genre in the list)
    const groups = {};
    
    favorites.forEach(movie => {
        // Use the first genre ID or 'other' if none are present
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
        // 👇 The key change for the thinner cards on the watchlist
        grid.className = 'favorites-grid'; 
        
        movies.forEach(m => grid.appendChild(createMovieCard(m)));
        section.appendChild(grid);
        container.appendChild(section);
    }
}

// ========================================
// Initialize Shared Link Support
// ========================================
(function initializeShareLink() {
    const hasSharedLink = decodeSelectionsFromURL();
    if (hasSharedLink) {
        // Go directly to results with the shared selections
        goToStep(5);
        fetchAndDisplayMovies(false);
    }
})();