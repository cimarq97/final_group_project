/*
    DISCLAIMER: This project was developed with the assistance of AI (GitHub Copilot).
    The AI was used to help with code suggestions, refactoring, and implementation of features.
    All code has been reviewed and modified by the development team.
*/

// ========================================
// API & Config
// ========================================
const TMDB_V4_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOWQ3ZGFjM2QyZDI4OGFiMDFiMTliMDA1YWQzMjIxNCIsIm5iZiI6MTc2MzA4MjI4Mi4wOTYsInN1YiI6IjY5MTY4MDJhMzEzN2M3ZGFmMTg3NjVhNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mNnYHf28DA9OqlRm8Vc6tsVs96b9YrA6eJlnWJbtuXY";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";

// ========================================
// Rules-Based Chatbot Configuration
// ========================================
const CHATBOT_RULES = {
    // Define patterns and their corresponding genres/moods
    patterns: [
        // Heartwarming/Uplifting - MORE SENSITIVE
        { keywords: ['heartwarming', 'heartfelt', 'uplifting', 'inspiring', 'feel-good', 'wholesome', 'heartwarmed', 'sweet', 'touching', 'warm', 'cozy'], genres: [10749, 35, 18], mood: 'Heartwarming' },

        // Action
        { keywords: ['action', 'fight', 'adrenaline', 'explosive', 'thrill', 'battle', 'combat', 'chase'], genres: [28, 53], mood: 'Action Lover' },

        // Comedy
        { keywords: ['comedy', 'funny', 'laugh', 'humor', 'hilarious', 'comedic', 'quirky', 'witty'], genres: [35], mood: 'Comedy Fan' },

        // Romantic - MORE SPECIFIC
        { keywords: ['romantic', 'romance', 'love', 'couple', 'date night', 'dating', 'sweet love', 'relationship'], genres: [10749], mood: 'Romantic' },

        // Horror
        { keywords: ['horror', 'scary', 'terror', 'spooky', 'frightening', 'creepy', 'horror movie', 'supernatural'], genres: [27], mood: 'Horror Fan' },

        // Drama - MORE SPECIFIC
        { keywords: ['drama', 'emotional', 'touching', 'serious', 'intense', 'powerful', 'moving', 'deep'], genres: [18], mood: 'Drama Lover' },

        // Sci-Fi
        { keywords: ['sci-fi', 'scifi', 'science fiction', 'futuristic', 'space', 'aliens', 'dystopian', 'cyberpunk'], genres: [878], mood: 'Sci-Fi Fan' },

        // Adventure
        { keywords: ['adventure', 'explore', 'journey', 'quest', 'epic', 'action adventure', 'travel'], genres: [12], mood: 'Adventurer' },

        // Animation
        { keywords: ['animation', 'animated', 'cartoon', 'anime', 'hand-drawn', 'stop-motion'], genres: [16], mood: 'Animation Fan' },

        // Documentary
        { keywords: ['documentary', 'docuseries', 'true story', 'real', 'biography', 'real-life', 'non-fiction'], genres: [99], mood: 'Documentary Watcher' },

        // Mystery/Thriller
        { keywords: ['mystery', 'thriller', 'detective', 'suspense', 'whodunit', 'mysterious', 'suspenseful', 'crime'], genres: [9648, 53], mood: 'Mystery Lover' },

        // Family
        { keywords: ['family', 'kids', 'children', 'family-friendly', 'fun for all', 'parents', 'kids movie'], genres: [10751], mood: 'Family Watcher' },

        // Historical
        { keywords: ['historical', 'history', 'period', 'based on true', 'war', 'historical drama', 'period piece'], genres: [10752, 36], mood: 'History Enthusiast' },

        // Top-Rated Films
        { keywords: ['top rated', 'highest rated', 'best rated', 'best films', 'best movies', 'most rated', 'highly rated', 'rated', 'best of'], genres: [28, 35, 18, 878, 53, 27, 10749], mood: 'Top-Rated Films' },

        // Similar Movies
        { keywords: ['similar to', 'similar films', 'similar movies', 'recommendations like', 'movies like', 'shows like', 'like this', 'like that'], genres: [], mood: 'Similar Movies', isSimilarSearch: true }
    ]
};

const MOOD_CONFIG = {
    cozy: { genres: [35, 10749], sort: "popularity.desc" },
    excited: { genres: [28, 53, 878], sort: "popularity.desc" },
    sad: { genres: [18, 10752], sort: "vote_average.desc", minVotes: 100 },
    tired: { genres: [35, 10751], sort: "popularity.desc", minVotes: 50 },
    curious: { genres: [99, 9648, 18], sort: "vote_average.desc", minVotes: 50 },
    topRated: { genres: [28, 35, 18, 878, 53, 27, 10749], sort: "vote_average.desc", minVotes: 200 }
};

const RUNTIME_CONFIG = {
    short: { lte: 30 },
    medium: { gte: 30, lte: 60 },
    long: { gte: 80, lte: 160 },
    binge: null
};

// --- START: Platform and Genre Config Updates ---
const PLATFORM_NAMES = {
    8: "Netflix", 15: "Hulu", 1899: "Max", 337: "Disney+", 9: "Prime Video",
    531: "Paramount+", 384: "MGM+", 257: "Fubo TV", 350: "Apple TV+",
    386: "Peacock", 1796: "Crunchyroll"
};

// NEW: Mapping for platform ID to the official website URL
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
    1796: "https://www.crunchyroll.com/"
};

// UPDATED: Mapping for platform ID to external logo URLs (Kept for Movie Cards)
const PLATFORM_LOGOS = {
    8: "https://images.tmdb.org/t/p/original/t2yySAY33bYJqX3K3P755u4FjWz.png", // Netflix
    15: "https://images.tmdb.org/t/p/original/y4F9z9g9mO2xYhO3J0m6eA2jW6S.png", // Hulu
    1899: "https://images.tmdb.org/t/p/original/u2LhN9j9SjWn6JjVnN5E0aXqXzR.png", // Max
    337: "https://images.tmdb.org/t/p/original/jG3IzdM82K4Wc0R6cWvV2lVd3Vn.png", // Disney+
    9: "https://images.tmdb.org/t/p/original/o855VjS8o40c49g8uJ6m0lWwDQC.png", // Prime Video
    531: "https://images.tmdb.org/t/p/original/1QyFdJ6z1z7f6p321L6J6z53LhJ.png", // Paramount+
    384: "https://images.tmdb.org/t/p/original/3GJKb93s0iJzJ4q92Kq39XyL8z.png", // MGM+ (Epix)
    257: "https://images.tmdb.org/t/p/original/i53Q9T8k13XmC9Q6c4kI6G7HhFk.png", // Fubo TV
    350: "https://images.tmdb.org/t/p/original/i6oN9iE0i5x3n1c00i5Lq8uHjK4.png", // Apple TV+
    386: "https://images.tmdb.org/t/p/original/mX7YtU0s07QjY5k7S1bJbQc3k1i.png", // Peacock
    1796: "https://images.tmdb.org/t/p/original/5jE6Y6qY6GKGtC8pLwQxR4O4Z9Z.png"  // Crunchyroll
};

const GENRE_NAMES = {
    // Movie Genres (TMDB Standard)
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
    // TV Genres (TMDB Standard)
    10759: "Action & Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    10762: "Kids",
    9648: "Mystery",
    10763: "News",
    10764: "Reality",
    10765: "Sci-Fi & Fantasy",
    10766: "Soap",
    10767: "Talk",
    10768: "War & Politics"
}
// --- END: Platform and Genre Config Updates ---

