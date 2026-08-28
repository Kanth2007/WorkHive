import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({
  rating = 0,
  maxStars = 5,
  showScore = true,
  count,
  size = 18,
  interactive = false,
  onChange,
  className = ''
}) => {
  const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

  return (
    <div className={`ss-rating ${className}`.trim()}>
      <div className="ss-rating-stars">
        {stars.map((starIndex) => {
          const isFilled = starIndex <= Math.round(rating);
          return (
            <button
              key={starIndex}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(starIndex)}
              style={{
                cursor: interactive ? 'pointer' : 'default',
                padding: 0,
                display: 'inline-flex'
              }}
              aria-label={`${starIndex} star`}
            >
              <Star
                size={size}
                className={isFilled ? 'ss-star-icon' : 'ss-star-icon-empty'}
                fill={isFilled ? 'var(--color-accent)' : 'transparent'}
                strokeWidth={2}
              />
            </button>
          );
        })}
      </div>

      {showScore && <span className="ss-rating-score">{Number(rating).toFixed(1)}</span>}
      {count !== undefined && (
        <span className="ss-rating-count">({count} reviews)</span>
      )}
    </div>
  );
};

export default StarRating;
