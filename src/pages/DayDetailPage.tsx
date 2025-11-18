import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchDayById, Day, normalizeImageUrl } from '../api/servicesApi';
import './styles/DayDetailPage.css';

function DayDetailPage() {
  const { id } = useParams();
  const [day, setDay] = useState<Day | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDayById(Number(id));
      setDay(data);
    } catch (e) {
      setError('Не удалось загрузить данные астрономического дня.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const baseUrl = import.meta.env.BASE_URL || '/';
  const backgroundUrl = `${baseUrl}background.jpg`;
  const asteroidsUrl = `${baseUrl}asteroids.png`;

  if (loading) {
    return (
      <div className="frame">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="frame">
        <div className="error">Ошибка: {error}</div>
      </div>
    );
  }

  if (!day) {
    return (
      <div className="frame">
        <div className="error">Астрономический день не найден.</div>
      </div>
    );
  }

  const dayName = day.date || day.name;
  const dayImage = normalizeImageUrl(day.image_url, asteroidsUrl);

  return (
    <div className="frame">
      <img className="img" src={backgroundUrl} alt="Background" />

      <div className="breadcrumbs">
        <Link to="/" className="crumb-link">Главная</Link>
        <span className="crumb-sep">/</span>
        <Link to="/astronomy" className="crumb-link">Астрономия</Link>
        <span className="crumb-sep">/</span>
        <span className="crumb-current">{dayName}</span>
      </div>

      <div className="details-header">
        <div className="details-title">{dayName}</div>
      </div>
      
      <div className="details-text">
        <p className="bennu-RA">
          Земля:<br />
          {day.earthRA !== undefined && day.earthDEC !== undefined && (
            <>
              RA: {day.earthRA.toFixed(4)}° <br />
              DEC: {day.earthDEC.toFixed(4)}° <br />
            </>
          )}
          {day.bodiesText || day.description || day.fullInfo || 'Описание отсутствует'}
        </p>
      </div>
      
      <img
        className="details-image"
        src={dayImage}
        alt={dayName}
        onError={(e) => {
          const t = e.currentTarget;
          if (!t.src.includes('asteroids.png')) {
            t.src = asteroidsUrl;
          }
        }}
      />
    </div>
  );
}

export default DayDetailPage;
