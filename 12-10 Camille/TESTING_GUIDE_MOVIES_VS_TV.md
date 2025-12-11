# Quick Test Guide - Movies vs TV Shows Feature

## 🎯 Test These Requests

### ✅ TV Show Detection Tests

**Test 1: Basic TV Show Request**
```
Input: "I want to binge a comedy series"
Expected:
✓ Bot says: "...TV shows..." or "...series..."
✓ Results are TV shows (not movies)
✓ Titles like: "The Office", "Friends", "Brooklyn Nine-Nine"
```

**Test 2: Action TV Series**
```
Input: "Show me an action TV show with episodes"
Expected:
✓ Detects: isShowRequest = true
✓ Response mentions "shows" or "series"
✓ Results: Action TV series (not action movies)
```

**Test 3: Binge-Watching**
```
Input: "I'm looking to binge something dramatic"
Expected:
✓ Recognizes "binge" keyword
✓ Shows drama TV shows/series
✓ Not drama movies
```

---

### ✅ Movie Request Tests

**Test 4: Explicit Movie Request**
```
Input: "Show me a good movie"
Expected:
✓ Bot says: "...movies..." or "...films..."
✓ Results are movies (not TV shows)
✓ Titles like: "Inception", "The Shawshank Redemption"
```

**Test 5: Film vs Show**
```
Input: "I want to watch a film tonight"
Expected:
✓ Defaults to movies
✓ Bot response uses "films" or "movies"
✓ Results: Movies only
```

---

### ✅ Streaming Availability Tests

**Test 6: Available on Streaming**
```
Input: "Show me a popular comedy movie"
Expected:
✓ Some cards show: "Watch on: [Netflix] [Hulu]..."
✓ Blue-ish badges with streaming names
✓ Badges are clickable (link to service)
```

**Test 7: Not Available on Streaming**
```
Input: "Recommend something from 2010s"
Expected:
✓ Some results show: "🚫 Not available on streaming"
✓ Red icon (🚫) appears
✓ Grayed out text in muted color
✓ No "Watch on:" section for those items
```

---

### ✅ Mixed/Default Tests

**Test 8: No Content Type Keyword**
```
Input: "Something heartwarming and feel-good"
Expected:
✓ No TV keywords mentioned
✓ Defaults to MOVIES
✓ Bot says: "...movies..." or "...films..."
```

**Test 9: Both Content Types (Movie Wins)**
```
Input: "I want a movie or TV show about action"
Expected:
✓ "movie" keyword detected first
✓ Searches movies (not TV shows)
✓ Returns action movies
```

---

## 📺 All TV Keywords

- "tv show"
- "tv series"
- "series"
- "show"
- "binge"
- "episodes"
- "season"

## 🎬 All Movie Keywords

- "movie"
- "film"
- "watch a film"

---

## 🔍 How to Verify in Browser

### Check Network Traffic:
1. Open DevTools (F12)
2. Go to Network tab
3. Make a request to the chatbot

**For TV Shows, look for:**
```
GET https://api.themoviedb.org/3/discover/tv?...
```

**For Movies, look for:**
```
GET https://api.themoviedb.org/3/discover/movie?...
```

---

### Check Console (F12 → Console):
```javascript
// Type this to see detection:
detectMoodFromUserInput("I want to binge an action show")

// Should return:
{
  mood: "Action Lover",
  genres: [28, 53],
  matchedKeyword: "action",
  contentType: "tv",
  isShowRequest: true
}
```

---

## ✨ Expected Behavior

### Streaming Available
```
[Movie Card]
────────────
Title
⭐ Rating
Plot
💡 Heartwarming
───────────────
📺 Watch on:
[Netflix] [Hulu] [Disney+]
────────────────
❤️ Add to Watchlist | 🔗 IMDb
```

### Streaming Not Available
```
[Movie Card]
────────────
Title
⭐ Rating
Plot
💡 Action Lover
───────────────
🚫 Not available on streaming
────────────────
❤️ Add to Watchlist | 🔗 IMDb
```

---

## 🚀 Quick Test Sequence

1. **TV Test:** Type "I want to binge a comedy" → Press Enter
   - ✅ Should search TV, show series titles

2. **Movie Test:** Type "Show me an action movie" → Press Enter
   - ✅ Should search movies, show film titles

3. **Streaming Test:** Look at results
   - ✅ Some show "Watch on:" badges
   - ✅ Some show "🚫 Not available"

4. **Default Test:** Type "Something romantic" (no content keyword)
   - ✅ Should return movies (default), not TV shows

---

## 🎓 Example Inputs That Work Well

### TV Shows
- "i need a tv show"
- "show me a comedy series"
- "find me episodes to watch"
- "something to binge"
- "action tv show please"
- "what should i binge this weekend?"

### Movies
- "recommend a movie"
- "i want a film"
- "show me a film tonight"
- "find me a movie"

### Both (Ambiguous - Will Default to Movie)
- "something funny"
- "something scary"
- "something romantic"
- "show me drama"

---

## 📊 Status Check

| Feature | Status | How to Test |
|---------|--------|------------|
| TV Detection | ✅ | Say "show" or "series" |
| Movie Default | ✅ | Say "funny" (no TV keyword) |
| API Routing | ✅ | Check Network tab for /tv or /movie |
| Streaming Badge | ✅ | Popular movies show "Watch on" |
| No Streaming | ✅ | Older movies show "🚫 Not available" |
| Bot Response | ✅ | Message should say "shows" or "movies" |

---

All features ready for testing! 🎬 📺 ✅
