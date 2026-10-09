import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

export function initWebVitals() {
  if (process.env.NODE_ENV !== 'production' || window.location.hostname === 'localhost') {
    const logMetric = ({ name, value, rating }) => {
      const color = rating === 'good' ? '#34d399' : rating === 'needs-improvement' ? '#fbbf24' : '#f87171';
      console.log(
        `%c[Web Vitals] ${name}: ${Math.round(value * 100) / 100}ms (${rating.toUpperCase()})`,
        `color: ${color}; font-weight: bold;`
      );
    };

    onCLS(logMetric);
    onINP(logMetric);
    onLCP(logMetric);
    onFCP(logMetric);
    onTTFB(logMetric);
  }
}
