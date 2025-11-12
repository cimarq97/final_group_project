// ===== SAMPLE DATA =====
// This is the placeholder dataset with 15 movie/show entries
const mediaDatabase = [
    {
        id: 1,
        title: "The Grand Budapest Hotel",
        type: "Movie",
        genre: "comedy",
        mood: ["happy", "relaxed"],
        time: "medium",
        duration: "100 min",
        services: ["netflix", "hulu"],
        description: "A whimsical comedy about a legendary concierge and his protégé at a famous European hotel."
    },
    {
        id: 2,
        title: "Breaking Bad",
        type: "Series",
        genre: "drama",
        mood: ["excited", "thoughtful"],
        time: "binge",
        duration: "5 Seasons",
        services: ["netflix"],
        description: "A high school chemistry teacher turned meth manufacturer navigates the dangerous criminal underworld."
    },
    {
        id: 3,
        title: "The Office",
        type: "Series",
        genre: "comedy",
        mood: ["happy", "relaxed"],
        time: "short",
        duration: "22 min episodes",
        services: ["prime", "hulu"],
        description: "A mockumentary following the everyday lives of office employees at Dunder Mifflin Paper Company."
    },
    {
        id: 4,
        title: "Inception",
        type: "Movie",
        genre: "scifi",
        mood: ["excited", "thoughtful"],
        time: "medium",
        duration: "148 min",
        services: ["hbo", "prime"],
        description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea."
    },
    {
        id: 5,
        title: "Planet Earth II",
        type: "Documentary",
        genre: "documentary",
        mood: ["relaxed", "thoughtful"],
        time: "short",
        duration: "50 min episodes",
        services: ["netflix", "disney"],
        description: "Stunning nature documentary showcasing the beauty and diversity of life on Earth."
    },
    {
        id: 6,
        title: "Gone Girl",
        type: "Movie",
        genre: "thriller",
        mood: ["excited", "thoughtful"],
        time: "medium",
        duration: "149 min",
        services: ["hulu", "prime"],
        description: "A husband becomes the prime suspect in his wife's mysterious disappearance."
    },
    {
        id: 7,
        title: "Ted Lasso",
        type: "Series",
        genre: "comedy",
        mood: ["happy", "relaxed"],
        time: "short",
        duration: "30 min episodes",
        services: ["apple"],
        description: "An American football coach is hired to manage a British soccer team despite having no experience."
    },
    {
        id: 8,
        title: "Mad Max: Fury Road",
        type: "Movie",
        genre: "action",
        mood: ["excited", "adventurous"],
        time: "medium",
        duration: "120 min",
        services: ["hbo", "netflix"],
        description: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search of her homeland."
    },
    {
        id: 9,
        title: "The Crown",
        type: "Series",
        genre: "drama",
        mood: ["thoughtful", "relaxed"],
        time: "binge",
        duration: "6 Seasons",
        services: ["netflix"],
        description: "A dramatized chronicle of the reign of Queen Elizabeth II and the political events that shaped the modern world."
    },
    {
        id: 10,
        title: "Parasite",
        type: "Movie",
        genre: "thriller",
        mood: ["excited", "thoughtful"],
        time: "medium",
        duration: "132 min",
        services: ["hulu", "hbo"],
        description: "A poor family schemes to become employed by a wealthy family and infiltrate their household."
    },
    {
        id: 11,
        title: "Stranger Things",
        type: "Series",
        genre: "scifi",
        mood: ["excited", "adventurous"],
        time: "binge",
        duration: "4 Seasons",
        services: ["netflix"],
        description: "A group of kids uncover supernatural mysteries in their small Indiana town in the 1980s."
    },
    {
        id: 12,
        title: "Amelie",
        type: "Movie",
        genre: "comedy",
        mood: ["happy", "relaxed"],
        time: "medium",
        duration: "122 min",
        services: ["prime", "hulu"],
        description: "A shy waitress decides to change the lives of those around her for the better while dealing with her own isolation."
    },
    {
        id: 13,
        title: "Our Planet",
        type: "Documentary",
        genre: "documentary",
        mood: ["thoughtful", "relaxed"],
        time: "short",
        duration: "50 min episodes",
        services: ["netflix"],
        description: "Explores the natural wonders of our planet and the impact of climate change on all living creatures."
    },
    {
        id: 14,
        title: "The Mandalorian",
        type: "Series",
        genre: "action",
        mood: ["adventurous", "excited"],
        time: "short",
        duration: "40 min episodes",
        services: ["disney"],
        description: "A lone bounty hunter travels the outer reaches of the galaxy, far from the authority of the New Republic."
    },
    {
        id: 15,
        title: "Knives Out",
        type: "Movie",
        genre: "thriller",
        mood: ["excited", "thoughtful"],
        time: "medium",
        duration: "130 min",
        services: ["prime", "netflix"],
        description: "A detective investigates the death of a patriarch of an eccentric, combative family."
    }
];

