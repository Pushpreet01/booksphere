// lib/openLibrary.js
import axios from 'axios';

const API_BASE = 'https://openlibrary.org';

export const searchBooks = async (query) => {
  const res = await axios.get(`${API_BASE}/search.json`, { params: { q: query } });
  return res.data.docs;
};

export const getBookDetails = async (olid) => {
  const res = await axios.get(`${API_BASE}/works/${olid}.json`);
  return res.data;
};
