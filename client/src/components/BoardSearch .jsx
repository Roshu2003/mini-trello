import React, { useState, useEffect } from "react";
import API from "../api/axios";

const BoardSearch = ({ boardId, onResults }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      onResults([]); // clear results
      return;
    }

    setLoading(true);
    try {
      const res = await API.get(`/boards/${boardId}/cards/search`, {
        params: { query },
      });
      onResults(res.data.data);
    } catch (err) {
      console.error("Search error:", err);
      onResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch();
    }, 300); // debounce 300ms

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className='flex justify-center'>
      <div className='relative w-full max-w-md'>
        <svg
          className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z'
          />
        </svg>
        <input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search cards by title, labels, or assignees...'
          className='bg-white border border-gray-300 p-2 pl-10 rounded-lg w-full max-w-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-sm shadow-sm hover:shadow-md'
          aria-label='Search cards'
        />
      </div>
    </div>
  );
};

export default BoardSearch;
