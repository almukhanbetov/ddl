'use client';

import { useSiteContent } from '@/lib/useSiteContent';
import ContentSaveBar from '@/components/admin/ContentSaveBar';

export default function AdminContentHowItWorksPage() {
  const { content, setContent, error, saved, submitting, handleSubmit } = useSiteContent();

  if (error && !content) return <p className="admin-error">{error}</p>;
  if (!content) return <p style={{ color: 'var(--ink-soft)' }}>Загрузка…</p>;

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-card">
        <h3 style={{ fontSize: 16, marginBottom: 18 }}>Блок «Как это работает»</h3>
        <div className="field-row">
          <div className="field">
            <label>Надзаголовок</label>
            <input
              type="text"
              value={content.howItWorks.eyebrow}
              onChange={(e) => setContent({ ...content, howItWorks: { ...content.howItWorks, eyebrow: e.target.value } })}
            />
          </div>
          <div className="field">
            <label>Заголовок</label>
            <input
              type="text"
              value={content.howItWorks.title}
              onChange={(e) => setContent({ ...content, howItWorks: { ...content.howItWorks, title: e.target.value } })}
            />
          </div>
        </div>

        {content.howItWorks.steps.map((step, i) => (
          <div key={i} style={{ borderTop: i > 0 ? '1px dashed var(--border)' : undefined, paddingTop: i > 0 ? 16 : 0, marginTop: i > 0 ? 16 : 0 }}>
            <div className="field">
              <label>Шаг {i + 1} — заголовок</label>
              <input
                type="text"
                value={step.title}
                onChange={(e) => {
                  const steps = [...content.howItWorks.steps];
                  steps[i] = { ...steps[i], title: e.target.value };
                  setContent({ ...content, howItWorks: { ...content.howItWorks, steps } });
                }}
              />
            </div>
            <div className="field">
              <label>Шаг {i + 1} — описание</label>
              <textarea
                value={step.description}
                onChange={(e) => {
                  const steps = [...content.howItWorks.steps];
                  steps[i] = { ...steps[i], description: e.target.value };
                  setContent({ ...content, howItWorks: { ...content.howItWorks, steps } });
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <ContentSaveBar error={error} saved={saved} submitting={submitting} />
    </form>
  );
}
