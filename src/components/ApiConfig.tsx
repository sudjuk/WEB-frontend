import { useState, useEffect } from 'react';
import { isTauri, getSavedApiUrl, setTauriApiBaseUrl } from '../config/tauriApiConfig';
import './ApiConfig.css';

function ApiConfig() {
  const [isVisible, setIsVisible] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isTauri) {
      const saved = getSavedApiUrl();
      if (saved) {
        setApiUrl(saved);
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      const handleOpenConfig = () => {
        setIsVisible(true);
      };

      window.addEventListener('openApiConfig', handleOpenConfig);
      return () => {
        window.removeEventListener('openApiConfig', handleOpenConfig);
      };
    }
  }, []);

  if (!isTauri) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!apiUrl.trim()) {
      setMessage({ type: 'error', text: 'Пожалуйста, введите IP адрес сервера' });
      return;
    }

    try {
      const testUrl = apiUrl.trim().endsWith('/') ? apiUrl.trim().slice(0, -1) : apiUrl.trim();
      console.log('Проверяю подключение к:', `${testUrl}/api/days`);
      
      const response = await fetch(`${testUrl}/api/days`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      });

      console.log('Ответ получен:', response.status, response.statusText);

      if (response.ok || response.status === 404) {
        setTauriApiBaseUrl(testUrl);
        setMessage({ type: 'success', text: 'IP адрес успешно сохранен! Перезагрузите приложение.' });
        setIsVisible(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const errorText = await response.text().catch(() => '');
        console.error('Ошибка API:', response.status, errorText);
        setMessage({
          type: 'error',
          text: `Ошибка ${response.status}: ${response.statusText}. Проверьте CORS настройки сервера.`,
        });
      }
    } catch (error: any) {
      console.error('Ошибка подключения:', error);
      const errorMessage = error?.message || 'Неизвестная ошибка';
      setMessage({
        type: 'error',
        text: `Ошибка подключения: ${errorMessage}. Проверьте IP адрес, убедитесь что сервер запущен и CORS настроен правильно.`,
      });
    }
  };

  const savedUrl = getSavedApiUrl();

  return (
    <>
      {isVisible && (
        <div className="api-config-overlay">
          <div className="api-config-modal">
            <h3>Настройка API сервера</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="api-url">IP адрес сервера (например: http://192.168.1.101:8080)</label>
                <input
                  id="api-url"
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="http://192.168.1.101:8080"
                  className="form-control"
                />
              </div>
              {message && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                  {message.text}
                </div>
              )}
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Убрана полоска с адресом API - настройки доступны через меню в навбаре */}
    </>
  );
}

export default ApiConfig;


