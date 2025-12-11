// ========================================
// API & Config
// ========================================
const TMDB_V4_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOWQ3ZGFjM2QyZDI4OGFiMDFiMTliMDA1YWQzMjIxNCIsIm5iZiI6MTc2MzA4MjI4Mi4wOTYsInN1YiI6IjY5MTY4MDJhMzEzN2M3ZGFmMTg3NjVhNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mNnYHf28DA9OqlRm8Vc6tsVs96b9YrA6eJlnWJbtuXY";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";

const MOOD_CONFIG = {
    cozy: { genres: [35, 10749], sort: "popularity.desc" },
    excited: { genres: [28, 53, 878], sort: "popularity.desc" },
    sad: { genres: [18, 10752], sort: "vote_average.desc", minVotes: 100 },
    tired: { genres: [35, 10751], sort: "popularity.desc", minVotes: 50 },
    curious: { genres: [99, 9648, 18], sort: "vote_average.desc", minVotes: 50 }
};

const RUNTIME_CONFIG = {
    short: { lte: 30 }, 
    medium: { gte: 30, lte: 60 },
    long: { gte: 80, lte: 160 }, 
    binge: null
};

const PLATFORM_NAMES = {
    8: "Netflix", 15: "Hulu", 1899: "Max", 337: "Disney+", 9: "Prime Video", 
    531: "Paramount+", 384: "MGM+", 257: "Fubo TV", 350: "Apple TV+", 
    386: "Peacock", 1796: "Crunchyroll", 283: "Crackle"
};

const PLATFORM_URLS = {
    8: "https://www.netflix.com/",
    15: "https://www.hulu.com/",
    1899: "https://www.max.com/",
    337: "https://www.disneyplus.com/",
    9: "https://www.amazon.com/Prime-Video/", 
    531: "https://www.paramountplus.com/",
    384: "https://www.mgmplus.com/",
    257: "https://www.fubo.tv/",
    350: "https://tv.apple.com/",
    386: "https://www.peacocktv.com/",
    1796: "https://www.crunchyroll.com/",
    283: "https://www.crackle.com/"
};

const GENRE_NAMES = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
    53: "Thriller", 10752: "War", 37: "Western", 10759: "Action & Adventure", 
    10765: "Sci-Fi & Fantasy"
};

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
    "Warner Bros. created the first ever studio system, establishing the factory approach to filmmaking."
];

// ========================================
// State & Elements
// ========================================
let currentStep = 0;
let selections = { mood: null, time: null, genres: [], platforms: [] };

// FIXED: Properly initialize favorites from localStorage
let favorites = [];
try {
    const savedFavs = localStorage.getItem('streamFinderFavs');
    if (savedFavs) {
        const parsed = JSON.parse(savedFavs);
        if (Array.isArray(parsed)) {
            favorites = parsed;
        }
    }
} catch (e) {
    console.error("Error loading favorites:", e);
    favorites = [];
    localStorage.setItem('streamFinderFavs', JSON.stringify(favorites));
}

let navigationHistory = [];
let currentResultsCache = [];
let favoritesFilters = { genre: 'all', platform: 'all' };

// SWIPER STATE
let swipeMoviePool = [];
let swipePageIndex = 1;
let isFetchingSwipeMovies = false;
let currentSwipeIndex = 0;
let isSwiping = false;

const navQuiz = document.getElementById('nav-quiz');
const navSwipe = document.getElementById('nav-swipe'); 
const navFavs = document.getElementById('nav-favorites');
const viewQuiz = document.getElementById('view-quiz');
const viewSwipe = document.getElementById('view-swipe'); 
const viewFavs = document.getElementById('view-favorites');
const favCountEl = document.getElementById('fav-count');
const logoHome = document.getElementById('logo-home');
const resultsSummaryEl = document.getElementById('results-summary'); 

const swipeCardsContainer = document.getElementById('swipe-cards');
const nopeBtn = document.getElementById('nope-btn');
const likeBtn = document.getElementById('like-btn');
const instructionsBtn = document.getElementById('instructions-btn');

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initializeMovieFact();
    initializeSelectAllButton();
    updateFavCount(); // Initialize fav count on load
    pushHistory(0);
    
    // Instructions button event listener
    if (instructionsBtn) {
        instructionsBtn.addEventListener('click', () => {
            showSwipeTutorial();
        });
    }
    
    // Check URL for saved state
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('mood')) {
        selections.mood = urlParams.get('mood');
        selections.time = urlParams.get('time');
        selections.genres = urlParams.get('genres') ? urlParams.get('genres').split(',').map(Number) : [];
        selections.platforms = urlParams.get('platforms') ? urlParams.get('platforms').split(',') : [];
        
        // Auto-load results if parameters exist
        setTimeout(() => {
            goToStep(5);
            fetchAndDisplayMovies(false);
        }, 1000);
    }
});

// ========================================
// MOVIE FACT DISPLAY
// ========================================
function initializeMovieFact() {
    const movieFactEl = document.getElementById('movie-fact');
    const factTextEl = document.getElementById('fact-text');
    
    if (!movieFactEl) return;
    
    const randomFact = MOVIE_FACTS[Math.floor(Math.random() * MOVIE_FACTS.length)];
    factTextEl.textContent = randomFact;
    
    setTimeout(() => {
        movieFactEl.classList.add('fade-out');
        setTimeout(() => {
            movieFactEl.style.display = 'none';
        }, 800);
    }, 8000);
}

