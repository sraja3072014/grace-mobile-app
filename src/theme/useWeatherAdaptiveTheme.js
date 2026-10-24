import { useCallback, useEffect, useState } from 'react'
import { getThemeByTemperature } from './weatherThemes'

const DEFAULT_LATITUDE = 11.0168
const DEFAULT_LONGITUDE = 76.9558

export function useWeatherAdaptiveTheme() {
  const [temperature, setTemperature] = useState(31)
  const [loading, setLoading] = useState(false)
  const [locationName, setLocationName] = useState('Default Sensor')
  const [manualOverride, setManualOverride] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchLiveWeather = useCallback(
    async (lat = DEFAULT_LATITUDE, lon = DEFAULT_LONGITUDE, signal) => {
      setLoading(true)

      try {
        const params = new URLSearchParams({
          latitude: String(lat),
          longitude: String(lon),
          current: 'temperature_2m',
        })
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params}`,
          { signal },
        )

        if (!response.ok) {
          throw new Error(`Weather request failed: ${response.status}`)
        }

        const data = await response.json()
        const liveTemperature = data?.current?.temperature_2m

        if (!Number.isFinite(liveTemperature)) {
          throw new Error('Weather response did not contain a valid temperature')
        }

        if (!signal?.aborted) {
          setTemperature(Math.round(liveTemperature))
          setLocationName('Live Telemetry')
        }
      } catch {
        if (!signal?.aborted) {
          setLocationName('Fallback Offline')
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false)
        }
      }
    },
    [],
  )

  useEffect(() => {
    if (manualOverride) return

    const controller = new AbortController()
    let isActive = true
    let fallbackTimer

    const fetchDefaultWeather = () => {
      if (isActive) {
        fetchLiveWeather(DEFAULT_LATITUDE, DEFAULT_LONGITUDE, controller.signal)
      }
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          if (isActive) {
            fetchLiveWeather(coords.latitude, coords.longitude, controller.signal)
          }
        },
        fetchDefaultWeather,
      )
    } else {
      fallbackTimer = window.setTimeout(fetchDefaultWeather, 0)
    }

    return () => {
      isActive = false
      window.clearTimeout(fallbackTimer)
      controller.abort()
    }
  }, [fetchLiveWeather, manualOverride, refreshKey])

  const setManualTemp = useCallback((temp) => {
    setManualOverride(true)
    setTemperature(temp)
    setLocationName('Manual Override')
    setLoading(false)
  }, [])

  const resetToLive = useCallback(() => {
    setManualOverride(false)
    setRefreshKey((key) => key + 1)
  }, [])

  return {
    temperature,
    theme: getThemeByTemperature(temperature),
    loading,
    locationName,
    manualOverride,
    setManualTemp,
    resetToLive,
  }
}
