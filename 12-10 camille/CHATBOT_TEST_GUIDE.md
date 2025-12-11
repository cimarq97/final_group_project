# Rules-Based Chatbot - Test Guide

## Quick Start

1. Open the app and click the **"AI Picks"** tab (robot icon in navigation)
2. Type a message describing what kind of movie you want
3. The bot will analyze your input and recommend movies from TMDB

## Test Cases

### Test 1: Action Movies
**Input:** "I want something with lots of action and explosions"
**Expected:** Bot detects "Action Lover" mood, searches for action/thriller films
**Genres:** Action (28), Thriller (53)

### Test 2: Comedy
**Input:** "Make me laugh! I need a funny movie"
**Expected:** Bot detects "Comedy Fan" mood
**Genres:** Comedy (35)

### Test 3: Romantic Films
**Input:** "Looking for something romantic and sweet"
**Expected:** Bot detects "Romantic" mood
**Genres:** Romance (10749)

### Test 4: Horror
**Input:** "Show me a scary horror movie"
**Expected:** Bot detects "Horror Fan" mood
**Genres:** Horror (27)

### Test 5: Drama
**Input:** "I want an emotional, powerful drama"
**Expected:** Bot detects "Drama Lover" mood
**Genres:** Drama (18)

### Test 6: Sci-Fi
**Input:** "Give me a futuristic sci-fi movie"
**Expected:** Bot detects "Sci-Fi Fan" mood
**Genres:** Sci-Fi (878)

### Test 7: Adventure
**Input:** "I'm feeling adventurous and want an epic journey"
**Expected:** Bot detects "Adventurer" mood
**Genres:** Adventure (12)

### Test 8: Animation
**Input:** "Show me an animated movie"
**Expected:** Bot detects "Animation Fan" mood
**Genres:** Animation (16)

### Test 9: Documentary
**Input:** "I want to learn something - any good documentaries?"
**Expected:** Bot detects "Documentary Watcher" mood
**Genres:** Documentary (99)

### Test 10: Mystery/Thriller
**Input:** "I love mystery stories and plot twists"
**Expected:** Bot detects "Mystery Lover" mood
**Genres:** Mystery (9648), Thriller (53)

### Test 11: Family-Friendly
**Input:** "Looking for something the whole family can enjoy"
**Expected:** Bot detects "Family Movie Watcher" mood
**Genres:** Family (10751)

### Test 12: Historical
**Input:** "Show me a great historical drama"
**Expected:** Bot detects "History Enthusiast" mood
**Genres:** War (10752), History (36)

### Test 13: Unknown/Default
**Input:** "Just show me something good"
**Expected:** Bot detects "Movie Enthusiast" (default), searches broad mix (Action/Comedy/Drama)
**Genres:** [28, 35, 18]

## Expected Behavior

### Chat Display
- User message appears with "👤 You" label
- Bot response appears with "🤖 StreamFinder" label
- Messages stack vertically in the chat area
- Chat auto-scrolls to show newest messages

### Movie Results
- 5 movies displayed in a grid below chat
- Each card shows:
  - Poster image
  - Title
  - Release year
  - Rating
  - Overview
  - **Mood badge** (e.g., "💡 Action Lover")
  - Streaming availability
  - Action buttons (favorite, share, IMDb)

### Loading States
- "Finding movies..." spinner shown while searching TMDB
- Chat remains interactive
- Results replace loading state when ready

## Known Limitations

- Bot only detects first matching mood (uses keyword matching, not NLP)
- Limited to 5 result movies (customizable in searchMoviesByRules)
- Only searches TMDB discovered movies with 50+ votes
- Does not understand complex context (e.g., "opposite of action" won't work)

## Customization

### Add New Mood
Edit `CHATBOT_RULES.patterns` in script.js:
```javascript
{ 
  keywords: ['thriller', 'suspenseful', 'tense'], 
  genres: [53],
  mood: 'Thriller Enthusiast' 
}
```

### Add New Response
Edit `generateBotResponse` in script.js:
```javascript
'Thriller Enthusiast': [
  "😨 Here are some edge-of-your-seat thrillers!",
  "⏱️ Heart-pounding films coming up!"
]
```

### Change Number of Results
Edit `searchMoviesByRules` function:
```javascript
const topMovies = data.results.slice(0, 10);  // Change 5 to 10 for more results
```

## Troubleshooting

**Issue:** No movies appear
- Check browser console for TMDB API errors
- Verify TMDB_V4_TOKEN is valid in script.js
- Try a different keyword (some genres might have fewer results)

**Issue:** Bot doesn't recognize input
- Currently uses keyword matching, not NLP
- Try using words from the keywords list in CHATBOT_RULES
- Check console for error messages

**Issue:** Movies not loading
- Check Network tab in browser DevTools
- Verify TMDB API token
- Check if enrichMovieData() is completing successfully