const MOVIE_FACTS = [
    // ... (Your movie facts are here)
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
let selections = { mood: null, time: null, genres: [], platforms: [] };
// FIX: Safely load and ensure 'favorites' is an array. If corrupted, reset it.
let favorites;
try {
    const savedFavs = JSON.parse(localStorage.getItem('streamFinderFavs'));
    favorites = Array.isArray(savedFavs) ? savedFavs : [];
    if (savedFavs && !Array.isArray(savedFavs)) {
        console.warn("Watchlist data corrupted, resetting.");
        localStorage.removeItem('streamFinderFavs');
    }
} catch (e) {
    console.error("Error parsing watchlist data, resetting:", e);
    favorites = [];
    localStorage.removeItem('streamFinderFavs');
}
// End FIX block

let navigationHistory = [];
let currentResultsCache = [];
// State for Watchlist Filtering
let favoritesFilters = { genre: 'all', platform: 'all' };

const navQuiz = document.getElementById('nav-quiz');
const navAI = document.getElementById('nav-ai');
const navFavs = document.getElementById('nav-favorites');
const viewQuiz = document.getElementById('view-quiz');
const viewAI = document.getElementById('view-ai');
const viewFavs = document.getElementById('view-favorites');
const favCountEl = document.getElementById('fav-count');
const logoHome = document.getElementById('logo-home');
const resultsSummaryEl = document.getElementById('results-summary');


// ========================================
// URL Sharing Functions (Unchanged)
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

// ========================================
// Movie Fact Display (Unchanged)
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
// Browser History Navigation (Unchanged)
// ========================================
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

// ========================================
// View Navigation Logic (Unchanged)
// ========================================
function switchView(view) {
    viewQuiz.classList.remove('active');
    viewAI.classList.remove('active');
    viewFavs.classList.remove('active');
    navQuiz.classList.remove('active');
    navAI.classList.remove('active');
    navFavs.classList.remove('active');

    if (view === 'quiz') {
        viewQuiz.classList.add('active');
        navQuiz.classList.add('active');
    } else if (view === 'ai') {
        viewAI.classList.add('active');
        navAI.classList.add('active');
        // Show initial greeting if chat is empty
        if (aiMessages.children.length === 0) {
            const greetingMessage = document.createElement('div');
            greetingMessage.className = 'ai-message bot-message';
            greetingMessage.innerHTML = `
                <div class="message-content">
                    <p>Hi! 👋 Tell me what you're in the mood for, and I'll find the perfect movie or show for you!</p>
                </div>
            `;
            aiMessages.appendChild(greetingMessage);
            aiMessages.scrollTop = aiMessages.scrollHeight;
        }
    } else {
        viewFavs.classList.add('active');
        navFavs.classList.add('active');
        renderCategorizedFavorites();
    }
}

navQuiz.addEventListener('click', () => switchView('quiz'));
navAI.addEventListener('click', () => switchView('ai'));
navFavs.addEventListener('click', () => switchView('favs'));

// Hamburger Menu Toggle
const hamburgerBtn = document.getElementById('hamburger-btn');
const navLinks = document.getElementById('nav-links');

hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when a nav item is clicked
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        hamburgerBtn.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

logoHome.addEventListener('click', () => {
    switchView('quiz');
    goToStep(0);
});

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
// Selection Logic 
// ========================================
function setupSingleSelection(parentId, key) {
    const parent = document.getElementById(parentId);
    if (!parent) return;
    const btns = parent.querySelectorAll('.option-card');
    const nextBtn = parent.closest('.quiz-step').querySelector('.next-btn');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Check to prevent this from affecting platform cards, which are labels
            if (btn.tagName === 'BUTTON') {
                btns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selections[key] = btn.dataset.value;
                if (nextBtn) nextBtn.disabled = false;
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

// RE-ENABLED: Logic for Select All/Deselect All button
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

        // Update the visual state (class on the label)
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

    // Handle single card clicks to update the 'selected' class and selection state
    platformCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Check if the click target is NOT the checkbox itself (which flips state before the event listener runs)
            if (e.target.tagName !== 'INPUT') {
                // Prevent default behavior to manage selection state manually
                e.preventDefault();
                const checkbox = card.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
            }
            // Toggle the 'selected' class based on the checkbox's final state
            if (card.querySelector('input[type="checkbox"]').checked) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    });
}

// ========================================
// Surprise Button (Unchanged)
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
// Quiz Submission (UPDATED to read Checkboxes)
// ========================================
document.getElementById('quiz-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // REVERTED: Read platforms from checked checkboxes
    selections.platforms = Array.from(document.querySelectorAll('input[name="platform"]:checked')).map(cb => cb.value);
    goToStep(5);
    fetchAndDisplayMovies(false);
});

document.getElementById('back-to-top-btn').addEventListener('click', () => {
    // Scroll to top of the page smoothly
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Old button handlers removed - back-to-top button replaces restart and browse all


// Update vibe button and add click handler
function updateVibeButton() {
    const vibeText = document.getElementById('vibe-text');
    if (vibeText && selections.mood) {
        vibeText.textContent = selections.mood;
    }
}

// Show feedback loop after results load
function showFeedbackLoop() {
    const feedbackLoop = document.getElementById('feedback-loop');
    if (feedbackLoop) {
        feedbackLoop.style.display = 'block';
    }
    
    // Add feedback button listeners
    const feedbackBtns = document.querySelectorAll('.feedback-btn');
    feedbackBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const feedback = btn.dataset.feedback;
            // Remove previous selection
            feedbackBtns.forEach(b => b.classList.remove('selected'));
            // Mark current as selected
            btn.classList.add('selected');
            
            // Handle feedback actions
            if (feedback === 'loved') {
                // Trigger confetti
                triggerConfetti();
                console.log(`User feedback: ${feedback}`);
            } else if (feedback === 'nope') {
                // Reload with new vibe - stay on surprise page
                setTimeout(() => {
                    // Select a new random mood
                    const moods = Object.keys(MOOD_CONFIG);
                    selections.mood = moods[Math.floor(Math.random() * moods.length)];
                    // Fetch and display new movies with the new vibe
                    fetchAndDisplayMovies(true);
                }, 500);
            }
        });
    });
}

// Function to trigger confetti effect
function triggerConfetti() {
    const confettiSettings = {
        target: 'confetti-canvas',
        max: 200,
        size: 1,
        animate: true,
        props: ['circle', 'square', 'triangle', 'line'],
        colors: [[212, 175, 55], [25, 118, 210], [255, 215, 0], [255, 165, 0]],
        clock: 25,
        interval: null,
        rotate: true,
        start_from_edge: false,
        respawn: true
    };
    
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
    
    // Stop confetti after 3 seconds
    setTimeout(() => {
        confetti.clear();
    }, 3000);
}

