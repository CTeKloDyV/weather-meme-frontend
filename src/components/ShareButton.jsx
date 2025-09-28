// src/components/ShareButton.jsx
import React from 'react';
import { theme } from '../styles/theme';

export default function ShareButton({ city }) {
    const handleShare = async () => {
        const url = `${window.location.origin}/?city=${encodeURIComponent(city)}`;
        try {
            await navigator.clipboard.writeText(url);
            alert('Ссылка скопирована в буфер обмена!');
        } catch (err) {
            console.error('Не удалось скопировать:', err);
            alert('Ошибка копирования. Попробуйте вручную.');
        }
    };

    return (
        <button
            onClick={handleShare}
            style={{
                marginTop: theme.spacing.md,
                padding: '10px 20px',
                fontSize: '0.95rem',
                backgroundColor: '#e9ecef',
                color: theme.text,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#dee2e6')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#e9ecef')}
        >
            📤 Поделиться
        </button>
    );
}