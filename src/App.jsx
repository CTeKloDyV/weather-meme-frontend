// src/App.jsx
import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import AdminPanel from './components/AdminPanel';
import './styles/global.css';

function App() {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showAdmin, setShowAdmin] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL;

    const loadWeather = async (cityName) => {
        if (!cityName.trim()) return;
        setLoading(true);
        setWeatherData(null);
        try {
            const response = await fetch(`${API_URL}/weather?city=${encodeURIComponent(cityName)}`);
            const data = await response.json();
            if (response.ok) {
                setWeatherData(data);
                setCity(cityName);
            } else {
                alert(data.error || 'Не удалось загрузить погоду');
            }
        } catch (err) {
            console.error('Ошибка:', err);
            alert('Ошибка подключения. Убедись, что бэкенд запущен!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const cityFromUrl = urlParams.get('city');
        if (cityFromUrl) {
            loadWeather(cityFromUrl);
        }
    }, []);

    const handleSearch = () => {
        loadWeather(city);
    };

    return (
        <div className="app-container" style={{ position: 'relative' }}>
            <h1 className="title">🌤️ Погода + Мемы</h1>

            <button
                onClick={() => setShowAdmin(true)}
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: '8px 16px',
                    fontSize: '0.9rem',
                    backgroundColor: '#4361ee',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    zIndex: 1000,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}
            >
                🛠️ Админка
            </button>

            <SearchBar
                city={city}
                onCityChange={setCity}
                onSearch={handleSearch}
            />

            {showAdmin && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        width: '520px',
                        height: '100%',
                        backgroundColor: 'white',
                        zIndex: 1002,
                        boxShadow: '-4px 0 12px rgba(0,0,0,0.15)',
                        overflowY: 'auto'
                    }}
                >
                    <button
                        onClick={() => setShowAdmin(false)}
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            background: '#f1f3f5',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ✕
                    </button>
                    <div style={{ padding: '20px', marginTop: '16px' }}>
                        <AdminPanel />
                    </div>
                </div>
            )}

            {loading && <p style={{ textAlign: 'center', color: '#666' }}>Загрузка...</p>}
            <WeatherCard weatherData={weatherData} />
        </div>
    );
}

export default App;