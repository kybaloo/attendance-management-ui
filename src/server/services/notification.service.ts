import { CreateNotificationDto, Notification } from "@/types/notification.types";
import { getAuthToken } from "@/utils/auth-utils";
import api from "@/utils/axios";

export class NotificationService {
  /**
   * Récupérer toutes les notifications avec pagination
   */
  static async getNotifications(page = 1, limit = 10): Promise<{ notifications: Notification[]; total: number }> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.get(`/api/v1/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { page, limit },
      });

      return {
        notifications: data.items || data,
        total: data.total || (data.items ? data.items.length : data.length),
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      throw new Error("Impossible de récupérer les notifications");
    }
  }

  /**
   * Récupérer une notification spécifique par son ID
   */
  static async getNotificationById(id: string): Promise<Notification> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.get(`/api/v1/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la notification ${id}:`, error);
      throw new Error("Impossible de récupérer les détails de la notification");
    }
  }

  /**
   * Créer une nouvelle notification
   */
  static async createNotification(input: CreateNotificationDto): Promise<Notification> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.post(`/api/v1/notifications`, input, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error("Erreur lors de la création de la notification:", error);
      throw new Error("Impossible de créer la notification");
    }
  }

  /**
   * Mettre à jour le statut d'une notification
   */
  static async updateNotificationStatus(id: string, status: string): Promise<boolean> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      await api.put(
        `/api/v1/notifications/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return true;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut de la notification ${id}:`, error);
      throw new Error("Impossible de mettre à jour le statut de la notification");
    }
  }

  /**
   * Récupérer les notifications non lues pour un utilisateur
   */
  static async getUnreadNotifications(): Promise<Notification[]> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.get(`/api/v1/notifications?status=SENT`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data.items || data;
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications non lues:", error);
      throw new Error("Impossible de récupérer les notifications non lues");
    }
  }
}