// ========================================
// Fetch & Render Results (Updated with Summary Logic)
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

        // --- Get Genres for Query and Summary ---
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
        // ----------------------------------------

        if (genreStr) url.searchParams.append("with_genres", genreStr);
        url.searchParams.append("sort_by", sortStr);
        url.searchParams.append("vote_count.gte", "50");

        if (selections.time && RUNTIME_CONFIG[selections.time]) {
            const rt = RUNTIME_CONFIG[selections.time];
            if (rt.gte) url.searchParams.append("with-runtime.gte", rt.gte);
            if (rt.lte) url.searchParams.append("with-runtime.lte", rt.lte);
        }

        const res = await fetch(url, { headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` } });
        const data = await res.json();

        currentResultsCache = data.results || [];

        // NEW: Render the summary for the user's choices
        renderResultsSummary(isSurpriseMode, selectedGenreNames);

        if (isSurpriseMode) {
            await displaySurpriseMovies(currentResultsCache, container);
        } else {
            displayMovies(currentResultsCache, container);
        }

    } catch (e) {
        console.error("Fetch Error:", e);
        container.innerHTML = '<div class="empty-state">Error connecting to database.</div>';
        if (resultsSummaryEl) resultsSummaryEl.innerHTML = '';
    }
}

// NEW FUNCTION: Renders the summary of the quiz choices at the top of the results page
function renderResultsSummary(isSurpriseMode, selectedGenreNames) {
    if (!resultsSummaryEl) return;
    let summaryHTML = '';
    let titleHTML = '';

    // FIX: Use the actual count of results fetched from the API for the "potential matches" number
    const totalCount = currentResultsCache.length;
    // Show up to 10 on screen, but display actual count
    const displayCount = Math.min(totalCount, 10);

    if (isSurpriseMode) {
        titleHTML = `<h1 class="summary-title"><i class="fas fa-magic"></i> Surprise Me Results!</h1>`;
        
        // Build platform options dynamically
        let platformOptions = '<option value="default">All Platforms</option>';
        Object.entries(PLATFORM_NAMES).forEach(([id, name]) => {
            platformOptions += `<option value="platform-${id}">${name}</option>`;
        });
        
        summaryHTML = `<p class="summary-tagline">${displayCount} films for your <strong>${selections.mood}</strong> vibe across all streaming platforms</p>
        <div class="sort-controls">
            <label for="sort-by-platform">Sort by platform:</label>
            <select id="sort-by-platform" class="sort-select">
                ${platformOptions}
            </select>
        </div>`;
    } else {
        titleHTML = `<h1 class="summary-title"><i class="fas fa-trophy"></i> Your Perfect Picks</h1>`;
        
        const moodText = selections.mood ? `<span class="summary-item"><i class="fas fa-hand-point-right"></i> <strong>Mood:</strong> ${selections.mood}</span>` : '';
        const timeText = selections.time ? `<span class="summary-item"><i class="fas fa-clock"></i> <strong>Time:</strong> ${selections.time}</span>` : '';

        const genresText = selectedGenreNames.length > 0
            ? `<span class="summary-item"><i class="fas fa-mask"></i> <strong>Genres:</strong> ${selectedGenreNames.join(', ')}</span>`
            : '';

        const platformNames = selections.platforms.map(id => PLATFORM_NAMES[id]).filter(Boolean).join(', ');
        const platformsText = selections.platforms.length > 0
            ? `<span class="summary-item"><i class="fas fa-tv"></i> <strong>Platforms:</strong> ${platformNames}</span>`
            : '';

        // FIX: Improved summary copy - more engaging
        summaryHTML = `
            <p class="summary-tagline">${displayCount} films selected for your <strong>${selections.mood}</strong> vibe</p>
            <div class="summary-details">
                ${moodText}
                ${timeText}
                ${genresText}
                ${platformsText}
            </div>
        `;
    }

    // Set title at top
    const titleEl = document.getElementById('results-title');
    if (titleEl) {
        titleEl.innerHTML = titleHTML;
    }

    // Set summary below feedback
    resultsSummaryEl.innerHTML = summaryHTML;
    updateVibeButton();
    showFeedbackLoop();
    
    // Add event listener for sort dropdown
    const sortDropdown = document.getElementById('sort-by-platform');
    if (sortDropdown) {
        sortDropdown.addEventListener('change', (e) => {
            const sortBy = e.target.value;
            if (sortBy === 'platform') {
                // Sort movies by streaming platform
                const sorted = currentResultsCache.slice().sort((a, b) => {
                    const platformA = (a.providers && a.providers[0]?.name) || '';
                    const platformB = (b.providers && b.providers[0]?.name) || '';
                    return platformA.localeCompare(platformB);
                });
                displayMovies(sorted, document.getElementById('results-area'));
            } else if (sortBy.startsWith('platform-')) {
                // Filter by specific platform
                const platformId = sortBy.split('-')[1];
                const platformName = PLATFORM_NAMES[platformId];
                const filtered = currentResultsCache.filter(movie => {
                    if (!movie.providers || movie.providers.length === 0) return false;
                    return movie.providers.some(provider => provider.name === platformName);
                });
                // Update count message when filtering
                const displayCount = Math.min(filtered.length, 10);
                const taglineEl = document.querySelector('.summary-tagline');
                if (taglineEl) {
                    taglineEl.innerHTML = `${displayCount} films for your <strong>${selections.mood}</strong> vibe on ${platformName}`;
                }
                displayMovies(filtered, document.getElementById('results-area'));
            } else {
                // Default: shuffle display
                const displayCount = Math.min(currentResultsCache.length, 10);
                const taglineEl = document.querySelector('.summary-tagline');
                if (taglineEl) {
                    taglineEl.innerHTML = `${displayCount} films for your <strong>${selections.mood}</strong> vibe across all streaming platforms`;
                }
                displayMovies(currentResultsCache, document.getElementById('results-area'));
            }
        });
    }
}

function displayMovies(movies, container) {
    // Show loading bar
    const loadingBarContainer = document.getElementById('loading-bar-container');
    if (loadingBarContainer) {
        loadingBarContainer.style.display = 'block';
    }
    
    container.innerHTML = "";
    if (!movies.length) {
        container.innerHTML = '<div class="empty-state">No matches found. Try different filters.</div>';
        // Hide loading bar
        if (loadingBarContainer) {
            loadingBarContainer.style.display = 'none';
        }
        return;
    }

    // Shuffle and slice for normal display (max 10)
    const shuffled = movies.sort(() => 0.5 - Math.random()).slice(0, 10);

    // Fetch additional data for each movie using enrichMovieData
    const promises = shuffled.map(m => enrichMovieData(m));
    
    Promise.all(promises).then(enrichedMovies => {
        // Hide loading bar once data is ready
        if (loadingBarContainer) {
            loadingBarContainer.style.display = 'none';
        }
        
        // Group by platform (like watchlist groups by genre)
        const groups = {};
        enrichedMovies.forEach((movie) => {
            const rawProviders = movie.providers || [];
            
            if (rawProviders.length > 0) {
                // Group by first provider
                const platformKey = rawProviders[0].name;
                
                if (!groups[platformKey]) {
                    groups[platformKey] = [];
                }
                
                groups[platformKey].push(movie);
            }
        });
        
        // Render each platform group with horizontal scroll (same layout as genre sections)
        for (const [platformName, movies] of Object.entries(groups)) {
            const section = document.createElement('div');
            section.className = 'genre-section';  // Reuse genre-section styling

            section.innerHTML = `<h3 class="genre-title">${platformName} (${movies.length})</h3>`;  // Reuse genre-title styling

            const grid = document.createElement('div');
            grid.className = 'favorites-grid';
            
            movies.forEach(movie => {
                // Use createChatbotCard for consistent appearance
                grid.appendChild(createChatbotCard(movie));
            });
            
            section.appendChild(grid);
            container.appendChild(section);
        }

    }).catch(err => {
        console.error("Error enriching movies:", err);
        container.innerHTML = '<div class="empty-state">Error loading movie details.</div>';
        // Hide loading bar on error
        const loadingBarContainer = document.getElementById('loading-bar-container');
        if (loadingBarContainer) {
            loadingBarContainer.style.display = 'none';
        }
    });
}

// ========================================
// Enrich Movie Data (Cast & Providers) (UPDATED to fetch URLs)
// ========================================
async function enrichMovieData(movie) {
    try {
        // Fetch cast and external IDs
        const creditsUrl = `${TMDB_BASE_URL}/movie/${movie.id}/credits`;
        const creditsRes = await fetch(creditsUrl, { headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` } });
        const creditsData = await creditsRes.json();

        // Fetch external IDs for the movie
        const externalIdsUrl = `${TMDB_BASE_URL}/movie/${movie.id}/external_ids`;
        const externalIdsRes = await fetch(externalIdsUrl, { headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` } });
        const externalIdsData = await externalIdsRes.json();

        movie.cast = creditsData.cast ? creditsData.cast.slice(0, 5) : [];

        // FIX: Fetch external ID for cast members (required for IMDb link)
        for (const actor of movie.cast) {
            const personUrl = `${TMDB_BASE_URL}/person/${actor.id}/external_ids`;
            const personRes = await fetch(personUrl, { headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` } });
            const personData = await personRes.json();
            actor.imdb_id = personData.imdb_id;
        }

        // Fetch providers
        const providersData = await fetchWatchProviders(movie.id);
        const usProviders = providersData?.results?.US?.flatrate || [];

        // Extract both name and URL for easy rendering and link functionality
        movie.providers = usProviders.map(p => {
            const name = PLATFORM_NAMES[p.provider_id];
            const url = PLATFORM_URLS[p.provider_id] || '#';
            return name ? { name, url } : null;
        }).filter(Boolean);

        // Get IMDb ID
        movie.imdb_id = externalIdsData.imdb_id;

    } catch (e) {
        console.error("Error enriching movie data:", e);
    }
    return movie;
}

