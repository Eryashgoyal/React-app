
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [characters, setCharacters] = useState([]);
  const [characterDetails, setCharacterDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCharacterDetails, setShowCharacterDetails] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  useEffect(() => {
    axios.get('https://swapi.dev/api/people/').then((response) => {
      setCharacters(response.data.results);
      setLoading(false);
    });
  }, []);

  const handleCharacterClick = (character) => {
    axios.get(character.url).then((response) => {
      setCharacterDetails(response.data);
      setShowCharacterDetails(true);
    });
  };

  const handleBackButtonClick = () => {
    setShowCharacterDetails(false);
  };

  const toggleFavorite = (character) => {
    const isFavorite = favorites.some((fav) => fav.url === character.url);

    if (isFavorite) {
      const updatedFavorites = favorites.filter((fav) => fav.url !== character.url);
      setFavorites(updatedFavorites);
    } else {
      setFavorites([...favorites, character]);
    }
  };

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Star Wars Characters</h2>
      {!showCharacterDetails && (
        <ul>
          {characters.map((character) => (
            <li key={character.url} onClick={() => handleCharacterClick(character)}>
              {character.name}{' '}
              <span
                style={{ cursor: 'pointer', color: favorites.some((fav) => fav.url === character.url) ? 'red' : 'black' }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(character);
                }}
              >
                ★
              </span>
            </li>
          ))}
        </ul>
      )}
      {showCharacterDetails && characterDetails && (
        <div>
          <h2>{characterDetails.name}</h2>
          <h3>Movies:</h3>
          <ul>
            {characterDetails.films.map((filmUrl) => (
              <Movie key={filmUrl} url={filmUrl} />
            ))}
          </ul>
          <button onClick={handleBackButtonClick}>Back</button>
        </div>
      )}
    </div>
  );
};

const Movie = ({ url }) => {
  const [movieTitle, setMovieTitle] = useState('');

  useEffect(() => {
    axios.get(url).then((response) => {
      setMovieTitle(response.data.title);
    });
  }, [url]);

  return <li>{movieTitle}</li>;
};

export default App;
