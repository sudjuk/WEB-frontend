import { Carousel } from 'react-bootstrap';
import './styles/HomePage.css';

function HomePage() {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const videoFileName = 'Endless Space.mp4';
  const videoSrc = baseUrl === '/' ? `/${videoFileName}` : `${baseUrl}${videoFileName}`;

  return (
    <>
      <div className="home-video-container">
        <video 
          className="home-background-video" 
          autoPlay 
          loop 
          muted 
          playsInline
          onError={(e) => {
            console.error('Video load error:', e);
            const video = e.currentTarget;
            if (typeof window !== 'undefined') {
              const fallbackSrc = `${window.location.origin}${baseUrl}${videoFileName}`;
              if (video.src !== fallbackSrc) {
                video.src = fallbackSrc;
              }
            }
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="home-content">
          <h1 className="hero-title">AstroDist</h1>
          <p className="hero-subtitle">Сервис для расчёта расстояния до астероидов</p>
        </div>
      </div>
      <div className="carousel-container">
        <Carousel fade interval={5000}>
          <Carousel.Item>
            <div className="carousel-slide">
              <div className="carousel-content">
                <h3>Расчёт координат Земли</h3>
                <p>Определение точных координат Земли относительно Солнца для любой даты</p>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="carousel-slide">
              <div className="carousel-content">
                <h3>Анализ астероидов</h3>
                <p>Получение информации о близких к Земле астероидах и их траекториях</p>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="carousel-slide">
              <div className="carousel-content">
                <h3>Исторические данные</h3>
                <p>Просмотр архивных данных о положении небесных тел в прошлом</p>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>
    </>
  );
}

export default HomePage;