// ========================================
// VIEW NAVIGATION
// ========================================
function switchView(view) {
    viewQuiz.classList.remove('active');
    viewSwipe.classList.remove('active'); 
    viewFavs.classList.remove('active');
    navQuiz.classList.remove('active');
    navSwipe.classList.remove('active'); 
    navFavs.classList.remove('active');
    
    if (view === 'quiz') {
        viewQuiz.classList.add('active'); 
        navQuiz.classList.add('active'); 
    } else if (view === 'swipe') {
        viewSwipe.classList.add('active');
        navSwipe.classList.add('active');
        
        // Initialize swipe view
        if (swipeMoviePool.length === 0 || !document.querySelector('.swipe-card')) {
            loadInitialSwipeMovies();
        }
        
        // Show tutorial on first visit
        const hasSeenTutorial = localStorage.getItem('swipeTutorialSeen');
        if (!hasSeenTutorial) {
            showSwipeTutorial();
            localStorage.setItem('swipeTutorialSeen', 'true');
        }
    } else {
        viewFavs.classList.add('active');
        navFavs.classList.add('active');
        renderCategorizedFavorites();
    }
}

navQuiz.addEventListener('click', () => switchView('quiz'));
navSwipe.addEventListener('click', () => switchView('swipe')); 
navFavs.addEventListener('click', () => switchView('favs'));

logoHome.addEventListener('click', () => {
    switchView('quiz');
    goToStep(0);
});

// ========================================
// FAVORITES COUNT
// ========================================
function updateFavCount() { 
    if (!favCountEl) return;
    
    // Ensure favorites is an array
    if (!Array.isArray(favorites)) {
        favorites = [];
    }
    
    const count = favorites.length;
    favCountEl.innerText = count;
    
    // Show/hide based on count
    if (count > 0) {
        favCountEl.style.display = 'flex';
    } else {
        favCountEl.style.display = 'none';
    }
}

// Call on initial load
updateFavCount();

// ========================================
// QUIZ NAVIGATION
// ========================================
function goToStep(index, addToHistory = true) {
    if (index < 0 || index > 5) return; 

    const activeStep = document.querySelector('.quiz-step.active');
    const nextStepEl = document.getElementById(`step-${index}`);

    if (activeStep) {
        activeStep.classList.add('fading-out');
        activeStep.classList.remove('active');

        setTimeout(() => {
            activeStep.classList.remove('fading-out');
            activeStep.style.display = 'none';
            
            if (nextStepEl) {
                nextStepEl.style.display = 'flex';
                setTimeout(() => {
                    nextStepEl.classList.add('active');
                }, 50);
            }
        }, 400);
    } else {
        nextStepEl.classList.add('active');
    }
    
    currentStep = index;
    if (addToHistory) {
        pushHistory(index);
    }
}

function pushHistory(step) {
    navigationHistory.push(step);
    updateBrowserHistory(step);
}

function updateBrowserHistory(step) {
    const state = { step };
    const url = `#step-${step}`;
    window.history.pushState(state, '', url);
}

window.addEventListener('popstate', (e) => {
    if (e.state && e.state.step !== undefined) {
        goToStep(e.state.step, false);
    }
});

document.querySelectorAll('.next-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentStep === 0) {
            goToStep(1);
        } else {
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
// SELECTION LOGIC
// ========================================
function setupSingleSelection(parentId, key) {
    const parent = document.getElementById(parentId);
    if(!parent) return;
    const btns = parent.querySelectorAll('.option-card');
    const nextBtn = parent.closest('.quiz-step').querySelector('.next-btn');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.tagName === 'BUTTON') { 
                btns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selections[key] = btn.dataset.value;
                if(nextBtn) nextBtn.disabled = false;
            }
        });
    });
}

setupSingleSelection('mood-buttons', 'mood');
setupSingleSelection('time-buttons', 'time');

const genreParent = document.getElementById('genre-buttons');
if (genreParent) {
    const genreBtns = genreParent.querySelectorAll('.option-card');
    genreBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const genreId = parseInt(btn.dataset.genreId, 10);
            const index = selections.genres.indexOf(genreId);

            btn.classList.toggle('selected');

            if (index > -1) {
                selections.genres.splice(index, 1);
            } else {
                selections.genres.push(genreId);
            }
        });
    });
}

// ========================================
// PLATFORM SELECTION
// ========================================
function initializeSelectAllButton() {
    const selectAllBtn = document.getElementById('select-all-platforms');
    const platformCheckboxes = document.querySelectorAll('input[name="platform"]');
    const platformCards = document.querySelectorAll('.platform-card');
    
    if (!selectAllBtn) return;
    
    selectAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const allChecked = Array.from(platformCheckboxes).every(cb => cb.checked);
        
        platformCheckboxes.forEach(checkbox => {
            checkbox.checked = !allChecked;
        });
        
        platformCards.forEach(card => {
            const checkbox = card.querySelector('input[type="checkbox"]');
            if (checkbox.checked) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
        
        if (allChecked) {
            selectAllBtn.innerHTML = '<i class="fas fa-check-double"></i> Select All';
        } else {
            selectAllBtn.innerHTML = '<i class="fas fa-times-circle"></i> Deselect All';
        }
    });

    platformCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT') {
                 e.preventDefault();
                 const checkbox = card.querySelector('input[type="checkbox"]');
                 checkbox.checked = !checkbox.checked;
            }
            if (card.querySelector('input[type="checkbox"]').checked) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    });
}

