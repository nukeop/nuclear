import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useSearch = () => {
  const navigate = useNavigate();

  const onSearch = useCallback((terms: string) => {
    navigate('/search/' + encodeURIComponent(terms));
  }, []);

  return {
    onSearch
  };
};
