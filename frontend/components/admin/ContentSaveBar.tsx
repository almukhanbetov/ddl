export default function ContentSaveBar({
  error,
  saved,
  submitting,
}: {
  error: string | null;
  saved: boolean;
  submitting: boolean;
}) {
  return (
    <>
      {error && <p className="admin-error">{error}</p>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Сохраняем…' : 'Сохранить изменения'}
        </button>
        {saved && <span style={{ color: 'var(--success)', fontSize: 13.5, fontWeight: 600 }}>Сохранено ✓</span>}
      </div>
    </>
  );
}