// ========================================
// SURPRISE BUTTON
// ========================================
document.getElementById('surprise-btn').addEventListener('click', () => {
    const moods = Object.keys(MOOD_CONFIG);
    selections.mood = moods[Math.floor(Math.random() * moods.length)];
    selections.time = null;
    selections.genres = [];
    selections.platforms = Object.keys(PLATFORM_NAMES).map(id => id.toString()); 

    goToStep(5);
    fetchAndDisplayMovies(true);
});

// ========================================
// QUIZ SUBMISSION
// ========================================
document.getElementById('quiz-form').addEventListener('submit', (e) => {
    e.preventDefault();
    selections.platforms = Array.from(document.querySelectorAll('input[name="platform"]:checked')).map(cb => cb.value);
    goToStep(5);
    fetchAndDisplayMovies(false);
});

document.getElementById('restart-btn').addEventListener('click', () => {
    selections = { mood: null, time: null, genres: [], platforms: [] };
    document.querySelectorAll('.selected').forEach(b => b.classList.remove('selected'));
    document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
    document.querySelectorAll('.platform-card.selected').forEach(c => c.classList.remove('selected'));
    currentResultsCache = [];
    if (resultsSummaryEl) resultsSummaryEl.innerHTML = ''; 
    goToStep(0);
});

// ========================================
// FETCH & DISPLAY RESULTS - REMOVED MATCH COUNT
// ========================================
async function fetchAndDisplayMovies(isSurpriseMode = false) {
    const container = document.getElementById('results-area');
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Searching archives...</div>';
    if (resultsSummaryEl) resultsSummaryEl.innerHTML = ''; 

    try {
        const url = new URL(`${TMDB_BASE_URL}/discover/movie`);
        url.searchParams.append("watch_region", "US");
        
        if (selections.platforms.length) {
            url.searchParams.append("with_watch_providers", selections.platforms.join("|"));
        }
        
        let genreStr = "";
        let sortStr = "popularity.desc";
        let selectedGenreNames = []; 
        let finalGenreIds = [];

        if (selections.genres.length > 0) {
            finalGenreIds = selections.genres;
        } else if (selections.mood) {
            finalGenreIds = MOOD_CONFIG[selections.mood].genres;
            sortStr = MOOD_CONFIG[selections.mood].sort;
        }
        
        genreStr = finalGenreIds.join(",");
        selectedGenreNames = finalGenreIds.map(id => GENRE_NAMES[id]).filter(Boolean);

        if (genreStr) url.searchParams.append("with_genres", genreStr);
        url.searchParams.append("sort_by", sortStr);
        url.searchParams.append("vote_count.gte", "50");

        if(selections.time && RUNTIME_CONFIG[selections.time]) {
            const rt = RUNTIME_CONFIG[selections.time];
            if(rt.gte) url.searchParams.append("with_runtime.gte", rt.gte);
            if(rt.lte) url.searchParams.append("with_runtime.lte", rt.lte);
        }

        const res = await fetch(url, { headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` } });
        const data = await res.json();
        
        currentResultsCache = data.results || [];
        renderResultsSummary(isSurpriseMode, selectedGenreNames); 

        if (isSurpriseMode) {
            await displaySurpriseMovies(currentResultsCache, container);
        } else {
            displayMovies(currentResultsCache, container);
        }

    } catch(e) {
        console.error("Fetch Error:", e);
        container.innerHTML = '<div class="empty-state">Error connecting to database.</div>';
        if (resultsSummaryEl) resultsSummaryEl.innerHTML = '';
    }
}

// REMOVED: The match count from summary
function renderResultsSummary(isSurpriseMode, selectedGenreNames) {
    if (!resultsSummaryEl) return;
    let summaryHTML = '';
    
    if (isSurpriseMode) {
        summaryHTML = `
            <h1 class="summary-title"><i class="fas fa-magic"></i> Surprise Me Results!</h1>
            <p class="summary-tagline">We chose a <strong>${selections.mood}</strong> vibe for you across your available platforms.</p>
        `;
    } else {
        const moodText = selections.mood ? `<span class="summary-item"><i class="fas fa-hand-point-right"></i> <strong>Mood:</strong> ${selections.mood}</span>` : '';
        const timeText = selections.time ? `<span class="summary-item"><i class="fas fa-clock"></i> <strong>Time:</strong> ${selections.time}</span>` : '';
        
        const genresText = selectedGenreNames.length > 0 
            ? `<span class="summary-item"><i class="fas fa-mask"></i> <strong>Genres:</strong> ${selectedGenreNames.join(', ')}</span>`
            : '';
            
        const platformNames = selections.platforms.map(id => PLATFORM_NAMES[id]).filter(Boolean).join(', ');
        const platformsText = selections.platforms.length > 0 
            ? `<span class="summary-item"><i class="fas fa-tv"></i> <strong>Platforms:</strong> ${platformNames}</span>`
            : '';

        // REMOVED: "Found X potential matches for:" line
        summaryHTML = `
            <h1 class="summary-title"><i class="fas fa-trophy"></i> Your Perfect Picks</h1>
            <p class="summary-tagline">Based on your preferences:</p>
            <div class="summary-details">
                ${moodText}
                ${timeText}
                ${genresText}
                ${platformsText}
            </div>
        `;
    }
    
    resultsSummaryEl.innerHTML = summaryHTML;
}

function displayMovies(movies, container) {
    container.innerHTML = "";
    if(!movies.length) {
        container.innerHTML = '<div class="empty-state">No matches found. Try different filters.</div>';
        return;
    }
    
    const shuffled = movies.sort(() => 0.5 - Math.random()).slice(0, 10);
    
    shuffled.forEach(async m => {
        const enrichedMovie = await enrichMovieData(m, false); 
        container.appendChild(createMovieCard(enrichedMovie, false)); // false = not for swipe
    });
}

// ========================================
// ENRICH MOVIE DATA
// ========================================
async function enrichMovieData(movie, simple = false) {
    try {
        const providersData = await fetchWatchProviders(movie.id);
        const usProviders = providersData?.results?.US?.flatrate || [];
        
        movie.providers = usProviders.map(p => {
            const name = PLATFORM_NAMES[p.provider_id];
            const url = PLATFORM_URLS[p.provider_id] || '#'; 
            return name ? { name, url } : null;
        }).filter(Boolean);
    } catch (e) {
        console.error("Error fetching providers:", e);
    }

    // Always fetch cast and IMDb ID for all cards
    try {
        const creditsUrl = `${TMDB_BASE_URL}/movie/${movie.id}/credits`;
        const creditsRes = await fetch(creditsUrl, { headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` } });
        const creditsData = await creditsRes.json();
        
        const externalIdsUrl = `${TMDB_BASE_URL}/movie/${movie.id}/external_ids`;
        const externalIdsRes = await fetch(externalIdsUrl, { headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` } });
        const externalIdsData = await externalIdsRes.json();
        
        movie.cast = creditsData.cast ? creditsData.cast.slice(0, 5) : [];
        
        // Fetch IMDb IDs for cast members
        for (const actor of movie.cast) {
            try {
                const personUrl = `${TMDB_BASE_URL}/person/${actor.id}/external_ids`;
                const personRes = await fetch(personUrl, { headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` } });
                const personData = await personRes.json();
                actor.imdb_id = personData.imdb_id;
            } catch (e) {
                console.error("Error fetching actor IMDb ID:", e);
                actor.imdb_id = null;
            }
        }

        movie.imdb_id = externalIdsData.imdb_id;
        
    } catch(e) {
        console.error("Error enriching movie data:", e);
        movie.cast = [];
        movie.imdb_id = null;
    }

    return movie;
}

