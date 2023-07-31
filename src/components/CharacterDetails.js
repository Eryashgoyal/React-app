// src/components/CharacterDetails.js
import React, { useEffect, useState } from 'react';

const CharacterDetails = ({ match }) => {
  const [character, setCharacter] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const characterId = match.params.id;
    const characterUrl = `https://swapi.dev/api/people/${characterId}/`;

    fetch(characterUrl)
      .then((response) => response.json())
      .then((data) => {
        setCharacter(data);
        return data.films;
      })
      .then((filmUrls) => {
        return Promise.all(filmUrls.map((url) => fetch(url).then((response) => response.json())));
      })
      .then((filmsData) => {
        setMovies(filmsData);
        setLoading(false);
      });
  }, [match.params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{character.name}</h2>
      <h3>Movies:</h3>
      <ul>
        {movies.map((movie) => (
          <li key={movie.url}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default CharacterDetails;
