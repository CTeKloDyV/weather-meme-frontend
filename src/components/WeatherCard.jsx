// src/components/WeatherCard.jsx
import React, { useState, useEffect } from 'react';
import { theme } from '../styles/theme';

// Вспомогательные функции
function getWindDirection(deg) {
    if (deg === undefined || deg === null) return '—';
    const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
}

function getWindArrow(deg) {
    if (deg === undefined || deg === null) return '—';
    const arrowDeg = (deg + 180) % 360;
    return (
        <span
            style={{
                display: 'inline-block',
                transform: `rotate(${arrowDeg}deg)`,
                fontSize: '1.2rem',
                marginLeft: '6px'
            }}
        >
      ↑
    </span>
    );
}

function getWindColor(speed) {
    if (speed <= 5) return '#4caf50'; // зелёный
    if (speed <= 10) return '#ffeb3b'; // жёлтый
    return '#f44336'; // красный
}

export default function WeatherCard({ weatherData }) {
    const [shouldShakeTemp, setShouldShakeTemp] = useState(false);

    useEffect(() => {
        if (weatherData && (weatherData.temperature >= 30 || weatherData.temperature <= 0)) {
            setShouldShakeTemp(true);
            const timer = setTimeout(() => setShouldShakeTemp(false), 10000); // 10 сек
            return () => clearTimeout(timer);
        } else {
            setShouldShakeTemp(false);
        }
    }, [weatherData]);

    if (!weatherData) return null;

    const { city, temperature, description, icon, wind, main, meme } = weatherData;

    const isExtreme = temperature >= 30 || temperature <= 0;
    let bgColor = '#ffffff';
    if (temperature >= 30) bgColor = '#fff9f5';
    else if (temperature <= 0) bgColor = '#f8fcff';

    return (
        <div
            style={{
                backgroundColor: bgColor,
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                maxWidth: '500px',
                margin: '20px auto',
                border: '1px solid #eee',
            }}
        >
            <h2 style={{
                fontSize: '1.4rem',
                margin: '0 0 12px',
                color: isExtreme
                    ? (temperature >= 30 ? theme.extremeHot : theme.extremeCold)
                    : theme.text,
                textAlign: 'center'
            }}>
                {city}
            </h2>

            {/* Только температура дрожит */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '8px'
            }}>
                <div
                    className={shouldShakeTemp ? 'temperature-shake' : ''}
                    style={{
                        fontSize: '2.8rem',
                        fontWeight: '700',
                        lineHeight: 1,
                        textAlign: 'center'
                    }}
                >
                    {temperature}°C
                </div>
                {icon && (
                    <img
                        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                        alt="Погода"
                        style={{ width: '50px', height: '50px' }}
                    />
                )}
            </div>

            <p style={{
                fontSize: '1rem',
                color: '#666',
                margin: '4px 0 12px',
                textTransform: 'capitalize',
                textAlign: 'center'
            }}>
                {description}
            </p>

            {/* Влажность */}
            {main?.humidity !== undefined && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    padding: '8px',
                    backgroundColor: '#f0f8ff',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    color: '#2c3e50'
                }}>
                    💧 Влажность: <strong>{main.humidity}%</strong>
                </div>
            )}

            {/* Ветер */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
            }}>
                <div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Ветер</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div
                            style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: getWindColor(wind.speed),
                                border: '1px solid #ddd'
                            }}
                        />
                        <strong>{wind.speed.toFixed(1)} м/с</strong> ({(wind.speed * 3.6).toFixed(0)} км/ч)
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Направление</div>
                    <div>
                        {getWindDirection(wind.deg)} {getWindArrow(wind.deg)}
                    </div>
                </div>
            </div>

            {/* Мем в рамке */}
            {meme && (
                <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    border: '1px solid #eaeaea',
                    maxWidth: '320px',
                    margin: '0 auto'
                }}>
                    <img
                        src={meme.image}
                        alt="Мем"
                        style={{
                            width: '100%',
                            borderRadius: '8px',
                            display: 'block'
                        }}
                    />
                    <p style={{
                        marginTop: '10px',
                        fontSize: '0.95rem',
                        color: '#495057',
                        fontStyle: 'italic',
                        lineHeight: 1.4,
                        textAlign: 'center',
                        margin: 0
                    }}>
                        {meme.text}
                    </p>
                </div>
            )}

            {/* Кнопка "Поделиться" */}
            {meme && (
                <button
                    onClick={() => {
                        const url = `${window.location.origin}/?city=${encodeURIComponent(city)}`;
                        navigator.clipboard.writeText(url).then(() => {
                            alert('Ссылка скопирована!');
                        });
                    }}
                    style={{
                        marginTop: '16px',
                        padding: '8px 16px',
                        fontSize: '0.9rem',
                        backgroundColor: '#e9ecef',
                        color: '#333',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#dee2e6'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#e9ecef'}
                >
                    📤 Поделиться
                </button>
            )}
        </div>
    );
}