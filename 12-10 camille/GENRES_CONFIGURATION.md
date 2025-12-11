# TMDB Genres Configuration

## Overview
The application now supports all standard TMDB genres for both movies and TV shows. The `GENRE_NAMES` object in `script.js` (lines 109-142) contains a comprehensive mapping of TMDB genre IDs to human-readable genre names.

## Available Movie Genres (18 total)

| ID | Genre |
|---|---|
| 28 | Action |
| 12 | Adventure |
| 16 | Animation |
| 35 | Comedy |
| 80 | Crime |
| 99 | Documentary |
| 18 | Drama |
| 10751 | Family |
| 14 | Fantasy |
| 36 | History |
| 27 | Horror |
| 10402 | Music |
| 9648 | Mystery |
| 10749 | Romance |
| 878 | Science Fiction |
| 10770 | TV Movie |
| 53 | Thriller |
| 10752 | War |
| 37 | Western |

## Available TV Genres (14 total, some overlap with movies)

| ID | Genre |
|---|---|
| 10759 | Action & Adventure |
| 16 | Animation |
| 35 | Comedy |
| 80 | Crime |
| 99 | Documentary |
| 18 | Drama |
| 10751 | Family |
| 10762 | Kids |
| 9648 | Mystery |
| 10763 | News |
| 10764 | Reality |
| 10765 | Sci-Fi & Fantasy |
| 10766 | Soap |
| 10767 | Talk |
| 10768 | War & Politics |

## Implementation Details

### Location
- **File**: `script.js`
- **Lines**: 109-142
- **Object Name**: `GENRE_NAMES`

### How It Works
The `GENRE_NAMES` object maps TMDB genre IDs (numbers) to display names (strings):

```javascript
const GENRE_NAMES = {
    28: "Action",
    12: "Adventure",
    // ... etc
}
```

### Usage in Application

**1. Genre Display in Watchlist**
```javascript
const genreName = GENRE_NAMES[gId] || "Uncategorized";
```
Used in `renderCategorizedFavorites()` to display genre names when organizing favorites.

**2. Genre Filtering**
```javascript
const passesGenre = favoritesFilters.genre === 'all' || 
                    (movie.genre_ids && movie.genre_ids.includes(parseInt(favoritesFilters.genre)));
```
Used to filter favorites by selected genre.

**3. Genre Selection in Quiz**
```javascript
selectedGenreNames = finalGenreIds.map(id => GENRE_NAMES[id]).filter(Boolean);
```
Used to display selected genres in the quiz.

## Integration with Watchlist Page

The genre filter dropdown on the "My Watchlist" page automatically populates with all genres found in the user's saved favorites using `populateFavoriteFilters()` function.

### Filter Dropdown Behavior
- **Default Option**: "All Genres"
- **Populated Genres**: Only genres that have at least one saved movie/show
- **Fallback**: Shows "Uncategorized" for any genre ID not in GENRE_NAMES

## Notes

- TMDB uses the same genre IDs globally for their API
- Some genres are exclusive to TV shows (Kids, News, Reality, Soap, Talk, War & Politics)
- Some genres are exclusive to movies (Music, TV Movie)
- Some genres appear in both movies and TV (Animation, Comedy, Crime, Documentary, Drama, Family, Mystery)
- The watchlist filter will only show genres that have content saved in the user's watchlist
- Genre IDs come directly from TMDB API responses in the `genre_ids` array on each movie/show object

## Future Enhancements

1. **Fetch Genres Dynamically**: Could fetch genre list from TMDB API at startup for complete accuracy
2. **TV Show Support**: Separate `GENRE_NAMES_TV` for TV-specific genres
3. **Multi-Genre Filtering**: Allow filtering by multiple genres simultaneously
4. **Genre Statistics**: Show count of items in each genre
