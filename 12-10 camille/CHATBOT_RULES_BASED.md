# Rules-Based Chatbot Implementation

## Overview
The chatbot has been converted from a Gemini AI-based system to a **rules-based bot that uses TMDB API directly**. This approach is:
- ✅ No external AI service required
- ✅ No API keys to manage
- ✅ Faster response times
- ✅ More reliable and predictable
- ✅ Uses the same TMDB API already integrated in the app

## How It Works

### 1. **Pattern Matching Rules** (`CHATBOT_RULES.patterns`)
The chatbot analyzes user input against predefined keyword patterns:

```javascript
{
  keywords: ['action', 'fight', 'adrenaline', 'explosive', 'thrill'],
  genres: [28, 53],  // Action, Thriller
  mood: 'Action Lover'
}
```

**Supported Moods:**
- 🎬 Action Lover
- 😂 Comedy Fan
- 💕 Romantic
- 👻 Horror Fan
- 🎭 Drama Lover
- 🚀 Sci-Fi Fan
- 🗺️ Adventurer
- 🎨 Animation Fan
- 📚 Documentary Watcher
- 🕵️ Mystery Lover
- 👨‍👩‍👧‍👦 Family Movie Watcher
- 📜 History Enthusiast

### 2. **User Input Analysis**
Function: `detectMoodFromUserInput(userMessage)`

- Converts user message to lowercase
- Checks for keyword matches against all rules
- Returns: `{ mood, genres, matchedKeyword }`
- Falls back to default (Action/Comedy/Drama mix) if no match

### 3. **Bot Response Generation**
Function: `generateBotResponse(detectedMood)`

- Selects a random friendly response based on detected mood
- Provides context-specific encouragement (e.g., "💥 Here are some adrenaline-pumping films!")

### 4. **TMDB Movie Search**
Function: `searchMoviesByRules(genreIds, mood)`

- Uses `/discover/movie` endpoint with detected genres
- Filters by:
  - Genres (from rules)
  - Popularity sorting
  - Vote count >= 50 (quality filter)
  - Include adult = false
- Returns top 5 movies

### 5. **Movie Enrichment**
Function: `enrichMovieData(movie)` - already exists

- Fetches cast information
- Fetches streaming providers
- Fetches IMDb links
- Enhancements are cached in memory

### 6. **Display Results**
Function: `displayChatbotMovieResults(movies, mood)`

- Shows movies in grid layout
- Adds a mood indicator badge to each card
- Displays: "💡 **Action Lover**" above each recommendation

## Adding New Moods

To add a new mood, simply add it to `CHATBOT_RULES.patterns`:

```javascript
{
  keywords: ['western', 'cowboy', 'outlaw', 'gunslinger'],
  genres: [37],  // Western
  mood: 'Western Fan'
},
```

Then add responses in `generateBotResponse`:

```javascript
'Western Fan': [
  "🤠 Here are some classic western films!",
  "⚔️ Saddle up! Here are epic western movies!",
]
```

## Data Flow

```
User types message
    ↓
detectMoodFromUserInput()
    ↓
generateBotResponse() → Display in chat
    ↓
searchMoviesByRules() → TMDB API
    ↓
enrichMovieData() → Get cast, providers, IMDb links
    ↓
displayChatbotMovieResults() → Display movie grid
```

## Key Differences from Gemini Version

| Aspect | Old (Gemini) | New (Rules-Based) |
|--------|--------------|------------------|
| **AI Engine** | Gemini API | Rules + TMDB API |
| **API Keys** | Requires Gemini key | Uses existing TMDB key |
| **Response Time** | 2-5 seconds | < 1 second |
| **Reliability** | Dependent on external service | 100% local rules |
| **Cost** | Billable (Gemini) | Free (TMDB) |
| **Movie Source** | Text-based search | Direct TMDB genre match |

## Testing

To test the chatbot:

1. Click "AI Picks" tab
2. Type any of these example inputs:
   - "I want something funny and lighthearted"
   - "Show me an action movie"
   - "I'm in the mood for a scary horror film"
   - "Find me a romantic movie for date night"
   - "I want to learn something - documentary?"

3. Bot responds with relevant movies from TMDB
4. Each recommendation shows the detected mood and provides movie cards with full details

## No Configuration Needed

✅ **No setup required** - The chatbot works out of the box with your existing TMDB API token and application structure.
