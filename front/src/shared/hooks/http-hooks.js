import { useCallback, useEffect, useRef, useState } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequest = useRef([]);

  const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    setIsLoading(true);
    const httpAbortCtrll = new AbortController();
    activeHttpRequest.current.push(httpAbortCtrll);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
        signal: httpAbortCtrll.signal,
      });
      console.log('response =>', response);
      const responseData = await response.json();

      activeHttpRequest.current = activeHttpRequest.current.filter(reqCtrl => reqCtrl !== httpAbortCtrll);

      if (!response.ok) {
        throw new Error(responseData.message);
      };
      setIsLoading(false);
      return responseData;
    } catch (error) {
      setError(error.message || 'Something went wrong.');
      setIsLoading(false);
      throw error;
    }
  }, []);

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
    clearError,
  };
};
