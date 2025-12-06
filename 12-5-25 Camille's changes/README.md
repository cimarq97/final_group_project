# StreamFinder - Complete Feature Documentation

**Last Updated:** December 5, 2025

---

## Table of Contents

1. [Quick Overview](#quick-overview)
2. [Feature 1: Movie Card Enhancements](#feature-1-movie-card-enhancements)
3. [Feature 2: Shareable Recommendations](#feature-2-shareable-recommendations)
4. [Feature 3: Surprise Me Mode](#feature-3-surprise-me-mode)
5. [User Flows & Experience](#user-flows--experience)
6. [Technical Implementation](#technical-implementation)
7. [Streaming Platforms](#streaming-platforms)
8. [Customization Guide](#customization-guide)
9. [Browser Compatibility](#browser-compatibility)
10. [Troubleshooting](#troubleshooting)

---

## Quick Overview

StreamFinder has been enhanced with powerful new features that improve user engagement and discoverability:

### 🎬 Three Main Features

1. **Enhanced Movie Cards** - Individual sharing, IMDB links, and platform display
2. **Shareable Recommendations** - Share quiz results with friends via URL
3. **Surprise Me Mode** - Get curated recommendations grouped by platform

### 📊 Key Improvements

✅ Users can share individual movies with specific friends  
✅ Direct access to IMDB for reviews and details  
✅ Real-time streaming platform availability  
✅ Shareable quiz results that don't require retaking the quiz  
✅ Mobile-optimized with native Web Share API support  
✅ Fully responsive design across all devices  

---

# Feature 1: Movie Card Enhancements

## Overview

The StreamFinder movie cards have been enhanced with three interactive features that improve user engagement and discoverability:

1. **Individual Movie Sharing** - Users can share specific movies with friends
2. **IMDB Navigation** - Direct links to IMDB for detailed movie information
3. **Streaming Platform Display** - Shows which platforms each movie is available on

---

## 1.1 Individual Movie Sharing 🎬

### Functionality

- Each movie card includes a green **Share** button
- Click the share button to generate a shareable link for that specific movie
- On mobile devices, uses the native Web Share API (Messages, iMessage, etc.)
- On desktop, copies the link to clipboard with a confirmation message

### How It Works

```javascript
// Share URL format:
// https://yoursite.com/index.html?movieId=550&movieTitle=Fight%20Club

// When someone clicks a shared movie link, they can:
// 1. View the specific movie immediately (future feature)
// 2. See which platforms it's available on
// 3. Add it to their watchlist
```

### User Experience

```
Movie Card → [Share Button] → Mobile: Native Share Sheet
                           → Desktop: "Movie link copied to clipboard! 🎬"
```

### Styling

- Green background (#4CAF50) on hover
- Positioned in the action buttons row at bottom of card
- Scales up slightly on hover for visual feedback
- Responsive sizing on mobile devices

---

## 1.2 IMDB Navigation 🔗

### Functionality

- Each movie card displays a **gold IMDB** button
- Clicking opens the movie's IMDB page in a new tab
- The IMDB ID is fetched from TMDB API automatically
- If no IMDB ID is available, button is disabled (50% opacity)

### How It Works

```javascript
// Function: fetchMovieDetails(movieId)
// Returns: { imdb_id: "tt0111161", runtime: 142, genres: [...] }
// IMDB Link: https://www.imdb.com/title/{imdb_id}/

// Example:
// Movie: Shawshank Redemption
// IMDB ID: tt0111161
// Link: https://www.imdb.com/title/tt0111161/
```

### User Experience

```
Movie Card → [IMDB Button] → Opens IMDB in new tab
                           → Shows ratings, reviews, cast info
                           → Users never leave StreamFinder
```

### Styling

- Gold background with gold border (cinema theme)
- Changes to gold background on hover with white text
- Includes external link icon for clarity
- Responsive sizing on mobile devices

---

## 1.3 Streaming Platform Display 📺

### Functionality

- Shows all platforms where each movie is currently available
- Fetches real-time platform availability from TMDB
- Displays as colored badges below the movie description
- Only shows in expanded card view (when user clicks card)
- Includes 6 major US platforms: Netflix, Hulu, Max, Disney+, Prime Video, Paramount+

### How It Works

```javascript
// Function: fetchWatchProviders(movieId)
// Returns: { results: { US: { flatrate: [...] } } }

// Platforms supported:
// Netflix (8), Hulu (15), Max (1899), Disney+ (337), 
// Prime Video (9), Paramount+ (531)

// Display in card:
// "Available on: [Netflix] [Hulu] [Max]"
```

### User Experience

```
1. User clicks movie card to expand
2. Card expands to show full description
3. Below description: "Available on: [Badge1] [Badge2] [Badge3]"
4. User can immediately see where to watch without visiting IMDB
```

### Styling

- Gold/yellow gradient background for each badge
- Dark text for contrast
- Rounded pill-style buttons
- Grouped in responsive row layout
- Fades in as API data loads

---

## 1.4 Movie Card Layout

### Collapsed View (Default)

```
┌─────────────────────────────┐
│  Movie Poster Image         │  ◄── Click to expand
├─────────────────────────────┤
│ Title                       │
│ Year  ★ Rating              │
└─────────────────────────────┘
 [On Hover: Action buttons appear on desktop]
```

### Expanded View (After Click)

```
┌──────────────────────────────────┐
│  Movie Poster                    │
├──────────────────────────────────┤
│ Title                            │
│ Year  ★ Rating                   │
├──────────────────────────────────┤
│ Movie Description/Overview       │
│                                  │
│ Available on:                    │
│ [Netflix] [Hulu] [Max] [...]     │
│                                  │
│ [❤️ Watchlist] [🔗 IMDB]         │
│ [📤 Share Movie]                 │
└──────────────────────────────────┘
```

---

# Feature 2: Shareable Recommendations

## Overview

Users can now easily share their movie recommendations with friends! The share feature encodes the user's quiz selections (mood, time, genres, and platforms) into a URL that can be shared via link, social media, or messaging apps.

---

## 2.1 How Sharing Works

### Step 1: User Takes Quiz & Gets Results

- User selects mood, time available, genres, and streaming platforms
- Clicks "Reveal Picks" to get recommendations

### Step 2: Share Section Appears (Surprise Me Only)

For **Surprise Me Mode**, a prominent share section appears at the top of results:
- **Copy Link**: Copies the shareable URL to clipboard
- **Share**: Opens native share dialog (mobile) or copies to clipboard (desktop)

### Step 3: Shared Link Format

```
https://yoursite.com/path?mood=excited&time=long&genres=28,53,878&platforms=8,15
```

**URL Parameters:**
- `mood`: User's mood selection (cozy, excited, sad, tired, curious)
- `time`: Time available (short, medium, long, binge)
- `genres`: Comma-separated genre IDs
- `platforms`: Comma-separated platform provider IDs

### Step 4: Receiving the Share

- Friend receives the link via text, email, social media, etc.
- Clicks the link and is automatically taken to results matching those selections
- No need to fill out the quiz again!

---

## 2.2 URL Examples

**Comedy + Romance for relaxation:**
```
https://yoursite.com?mood=cozy&time=long&genres=35,10749&platforms=8
```

**Action + Thriller for excitement:**
```
https://yoursite.com?mood=excited&time=binge&genres=28,53&platforms=8,15
```

**Drama for emotional viewing:**
```
https://yoursite.com?mood=sad&time=long&genres=18,99&platforms=8,337
```

**Quick movie (All platforms):**
```
https://yoursite.com?mood=cozy&time=short
```

---

## 2.3 User Flow - Original Quiz

```
Step 0: Welcome
  ↓
Step 1: Select Mood (Cozy, Excited, Sad, Tired, Curious)
  ↓
Step 2: Select Time (< 30 min, 30-60 min, Movie-length, Binging)
  ↓
Step 3: Pick Genres (Comedy, Romance, Horror, Drama, Sci-Fi, Documentary)
  ↓
Step 4: Select Streaming Platforms (Netflix, Hulu, Max, Disney+, Prime Video, Paramount+)
  ↓
Step 5: RESULTS (10 Random Movies)
  │
  ├─ Each movie card has: ❤️ | 🔗 IMDB | 📤 Share
  └─ Can click to expand and see platforms
```

---

## 2.4 User Flow - Shared Link

```
Friend receives link → Clicks link
  ↓
Auto-loads selected parameters
  ↓
Jumps directly to Step 5 (Results)
  ↓
Shows recommended movies matching selections
  ↓
Can share again, add to watchlist, or view IMDB
```

---

## 2.5 Privacy & Security

### What's Shared

✅ Mood selection  
✅ Time selection  
✅ Genre preferences  
✅ Streaming service choices  

### What's NOT Shared

❌ Your watchlist  
❌ User account info  
❌ Personal data  
❌ Search history  

---

# Feature 3: Surprise Me Mode

## Overview

The "Surprise Me" feature provides a unique experience where users get surprise recommendations **grouped by streaming platform**.

---

## 3.1 How Surprise Me Works

### Step 1: Skip the Quiz

Click the **"Surprise Me"** button on the welcome screen
- No mood selection needed
- Only requires platform selection

### Step 2: Select Your Platforms

Choose which streaming services you have:
- Netflix
- Hulu
- Max
- Disney+
- Prime Video
- Paramount+

### Step 3: Get Surprise Recommendations

Movies are displayed **grouped by platform**:

```
Netflix Picks (3 movies)
├─ Movie 1 [❤️] [🔗 IMDB] [📤 Share]
├─ Movie 2 [❤️] [🔗 IMDB] [📤 Share]
└─ Movie 3 [❤️] [🔗 IMDB] [📤 Share]

Hulu Picks (2 movies)
├─ Movie 4 [❤️] [🔗 IMDB] [📤 Share]
└─ Movie 5 [❤️] [🔗 IMDB] [📤 Share]

Max Picks (3 movies)
├─ Movie 6 [❤️] [🔗 IMDB] [📤 Share]
├─ Movie 7 [❤️] [🔗 IMDB] [📤 Share]
└─ Movie 8 [❤️] [🔗 IMDB] [📤 Share]
```

### Step 4: Share Your Surprise

At the top of the results: **"Love the surprise? Share them!"**
- [🔗 Copy Link] - Share with friends
- [📤 Share] - Use Web Share API (mobile)

---

## 3.2 Why Surprise Me?

✨ **Quick Discovery** - No long quiz process  
✨ **Discovery Randomness** - See movies you might not find on your own  
✨ **Platform-Aware** - Already organized by where to watch  
✨ **Shareable** - Great for group recommendations  

---

# User Flows & Experience

## Desktop User Experience

### Regular Quiz Results

```
1. Browse StreamFinder results
   ↓
2. Hover over movie card → 3 action buttons appear at bottom
   [❤️ Watchlist] [🔗 IMDB] [📤 Share]
   ↓
3. Click any button:
   • ❤️ = Add to watchlist (heart turns red)
   • 🔗 = New tab opens to IMDB
   • 📤 = Link copied to clipboard with confirmation
   ↓
4. Want more info? Click card to expand
   → See full description + streaming platforms
```

### Surprise Me Results

```
1. See "Love the surprise? Share them!" at top
   ↓
2. [🔗 Copy Link] or [📤 Share] buttons
   ↓
3. Movies grouped by platform (Netflix, Hulu, Max, etc.)
   ↓
4. Hover and click individual movie buttons
   ↓
5. Share entire set or individual movies
```

---

## Mobile User Experience

### Quiz Step 4: Platform Selection

```
┌──────────────────────────┐
│ Select streaming services│
├──────────────────────────┤
│ ☐ Netflix                │
│ ☐ Hulu                   │
│ ☐ Max                    │
│ ☐ Disney+                │
│ ☐ Prime Video            │
│ ☐ Paramount+             │
├──────────────────────────┤
│ [← Back] [Reveal Picks →]│
└──────────────────────────┘
```

### Results Display - Collapsed

```
┌─────────────────────────────┐
│     Movie Poster            │ ◄── Tap to expand
├─────────────────────────────┤
│ Title                       │
│ Year ★ 8.5                  │
├─────────────────────────────┤
│ [❤️] [🔗 IMDB] [📤 Share]   │
└─────────────────────────────┘
```

### Results Display - Expanded

```
┌─────────────────────────────┐
│ Movie Poster                │
│ Title  Year  ★ 8.5          │
│                             │
│ This is an awesome movie... │
│                             │
│ Available on:               │
│ [Netflix] [Max] [Prime]     │
│                             │
│ [❤️ Watchlist]              │
│ [🔗 IMDB]                   │
│ [📤 Share Movie]            │
└─────────────────────────────┘
```

---

# Technical Implementation

## JavaScript Functions

### Movie Card Functions

#### `fetchMovieDetails(movieId)`
Fetches movie metadata from TMDB including IMDB ID and genres.

**API Endpoint:**
```
GET /movie/{movie_id}
Authorization: Bearer {TMDB_V4_TOKEN}
```

**Returns:**
```javascript
{
  imdb_id: "tt1234567",
  runtime: 120,
  genres: [{ id: 28, name: "Action" }, ...]
}
```

#### `fetchWatchProviders(movieId)`
Fetches streaming platform availability for a movie in the US region.

**API Endpoint:**
```
GET /movie/{movie_id}/watch/providers
Authorization: Bearer {TMDB_V4_TOKEN}
```

**Returns:**
```javascript
{
  results: {
    US: {
      flatrate: [
        { provider_id: 8, provider_name: "Netflix", logo_path: "..." },
        { provider_id: 15, provider_name: "Hulu", logo_path: "..." }
      ]
    }
  }
}
```

#### `shareMovieCard(movieId, movieTitle)`
Generates a shareable link for a specific movie.

**Functionality:**
- Creates URL with movieId and movieTitle as parameters
- Uses native Web Share API on mobile (Twitter, Facebook, Messages, etc.)
- Falls back to clipboard copy on desktop browsers
- Shows user-friendly confirmation message

**Share URL Format:**
```
https://yoursite.com/path/index.html?movieId={id}&movieTitle={encodedTitle}
```

### Share Feature Functions

#### `encodeSelections()`
Converts current quiz selections to URL parameters.

**Returns:**
```javascript
"mood=excited&time=long&genres=28,53&platforms=8,15"
```

#### `decodeSelectionsFromURL()`
Reads URL parameters and populates selections object.

**Returns:**
```javascript
true  // if shared link was found
false // if no shared link
```

#### `generateShareLink()`
Creates the full shareable URL.

**Returns:**
```javascript
"https://yoursite.com/index.html?mood=excited&time=long&genres=28,53&platforms=8"
```

#### `copyToClipboard()`
Copies the share link to clipboard using Clipboard API.

**Behavior:**
- Shows confirmation: "Share link copied to clipboard! 🎬"
- Graceful fallback if Clipboard API unavailable

#### `shareViaURL()`
Opens native share dialog or copies to clipboard.

**Desktop:** Copies link to clipboard  
**Mobile:** Opens native share sheet (iOS/Android)  

---

## CSS Classes

### Movie Action Buttons

```css
.movie-actions              /* Container for 3 buttons */
.fav-btn                    /* Favorite/watchlist button */
.imdb-btn                   /* IMDB navigation button */
.share-movie-btn            /* Share movie button */
```

### Platform Display

```css
.movie-platforms-list       /* Platforms container */
.platforms-label            /* "Available on:" label */
.platforms-row              /* Row of platform badges */
.platform-badge             /* Individual platform badge */
```

### Share Section

```css
.share-section              /* Gold gradient container */
.share-header               /* Title and buttons layout */
.share-buttons              /* Button group styling */
.share-btn                  /* Individual button styling */
```

---

## API Calls Per Page Load

Each movie card makes 2 asynchronous API calls:

1. **GET /movie/{id}** → Get IMDB ID (fetchMovieDetails)
2. **GET /movie/{id}/watch/providers** → Get streaming platforms (fetchWatchProviders)

**Total for 10 movies:** 20 API calls

**Performance:** All calls are asynchronous and don't block card rendering

---

# Streaming Platforms

## Supported Platforms

| Platform | ID | Included |
|----------|----|---------:|
| Netflix | 8 | ✅ |
| Hulu | 15 | ✅ |
| Max | 1899 | ✅ |
| Disney+ | 337 | ✅ |
| Prime Video | 9 | ✅ |
| Paramount+ | 531 | ✅ |

## Where Platforms Appear

### 1. Quiz Input (Step 4)

Users select which services they subscribe to:

```html
<label class="check-card"><input type="checkbox" name="platform" value="8"><span>Netflix</span></label>
<label class="check-card"><input type="checkbox" name="platform" value="15"><span>Hulu</span></label>
<label class="check-card"><input type="checkbox" name="platform" value="1899"><span>Max</span></label>
<label class="check-card"><input type="checkbox" name="platform" value="337"><span>Disney+</span></label>
<label class="check-card"><input type="checkbox" name="platform" value="9"><span>Prime Video</span></label>
<label class="check-card"><input type="checkbox" name="platform" value="531"><span>Paramount+</span></label>
```

### 2. Search Filter

API call includes: `with_watch_providers={selected_ids}`
- Only returns movies available on selected platforms

### 3. Movie Cards

- Fetch real-time availability for each movie
- Display as colored badges when card is expanded
- API: `/movie/{id}/watch/providers`

### 4. Surprise Me Grouping

- Groups movies by their available platforms
- Sections show: "Netflix Picks", "Hulu Picks", etc.
- Organized by platform for easy browsing

---

# Customization Guide

## Change Button Colors

**File:** `style.css`

```css
/* IMDB button (currently gold) */
.imdb-btn {
    background: rgba(245, 230, 211, 0.1);
    border: 1px solid var(--accent-gold);
    color: var(--accent-gold);
}

/* Share button (currently green) */
.share-movie-btn {
    background: rgba(212, 175, 55, 0.2);
    /* Change to any color you want */
}

.share-movie-btn:hover {
    background: #4CAF50;  /* Change hover color here */
    border-color: #4CAF50;
    color: white;
}
```

## Add More Streaming Platforms

**File:** `script.js`

```javascript
const PLATFORM_NAMES = {
    8: "Netflix",
    15: "Hulu",
    1899: "Max",
    337: "Disney+",
    9: "Prime Video",
    531: "Paramount+",
    // Add more platforms here
    // Get ID from TMDB documentation
};
```

Then add to HTML (Step 4):

```html
<label class="check-card"><input type="checkbox" name="platform" value="NEW_ID"><span>New Platform</span></label>
```

## Change Share Messages

**File:** `script.js`

```javascript
// Movie share message
function shareMovieCard(movieId, movieTitle) {
    navigator.share({
        title: 'StreamFinder',
        text: 'Check out this movie!', // ← Edit this text
        url: shareLink
    })
}

// Quiz share message
function shareViaURL() {
    navigator.share({
        title: 'StreamFinder',
        text: 'Check out these movie recommendations from StreamFinder!', // ← Edit
        url: shareLink
    })
}
```

## Customize Platform Badge Styling

**File:** `style.css`

```css
.platform-badge {
    display: inline-block;
    background: linear-gradient(135deg, var(--accent-gold), var(--accent-yellow));
    color: var(--bg-dark);
    padding: 0.3rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    /* Customize here */
}
```

---

# Browser Compatibility

## Movie Card Features

| Feature | Chrome | Firefox | Safari | Edge | Mobile |
|---------|--------|---------|--------|------|--------|
| Movie Cards | ✅ | ✅ | ✅ | ✅ | ✅ |
| IMDB Links | ✅ | ✅ | ✅ | ✅ | ✅ |
| Share (Clipboard) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Web Share API | ✅ | ❌ | ✅ | ✅ | ✅ |
| Platform Badges | ✅ | ✅ | ✅ | ✅ | ✅ |

## Share Feature

| Feature | Chrome | Firefox | Safari | Edge | Mobile |
|---------|--------|---------|--------|------|--------|
| URL Parameters | ✅ | ✅ | ✅ | ✅ | ✅ |
| Clipboard API | ✅ | ✅ | ✅ | ✅ | ✅ |
| Web Share API | ✅ | ❌ | ✅ | ✅ | ✅ |

**Notes:**
- Web Share API available on iOS 13.5+, Android 6+, Edge, Chrome
- All buttons fall back gracefully on unsupported browsers
- Clipboard API requires HTTPS (or localhost)

---

# Troubleshooting

## IMDB Button Issues

### Button is disabled/grayed out
- Some older movies may not have an IMDB ID in TMDB database
- This is a data limitation, not a bug
- Button will be disabled (50% opacity) for affected movies

### IMDB link doesn't open
- Check browser popup blocker settings
- May be blocking new tabs/windows
- Allow StreamFinder to open popups

---

## Platform Display Issues

### Platforms not showing on card
- Card must be expanded (clicked) to see platforms
- API call might be slow - wait a moment for badges to appear
- Check internet connection

### Specific platform missing
- Movie may not be available on that platform
- TMDB data may be outdated
- Only shows platforms where content is in "flatrate" (subscription)

---

## Share Feature Issues

### Share button doesn't work
- **Mobile:** Web Share API requires HTTPS (or localhost)
- **Desktop:** Clipboard API requires HTTPS (or localhost)
- **Fallback:** Will always work with localhost or HTTPS
- Try refreshing page if API calls were interrupted

### Shared link doesn't load results
- Check URL for correct format: `?mood=xxx&time=yyy`
- Ensure parameters are properly encoded
- Try URL with fewer parameters first

### Buttons cut off on mobile
- Check browser zoom level (should be 100%)
- Try viewing in fullscreen
- Buttons stack vertically on screens under 480px

---

## Performance Issues

### Page loading slowly
- Check network tab in browser console
- Verify TMDB API token is valid
- May have too many simultaneous API calls
- Try reducing number of movies shown (currently 10)

### API rate limiting
- TMDB API has rate limits (typically 40 requests/10 seconds)
- Each movie = 2 API calls
- 10 movies = 20 API calls
- Consider caching for high-traffic sites

---

## Testing Checklist

- [ ] **IMDB Button** - Opens correct IMDB page
- [ ] **Share Button (Mobile)** - Shows native share sheet
- [ ] **Share Button (Desktop)** - Copies link to clipboard
- [ ] **Platforms** - Show up when card is expanded
- [ ] **Responsive** - Buttons look good on mobile (480px)
- [ ] **Responsive** - Buttons look good on tablet (768px)
- [ ] **Responsive** - Buttons look good on desktop (1920px)
- [ ] **Expanded View** - All buttons are clickable
- [ ] **Hover Effects** - Buttons scale and change color
- [ ] **Watchlist** - Heart button still works with new layout
- [ ] **Performance** - Pages load smoothly with 10+ movies
- [ ] **Quiz Share** - Surprise Me share section appears
- [ ] **Shared Link** - Clicking shared URL loads results
- [ ] **Platform Selection** - All 6 platforms selectable
- [ ] **API Calls** - Network tab shows expected requests

---

## Support & Future Enhancements

### Planned Features
- Click-to-platform badges to jump directly to service
- Rental/purchase options in addition to subscriptions
- Referral tracking for shared links
- Social preview cards for better link sharing
- QR code generation for physical sharing
- Similar movie recommendations on detail pages

### Feedback
Report issues or suggest features by contacting:
- **Camille Marquez:** [LinkedIn](https://www.linkedin.com/in/camille-marquez-m-s-76a9391b3/)
- **Jordan Stahl:** [LinkedIn](https://www.linkedin.com/in/jordanstahl/)

---

## Summary

StreamFinder now offers a **complete movie discovery experience**:

1. ✅ Enhanced movie cards with sharing, IMDB links, and platform display
2. ✅ Shareable quiz results that work for Surprise Me mode
3. ✅ Real-time streaming platform availability
4. ✅ Fully responsive design for all devices
5. ✅ Mobile-optimized with native Web Share API

All features are **production-ready** and designed with **user experience** in mind!

---

**Created by:** [Camille Marquez](https://www.linkedin.com/in/camille-marquez-m-s-76a9391b3/) & [Jordan Stahl](https://www.linkedin.com/in/jordanstahl/)

**Last Updated:** December 5, 2025
