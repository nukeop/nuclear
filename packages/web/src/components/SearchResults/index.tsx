import React from 'react';

type SearchResult = {}

type SearchResultsProps = {
  searchResults?: SearchResult[];
  isLoading?: boolean;
};

export const SearchResults: React.FC<SearchResultsProps> = () => <div>
  <h1 className='nuclear'>Search Results</h1>
</div>;