async function fetchWatchProviders(movieId) {
    const url = new URL(`${TMDB_BASE_URL}/movie/${movieId}/watch/providers`);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` } });
    return res.json();
}

// ========================================
// MOVIE SWIPER LOGIC - USING UNIFIED CARDS
// ========================================
async function fetchSwipeMovies() {
    if (isFetchingSwipeMovies) return;
    isFetchingSwipeMovies = true;

    const url = new URL(`${TMDB_BASE_URL}/trending/movie/week`);
    url.searchParams.append("watch_region", "US");
    url.searchParams.append("page", swipePageIndex);
    
    try {
        const res = await fetch(url, { headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` } });
        const data = await res.json();
        
        if (data.results && data.results.length > 0) {
            const newMovies = data.results.filter(m => 
                !swipeMoviePool.some(p => p.id === m.id) &&
                !favorites.some(f => f.id === m.id)
            );
            
            // Enrich with full data including cast
            const enrichPromises = newMovies.map(m => enrichMovieData(m, false));
            const enrichedBatch = await Promise.all(enrichPromises);
            
            swipeMoviePool.push(...enrichedBatch);
            swipePageIndex++;
            
            if (swipeMoviePool.length > 0 && !document.querySelector('.swipe-card')) {
                renderSwipeCards();
            }
        }
        
    } catch(e) {
        console.error("Swipe movie fetch error:", e);
    } finally {
        isFetchingSwipeMovies = false;
    }
}

async function loadInitialSwipeMovies() {
    swipeCardsContainer.innerHTML = '<div class="swipe-loading"><i class="fas fa-spinner fa-spin"></i> Loading movie buffet...</div>';
    
    while (swipeMoviePool.length < 10 && swipePageIndex <= 3) { 
        await fetchSwipeMovies();
        if (swipeMoviePool.length >= 10) break; 
    }
    
    if (swipeMoviePool.length > 0) {
        renderSwipeCards();
    } else {
        swipeCardsContainer.innerHTML = '<div class="empty-state">No movies found for swiping. Try again later!</div>';
    }
}

function renderSwipeCards() {
    swipeCardsContainer.innerHTML = '';
    currentSwipeIndex = 0;
    
    if (swipeMoviePool.length === 0) {
        swipeCardsContainer.innerHTML = '<div class="empty-state">No more movies to swipe!</div>';
        return;
    }
    
    const currentMovie = swipeMoviePool[0];
    const card = createSwipeCard(currentMovie);
    swipeCardsContainer.appendChild(card);
    attachSwipeHandlers(card);
    
    if (swipeMoviePool.length < 5) {
        fetchSwipeMovies();
    }
}

// CREATE SWIPE CARD - Uses same createMovieCard function with swipe indicators
function createSwipeCard(movie) {
    // Create regular movie card
    const card = createMovieCard(movie, true); // true = for swipe
    
    // Add swipe indicators
    const indicatorsHTML = `
        <div class="swipe-indicator nope">
            <i class="fas fa-times-circle"></i> 
            <span>NOPE</span>
        </div>
        <div class="swipe-indicator like">
            <i class="fas fa-heart"></i> 
            <span>LIKE</span>
        </div>
    `;
    
    // Insert indicators at the beginning
    card.insertAdjacentHTML('afterbegin', indicatorsHTML);
    
    return card;
}

