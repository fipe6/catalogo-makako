'use client';

import { useState, FormEvent } from 'react';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      window.location.reload();
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0d0d0d',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#1a1a1a',
          padding: '2rem',
          borderRadius: '12px',
          width: '320px',
          border: '1px solid #2e2e2e',
        }}
      >
        <h1
          style={{
            color: '#F5A800',
            fontFamily: 'var(--font-bebas-neue), sans-serif',
            fontSize: '1.8rem',
            marginBottom: '1rem',
            textAlign: 'center',
          }}
        >
          MAKAKO FIT ADMIN
        </h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          autoFocus
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            border: '1px solid #2e2e2e',
            background: '#0d0d0d',
            color: '#fff',
            boxSizing: 'border-box',
          }}
        />
        {error && (
          <p style={{ color: '#CC1F1F', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '8px',
            border: 'none',
            background: '#F5A800',
            color: '#0d0d0d',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {loading ? 'Verificando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
