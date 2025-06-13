import { Emargement } from "./attendance.types";
import { User } from "./user.types";

export interface Notification {
  id: string;
  message: string;
  status: "SENT" | "CONFIRMED" | "RECEIVED" | "READ";
  emargement?: Emargement;
  recipient: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationDto {
  message: string;
  status: "SENT" | "CONFIRMED" | "RECEIVED" | "READ";
  emargementId: string;
  recipientId: string;
}

export interface UpdateNotificationDto {
  id: string;
  status?: "SENT" | "CONFIRMED" | "RECEIVED" | "READ";
  message?: string;
}