// ========================================
// Sort Results Function
// ========================================

// ========================================
// Surprise Me - Categorization by Platform & Global Share (UPDATED for new provider structure)
// ========================================
async function displaySurpriseMovies(movies, container) {
    // Show loading bar
    const loadingBarContainer = document.getElementById('loading-bar-container');
    if (loadingBarContainer) {
        loadingBarContainer.style.display = 'block';
    }
    
    container.innerHTML = "";
    if (!movies.length) {
        container.innerHTML = '<div class="empty-state">No surprises found on your selected platforms.</div>';
        // Hide loading bar
        if (loadingBarContainer) {
            loadingBarContainer.style.display = 'none';
        }
        return;
    }

    const promises = movies.sort(() => 0.5 - Math.random()).slice(0, 15).map(m => enrichMovieData(m));
    const enrichedMovies = await Promise.all(promises);

    // Hide loading bar once data is enriched
    if (loadingBarContainer) {
        loadingBarContainer.style.display = 'none';
    }

    // Group by platform (like watchlist groups by genre)
    const groups = {};
    enrichedMovies.forEach((movie) => {
        const rawProviders = movie.providers || [];

        if (rawProviders.length > 0) {
            // Group by first provider
            const platformKey = rawProviders[0].name;

            if (!groups[platformKey]) {
                groups[platformKey] = [];
            }

            groups[platformKey].push(movie);
        }
    });

    // Render each platform group with horizontal scroll (same layout as genre sections)
    for (const [platformName, movies] of Object.entries(groups)) {
        const section = document.createElement('div');
        section.className = 'genre-section';  // Reuse genre-section styling

        section.innerHTML = `<h3 class="genre-title">${platformName} (${movies.length})</h3>`;  // Reuse genre-title styling

        const grid = document.createElement('div');
        grid.className = 'favorites-grid';

        movies.forEach(m => grid.appendChild(createChatbotCard(m)));
        section.appendChild(grid);
        container.appendChild(section);
    }
}

async function fetchWatchProviders(movieId) {
    const url = new URL(`${TMDB_BASE_URL}/movie/${movieId}/watch/providers`);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` } });
    return res.json();
}

// Fetch watch providers for TV shows
async function fetchTVWatchProviders(tvId) {
    const url = new URL(`${TMDB_BASE_URL}/tv/${tvId}/watch/providers`);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` } });
    return res.json();
}

