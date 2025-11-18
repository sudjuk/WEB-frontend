import { useEffect, useState } from 'react';
import { getCartInfo, CartInfo } from '../api/servicesApi';
import './styles/CartButton.css';

function CartButton() {
  const [cartInfo, setCartInfo] = useState<CartInfo>({ asteroidRequestId: 0, counter: 0 });
  const [loading, setLoading] = useState(false);

  const loadCartInfo = async () => {
    setLoading(true);
    try {
      const info = await getCartInfo();
      if (info) {
        setCartInfo(info);
      }
    } catch (e) {
      // Игнорируем ошибки
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartInfo();
  }, []);

  // Обновляем корзину при событии
  useEffect(() => {
    const handleCartUpdate = () => {
      loadCartInfo();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const baseUrl = import.meta.env.BASE_URL || '/';
  const cartIconUrl = `${baseUrl}corzina.svg`;

  return (
    <span className="cart-button" style={{ opacity: cartInfo.asteroidRequestId > 0 ? 1 : 0.5, cursor: 'default' }}>
      <img className="vector" src={cartIconUrl} alt="Корзина" />
      <div className="group-2">
        <div className="ellipse"></div>
        <div className="text-wrapper-2">{cartInfo.counter}</div>
      </div>
    </span>
  );
}

export default CartButton;

