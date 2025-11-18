import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setNameFilter } from '../store/slices/filtersSlice';
import { fetchDays, addToCart, normalizeImageUrl } from '../api/servicesApi';
import { setDays, setLoading, setError } from '../store/slices/daysSlice';
import { Link } from 'react-router-dom';
import CartButton from '../components/CartButton';
import './styles/AstronomyListPage.css';

function AstronomyListPage() {
  const dispatch = useAppDispatch();
  const { name } = useAppSelector((state) => state.filters);
  const { items: days, loading, error } = useAppSelector((state) => state.days);
  const [searchValue, setSearchValue] = useState(name);

  useEffect(() => {
    dispatch(setLoading(true));
    fetchDays(name || undefined)
      .then((data) => {
        dispatch(setDays(data));
      })
      .catch((err) => {
        dispatch(setError(err.message));
      });
  }, [name, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setNameFilter(searchValue));
  };

  const handleAddToCart = async (dayId: number) => {
    try {
      await addToCart(dayId);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (e) {
      console.warn('Failed to add to cart:', e);
    }
  };

  const baseUrl = import.meta.env.BASE_URL || '/';
  const backgroundUrl = `${baseUrl}background.jpg`;
  const earthUrl = `${baseUrl}earth.png`;

  return (
    <div className="frame">
      <CartButton />
      <img 
        className="img" 
        src={backgroundUrl}
        onError={(e) => { 
          const t = e.currentTarget; 
          if (!t.src.includes('background.jpg')) {
            t.src = backgroundUrl;
          }
        }}
        alt="Background"
      />
      <img 
        className="img img-mirror" 
        src={backgroundUrl}
        onError={(e) => { 
          const t = e.currentTarget; 
          if (!t.src.includes('background.jpg')) {
            t.src = backgroundUrl;
          }
        }}
        alt="Background mirror"
      />

      <div className="group">
        <div className="rectangle"></div>
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Введите дату (например: 21.02.2025)"
            className="search-input"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>
      </div>

      {loading && (
        <div className="loading">Загрузка...</div>
      )}
      
      {error && (
        <div className="error">Ошибка: {error}</div>
      )}

      {!loading && !error && (
        <div className="days-grid">
          {days.map(day => {
            const dayName = day.date || day.name;
            const dayImage = normalizeImageUrl(day.image_url, earthUrl);
            
            // Логирование для отладки
            if (day.image_url) {
              console.log(`Day ${day.id} (${dayName}): original image_url="${day.image_url}", normalized="${dayImage}"`);
            }
            
            return (
              <div className="day-card" key={day.id}>
                <img
                  className="image"
                  src={dayImage}
                  onError={(e) => { 
                    const t = e.currentTarget;
                    console.warn(`Failed to load image for day ${day.id}: ${t.src}`);
                    if (!t.src.includes('earth.png')) {
                      t.src = earthUrl;
                    }
                  }}
                  alt={dayName}
                />
                <div className="text-wrapper-4">{dayName}</div>
                <p className="RA-DEC">
                  {day.earthRA !== undefined && day.earthDEC !== undefined ? (
                    <>
                      Координаты Земли относительно Солнца в этот день: <br />
                      RA: {day.earthRA.toFixed(4)}° <br />
                      DEC: {day.earthDEC.toFixed(4)}°
                    </>
                  ) : (
                    day.description || day.fullInfo || 'Описание отсутствует'
                  )}
                </p>
                <div className="div-3">
                  <button 
                    className="group-3"
                    onClick={() => handleAddToCart(day.id)}
                  >
                    <div className="rectangle-2"></div>
                    <div className="text-wrapper-5">Добавить</div>
                  </button>
                  <Link to={`/day_details/${day.id}`} className="group-4">
                    <div className="rectangle-3"></div>
                    <div className="text-wrapper-6">Подробнее</div>
                  </Link>
                </div>
              </div>
            );
          })}
          {days.length === 0 && (
            <div style={{ 
              color: '#d8d8e0', 
              fontFamily: 'Montserrat-Medium, Helvetica', 
              fontSize: '24px', 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              marginTop: '40px' 
            }}>
              Ничего не найдено.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AstronomyListPage;
