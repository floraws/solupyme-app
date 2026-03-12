export * from './api/common';

export interface DeleteResult {
  success: boolean;
  message: string;
  deletedId?: string;
  deletedAt?: string;
}