function attachSwipeHandlers(card) {
    if (!card) return;

    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let isSwiping = false;
    
    const nopeIndicator = card.querySelector('.swipe-indicator.nope');
    const likeIndicator = card.querySelector('.swipe-indicator.like');
    
    card.addEventListener('mousedown', handleStart);
    card.addEventListener('touchstart', handleStart, { passive: true });
    
    function handleStart(e) {
        if (isSwiping) return;
        isDragging = true;
        startX = e.clientX || e.touches[0].clientX;
        currentX = startX;
        card.style.transition = 'none';
        card.style.cursor = 'grabbing';
        card.classList.add('dragging');
        e.preventDefault();
    }
    
    function handleMove(e) {
        if (!isDragging || isSwiping) return;
        
        currentX = e.clientX || (e.touches && e.touches[0].clientX) || currentX;
        const deltaX = currentX - startX;
        const windowWidth = window.innerWidth;
        const rotation = (deltaX / windowWidth) * 25;
        const swipeDistance = Math.abs(deltaX);
        const threshold = 100;
        const opacity = Math.min(swipeDistance / threshold, 0.8);
        
        card.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
        
        if (deltaX < -threshold) {
            nopeIndicator.style.opacity = opacity;
            likeIndicator.style.opacity = 0;
            nopeIndicator.style.transform = 'scale(1)';
            likeIndicator.style.transform = 'scale(0.8)';
        } else if (deltaX > threshold) {
            likeIndicator.style.opacity = opacity;
            nopeIndicator.style.opacity = 0;
            likeIndicator.style.transform = 'scale(1)';
            nopeIndicator.style.transform = 'scale(0.8)';
        } else {
            nopeIndicator.style.opacity = 0;
            likeIndicator.style.opacity = 0;
        }
    }
    
    function handleEnd(e) {
        if (!isDragging || isSwiping) return;
        
        isDragging = false;
        card.style.cursor = 'grab';
        card.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        card.classList.remove('dragging');
        
        const deltaX = currentX - startX;
        const threshold = 100;
        
        if (Math.abs(deltaX) > threshold) {
            isSwiping = true;
            const direction = deltaX > 0 ? 'right' : 'left';
            handleSwipe(card, direction);
        } else {
            card.style.transform = 'translateX(0) rotate(0)';
            nopeIndicator.style.opacity = 0;
            likeIndicator.style.opacity = 0;
        }
    }
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: true });
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);
    document.addEventListener('mouseleave', handleEnd);
    
    const cleanup = () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchend', handleEnd);
    };
    
    card.addEventListener('remove', cleanup);
}

function handleSwipe(card, direction) {
    const movieId = card.dataset.movieId;
    const movie = swipeMoviePool.find(m => m.id.toString() === movieId);
    
    const exitX = direction === 'right' ? 1000 : -1000;
    const exitRotation = direction === 'right' ? 30 : -30;
    
    if (direction === 'right' && movie) {
        card.querySelector('.swipe-indicator.like').style.opacity = '1';
        card.querySelector('.swipe-indicator.like').style.transform = 'scale(1.2)';
        toggleFavorite(movie);
        showSwipeFeedback('Added to Watchlist!', 'success');
    } else {
        card.querySelector('.swipe-indicator.nope').style.opacity = '1';
        card.querySelector('.swipe-indicator.nope').style.transform = 'scale(1.2)';
        showSwipeFeedback('Movie dismissed', 'info');
    }
    
    card.style.transform = `translateX(${exitX}px) rotate(${exitRotation}deg)`;
    
    setTimeout(() => {
        swipeMoviePool = swipeMoviePool.filter(m => m.id.toString() !== movieId);
        card.remove();
        setTimeout(() => {
            renderSwipeCards();
            isSwiping = false;
        }, 300);
    }, 500);
}

