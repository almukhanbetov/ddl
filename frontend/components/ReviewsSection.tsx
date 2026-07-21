'use client';

import { useState } from 'react';
import { resolveImageUrl } from '@/lib/api';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Review } from '@/lib/data';
import ReviewForm from './ReviewForm';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ReviewsSection({ initialReviews, t }: { initialReviews: Review[]; t: Dictionary['reviews'] }) {
  const [reviews, setReviews] = useState(initialReviews);

  return (
    <div className="checkout-grid" style={{ marginBottom: 60, alignItems: 'start' }}>
      <div className="checkout-col">
        <div className="panel">
          <div className="panel-head">
            <h3>{t.listTitle}</h3>
          </div>
          {reviews.length === 0 ? (
            <p className="review-empty">{t.emptyState}</p>
          ) : (
            <div className="review-list">
              {reviews.map((review) => (
                <div className="review-card" key={review.id}>
                  <div className="review-card-head">
                    <span className="review-card-author">{review.authorName}</span>
                    <span className="review-card-date">{formatDate(review.createdAt)}</span>
                  </div>
                  <p className="review-card-text">{review.text}</p>
                  {review.photos.length > 0 && (
                    <div className="review-card-photos">
                      {review.photos.map((photo, i) => (
                        <a key={i} href={resolveImageUrl(photo)} target="_blank" rel="noopener noreferrer">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={resolveImageUrl(photo)} alt="" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <aside style={{ position: 'static' }}>
        <ReviewForm t={t} onCreated={(review) => setReviews((prev) => [review, ...prev])} />
      </aside>
    </div>
  );
}