// ===== STATE MANAGEMENT =====
let currentStep = 1;
const totalSteps = 4;
const userSelections = {
    mood: null,
    time: null,
    genre: null,
    services: []
};

// ===== DOM ELEMENTS =====
const formSteps = document.querySelectorAll('.form-step');
const progressDots = document.querySelectorAll('.progress-dot');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const findBtn = document.getElementById('find-btn');
const resetBtn = document.getElementById('reset-btn');
const selectorSection = document.getElementById('selector-section');
const resultsSection = document.getElementById('results-section');
const resultsContainer = document.getElementById('results-container');
const noResultsDiv = document.getElementById('no-results');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    updateStepDisplay();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Navigation buttons
    nextBtn.addEventListener('click', handleNext);
    prevBtn.addEventListener('click', handlePrevious);
    findBtn.addEventListener('click', handleFindRecommendations);
    resetBtn.addEventListener('click', handleReset);
    
    // Input change listeners to save selections
    document.querySelectorAll('input[name="mood"]').forEach(input => {
        input.addEventListener('change', (e) => {
            userSelections.mood = e.target.value;
        });
    });
    
    document.querySelectorAll('input[name="time"]').forEach(input => {
        input.addEventListener('change', (e) => {
            userSelections.time = e.target.value;
        });
    });
    
    document.
querySelectorAll('input[name="genre"]').forEach(input => {
        input.addEventListener('change', (e) => {
            userSelections.genre = e.target.value;
        });
    });
    
    document.querySelectorAll('input[name="services"]').forEach(input => {
        input.addEventListener('change', (e) => {
            if (e.target.checked) {
                userSelections.services.push(e.target.value);
            } else {
                userSelections.services = userSelections.services.filter(
                    service => service !== e.target.value
                );
            }
        });
    });
}

// ===== NAVIGATION FUNCTIONS =====
function handleNext() {
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
        alert('Please make a selection before continuing.');
        return;
    }
    
    if (currentStep < totalSteps) {
        currentStep++;
        updateStepDisplay();
    }
}

function handlePrevious() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
    }
}