// ========================================
// SWIPE FEEDBACK
// ========================================
function showSwipeFeedback(message, type = 'info') {
    const existing = document.querySelector('.swipe-feedback');
    if (existing) existing.remove();
    
    const feedback = document.createElement('div');
    feedback.className = `swipe-feedback ${type}`;
    feedback.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'heart' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    const swipeArea = document.querySelector('.swipe-area');
    if (swipeArea) {
        swipeArea.appendChild(feedback);
        
        setTimeout(() => {
            feedback.classList.add('fade-out');
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    }
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========================================
// SWIPE CONTROLS
// ========================================
if (nopeBtn) {
    nopeBtn.addEventListener('click', () => {
        const topCard = swipeCardsContainer.querySelector('.swipe-card');
        if (topCard && !isSwiping) {
            handleSwipe(topCard, 'left');
        }
    });
}

if (likeBtn) {
    likeBtn.addEventListener('click', () => {
        const topCard = swipeCardsContainer.querySelector('.swipe-card');
        if (topCard && !isSwiping) {
            handleSwipe(topCard, 'right');
        }
    });
}

const infoBtn = document.getElementById('info-btn');
if (infoBtn) {
    infoBtn.addEventListener('click', () => {
        const topCard = swipeCardsContainer.querySelector('.swipe-card');
        if (topCard) {
            topCard.classList.toggle('expanded');
            if (topCard.classList.contains('expanded')) {
                showSwipeFeedback('Tap again to collapse', 'info');
            }
        }
    });
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================
document.addEventListener('keydown', (e) => {
    if (viewSwipe.classList.contains('active')) {
        const topCard = swipeCardsContainer.querySelector('.swipe-card');
        if (!topCard || isSwiping) return;
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'A':
            case 'a':
                e.preventDefault();
                handleSwipe(topCard, 'left');
                break;
            case 'ArrowRight':
            case 'D':
            case 'd':
                e.preventDefault();
                handleSwipe(topCard, 'right');
                break;
            case ' ':
            case 'Enter':
                e.preventDefault();
                topCard.classList.toggle('expanded');
                break;
        }
    }
});

// ========================================
// SWIPE TUTORIAL
// ========================================
function showSwipeTutorial() {
    const tutorial = document.createElement('div');
    tutorial.className = 'swipe-tutorial-overlay';
    tutorial.innerHTML = `
        <div class="swipe-tutorial">
            <h3><i class="fas fa-graduation-cap"></i> How to Use Movie Swipe</h3>
            <div class="tutorial-steps">
                <div class="tutorial-step">
                    <div class="tutorial-icon swipe-left">
                        <i class="fas fa-arrow-left"></i>
                    </div>
                    <p>Swipe <strong>LEFT</strong> or click <i class="fas fa-times"></i> to dismiss</p>
                </div>
                <div class="tutorial-step">
                    <div class="tutorial-icon swipe-right">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                    <p>Swipe <strong>RIGHT</strong> or click <i class="fas fa-heart"></i> to add to Watchlist</p>
                </div>
                <div class="tutorial-step">
                    <div class="tutorial-icon swipe-info">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <p>Click <i class="fas fa-info"></i> or <strong>SPACEBAR</strong> to see details</p>
                </div>
                <div class="tutorial-step">
                    <div class="tutorial-icon keyboard">
                        <i class="fas fa-keyboard"></i>
                    </div>
                    <p>Use <strong>Arrow Keys</strong> or <strong>A/D</strong> for keyboard shortcuts</p>
                </div>
            </div>
            <button class="action-btn primary-btn tutorial-close">
                Got it, let's swipe!
            </button>
        </div>
    `;
    
    document.body.appendChild(tutorial);
    
    tutorial.querySelector('.tutorial-close').addEventListener('click', () => {
        tutorial.classList.add('fade-out');
        setTimeout(() => tutorial.remove(), 300);
    });
    
    setTimeout(() => {
        if (tutorial.parentNode) {
            tutorial.classList.add('fade-out');
            setTimeout(() => tutorial.remove(), 300);
        }
    }, 10000);
}

// ========================================
// SURPRISE MOVIES
// ========================================
async function displaySurpriseMovies(movies, container) {
    container.innerHTML = "";
    if(!movies.length) {
        container.innerHTML = '<div class="empty-state">No surprises found on your selected platforms.</div>';
        return;
    }

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
    
    shareSection.querySelector('.share-copy').addEventListener('click', () => copyToClipboard());
    shareSection.querySelector('.share-social').addEventListener('click', () => shareViaURL());

    const groups = {};
    const promises = movies.sort(() => 0.5 - Math.random()).slice(0, 15).map(m => enrichMovieData(m, false)); 
    const enrichedMovies = await Promise.all(promises);

    enrichedMovies.forEach((movie) => {
        const rawProviders = movie.providers || [];
        
        if (rawProviders.length > 0) {
            const selectedProvider = rawProviders.find(p => 
                selections.platforms.some(id => PLATFORM_NAMES[id] === p.name)
            );

            if (selectedProvider) {
                const platformKey = selectedProvider.name;
                
                if (!groups[platformKey]) {
                    groups[platformKey] = { name: platformKey, movies: [] };
                }
                
                movie.platformName = selectedProvider.name; 
                movie.platformUrl = selectedProvider.url; 
                groups[platformKey].movies.push(movie);
            }
        }
    });

    if (Object.keys(groups).length === 0) {
         container.innerHTML = '<div class="empty-state">Could not verify streaming providers for the results.</div>';
         return;
    }

    for (const group of Object.values(groups)) {
        const section = document.createElement('div');
        section.className = 'platform-section';
        section.innerHTML = `<h3 class="platform-title">${group.name} Picks (${group.movies.length})</h3>`;
        
        const grid = document.createElement('div');
        grid.className = 'results-grid';
        
        group.movies.forEach(m => grid.appendChild(createMovieCard(m, false))); // false = not for swipe
        section.appendChild(grid);
        container.appendChild(section);
    }
}

// ========================================
// CREATE UNIFIED MOVIE CARD - Used EVERYWHERE
// ========================================
function createMovieCard(movie, forSwipe = false) {
    const div = document.createElement('div');
    div.className = forSwipe ? 'movie-card swipe-card' : 'movie-card';
    div.dataset.movieId = movie.id;
    
    const isFav = favorites.some(f => f.id === movie.id);
    const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
    const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/342x513?text=No+Image';

    // Cast section
    const castHTML = movie.cast && movie.cast.length > 0 
        ? `<div class="movie-cast">
             <div class="cast-title">Starring</div>
             <div class="cast-list">
               ${movie.cast.map(actor => 
                    `<span class="cast-member" data-imdb-id="${actor.imdb_id || ''}">${actor.name}</span>`
               ).join('')}
             </div>
           </div>`
        : '';

    // Providers section
    let providersDisplay = [];
    if (movie.platformName && movie.platformUrl) {
        providersDisplay.push({ name: movie.platformName, url: movie.platformUrl });
    } else {
        providersDisplay = movie.providers || [];
    }
    
    const providersHTML = providersDisplay.length > 0
        ? `<div class="movie-platforms">
             ${providersDisplay.map(p => {
                return `
                    <a href="${p.url}" target="_blank" class="movie-platform streaming-link" onclick="event.stopPropagation()">
                        ${p.name}
                    </a>`;
            }).join('')}
           </div>`
        : '';

    const imdbLink = movie.imdb_id 
        ? `https://www.imdb.com/title/${movie.imdb_id}/` 
        : '#';
    
    const voteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

    div.innerHTML = `
        <img src="${posterUrl}" class="movie-poster" alt="${movie.title} Poster">
        
        <div class="quick-rating-badge">
            <i class="fas fa-star"></i> ${voteAverage}
        </div>

        <div class="movie-actions-overlay">
            <button class="action-btn-circle btn-favorite ${isFav ? 'is-active' : ''}" title="Add to watchlist">
                ${isFav ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>'}
            </button>
            <button class="action-btn-circle btn-share" data-title="${movie.title}" title="Share this movie">
                <i class="fas fa-share-alt"></i>
            </button>
            <a href="${imdbLink}" target="_blank" class="action-btn-circle btn-imdb ${movie.imdb_id ? '' : 'disabled'}" title="View on IMDB">
                <i class="fas fa-external-link-alt"></i>
            </a>
        </div>
        
        <div class="movie-header">
            <div class="movie-title">${movie.title}</div>
            ${providersHTML}
        </div>

        <div class="movie-details">
            <div class="movie-meta">
                <span>${year}</span>
            </div>
            <p class="movie-desc">${movie.overview || "No description available."}</p>
            ${castHTML}
            
            <div class="action-links-expanded">
                <button class="expanded-action-btn btn-favorite-expanded ${isFav ? 'is-active' : ''}" title="Add to watchlist">
                    ${isFav ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>'} Watchlist
                </button>
                ${movie.imdb_id ? `<a href="${imdbLink}" target="_blank" class="expanded-action-btn btn-imdb-expanded" title="View on IMDB">
                    <i class="fas fa-external-link-alt"></i> IMDb
                </a>` : ''}
                <button class="expanded-action-btn btn-share-expanded" data-title="${movie.title}">
                    <i class="fas fa-share-alt"></i> Share
                </button>
            </div>
        </div>
        ${forSwipe ? '' : '<p class="click-hint">Click for details</p>'}
    `;

    // Card expansion (not for swipe cards - they use info button)
    if (!forSwipe) {
        div.addEventListener('click', (e) => {
            if(e.target.closest('.action-btn-circle') || e.target.closest('.cast-member') || e.target.closest('.streaming-link')) {
                return;
            }
            if(!e.target.closest('.action-links-expanded')) {
                div.classList.toggle('expanded');
            }
        });
    }

    // Favorite toggle
    div.querySelectorAll('.btn-favorite, .btn-favorite-expanded').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(movie);
            
            // Update UI immediately
            const active = favorites.some(f => f.id === movie.id);
            
            div.querySelectorAll('.btn-favorite').forEach(favBtn => {
                favBtn.classList.toggle('is-active', active);
                favBtn.innerHTML = active ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
            });
            div.querySelectorAll('.btn-favorite-expanded').forEach(favBtnExpanded => {
                favBtnExpanded.classList.toggle('is-active', active);
                favBtnExpanded.innerHTML = active ? '<i class="fas fa-heart"></i> Watchlist' : '<i class="far fa-heart"></i> Watchlist';
            });
        });
    });

    // Share button
    div.querySelectorAll('.btn-share, .btn-share-expanded').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            shareMovie(movie);
        });
    });
    
    // IMDb link
    div.querySelectorAll('.btn-imdb, .btn-imdb-expanded').forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Actor click handler
    div.querySelectorAll('.cast-member').forEach(actorEl => {
        actorEl.addEventListener('click', (e) => {
            e.stopPropagation();
            const imdbId = actorEl.dataset.imdbId;
            if (imdbId) {
                window.open(`https://www.imdb.com/name/${imdbId}/`, '_blank');
            } else {
                alert(`IMDb ID not found for ${actorEl.textContent}`);
            }
        });
    });

    return div;
}

