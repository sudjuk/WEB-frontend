import { Day } from '../api/servicesApi';
import './styles/ServiceCard.css';

interface ServiceCardProps {
  day: Day;
}

function ServiceCard({ day }: ServiceCardProps) {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const imageUrl = day.image_url 
    ? (day.image_url.startsWith('http') 
        ? day.image_url 
        : `${baseUrl}${day.image_url.startsWith('/') ? day.image_url.slice(1) : day.image_url}`)
    : null;

  return (
    <div className="service-card">
      {imageUrl && (
        <img src={imageUrl} alt={day.name} className="service-card-image" />
      )}
      <div className="service-card-content">
        <h3>{day.name}</h3>
        <p>{day.description}</p>
      </div>
    </div>
  );
}

export default ServiceCard;


