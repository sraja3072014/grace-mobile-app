// src/hooks/useWeatherEngine.js
import { useState, useEffect, useCallback } from 'react';
import { THEME_PALETTES } from '../constants/themeTokens';

export function useWeatherEngine(defaultAdaptive = true) {
  const [isLiveAdaptive, setIsLiveAdaptive] = useState(defaultAdaptive);
  const [activeThemeKey, setActiveThemeKey] = useState('sunny_bright');
  const [isSyncingWeather, setIsSyncingWeather] = useState(false);

  // பின்னணியில் வானிலையைக் கண்டறியும் செயல்முறை
  const syncLiveWeatherAtmosphere = useCallback(async (lat = 11.0168, lon = 76.9558) => {
    try {
      setIsSyncingWeather(true);
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code,is_day`
      );
      const data = await res.json();
      
      const isDay = data?.current?.is_day ?? 1;
      const weatherCode = data?.current?.weather_code ?? 0;

      // இரவு நேரம்
      if (isDay === 0) {
        setActiveThemeKey('night');
      } 
      // மழை / இடிமின்னல்
      else if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 99)) {
        setActiveThemeKey('rainy');
      } 
      // மேகமூட்டம் / அந்திப்பொழுது
      else if (weatherCode >= 1 && weatherCode <= 48) {
        setActiveThemeKey('cloudy_muted');
      } 
      // தெளிவான வெயில்
      else {
        setActiveThemeKey('sunny_bright');
      }
    } catch {
      // ஆஃப்லைன் அல்லது பிழை ஏற்பட்டால் நேரத்தைக் கொண்டு கணிப்பது
      const hour = new Date().getHours();
      if (hour >= 18 || hour < 6) setActiveThemeKey('night');
      else setActiveThemeKey('sunny_bright');
    } finally {
      setIsSyncingWeather(false);
    }
  }, []);

  useEffect(() => {
    if (!isLiveAdaptive) return;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => syncLiveWeatherAtmosphere(pos.coords.latitude, pos.coords.longitude),
        () => syncLiveWeatherAtmosphere()
      );
    } else {
      syncLiveWeatherAtmosphere();
    }
  }, [isLiveAdaptive, syncLiveWeatherAtmosphere]);

  const currentTheme = THEME_PALETTES[activeThemeKey] || THEME_PALETTES.sunny_bright;

  return {
    isLiveAdaptive,
    setIsLiveAdaptive,
    activeThemeKey,
    setActiveThemeKey,
    currentTheme,
    isSyncingWeather,
    refreshWeather: syncLiveWeatherAtmosphere
  };
}