// Enrich TV show data with cast, providers, and IMDb info
async function enrichTVShowData(show) {
    try {
        // Fetch cast and external IDs
        const creditsUrl = `${TMDB_BASE_URL}/tv/${show.id}/credits`;
        const creditsRes = await fetch(creditsUrl, { headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` } });
        const creditsData = await creditsRes.json();

        // Fetch external IDs for the TV show
        const externalIdsUrl = `${TMDB_BASE_URL}/tv/${show.id}/external_ids`;
        const externalIdsRes = await fetch(externalIdsUrl, { headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` } });
        const externalIdsData = await externalIdsRes.json();

        show.cast = creditsData.cast ? creditsData.cast.slice(0, 5) : [];

        // Fetch external ID for cast members (required for IMDb link)
        for (const actor of show.cast) {
            const personUrl = `${TMDB_BASE_URL}/person/${actor.id}/external_ids`;
            const personRes = await fetch(personUrl, { headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` } });
            const personData = await personRes.json();
            actor.imdb_id = personData.imdb_id;
        }

        // Fetch providers
        const providersData = await fetchTVWatchProviders(show.id);
        const usProviders = providersData?.results?.US?.flatrate || [];

        // Extract both name and URL for easy rendering and link functionality
        show.providers = usProviders.map(p => {
            const name = PLATFORM_NAMES[p.provider_id];
            const url = PLATFORM_URLS[p.provider_id] || '#';
            return name ? { name, url } : null;
        }).filter(Boolean);

        // Get IMDb ID
        show.imdb_id = externalIdsData.imdb_id;

        // Convert TV show title field to title for compatibility
        show.title = show.name;

    } catch (e) {
        console.error("Error enriching TV show data:", e);
    }
    return show;
}

// ========================================
// Rules-Based Movie Recommender (Using TMDB API)
// ========================================

const aiInput = document.getElementById('ai-input');
const aiSendBtn = document.getElementById('ai-send-btn');
const aiMessages = document.getElementById('ai-chat-messages');
const aiResults = document.getElementById('ai-results');

// Detect mood and genres from user input
function detectMoodFromUserInput(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    // Detect if user wants TV shows or movies
    const tvKeywords = ['tv show', 'tv series', 'series', 'show', 'binge', 'episodes', 'season'];
    const movieKeywords = ['movie', 'film', 'watch a film'];

    let contentType = 'movie'; // Default to movie
    let isShowRequest = false;

    // Check for TV show indicators first
    for (const keyword of tvKeywords) {
        if (lowerMessage.includes(keyword)) {
            contentType = 'tv';
            isShowRequest = true;
            break;
        }
    }

    // Check for explicit movie request (overrides TV if both mentioned)
    for (const keyword of movieKeywords) {
        if (lowerMessage.includes(keyword)) {
            contentType = 'movie';
            isShowRequest = false;
            break;
        }
    }

    // Check each rule pattern for mood
    for (const rule of CHATBOT_RULES.patterns) {
        for (const keyword of rule.keywords) {
            if (lowerMessage.includes(keyword)) {
                return {
                    mood: rule.mood,
                    genres: rule.genres,
                    matchedKeyword: keyword,
                    contentType: contentType,
                    isShowRequest: isShowRequest
                };
            }
        }
    }

    // Default to broad search if no pattern matches
    return {
        mood: 'Movie Enthusiast',
        genres: [28, 35, 18],  // Mix of action, comedy, drama
        matchedKeyword: 'general',
        contentType: contentType,
        isShowRequest: isShowRequest
    };
}

// Generate a friendly bot response based on detected mood
function generateBotResponse(detectedMood, userMessage, isShowRequest = false) {
    const contentWord = isShowRequest ? 'shows' : 'movies';
    const contentEmoji = isShowRequest ? '📺' : '🎬';

    const responses = {
        'Heartwarming': isShowRequest ? [
            "💕 I found some beautiful, feel-good TV shows that'll warm your heart!",
            "🌟 Here are some uplifting series with heartfelt moments!",
            "✨ Get ready to smile! Here are some touching, wholesome shows!"
        ] : [
            "💕 I found some beautiful, feel-good movies that'll warm your heart!",
            "🌟 Here are some uplifting films with heartfelt moments!",
            "✨ Get ready to smile! Here are some touching, wholesome movies!"
        ],
        'Action Lover': isShowRequest ? [
            "🎬 Buckle up! I found some intense action-packed TV shows for you!",
            "💥 Here are some adrenaline-pumping series that'll keep you hooked!",
            "🔥 Ready for some explosive entertainment? Check these out!"
        ] : [
            "🎬 Buckle up! I found some intense action-packed movies for you!",
            "💥 Here are some adrenaline-pumping films that'll keep you on the edge of your seat!",
            "🔥 Ready for some explosive entertainment? Check these out!"
        ],
        'Comedy Fan': isShowRequest ? [
            "😂 Time for some laughs! Here are hilarious TV shows that'll make you smile!",
            "🎭 Get ready to giggle! These comedies are comedy gold!",
            "😄 Here are some side-splitting comedy series I picked for you!"
        ] : [
            "😂 Time for some laughs! Here are hilarious movies that'll make you smile!",
            "🎭 Get ready to giggle! These comedies are comedy gold!",
            "😄 Here are some side-splitting comedies I picked for you!"
        ],
        'Romantic': isShowRequest ? [
            "💕 I found some beautiful love stories in TV form perfect for you!",
            "🌹 Here are some heartwarming romantic series!",
            "💑 Get your tissues ready! Here are some touching romance shows!"
        ] : [
            "💕 I found some beautiful love stories perfect for you!",
            "🌹 Here are some heartwarming romantic films!",
            "💑 Get your tissues ready! Here are some touching romance movies!"
        ],
        'Horror Fan': isShowRequest ? [
            "👻 Brace yourself! Here are some genuinely scary TV shows!",
            "🔪 Get the lights on! Here are thrilling horror series!",
            "😱 Ready for some scares? Check out these spine-tingling shows!"
        ] : [
            "👻 Brace yourself! Here are some genuinely scary films!",
            "🔪 Get the lights on! Here are thrilling horror movies!",
            "😱 Ready for some scares? Check out these spine-tingling films!"
        ],
        'Drama Lover': isShowRequest ? [
            "🎭 Here are some powerful, emotionally gripping drama series!",
            "😢 Prepare for an emotional journey with these compelling dramas!",
            "❤️ Here are some deeply moving dramatic shows!"
        ] : [
            "🎭 Here are some powerful, emotionally gripping dramas!",
            "😢 Prepare for an emotional journey with these compelling dramas!",
            "❤️ Here are some deeply moving dramatic films!"
        ],
        'Sci-Fi Fan': isShowRequest ? [
            "🚀 Blast off! Here are some mind-bending sci-fi TV shows!",
            "🌌 Explore the future with these amazing sci-fi series!",
            "👽 Here are some imaginative sci-fi adventures for you!"
        ] : [
            "🚀 Blast off! Here are some mind-bending sci-fi films!",
            "🌌 Explore the future with these amazing sci-fi movies!",
            "👽 Here are some imaginative sci-fi adventures for you!"
        ],
        'Adventurer': isShowRequest ? [
            "🗺️ Let's go on an adventure! Here are epic journey series!",
            "⛰️ Here are some thrilling adventure TV shows!",
            "🏔️ Get ready to explore! Here are some amazing adventures!"
        ] : [
            "🗺️ Let's go on an adventure! Here are epic journey films!",
            "⛰️ Here are some thrilling adventure movies!",
            "🏔️ Get ready to explore! Here are some amazing adventures!"
        ],
        'Animation Fan': isShowRequest ? [
            "🎨 Here are some beautifully animated TV series!",
            "✨ Check out these stunning animated shows!",
            "🎬 Here are some creative and colorful animated series!"
        ] : [
            "🎨 Here are some beautifully animated films!",
            "✨ Check out these stunning animated movies!",
            "🎬 Here are some creative and colorful animated films!"
        ],
        'Documentary Watcher': isShowRequest ? [
            "📚 Here are some fascinating documentary series!",
            "🔍 Learn something new! Here are compelling documentaries!",
            "📖 Here are some eye-opening documentary shows!"
        ] : [
            "📚 Here are some fascinating documentaries!",
            "🔍 Learn something new! Here are compelling documentaries!",
            "📖 Here are some eye-opening documentary films!"
        ],
        'Mystery Lover': isShowRequest ? [
            "🕵️ Here are some thrilling mystery and detective TV shows!",
            "🔎 Keep your wits sharp! Here are suspenseful mysteries!",
            "🎭 Can you solve it? Here are intriguing mystery series!"
        ] : [
            "🕵️ Here are some thrilling mystery and detective films!",
            "🔎 Keep your wits sharp! Here are suspenseful mysteries!",
            "🎭 Can you solve it? Here are intriguing mystery movies!"
        ],
        'Family Watcher': isShowRequest ? [
            "👨‍👩‍👧‍👦 Perfect for family night! Here are great family-friendly shows!",
            "🍿 Here are some entertaining TV shows the whole family can enjoy!",
            "🎪 Great for all ages! Check out these fun family series!"
        ] : [
            "👨‍👩‍👧‍👦 Perfect for family night! Here are great family-friendly films!",
            "🍿 Here are some entertaining movies the whole family can enjoy!",
            "🎪 Great for all ages! Check out these fun family movies!"
        ],
        'History Enthusiast': isShowRequest ? [
            "📜 Here are some epic historical series!",
            "⚔️ Step back in time! Here are powerful period dramas!",
            "🏰 Here are some compelling historical shows!"
        ] : [
            "📜 Here are some epic historical films!",
            "⚔️ Step back in time! Here are powerful period pieces!",
            "🏰 Here are some compelling historical dramas!"
        ],
        'Top-Rated Films': isShowRequest ? [
            "⭐ Here are the highest-rated TV shows of all time!",
            "🏆 These are the critically acclaimed series everyone loves!",
            "👑 Check out these absolute masterpieces - the best rated shows!"
        ] : [
            "⭐ Here are the highest-rated movies of all time!",
            "🏆 These are the critically acclaimed films everyone loves!",
            "👑 Check out these absolute masterpieces - the best rated movies!"
        ],
        'Movie Enthusiast': isShowRequest ? [
            "🎬 Here are some great TV shows for you!",
            "🌟 Let me find some perfect shows for you!",
            "📽️ I've found some amazing series you might enjoy!"
        ] : [
            "🎬 Here are some great recommendations for you!",
            "🌟 Let me find some perfect movies for you!",
            "📽️ I've found some amazing films you might enjoy!"
        ],
        'Similar Movies': isShowRequest ? [
            "🔍 Finding shows similar to what you mentioned...",
            "✨ Here are some great shows in the same style!",
            "🎯 Based on your preference, check these out!"
        ] : [
            "🔍 Finding movies similar to what you mentioned...",
            "✨ Here are some great movies in the same style!",
            "🎯 Based on your preference, check these out!"
        ]
    };

    const responseArray = responses[detectedMood] || responses['Movie Enthusiast'];
    return responseArray[Math.floor(Math.random() * responseArray.length)];
}

// Function to send chatbot message
async function sendChatbotMessage() {
    const userMessage = aiInput.value.trim();

    if (!userMessage) {
        alert('Please tell me what kind of movie you\'re in the mood for!');
        return;
    }

    // Add user message to chat
    addMessageToChat('user', userMessage);
    aiInput.value = '';

    // Disable button and show loading
    aiSendBtn.disabled = true;
    aiSendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Finding content...';

    try {
        // Analyze user input with rules
        const analysis = detectMoodFromUserInput(userMessage);
        const botResponse = generateBotResponse(analysis.mood, userMessage, analysis.isShowRequest);

        // Add bot response
        addMessageToChat('assistant', botResponse);

        // Search for movies or TV shows using TMDB
        if (analysis.mood === 'Similar Movies') {
            // Extract movie title from user message (remove "similar to", "like", etc.)
            let movieTitle = userMessage.toLowerCase();
            const similarKeywords = ['similar to', 'like', 'similar films', 'similar movies', 'recommendations like', 'movies like', 'shows like'];

            for (const keyword of similarKeywords) {
                if (movieTitle.includes(keyword)) {
                    movieTitle = movieTitle.replace(keyword, '').trim();
                    break;
                }
            }

            await searchSimilarMovies(movieTitle, analysis.isShowRequest);
        } else if (analysis.isShowRequest) {
            await searchTVShowsByRules(analysis.genres, analysis.mood);
        } else {
            await searchMoviesByRules(analysis.genres, analysis.mood);
        }

    } catch (error) {
        console.error('Chatbot error:', error);
        addMessageToChat('assistant', '❌ Sorry, something went wrong. Please try again!');
    } finally {
        aiSendBtn.disabled = false;
        aiSendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Get Recommendations';
    }
}

// Button click listener
if (aiSendBtn) {
    aiSendBtn.addEventListener('click', sendChatbotMessage);
}

// Enter key listener for textarea (Shift+Enter for new line)
if (aiInput) {
    aiInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatbotMessage();
        }
    });
}

// Search TMDB for movies based on detected genres
async function searchMoviesByRules(genreIds, mood) {
    aiResults.innerHTML = '<div class="ai-loading"><i class="fas fa-spinner fa-spin"></i> Searching for perfect movies...</div>';

    try {
        const url = new URL(`${TMDB_BASE_URL}/discover/movie`);
        url.searchParams.append('with_genres', genreIds.join(','));
        
        // Add watch provider filtering - only show movies on listed streaming platforms
        const platformIds = Object.keys(PLATFORM_NAMES).join('|');
        url.searchParams.append('with_watch_providers', platformIds);
        url.searchParams.append('watch_region', 'US');

        // Use vote_average sorting for top-rated films, popularity for others
        if (mood === 'Top-Rated Films') {
            url.searchParams.append('sort_by', 'vote_average.desc');
            url.searchParams.append('vote_count.gte', '200');
        } else {
            url.searchParams.append('sort_by', 'popularity.desc');
            url.searchParams.append('vote_count.gte', '50');
        }

        url.searchParams.append('page', '1');
        url.searchParams.append('include_adult', 'false');

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` }
        });
        const data = await res.json();

        if (!data.results || data.results.length === 0) {
            aiResults.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No movies found for that mood on our streaming platforms. Try a different request!</p>';
            return;
        }

        // Get top 5 movies and enrich them
        const topMovies = data.results.slice(0, 5);
        const enrichedMovies = await Promise.all(
            topMovies.map(movie => enrichMovieData(movie))
        );

        // Display results
        displayChatbotMovieResults(enrichedMovies, mood);

    } catch (error) {
        console.error('Error searching movies:', error);
        aiResults.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Sorry, I had trouble searching for movies. Please try again!</p>';
    }
}

