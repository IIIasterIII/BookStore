"use client"
import React, { useState } from 'react';
import { BiArrowToTop } from "react-icons/bi";
import { BiSolidArrowFromTop } from "react-icons/bi";

type SearchType = 'title' | 'author' | 'genre';

const genres = ['Fantasy', 'Sci-Fi', 'Mystery', 'Romance', 'Horror', 'Non-fiction'];
const authors = ['J.K. Rowling', 'George R.R. Martin', 'Stephen King', 'Jane Austen'];

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('title');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [show, setShow] = useState<boolean>(false)

  const toggleTag = (tag: string, type: 'genre' | 'author') => {
    const set = type === 'genre' ? selectedGenres : selectedAuthors;
    const setter = type === 'genre' ? setSelectedGenres : setSelectedAuthors;

    if (set.includes(tag)) {
      setter(set.filter(item => item !== tag));
    } else {
      setter([...set, tag]);
    }
  };

  const removeTag = (tag: string, type: 'genre' | 'author') => {
    const setter = type === 'genre' ? setSelectedGenres : setSelectedAuthors;
    setter(prev => prev.filter(item => item !== tag));
  };

  const handleSearch = () => {
    const filters = {
      query,
      searchType,
      genres: selectedGenres,
      authors: selectedAuthors,
    };
    console.log('Поиск с фильтрами:', filters);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-4 border rounded-2xl shadow-xl bg-white">
      <div className="flex gap-2 mb-4">
        <select
          className="border rounded px-2 py-2"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as SearchType)}
        >
          <option value="title">Name</option>
          <option value="author">Author</option>
          <option value="genre">Genre</option>
        </select>

        <input
          className="flex-1 border rounded px-3 py-2"
          type="text"
          placeholder="search a book..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Search
        </button>
      </div>

      <button className='cursor-pointer' onClick={() => setShow(prev => !prev)}>{show ? <BiArrowToTop/> : <BiSolidArrowFromTop/>}</button>

      {show && <>

      <div className="mb-4">
        <p className="font-semibold mb-1">Жанры:</p>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <span
              key={genre}
              onClick={() => toggleTag(genre, 'genre')}
              className={`px-3 py-1 rounded-full text-sm cursor-pointer 
                ${selectedGenres.includes(genre) ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {genre}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="font-semibold mb-1">Авторы:</p>
        <div className="flex flex-wrap gap-2">
          {authors.map((author) => (
            <span
              key={author}
              onClick={() => toggleTag(author, 'author')}
              className={`px-3 py-1 rounded-full text-sm cursor-pointer 
                ${selectedAuthors.includes(author) ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {author}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {selectedGenres.map((tag) => (
          <span key={tag} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            {tag}
            <span
              className="ml-1 text-red-600 font-bold cursor-pointer"
              onClick={() => removeTag(tag, 'genre')}
            >
              ×
            </span>
          </span>
        ))}

        {selectedAuthors.map((tag) => (
          <span key={tag} className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
            {tag}
            <span
              className="ml-1 text-red-600 font-bold cursor-pointer"
              onClick={() => removeTag(tag, 'author')}
            >
              ×
            </span>
          </span>
        ))}
      </div>
      </>}
    </div>
  );
};

export default SearchBar;
