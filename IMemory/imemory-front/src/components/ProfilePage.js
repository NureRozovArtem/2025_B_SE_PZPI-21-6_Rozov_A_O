import { useEffect, useState } from 'react';
import './ProfilePage.css';
import Header from "./Header";


export default function ProfilePage({ onBack, onLogout }) {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState([]);
  const [filters, setFilters] = useState({ from: '', to: '', type: '', minScore: '', maxScore: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:8080/api/user/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.text())
      .then(text => {
        console.log('Response http://localhost:8080/api/user/me:', text);
        try {
          return JSON.parse(text);
        } catch {
          throw new Error('Response is not valid JSON');
        }
      })
      .then(data => setUser(data))
      .catch(err => console.error('Помилка при завантаженні профілю:', err));

    fetch('http://localhost:8080/api/user/progress', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.text())
      .then(text => {
        console.log('http://localhost:8080/api/user/progress:', text);
        try {
          return JSON.parse(text);
        } catch {
          throw new Error('Response is not valid JSON');
        }
      })
      .then(data => setProgress(data))
      .catch(err => console.error('Помилка при завантаженні статистики:', err));
  }, []);

  const filtered = progress
    .filter(r => {
      const date = new Date(r.date);
      if (filters.from && date < new Date(filters.from)) return false;
      if (filters.to && date > new Date(filters.to)) return false;
      if (filters.type && r.exerciseTitle !== filters.type) return false;
      if (filters.minScore && r.result < +filters.minScore) return false;
      if (filters.maxScore && r.result > +filters.maxScore) return false;
      return true;
    })
    .sort((a, b) => {
      const { key, direction } = sortConfig;
      const valA = (a[key] || '').toString();
      const valB = (b[key] || '').toString();
      const diff = valA.localeCompare(valB, undefined, { numeric: true });
      return direction === 'asc' ? diff : -diff;
    });

  const requestSort = key => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
     <div>
        <Header showTopBar={false} />
      <div className="profile-page">
        <div className="top-bar">
          <button className="back" onClick={onBack}>⬅ Назад</button>
        </div>

        {user ? (
          <div className="profile-info">
            <h2>Профіль</h2>
            <p><strong>Логін:</strong> {user.username}</p>
            <p><strong>Пошта:</strong> {user.email}</p>
            <p><strong>Підписка:</strong> {user.hasSubscription ? 'Так' : 'Ні'}</p>
            <button className="logout" onClick={onLogout}>Вийти</button>
          </div>
        ) : (
          <p>Завантаження…</p>
        )}

        <h3>Статистика ігор</h3>
        <div className="filters">
          <label>Дата від <input type="date" value={filters.from} onChange={e => setFilters({ ...filters, from: e.target.value })} /></label>
          <label>по <input type="date" value={filters.to} onChange={e => setFilters({ ...filters, to: e.target.value })} /></label>
          <label>Тип гри <input type="text" placeholder="Наприклад: Числова пам'ять" value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })} /></label>
          <label>Результат від <input type="number" min="0" max="100" value={filters.minScore} onChange={e => setFilters({ ...filters, minScore: e.target.value })} /></label>
          <label>до <input type="number" min="0" max="100" value={filters.maxScore} onChange={e => setFilters({ ...filters, maxScore: e.target.value })} /></label>
          <button onClick={() => setFilters({ from: '', to: '', type: '', minScore: '', maxScore: '' })}>Скинути фільтри</button>
        </div>

        <table className="stats-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('exerciseTitle')}>
                Гра {sortConfig.key === 'exerciseTitle' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => requestSort('result')}>
                Результат {sortConfig.key === 'result' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => requestSort('date')}>
                Дата {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.exerciseTitle}</td>
                  <td>{r.result}</td>
                  <td>{new Date(r.date).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">Немає записів</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