// ========================================
// FAVORITES LOGIC
// ========================================
function toggleFavorite(movie) {
    // Ensure favorites is an array
    if (!Array.isArray(favorites)) {
        favorites = [];
    }
    
    const idx = favorites.findIndex(f => f.id === movie.id);
    
    let storedProviderNames = [];
    if (movie.platformName) {
        storedProviderNames = [movie.platformName];
    } else if (movie.providers) {
        storedProviderNames = movie.providers.map(p => p.name);
    }

    if(idx > -1) {
        // Remove from favorites
        favorites.splice(idx, 1);
        showNotification('Removed from Watchlist', 'info');
    } else {
        // Add to favorites
        favorites.push({
            id: movie.id,
            title: movie.title,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            poster_path: movie.poster_path,
            overview: movie.overview,
            genre_ids: movie.genre_ids,
            providers: storedProviderNames,
            imdb_id: movie.imdb_id
        });
        showNotification('Added to Watchlist!', 'success');
    }
    
    // Save to localStorage
    try {
        localStorage.setItem('streamFinderFavs', JSON.stringify(favorites));
    } catch (e) {
        console.error("Error saving to localStorage:", e);
    }
    
    // Update UI immediately
    updateFavCount();
    
    // Refresh favorites view if active
    if (viewFavs.classList.contains('active')) {
        renderCategorizedFavorites();
    }
}