// Search TMDB for TV shows based on detected genres
async function searchTVShowsByRules(genreIds, mood) {
    aiResults.innerHTML = '<div class="ai-loading"><i class="fas fa-spinner fa-spin"></i> Searching for perfect TV shows...</div>';

    try {
        const url = new URL(`${TMDB_BASE_URL}/discover/tv`);
        url.searchParams.append('with_genres', genreIds.join(','));
        
        // Add watch provider filtering - only show shows on listed streaming platforms
        const platformIds = Object.keys(PLATFORM_NAMES).join('|');
        url.searchParams.append('with_watch_providers', platformIds);
        url.searchParams.append('watch_region', 'US');

        // Use vote_average sorting for top-rated films, popularity for others
        if (mood === 'Top-Rated Films') {
            url.searchParams.append('sort_by', 'vote_average.desc');
            url.searchParams.append('vote_count.gte', '200');
        } else {
            url.searchParams.append('sort_by', 'popularity.desc');
            url.searchParams.append('vote_count.gte', '50');
        }

        url.searchParams.append('page', '1');
        url.searchParams.append('include_adult', 'false');

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` }
        });
        const data = await res.json();

        if (!data.results || data.results.length === 0) {
            aiResults.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No TV shows found for that mood on our streaming platforms. Try a different request!</p>';
            return;
        }

        // Get top 5 TV shows and enrich them (as if they were movies for now)
        const topShows = data.results.slice(0, 5);
        const enrichedShows = await Promise.all(
            topShows.map(show => enrichTVShowData(show))
        );

        // Display results
        displayChatbotMovieResults(enrichedShows, mood, true);

    } catch (error) {
        console.error('Error searching TV shows:', error);
        aiResults.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Sorry, I had trouble searching for TV shows. Please try again!</p>';
    }
}

// Search for movies similar to a given movie title
async function searchSimilarMovies(movieTitle, isShowRequest = false) {
    aiResults.innerHTML = '<div class="ai-loading"><i class="fas fa-spinner fa-spin"></i> Searching for similar content...</div>';

    try {
        // First, search for the reference movie by title
        const searchUrl = new URL(`${TMDB_BASE_URL}/search/${isShowRequest ? 'tv' : 'movie'}`);
        searchUrl.searchParams.append('query', movieTitle);
        searchUrl.searchParams.append('include_adult', 'false');

        const searchRes = await fetch(searchUrl, {
            headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` }
        });
        const searchData = await searchRes.json();

        if (!searchData.results || searchData.results.length === 0) {
            aiResults.innerHTML = `<p style="color: var(--text-muted); text-align: center;">Could not find a ${isShowRequest ? 'show' : 'movie'} called "${movieTitle}". Try being more specific!</p>`;
            return;
        }

        const referenceItem = searchData.results[0];
        const referenceId = referenceItem.id;

        // Get the genres from the reference movie/show
        let genreIds = [];
        if (isShowRequest && referenceItem.genre_ids) {
            genreIds = referenceItem.genre_ids.slice(0, 3);
        } else if (!isShowRequest && referenceItem.genre_ids) {
            genreIds = referenceItem.genre_ids.slice(0, 3);
        }

        // If no genres found, use default mix
        if (genreIds.length === 0) {
            genreIds = [28, 35, 18]; // Default: action, comedy, drama
        }

        // Now search for similar movies by genre
        const similarUrl = new URL(`${TMDB_BASE_URL}/discover/${isShowRequest ? 'tv' : 'movie'}`);
        similarUrl.searchParams.append('with_genres', genreIds.join(','));
        similarUrl.searchParams.append('sort_by', 'vote_average.desc');
        similarUrl.searchParams.append('vote_count.gte', '50');
        similarUrl.searchParams.append('page', '1');
        similarUrl.searchParams.append('include_adult', 'false');

        const similarRes = await fetch(similarUrl, {
            headers: { Authorization: `Bearer ${TMDB_V4_TOKEN}` }
        });
        const similarData = await similarRes.json();

        if (!similarData.results || similarData.results.length === 0) {
            aiResults.innerHTML = `<p style="color: var(--text-muted); text-align: center;">No similar ${isShowRequest ? 'shows' : 'movies'} found. Try another title!</p>`;
            return;
        }

        // Get top 5 similar items and enrich them
        const topSimilar = similarData.results.slice(0, 5);
        const enrichedSimilar = await Promise.all(
            topSimilar.map(item => isShowRequest ? enrichTVShowData(item) : enrichMovieData(item))
        );

        // Display results with special mood indicator
        displayChatbotMovieResults(enrichedSimilar, `Similar to "${referenceItem.title || referenceItem.name}"`, isShowRequest);

    } catch (error) {
        console.error('Error searching for similar content:', error);
        aiResults.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Sorry, I had trouble searching for similar content. Please try again!</p>';
    }
}

