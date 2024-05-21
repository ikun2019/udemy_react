import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    // * tokenの有効時間を設定
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    // * tokenをローカルストレージに保存
    localStorage.setItem(
      'userData',
      JSON.stringify({ userId: uid, token: token, expiration: tokenExpirationDate.toISOString() })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem('userData');
  }, []);

  // * 自動的にログアウトする機能
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  // * tokenが有効であれば自動的にログインする機能
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userid, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  return { token, login, logout, userId };
};