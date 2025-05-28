/**
 * Tipos de notificaciones soportadas
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Interfaz para una notificación
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  timestamp: number;
}

/**
 * Servicio para manejar notificaciones globales de la aplicación
 */
class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private nextId = 1;

  /**
   * Suscribe un listener para recibir actualizaciones de notificaciones
   */
  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    
    // Retorna función para desuscribirse
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notifica a todos los listeners sobre cambios
   */
  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  /**
   * Agrega una nueva notificación
   */
  private addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): string {
    const id = `notification-${this.nextId++}`;
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
      duration: notification.duration ?? 5000, // 5 segundos por defecto
    };

    this.notifications.push(newNotification);
    this.notifyListeners();

    // Auto-remover notificación después del tiempo especificado
    if (!newNotification.persistent && (newNotification.duration ?? 0) > 0) {
      setTimeout(() => {
        this.remove(id);
      }, newNotification.duration ?? 0);
    }

    return id;
  }

  /**
   * Muestra una notificación de éxito
   */
  success(message: string, title?: string, options?: Partial<Notification>): string {
    return this.addNotification({
      type: 'success',
      title,
      message,
      ...options,
    });
  }

  /**
   * Muestra una notificación de error
   */
  error(message: string, title?: string, options?: Partial<Notification>): string {
    return this.addNotification({
      type: 'error',
      title,
      message,
      duration: 8000, // Errores duran más tiempo
      ...options,
    });
  }

  /**
   * Muestra una notificación de advertencia
   */
  warning(message: string, title?: string, options?: Partial<Notification>): string {
    return this.addNotification({
      type: 'warning',
      title,
      message,
      duration: 6000,
      ...options,
    });
  }

  /**
   * Muestra una notificación informativa
   */
  info(message: string, title?: string, options?: Partial<Notification>): string {
    return this.addNotification({
      type: 'info',
      title,
      message,
      ...options,
    });
  }

  /**
   * Remueve una notificación por ID
   */
  remove(id: string): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index > -1) {
      this.notifications.splice(index, 1);
      this.notifyListeners();
    }
  }

  /**
   * Limpia todas las notificaciones
   */
  clear(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  /**
   * Obtiene todas las notificaciones actuales
   */
  getAll(): Notification[] {
    return [...this.notifications];
  }

  /**
   * Obtiene notificaciones por tipo
   */
  getByType(type: NotificationType): Notification[] {
    return this.notifications.filter(n => n.type === type);
  }
}

/**
 * Instancia singleton del servicio de notificaciones
 */
export const notificationService = new NotificationService();
