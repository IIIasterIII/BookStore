"use server"

import axios from "axios";
import Redis from "ioredis";
let cache: { [key: string]: any } = {};
const CACHE_TTL_SECONDS = 60 * 10; 
const redis = new Redis()

export interface Book {
  id: string;
  title: string;
  authors?: string[];
  thumbnail?: string;
  price: number;
}

export interface GenreBooks {
  genre: string;
  books: Book[];
}

export interface BookDetails {
  id: string;
  title: string;
  description?: string;
  genres: string[];
  authors?: string[];
  publishers?: string[];
  publishDate?: string;
  numberOfPages?: number;
  language?: string;
  isbn10?: string[];
  isbn13?: string[];
  coverLarge?: string;
  coverMedium?: string;
  coverSmall?: string;
  price: number;
}

const genres = [
  "fiction",
  "fantasy",
  "science_fiction",
  "romance",
  "mystery",
  "thriller",
  "history",
  "biography",
  "horror",
  "self_help",
]; 

const getRandomPrice = (min = 5, max = 50): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

const fetchWithCache = async (key: string, fetchFn: () => Promise<any>): Promise<any> => {
  const cachedData = await redis.get(key);

  if (cachedData) {
    console.log("Serving from Redis cache:", key);
    return JSON.parse(cachedData);
  }

  console.log("Fetching from server:", key);
  const data = await fetchFn();
  await redis.set(key, JSON.stringify(data), "EX", CACHE_TTL_SECONDS);

  return data;
};


export const getTopGenresBooks = async (): Promise<GenreBooks[]> => {
  const promises = genres.map(async (genre) => {
    const key = `top-genre-${genre}`;
    return fetchWithCache(key, async () => {
      const url = `https://openlibrary.org/subjects/${genre}.json?limit=3`;
      const { data } = await axios.get(url);
      const books: Book[] = data.works?.map((work: any) => ({
        id: work.key.replace("/works/", ""),
        title: work.title,
        authors: work.authors?.map((a: any) => a.name),
        thumbnail: work.cover_id ? `https://covers.openlibrary.org/b/id/${work.cover_id}-M.jpg` : undefined,
        price: getRandomPrice(),
      })) ?? [];

      return { genre, books };
    });
  });

  return await Promise.all(promises);
};

export const getBooksByGenre = async (genre: string, limit: number = 5): Promise<Book[]> => {
  const cacheKey = `${genre}-${limit}`;
  const now = Date.now();

  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_TTL_SECONDS) {
    console.log("Serving from cache:", cacheKey);
    return cache[cacheKey].data;
  }

  try {
    const url = `https://openlibrary.org/subjects/${genre}.json?limit=${limit}`;
    const { data } = await axios.get(url);

    const books: Book[] = data.works?.map((work: any) => ({
      id: work.key.replace("/works/", ""),
      title: work.title,
      authors: work.authors?.map((a: any) => a.name),
      thumbnail: work.cover_id
        ? `https://covers.openlibrary.org/b/id/${work.cover_id}-M.jpg`
        : undefined,
      price: getRandomPrice(),
    })) ?? [];

    cache[cacheKey] = {
      data: books,
      timestamp: now,
    };

    return books;
  } catch (error) {
    console.error(`Failed to fetch books for genre "${genre}":`, error);
    return [];
  }
};

export const getTopHarryPotterBook = async (): Promise<Book | null> => {
  const cacheKey = 'top-harry-potter';
  const now = Date.now();

  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_TTL_SECONDS) {
    console.log("Serving from cache:", cacheKey);
    return cache[cacheKey].data;
  }

  try {
    const { data } = await axios.get(
      'https://openlibrary.org/search.json?q=harry+potter&limit=50'
    );

    const filtered = data.docs.filter((doc: any) =>
      doc.title.toLowerCase().includes("harry potter") &&
      doc.author_name?.some((name: string) =>
        name.toLowerCase().includes("rowling")
      ) &&
      doc.cover_i
    );

    const topBookDoc = filtered.sort(
      (a: any, b: any) => (b.edition_count ?? 0) - (a.edition_count ?? 0)
    )[0];

    if (!topBookDoc) return null;

    const topBook: Book = {
      id: topBookDoc.key.replace("/works/", ""),
      title: topBookDoc.title,
      authors: topBookDoc.author_name,
      thumbnail: `https://covers.openlibrary.org/b/id/${topBookDoc.cover_i}-L.jpg`,
      price: getRandomPrice(),
    };

    cache[cacheKey] = {
      data: topBook,
      timestamp: now,
    };

    return topBook;
  } catch (error) {
    console.error("Failed to fetch top Harry Potter book:", error);
    return null;
  }
};

