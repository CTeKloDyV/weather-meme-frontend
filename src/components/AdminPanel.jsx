// src/components/AdminPanel.jsx
import React, { useState, useEffect, useRef } from 'react';

export default function AdminPanel() {
    const [category, setCategory] = useState('normal');
    const [imageFile, setImageFile] = useState(null);
    const [text, setText] = useState('');
    const [status, setStatus] = useState('');
    const [memes, setMemes] = useState({});
    const fileInputRef = useRef(null);

    // Загружаем список мемов при открытии админки
    useEffect(() => {
        fetch('http://localhost:5000/memes-list')
            .then((res) => {
                if (!res.ok) throw new Error('Не удалось загрузить мемы');
                return res.json();
            })
            .then((data) => setMemes(data))
            .catch((err) => {
                console.error(err);
                setStatus('❌ Ошибка загрузки мемов');
            });
    }, []);

    // Обновление списка мемов
    const refreshMemes = () => {
        fetch('http://localhost:5000/memes-list')
            .then((res) => res.json())
            .then(setMemes)
            .catch(console.error);
    };

    // Добавление мема
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');

        if (!imageFile) {
            setStatus('❌ Выберите изображение');
            return;
        }

        const formData = new FormData();
        formData.append('category', category);
        formData.append('text', text);
        formData.append('image', imageFile);

        try {
            const response = await fetch('http://localhost:5000/memes', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('✅ Мем успешно добавлен!');
                setImageFile(null);
                setText('');
                if (fileInputRef.current) fileInputRef.current.value = '';
                refreshMemes(); // обновить список
            } else {
                setStatus(`❌ Ошибка: ${data.error || 'Неизвестная ошибка'}`);
            }
        } catch (err) {
            console.error(err);
            setStatus('❌ Не удалось подключиться к серверу');
        }
    };

    // Удаление мема
    const handleDelete = async (cat, index) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот мем?')) return;

        try {
            const response = await fetch(`http://localhost:5000/memes/${cat}/${index}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('🗑️ Мем удалён');
                refreshMemes();
            } else {
                setStatus(`❌ Ошибка: ${data.error || 'Не удалось удалить'}`);
            }
        } catch (err) {
            console.error(err);
            setStatus('❌ Ошибка подключения');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Пожалуйста, выберите изображение (jpg, png, gif)');
                return;
            }
            setImageFile(file);
        }
    };

    return (
        <div
            style={{
                backgroundColor: '#ffffff',
                padding: '24px',
                borderRadius: '16px',
                maxWidth: '520px',
                margin: '30px auto',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #eaeaea',
            }}
        >
            <h3
                style={{
                    marginBottom: '20px',
                    textAlign: 'center',
                    color: '#2c3e50',
                    fontWeight: '600',
                    fontSize: '1.3rem',
                }}
            >
                🛠️ Админка: Мемы
            </h3>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#34495e',
                        }}
                    >
                        Категория (по температуре):
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            border: '1px solid #ced4da',
                            backgroundColor: '#fafafa',
                            fontSize: '1rem',
                        }}
                    >
                        <option value="hot">🔥 Жарко (≥30°C)</option>
                        <option value="warm">☀️ Тёпло (20–29°C)</option>
                        <option value="normal">🌤️ Нормально (10–19°C)</option>
                        <option value="cool">🌬️ Прохладно (0–9°C)</option>
                        <option value="cold">❄️ Холодно (≤0°C)</option>
                    </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#34495e',
                        }}
                    >
                        Загрузить изображение:
                    </label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px dashed #bdc3c7',
                            borderRadius: '8px',
                            backgroundColor: '#f8f9fa',
                        }}
                    />
                    {imageFile && (
                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                            <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Предпросмотр"
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                }}
                            />
                            <p
                                style={{
                                    fontSize: '0.85rem',
                                    color: '#7f8c8d',
                                    marginTop: '4px',
                                }}
                            >
                                {imageFile.name}
                            </p>
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#34495e',
                        }}
                    >
                        Текст мема:
                    </label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Когда на улице +35, а ты без кондиционера..."
                        required
                        rows="3"
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            border: '1px solid #ced4da',
                            fontSize: '1rem',
                            resize: 'vertical',
                            backgroundColor: '#fafafa',
                        }}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#4361ee',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#3a56e4')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#4361ee')}
                >
                    ➕ Добавить мем
                </button>

                {status && (
                    <p
                        style={{
                            marginTop: '14px',
                            textAlign: 'center',
                            color: status.includes('✅') || status.includes('🗑️') ? '#27ae60' : '#e74c3c',
                            fontWeight: '500',
                        }}
                    >
                        {status}
                    </p>
                )}
            </form>

            {/* Таблица всех мемов */}
            <div style={{ marginTop: '30px' }}>
                <h4 style={{ marginBottom: '16px', color: '#2c3e50', textAlign: 'center' }}>
                    📋 Все мемы
                </h4>

                {Object.values(memes).some(cat => cat && cat.length > 0) ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Категория</th>
                                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Изображение</th>
                                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Текст</th>
                                <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Действие</th>
                            </tr>
                            </thead>
                            <tbody>
                            {['hot', 'warm', 'normal', 'cool', 'cold'].flatMap(cat =>
                                    (memes[cat] || []).map((meme, i) => (
                                        <tr key={`${cat}-${i}`} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '12px 10px', verticalAlign: 'top' }}>
                  <span
                      style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: '500',
                          color: cat === 'hot' ? '#e74c3c' :
                              cat === 'cold' ? '#3498db' : '#2c3e50'
                      }}
                  >
                    {cat === 'hot' && '🔥'}
                      {cat === 'warm' && '☀️'}
                      {cat === 'normal' && '🌤️'}
                      {cat === 'cool' && '🌬️'}
                      {cat === 'cold' && '❄️'}
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </span>
                                            </td>
                                            <td style={{ padding: '12px 10px', verticalAlign: 'top', width: '100px' }}>
                                                <img
                                                    src={meme.image.startsWith('http') ? meme.image : `http://localhost:5000${meme.image}`}
                                                    alt="Мем"
                                                    style={{
                                                        width: '80px',
                                                        height: '60px',
                                                        objectFit: 'cover',
                                                        borderRadius: '4px',
                                                        border: '1px solid #ddd'
                                                    }}
                                                />
                                            </td>
                                            <td style={{ padding: '12px 10px', verticalAlign: 'top', maxWidth: '250px' }}>
                                                <div
                                                    style={{
                                                        fontSize: '0.9rem',
                                                        color: '#34495e',
                                                        lineHeight: 1.4,
                                                        wordBreak: 'break-word'
                                                    }}
                                                    title={meme.text}
                                                >
                                                    {meme.text}
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px 10px', verticalAlign: 'top', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => handleDelete(cat, i)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        fontSize: '0.85rem',
                                                        backgroundColor: '#e74c3c',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    Удалить
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                            )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: '#95a5a6', fontStyle: 'italic' }}>
                        Нет сохранённых мемов
                    </p>
                )}
            </div>
        </div>
    );
}