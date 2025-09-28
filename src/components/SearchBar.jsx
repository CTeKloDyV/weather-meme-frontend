// src/components/SearchBar.jsx
import React from 'react';
import { theme } from '../styles/theme';

export default function SearchBar({ city, onCityChange, onSearch }) {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') onSearch();
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <input
                type="text"
                placeholder="Город (например, Москва)"
                value={city}
                onChange={(e) => onCityChange(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                    padding: '12px 16px',
                    fontSize: '1rem',
                    width: '100%',
                    maxWidth: '360px',
                    borderRadius: '50px',
                    border: '2px solid #ddd',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                }}
                onFocus={(e) => (e.target.style.borderColor = theme.primary)}
                onBlur={(e) => (e.target.style.borderColor = '#ddd')}
            />
            <button
                onClick={onSearch}
                style={{
                    marginTop: '12px',
                    padding: '10px 24px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    backgroundColor: theme.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    transition: 'background 0.3s',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#3a56e4')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = theme.primary)}
            >
                Узнать погоду 🌤️
            </button>
        </div>
    );
}