export const getBookDetails = async (id: string): Promise<BookDetails | null> => {
  const cacheKey = `book-details-${id}`;
  const now = Date.now();
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_TTL_SECONDS) {
    console.log("Serving from cache:", cacheKey);
    return cache[cacheKey].data;
  }

  try {
    const { data: workData } = await axios.get(`https://openlibrary.org/works/${id}.json`);

    const authorNames = await Promise.all(
      (workData.authors || []).map(async (authorRef: any) => {
        const authorId = authorRef.author.key;
        const authorData = await axios.get(`https://openlibrary.org${authorId}.json`);
        return authorData.data.name;
      })
    );

    const editionsRes = await axios.get(`https://openlibrary.org/works/${id}/editions.json?limit=1`);
    const edition = editionsRes.data.entries?.[0];

    const publishers = edition?.publishers || [];
    const publishDate = edition?.publish_date;
    const numberOfPages = edition?.number_of_pages;
    const language = edition?.languages?.[0]?.key?.replace("/languages/", "");
    const isbn10 = edition?.isbn_10;
    const isbn13 = edition?.isbn_13;

    const subjects: string[] = workData.subjects || [];
    const genres = subjects?.filter((s: string) =>
      ["fiction", "fantasy", "romance", "mystery", "science fiction", "horror", "thriller", "history", "biography", "self-help"]
        .some(g => s.toLowerCase().includes(g))
    );

    const coverId = workData.covers?.[0];
    const price = getRandomPrice();

    const bookDetails: BookDetails = {
      id,
      title: workData.title,
      description: typeof workData.description === "string"
        ? workData.description
        : workData.description?.value,
      genres,
      authors: authorNames,
      publishers,
      publishDate,
      numberOfPages,
      language,
      isbn10,
      isbn13,
      coverLarge: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : undefined,
      coverMedium: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : undefined,
      coverSmall: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-S.jpg` : undefined,
      price,
    };

    cache[cacheKey] = { data: bookDetails, timestamp: now };
    return bookDetails;
  } catch (error) {
    console.error(`Failed to fetch book details for ID ${id}:`, error);
    return null;
  }
};

export const getTopAuthorBooks = async (authors: string[]): Promise<GenreBooks[]> => {
  const now = Date.now();

  const promises = authors.map(async (authorName) => {
    const cacheKey = `author-books-${authorName}`;
    if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_TTL_SECONDS) {
      console.log("Serving from cache:", cacheKey);
      return { genre: authorName, books: cache[cacheKey].data };
    }

    try {
      const res = await fetch(`/api/books/author?author=${encodeURIComponent(authorName)}&limit=3`);
      const data = await res.json();

      const books: Book[] = data.docs?.map((doc: any) => ({
        id: doc.key.replace("/works/", ""),
        title: doc.title,
        authors: doc.author_name,
        thumbnail: doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
          : undefined,
        price: getRandomPrice(),
      })) ?? [];

      cache[cacheKey] = { data: books, timestamp: now };
      return { genre: authorName, books };
    } catch (error) {
      console.error(`Failed to fetch books for author "${authorName}":`, error);
      return { genre: authorName, books: [] };
    }
  });

  return await Promise.all(promises);
};

const fetchBooksWithCache = async (key: string, url: string): Promise<Book[]> => {
  const now = Date.now();
  if (cache[key] && now - cache[key].timestamp < CACHE_TTL_SECONDS) {
    console.log("Serving from cache:", key);
    return cache[key].data;
  }

  try {
    const { data } = await axios.get(url);
    const books: Book[] = data.works?.map((work: any) => ({
      id: work.key.replace("/works/", ""),
      title: work.title,
      authors: work.authors?.map((a: any) => a.name),
      thumbnail: work.cover_id
        ? `https://covers.openlibrary.org/b/id/${work.cover_id}-M.jpg`
        : undefined,
      price: getRandomPrice(),
    })) ?? [];

    cache[key] = { data: books, timestamp: now };
    return books;
  } catch (error) {
    console.error(`Failed to fetch books from ${url}`, error);
    return [];
  }
};

export const getRecommendedBooks = async (): Promise<Book[]> => {
  return fetchBooksWithCache("recommended-fiction", `https://openlibrary.org/subjects/fiction.json?limit=15`);
};

export const getUpcomingBooks = async (): Promise<Book[]> => {
  return fetchBooksWithCache("upcoming-scifi", `https://openlibrary.org/subjects/science_fiction.json?limit=15&offset=10`);
};

export const getBestBooksOfMonth = async (): Promise<Book[]> => {
  return fetchBooksWithCache("best-month-mystery", `https://openlibrary.org/subjects/mystery.json?limit=15&offset=20`);
};