function updateStepDisplay() {
    // Update form step visibility
    formSteps.forEach((step, index) => {
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Update progress dots
    progressDots.forEach((dot, index) => {
        if (index + 1 <= currentStep) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Update button visibility
    if (currentStep === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-block';
    }
    
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        findBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        findBtn.style.display = 'none';
    }
    
    // Scroll to top of card for better UX
    selectorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== VALIDATION =====
function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            return userSelections.mood !== null;
        case 2:
            return userSelections.time !== null;
        case 3:
            return userSelections.genre !== null;
        case 4:
            // Services are optional, but at least warn if none selected
            if (userSelections.services.length === 0) {
                return confirm('You haven\'t selected any streaming services. Continue anyway?');
            }
            return true;
        default:
            return true;
    }
}

// ===== FILTERING LOGIC =====
function filterRecommendations() {
    return mediaDatabase.filter(item => {
        // Filter by genre (exact match required)
        if (item.genre !== userSelections.genre) {
            return false;
        }
        
        // Filter by mood (item must support user's mood)
        if (!item.mood.includes(userSelections.mood)) {
            return false;
        }
        
        // Filter by time availability
        if (item.time !== userSelections.time) {
            return false;
        }
        
        // Filter by streaming services (if user selected any)
        if (userSelections.services.length > 0) {
            // Check if item is available on at least one selected service
            const hasMatchingService = item.services.some(service => 
                userSelections.services.includes(service)
            );
            if (!hasMatchingService) {
                return false;
            }
        }
        
        return true;
    });
}

// ===== DISPLAY RESULTS =====
function handleFindRecommendations() {
    // Validate that we have all selections
    if (!validateCurrentStep()) {
        return;
    }
    
    // Get filtered results
    const results = filterRecommendations();
    
    // Hide selector, show results
    selectorSection.style.display = 'none';
    resultsSection.style.display = 'block';
    
    // Display results
    if (results.length > 0) {
        displayResults(results);
        noResultsDiv.style.display = 'none';
    } else {
        resultsContainer.innerHTML = '';
        noResultsDiv.style.display = 'block';
    }
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function displayResults(results) {
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Create result cards
    results.forEach((item, index) => {
        const card = createResultCard(item, index);
        resultsContainer.appendChild(card);
    });
}

function createResultCard(item, index) {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    // Build services HTML
    const servicesHTML = item.services
        .filter(service => userSelections.services.length === 0 || userSelections.services.includes(service))
        .map(service => `<span class="streaming-service">${capitalizeService(service)}</span>`)
        .join(' ');
    
    card.innerHTML = `
        <h3>${item.title}</h3>
        <span class="result-type">${item.type}</span>
        <p>${item.description}</p>
        <div class="result-meta">
            <span class="meta-tag">⏱️ ${item.duration}</span>
            <span class="meta-tag">🎭 ${capitalizeGenre(item.genre)}</span>
        </div>
        <div class="result-meta">
            ${servicesHTML}
        </div>
    `;
    
    return card;
}

// ===== RESET FUNCTION =====
function handleReset() {
    // Reset all selections
    userSelections.mood = null;
    userSelections.time = null;
    userSelections.genre = null;
    userSelections.services = [];
    
    // Reset form inputs
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked = false;
    });
    
    document.querySelectorAll('input[type="checkbox"]').forEach(input => {
        input.checked = false;
    });
    
    // Reset to first step
    currentStep = 1;
    updateStepDisplay();
    
    // Show selector, hide results
    resultsSection.style.display = 'none';
    selectorSection.style.display = 'block';
    
    // Scroll to top
    selectorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== UTILITY FUNCTIONS =====
function capitalizeService(service) {
    const serviceNames = {
        'netflix': 'Netflix',
        'hulu': 'Hulu',
        'disney': 'Disney+',
        'prime': 'Prime Video',
        'hbo': 'HBO Max',
        'apple': 'Apple TV+'
    };
    return serviceNames[service] || service;
}

function capitalizeGenre(genre) {
    const genreNames = {
        'comedy': 'Comedy',
        'drama': 'Drama',
        'action': 'Action',
        'thriller': 'Thriller',
        'scifi': 'Sci-Fi',
        'documentary': 'Documentary'
    };
    return genreNames[genre] || genre;
}

// ===== KEYBOARD NAVIGATION (Bonus Enhancement) =====
document.addEventListener('keydown', (e) => {
    // Only handle keyboard navigation when selector is visible
    if (selectorSection.style.display === 'none') return;
    
    if (e.key === 'ArrowRight' && currentStep < totalSteps) {
        if (validateCurrentStep()) {
            handleNext();
        }
    } else if (e.key === 'ArrowLeft' && currentStep > 1) {
        handlePrevious();
    } else if (e.key === 'Enter' && currentStep === totalSteps) {
        handleFindRecommendations();
    }
});