'use client';

import { useSiteContent } from '@/lib/useSiteContent';
import ContentSaveBar from '@/components/admin/ContentSaveBar';
import ImageUploadField from '@/components/admin/ImageUploadField';

export default function AdminContentDeliveryPage() {
  const { content, setContent, error, saved, submitting, handleSubmit } = useSiteContent();

  if (error && !content) return <p className="admin-error">{error}</p>;
  if (!content) return <p style={{ color: 'var(--ink-soft)' }}>Загрузка…</p>;

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-card">
        <h3 style={{ fontSize: 16, marginBottom: 18 }}>Страница «Доставка и оплата»</h3>

        <div className="field">
          <label>Фото (необязательно)</label>
          <ImageUploadField
            value={content.deliveryPage.photo}
            onChange={(url) => setContent({ ...content, deliveryPage: { ...content.deliveryPage, photo: url } })}
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label>Надзаголовок</label>
            <input
              type="text"
              value={content.deliveryPage.eyebrow}
              onChange={(e) => setContent({ ...content, deliveryPage: { ...content.deliveryPage, eyebrow: e.target.value } })}
            />
          </div>
          <div className="field">
            <label>Заголовок</label>
            <input
              type="text"
              value={content.deliveryPage.heading}
              onChange={(e) => setContent({ ...content, deliveryPage: { ...content.deliveryPage, heading: e.target.value } })}
            />
          </div>
        </div>
        <div className="field">
          <label>Вводный текст</label>
          <textarea
            value={content.deliveryPage.intro}
            onChange={(e) => setContent({ ...content, deliveryPage: { ...content.deliveryPage, intro: e.target.value } })}
          />
        </div>

        {[
          ['courierTitle', 'courierDesc', 'Карточка «Доставка курьером»'],
          ['pickupTitle', 'pickupDesc', 'Карточка «Самовывоз со склада»'],
          ['paymentTitle', 'paymentDesc', 'Карточка «Оплата картой или наличными»'],
          ['noPrepayTitle', 'noPrepayDesc', 'Карточка «Без предоплаты»'],
        ].map(([titleKey, descKey, label]) => (
          <div key={titleKey} style={{ borderTop: '1px dashed var(--border)', paddingTop: 16, marginTop: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 9 }}>{label}</label>
            <div className="field">
              <input
                type="text"
                placeholder="Заголовок"
                value={content.deliveryPage[titleKey as keyof typeof content.deliveryPage] as string}
                onChange={(e) => setContent({ ...content, deliveryPage: { ...content.deliveryPage, [titleKey]: e.target.value } })}
              />
            </div>
            <div className="field">
              <textarea
                placeholder="Описание"
                value={content.deliveryPage[descKey as keyof typeof content.deliveryPage] as string}
                onChange={(e) => setContent({ ...content, deliveryPage: { ...content.deliveryPage, [descKey]: e.target.value } })}
              />
            </div>
          </div>
        ))}

        <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 16, marginTop: 16 }}>
          <div className="field">
            <label>Заголовок таблицы зон доставки</label>
            <input
              type="text"
              value={content.deliveryPage.zonesTitle}
              onChange={(e) => setContent({ ...content, deliveryPage: { ...content.deliveryPage, zonesTitle: e.target.value } })}
            />
          </div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 9 }}>Зоны и стоимость (6 строк)</label>
          {content.deliveryPage.zones.map((zone, i) => (
            <div className="field-row" key={i}>
              <div className="field">
                <input
                  type="text"
                  placeholder="Название зоны"
                  value={zone.label}
                  onChange={(e) => {
                    const zones = [...content.deliveryPage.zones];
                    zones[i] = { ...zones[i], label: e.target.value };
                    setContent({ ...content, deliveryPage: { ...content.deliveryPage, zones } });
                  }}
                />
              </div>
              <div className="field">
                <input
                  type="text"
                  placeholder="Стоимость"
                  value={zone.price}
                  onChange={(e) => {
                    const zones = [...content.deliveryPage.zones];
                    zones[i] = { ...zones[i], price: e.target.value };
                    setContent({ ...content, deliveryPage: { ...content.deliveryPage, zones } });
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 16, marginTop: 16 }}>
          <div className="field-row">
            <div className="field">
              <label>Заголовок блока «Важно»</label>
              <input
                type="text"
                value={content.deliveryPage.importantTitle}
                onChange={(e) => setContent({ ...content, deliveryPage: { ...content.deliveryPage, importantTitle: e.target.value } })}
              />
            </div>
            <div className="field">
              <label>Заголовок блока «Есть вопросы?»</label>
              <input
                type="text"
                value={content.deliveryPage.questionsTitle}
                onChange={(e) => setContent({ ...content, deliveryPage: { ...content.deliveryPage, questionsTitle: e.target.value } })}
              />
            </div>
          </div>
          <div className="field">
            <label>Текст блока «Важно»</label>
            <textarea
              value={content.deliveryPage.importantText}
              onChange={(e) => setContent({ ...content, deliveryPage: { ...content.deliveryPage, importantText: e.target.value } })}
            />
          </div>
          <div className="field">
            <label>Текст блока «Есть вопросы?»</label>
            <textarea
              value={content.deliveryPage.questionsDesc}
              onChange={(e) => setContent({ ...content, deliveryPage: { ...content.deliveryPage, questionsDesc: e.target.value } })}
            />
          </div>
          <div className="field">
            <label>Текст кнопки «Связаться с нами»</label>
            <input
              type="text"
              value={content.deliveryPage.contactUs}
              onChange={(e) => setContent({ ...content, deliveryPage: { ...content.deliveryPage, contactUs: e.target.value } })}
            />
          </div>
        </div>
      </div>

      <ContentSaveBar error={error} saved={saved} submitting={submitting} />
    </form>
  );
}