function renderCategorizedFavorites() {
    const container = document.getElementById('favorites-container');
    const genreFilterEl = document.getElementById('genre-filter');
    const platformFilterEl = document.getElementById('platform-filter');

    if (!container) return;

    if (genreFilterEl && platformFilterEl && genreFilterEl.options.length <= 1) {
        populateFavoriteFilters(genreFilterEl, platformFilterEl);
    }

    container.innerHTML = '';
    
    if(favorites.length === 0) {
        container.innerHTML = '<div class="empty-state">Your watchlist is empty. Go find some great content!</div>';
        return;
    }

    const filteredFavorites = favorites.filter(movie => {
        const passesGenre = favoritesFilters.genre === 'all' || 
                            (movie.genre_ids && movie.genre_ids.includes(parseInt(favoritesFilters.genre)));
        
        const passesPlatform = favoritesFilters.platform === 'all' || 
                               (movie.providers && movie.providers.includes(favoritesFilters.platform));
        
        return passesGenre && passesPlatform;
    });

    if (filteredFavorites.length === 0) {
        container.innerHTML = '<div class="empty-state">No movies matched your current filters.</div>';
        return;
    }

    const groups = {};
    
    filteredFavorites.forEach(movie => {
        const gId = (movie.genre_ids && movie.genre_ids.length > 0) ? movie.genre_ids[0] : 'other';
        if(!groups[gId]) groups[gId] = [];
        groups[gId].push(movie);
    });

    for (const [gId, movies] of Object.entries(groups)) {
        const section = document.createElement('div');
        section.className = 'genre-section';
        
        const genreName = GENRE_NAMES[gId] || "Uncategorized";
        
        section.innerHTML = `<h3 class="genre-title">${genreName} (${movies.length})</h3>`;
        
        const grid = document.createElement('div');
        grid.className = 'favorites-grid'; 
        
        movies.forEach(m => {
             m.providers = (m.providers || []).map(name => {
                 const platformId = Object.keys(PLATFORM_NAMES).find(key => PLATFORM_NAMES[key] === name);
                 return { name, url: platformId ? PLATFORM_URLS[platformId] : '#' };
             });
             grid.appendChild(createMovieCard(m, false)); // false = not for swipe
        });
        section.appendChild(grid);
        container.appendChild(section);
    }
}

function populateFavoriteFilters(genreFilterEl, platformFilterEl) {
    const uniqueGenres = new Set();
    
    favorites.forEach(movie => {
        if (movie.genre_ids) {
            movie.genre_ids.forEach(id => uniqueGenres.add(id));
        }
    });
    
    const allPlatforms = Object.values(PLATFORM_NAMES).sort(); 

    genreFilterEl.innerHTML = '<option value="all">All Genres</option>';
    platformFilterEl.innerHTML = '<option value="all">All Platforms</option>';

    Array.from(uniqueGenres).sort((a, b) => {
        const nameA = GENRE_NAMES[a] || 'Uncategorized';
        const nameB = GENRE_NAMES[b] || 'Uncategorized';
        return nameA.localeCompare(nameB);
    }).forEach(id => {
        const name = GENRE_NAMES[id] || 'Uncategorized';
        const option = new Option(name, id);
        if (id.toString() === favoritesFilters.genre) option.selected = true;
        genreFilterEl.add(option);
    });

    allPlatforms.forEach(name => {
        const option = new Option(name, name);
        if (name === favoritesFilters.platform) option.selected = true;
        platformFilterEl.add(option);
    });

    if (!genreFilterEl.dataset.initialized) {
        genreFilterEl.addEventListener('change', (e) => {
            favoritesFilters.genre = e.target.value;
            renderCategorizedFavorites();
        });
        
        platformFilterEl.addEventListener('change', (e) => {
            favoritesFilters.platform = e.target.value;
            renderCategorizedFavorites();
        });
        
        const clearBtn = document.getElementById('clear-filters-btn');
        if(clearBtn) {
            clearBtn.addEventListener('click', () => {
                favoritesFilters.genre = 'all';
                favoritesFilters.platform = 'all';
                genreFilterEl.value = 'all';
                platformFilterEl.value = 'all';
                renderCategorizedFavorites();
            });
        }
        genreFilterEl.dataset.initialized = true;
    }
}

// ========================================
// SHARING FUNCTIONS
// ========================================
function encodeSelections() {
    const params = new URLSearchParams();
    if (selections.mood) params.append('mood', selections.mood);
    if (selections.time) params.append('time', selections.time);
    if (selections.genres.length) params.append('genres', selections.genres.join(','));
    if (selections.platforms.length) params.append('platforms', selections.platforms.join(','));
    return params.toString();
}

function generateShareLink() {
    const encodedParams = encodeSelections();
    const baseURL = window.location.origin + window.location.pathname;
    return encodedParams ? `${baseURL}?${encodedParams}` : baseURL;
}

function copyToClipboard() {
    navigator.clipboard.writeText(generateShareLink()).then(() => {
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

function shareMovie(movie) {
    const shareData = {
        title: movie.title,
        text: `Check out "${movie.title}" on StreamFinder!`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).catch(err => console.log('Share cancelled'));
    } else {
        const shareText = `${movie.title} - ${window.location.href}`;
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Link copied to clipboard!');
        });
    }
}