// Create a compact chatbot card that expands on click
function createChatbotCard(movie) {
    const div = document.createElement('div');
    div.className = 'chatbot-movie-card';
    const isFav = favorites.some(f => f.id === movie.id);
    const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
    const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/342x513?text=No+Image';

    // Providers display
    let providersDisplay = [];
    if (movie.providers && movie.providers.length > 0) {
        providersDisplay = movie.providers;
    }

    const providersHTML = providersDisplay.length > 0
        ? `<div class="chatbot-card-platforms">
             ${providersDisplay.map(p => {
            return `
                    <a href="${p.url}" target="_blank" class="chatbot-platform-badge" onclick="event.stopPropagation()">
                        ${p.name}
                    </a>`;
        }).join('')}
           </div>`
        : '<div class="chatbot-card-platforms"><span class="chatbot-no-stream">Not on streaming</span></div>';

    // Cast display
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

    // Action links for expanded view
    const imdbLink = movie.imdb_id
        ? `https://www.imdb.com/title/${movie.imdb_id}/`
        : '#';

    const voteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

    div.innerHTML = `
        <!-- Collapsed View -->
        <div class="chatbot-card-collapsed">
            <img src="${posterUrl}" class="chatbot-card-poster" alt="${movie.title} Poster">
            <div class="chatbot-card-overlay">
                <h3 class="chatbot-card-title">${movie.title}</h3>
                ${providersHTML}
            </div>
        </div>

        <!-- Expanded View (Hidden by default) -->
        <div class="chatbot-card-expanded" style="display: none;">
            <img src="${posterUrl}" class="chatbot-card-poster-expanded" alt="${movie.title} Poster">
            <div class="chatbot-expanded-content">
                <h3 class="chatbot-card-title">${movie.title}</h3>
                
                <div class="chatbot-expanded-meta">
                    <span><i class="fas fa-calendar"></i> ${year}</span>
                    <span><i class="fas fa-star"></i> ${voteAverage}</span>
                </div>

                <p class="chatbot-card-desc">${movie.overview || "No description available."}</p>

                ${castHTML}

                <div class="chatbot-expanded-platforms">
                    <div class="streaming-label"><i class="fas fa-tv"></i> Watch on:</div>
                    <div class="chatbot-streaming-services">
                        ${providersDisplay.map(p => `
                            <a href="${p.url}" target="_blank" class="chatbot-streaming-link" onclick="event.stopPropagation()">
                                ${p.name}
                            </a>
                        `).join('') || '<span class="chatbot-no-stream">Not available on streaming</span>'}
                    </div>
                </div>

                <div class="chatbot-action-buttons">
                    <button class="chatbot-action-btn chatbot-favorite-btn ${isFav ? 'is-active' : ''}" title="Add to watchlist">
                        ${isFav ? '<i class="fas fa-heart"></i> In Watchlist' : '<i class="far fa-heart"></i> Watchlist'}
                    </button>
                    ${movie.imdb_id ? `<a href="${imdbLink}" target="_blank" class="chatbot-action-btn chatbot-imdb-btn btn-imdb-chat" title="View on IMDB">
                        <i class="fas fa-external-link-alt"></i> IMDb
                    </a>` : ''}
                    <button class="chatbot-action-btn chatbot-share-btn btn-share-chat" data-title="${movie.title}" title="Share this movie">
                        <i class="fas fa-share-alt"></i> Share
                    </button>
                </div>

                <div class="chatbot-click-hint">Click to collapse</div>
            </div>
        </div>
    `;

    // Toggle expanded/collapsed on click
    div.addEventListener('click', (e) => {
        if (e.target.closest('.chatbot-platform-badge') || 
            e.target.closest('.chatbot-streaming-link') || 
            e.target.closest('.cast-member')) {
            return;
        }
        
        const collapsed = div.querySelector('.chatbot-card-collapsed');
        const expanded = div.querySelector('.chatbot-card-expanded');
        
        if (collapsed.style.display !== 'none') {
            collapsed.style.display = 'none';
            expanded.style.display = 'block';
        } else {
            collapsed.style.display = 'block';
            expanded.style.display = 'none';
        }
    });

    // Favorite toggle
    const favBtn = div.querySelector('.chatbot-favorite-btn');
    if (favBtn) {
        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(movie);
            const active = favorites.some(f => f.id === movie.id);
            favBtn.classList.toggle('is-active');
            favBtn.innerHTML = active ? '<i class="fas fa-heart"></i> In Watchlist' : '<i class="far fa-heart"></i> Watchlist';
        });
    }

    // Share button
    const shareBtn = div.querySelector('.chatbot-share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            shareViaURL();
        });
    }

    return div;
}

// Display movie results from chatbot search
function displayChatbotMovieResults(movies, mood, isShowRequest = false) {
    aiResults.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'ai-results-grid';

    movies.forEach(movie => {
        const card = createChatbotCard(movie);
        grid.appendChild(card);
    });

    aiResults.appendChild(grid);
}

// Add message to chat display
function addMessageToChat(role, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${role}`;
    messageDiv.innerHTML = `
        <div class="ai-message-content">
            <strong>${role === 'user' ? '👤 You' : '🤖 StreamFinder'}:</strong>
            <p>${message}</p>
        </div>
    `;
    aiMessages.appendChild(messageDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}


// ========================================
// Card Creation (UPDATED to remove platform logos)
// ========================================
function createMovieCard(movie) {
    const div = document.createElement('div');
    div.className = 'movie-card';
    const isFav = favorites.some(f => f.id === movie.id);
    const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
    const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/342x513?text=No+Image';

    // Cast display - Now includes IMDb ID for linking
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

    // Providers display (using the rich provider object: { name, url })
    let providersDisplay = [];
    // For Surprise Mode, use the platformName/platformUrl fields set in displaySurpriseMovies
    if (movie.platformName && movie.platformUrl) {
        providersDisplay.push({ name: movie.platformName, url: movie.platformUrl });
    } else {
        // For Quiz Results or Favorites, use the movie.providers array (populated in enrichMovieData)
        providersDisplay = movie.providers || [];
    }

    const providersHTML = providersDisplay.length > 0
        ? `<div class="movie-platforms">
             ${providersDisplay.map(p => {
            // FIX: Removed the platform logo from the streaming link
            return `
                    <a href="${p.url}" target="_blank" class="movie-platform streaming-link" onclick="event.stopPropagation()">
                        ${p.name}
                    </a>`;
        }).join('')}
           </div>`
        : '';

    // Action links
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
            ${isFav ? `<button class="action-btn-circle btn-remove" title="Remove from watchlist">
                <i class="fas fa-trash-alt"></i>
            </button>` : ''}
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
                    ${isFav ? '<i class="fas fa-trash-alt"></i> Remove' : '<i class="far fa-heart"></i> Watchlist'}
                </button>
                ${movie.imdb_id ? `<a href="${imdbLink}" target="_blank" class="expanded-action-btn btn-imdb-expanded" title="View on IMDB">
                    <i class="fas fa-external-link-alt"></i> IMDb
                </a>` : ''}
                <button class="expanded-action-btn btn-share-expanded" data-title="${movie.title}">
                    <i class="fas fa-share-alt"></i> Share
                </button>
            </div>
        </div>
        <p class="click-hint">Click for details</p>
    `;

    // 1. Expansion toggle - Cards start closed, clicking toggles expand/collapse like chatbot cards
    div.addEventListener('click', (e) => {
        // Only expand/collapse if clicking the card body, excluding all interactive elements
        if (e.target.closest('.action-btn-circle') || e.target.closest('.cast-member') || e.target.closest('.streaming-link')) {
            return;
        }
        if (!e.target.closest('.action-links-expanded')) {
            div.classList.toggle('expanded');
        }
    });

    // 2. Favorite toggle (Handles ALL favorite buttons)
    div.querySelectorAll('.btn-favorite, .btn-favorite-expanded').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(movie);

            const active = favorites.some(f => f.id === movie.id);

            div.querySelectorAll('.btn-favorite').forEach(favBtn => {
                favBtn.classList.toggle('is-active', active);
                favBtn.innerHTML = active ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
            });
            div.querySelectorAll('.btn-favorite-expanded').forEach(favBtnExpanded => {
                favBtnExpanded.classList.toggle('is-active', active);
                favBtnExpanded.innerHTML = active ? '<i class="fas fa-trash-alt"></i> Remove' : '<i class="far fa-heart"></i> Watchlist';
            });
        });
    });

    // 3. Share button (Handles ALL share buttons)
    div.querySelectorAll('.btn-share, .btn-share-expanded').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            shareMovie(movie);
        });
    });

    // 4. Remove button (In hover state action overlay)
    const removeBtn = div.querySelector('.btn-remove');
    if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(movie);
        });
    }

    // 5. Cast member click handler (Opens IMDb page)
    div.querySelectorAll('.cast-member').forEach(actorEl => {
        actorEl.addEventListener('click', (e) => {
            e.stopPropagation();
            const imdbId = actorEl.dataset.imdbId;
            if (imdbId) {
                window.open(`https://www.imdb.com/name/${imdbId}/`, '_blank');
            } else {
                showToast(`IMDb page not available for ${actorEl.textContent}`, 'removed');
            }
        });
    });

    return div;
}


// ========================================
// Toast Notification Function
// ========================================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ?
        '<i class="fas fa-check-circle"></i>' :
        '<i class="fas fa-times-circle"></i>';

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ========================================
// Favorites Logic (UPDATED for new provider structure and filter population)
// ========================================
function updateFavCount() {
    favCountEl.innerText = favorites.length;
    favCountEl.style.display = favorites.length > 0 ? 'inline' : 'none';

    // Trigger animation
    favCountEl.classList.add('updated');
    setTimeout(() => {
        favCountEl.classList.remove('updated');
    }, 500);
}
updateFavCount();

