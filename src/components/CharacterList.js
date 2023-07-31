
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CharacterList = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  useEffect(() => {
    setLoading(true);
    const url = nextPage || 'https://swapi.dev/api/people/';

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCharacters((prevCharacters) => [...prevCharacters, ...data.results]);
        setNextPage(data.next);
        setLoading(false);
      });
  }, [nextPage]);

  const toggleFavorite = (character) => {
    const updatedFavorites = favorites.includes(character)
      ? favorites.filter((fav) => fav !== character)
      : [...favorites, character];

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Star Wars Characters</h2>
      <ul>
        {characters.map((character) => (
          <li key={character.url}>
            <Link to={`/characters/${character.url.split('/').reverse()[1]}`}>{character.name}</Link>
            <button onClick={() => toggleFavorite(character)}>Favorite</button>
          </li>
        ))}
      </ul>
      {nextPage && <button onClick={() => setNextPage(nextPage)}>Load More</button>}
    </div>
  );
};

export default CharacterList;
