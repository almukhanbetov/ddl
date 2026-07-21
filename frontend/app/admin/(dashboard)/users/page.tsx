'use client';

import { useEffect, useState, type SubmitEvent } from 'react';
import { adminListUsers, adminCreateUser, AdminUser, ApiError } from '@/lib/adminApi';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    adminListUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Fetch-on-mount: loading flag set synchronously before the request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await adminCreateUser({ email, name, password });
      setEmail('');
      setName('');
      setPassword('');
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось создать пользователя');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="admin-card">
        <div className="admin-toolbar">
          <span className="results-count">
            Всего <b>{users.length}</b> администраторов
          </span>
        </div>
        {loading ? (
          <p style={{ color: 'var(--ink-soft)' }}>Загрузка…</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Email</th>
                <th>В системе с</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('ru-RU') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-card">
        <h3 style={{ fontSize: 16, marginBottom: 18 }}>Добавить администратора</h3>
        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <div className="field">
              <label>Имя</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Пароль</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Минимум 8 символов" />
          </div>
          {error && <p className="admin-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
            {submitting ? 'Добавляем…' : 'Добавить'}
          </button>
        </form>
      </div>
    </>
  );
}