function toggleFavorite(movie) {
    const idx = favorites.findIndex(f => f.id === movie.id);
    let isAdding = idx === -1;

    // Extract just the names for storage/filtering
    let storedProviderNames = [];
    if (movie.platformName) {
        // If it was a Surprise movie, use the single platform name
        storedProviderNames = [movie.platformName];
    } else if (movie.providers) {
        // For other movies, map the array of {name, url} objects to just names
        storedProviderNames = movie.providers.map(p => p.name);
    }

    if (idx > -1) {
        favorites.splice(idx, 1);
        showToast(`Removed "${movie.title}" from Watchlist`, 'removed');
    } else {
        favorites.push({
            id: movie.id,
            title: movie.title,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            poster_path: movie.poster_path,
            overview: movie.overview,
            genre_ids: movie.genre_ids,
            providers: storedProviderNames, // Store only the names for simplicity
            imdb_id: movie.imdb_id
        });
        showToast(`Added "${movie.title}" to Watchlist!`, 'success');
    }
    localStorage.setItem('streamFinderFavs', JSON.stringify(favorites));
    // FIX: Update the count immediately after modifying the favorites array
    updateFavCount();
    // FIX: Always re-render if the view is active to refresh filters
    if (viewFavs.classList.contains('active')) renderCategorizedFavorites();
}

function renderCategorizedFavorites() {
    const container = document.getElementById('favorites-container');
    const genreFilterEl = document.getElementById('genre-filter');
    const platformFilterEl = document.getElementById('platform-filter');

    // 1. Initialize Filters (on first load only)
    if (genreFilterEl && platformFilterEl && genreFilterEl.options.length <= 1) {
        populateFavoriteFilters(genreFilterEl, platformFilterEl);
    }

    container.innerHTML = "";

    if (favorites.length === 0) {
        container.innerHTML = '<div class="empty-state">Your watchlist is empty. Go find some great content!</div>';
        return;
    }

    // Apply Filters
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

    // 2. Group by Genre ID 
    const groups = {};

    filteredFavorites.forEach(movie => {
        const gId = (movie.genre_ids && movie.genre_ids.length > 0) ? movie.genre_ids[0] : 'other';
        if (!groups[gId]) groups[gId] = [];
        groups[gId].push(movie);
    });

    // 3. Render Groups
    for (const [gId, movies] of Object.entries(groups)) {
        const section = document.createElement('div');
        section.className = 'genre-section';

        const genreName = GENRE_NAMES[gId] || "Uncategorized";

        section.innerHTML = `<h3 class="genre-title">${genreName} (${movies.length})</h3>`;

        const grid = document.createElement('div');
        grid.className = 'favorites-grid';

        // Enrich movies with cast data
        const promises = movies.map(m => {
            // Reconstruct providers property first
            if (m.providers && Array.isArray(m.providers)) {
                m.providers = m.providers.map(item => {
                    if (typeof item === 'object' && item.name) {
                        return item;
                    }
                    const name = String(item);
                    const platformId = Object.keys(PLATFORM_NAMES).find(key => PLATFORM_NAMES[key] === name);
                    return { name, url: platformId ? PLATFORM_URLS[platformId] : '#' };
                });
            }
            // Enrich with cast data
            return enrichMovieData(m);
        });
        
        Promise.all(promises).then(enrichedMovies => {
            enrichedMovies.forEach(m => {
                grid.appendChild(createMovieCard(m));
            });
        }).catch(err => {
            console.error("Error enriching watchlist movies:", err);
            movies.forEach(m => {
                // Reconstruct providers property
                if (m.providers && Array.isArray(m.providers)) {
                    m.providers = m.providers.map(item => {
                        if (typeof item === 'object' && item.name) {
                            return item;
                        }
                        const name = String(item);
                        const platformId = Object.keys(PLATFORM_NAMES).find(key => PLATFORM_NAMES[key] === name);
                        return { name, url: platformId ? PLATFORM_URLS[platformId] : '#' };
                    });
                }
                grid.appendChild(createMovieCard(m));
            });
        });
        
        section.appendChild(grid);
        container.appendChild(section);
    }
    
    // Populate and setup sort by platform dropdown
    setupWatchlistPlatformSort();
}

// Function to setup watchlist sort by platform dropdown
function setupWatchlistPlatformSort() {
    const sortDropdown = document.getElementById('watchlist-sort-platform');
    if (!sortDropdown) return;
    
    // Build platform options dynamically
    let platformOptions = '<option value="default">All Platforms</option>';
    Object.entries(PLATFORM_NAMES).forEach(([id, name]) => {
        platformOptions += `<option value="platform-${id}">${name}</option>`;
    });
    
    sortDropdown.innerHTML = platformOptions;
    
    // Add event listener for sorting
    sortDropdown.addEventListener('change', (e) => {
        const sortBy = e.target.value;
        const container = document.getElementById('favorites-container');
        
        if (sortBy === 'default') {
            // Show all favorites (re-render with normal grouping)
            renderCategorizedFavorites();
        } else if (sortBy.startsWith('platform-')) {
            // Filter by specific platform
            const platformId = sortBy.split('-')[1];
            const platformName = PLATFORM_NAMES[platformId];
            
            // Filter favorites by platform
            const filtered = favorites.filter(movie => {
                if (!movie.providers || movie.providers.length === 0) return false;
                return movie.providers.some(provider => {
                    if (typeof provider === 'object' && provider.name) {
                        return provider.name === platformName;
                    }
                    return String(provider) === platformName;
                });
            });
            
            // Display filtered favorites
            container.innerHTML = '';
            
            if (filtered.length === 0) {
                container.innerHTML = `<div class="empty-state">No movies found on ${platformName}.</div>`;
                return;
            }
            
            const grid = document.createElement('div');
            grid.className = 'favorites-grid';
            
            // Enrich filtered movies with cast data
            const promises = filtered.map(m => {
                // Reconstruct providers property for consistent display
                if (m.providers && Array.isArray(m.providers)) {
                    m.providers = m.providers.map(item => {
                        if (typeof item === 'object' && item.name) {
                            return item;
                        }
                        const name = String(item);
                        const pId = Object.keys(PLATFORM_NAMES).find(key => PLATFORM_NAMES[key] === name);
                        return { name, url: pId ? PLATFORM_URLS[pId] : '#' };
                    });
                }
                // Enrich with cast data
                return enrichMovieData(m);
            });
            
            Promise.all(promises).then(enrichedMovies => {
                enrichedMovies.forEach(m => {
                    grid.appendChild(createMovieCard(m));
                });
            }).catch(err => {
                console.error("Error enriching filtered watchlist movies:", err);
                filtered.forEach(m => {
                    // Fallback: create card without cast data
                    grid.appendChild(createMovieCard(m));
                });
            });
            
            container.appendChild(grid);
        }
    });
}

// FIX: Function to populate the filter dropdowns with ALL platforms
function populateFavoriteFilters(genreFilterEl, platformFilterEl) {
    const uniqueGenres = new Set();

    // Collect all genres from saved movies
    favorites.forEach(movie => {
        if (movie.genre_ids) {
            movie.genre_ids.forEach(id => uniqueGenres.add(id));
        }
    });

    // Get all platform names from the map keys
    const allPlatforms = Object.values(PLATFORM_NAMES).sort();

    // Clear existing options (except "All")
    genreFilterEl.innerHTML = '<option value="all">All Genres</option>';
    platformFilterEl.innerHTML = '<option value="all">All Platforms</option>';

    // Populate Genres
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

    // Populate Platforms with ALL available platforms
    allPlatforms.forEach(name => {
        const option = new Option(name, name);
        if (name === favoritesFilters.platform) option.selected = true;
        platformFilterEl.add(option);
    });

    // Add event listeners to filters 
    if (!genreFilterEl.dataset.initialized) { // Prevent adding listeners multiple times
        genreFilterEl.addEventListener('change', (e) => {
            favoritesFilters.genre = e.target.value;
            renderCategorizedFavorites();
        });

        platformFilterEl.addEventListener('change', (e) => {
            favoritesFilters.platform = e.target.value;
            renderCategorizedFavorites();
        });

        const clearBtn = document.getElementById('clear-filters-btn');
        if (clearBtn) {
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
// Back-to-Top Button Handler
// ========================================
const backToTopBtn = document.getElementById('back-to-top-btn');
const viewFavsContainer = document.getElementById('view-favorites');

if (backToTopBtn && viewFavsContainer) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    // Scroll to top when button is clicked
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// Initialization (Unchanged)
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initializeMovieFact();
    initializeSelectAllButton();
});

pushHistory(0);