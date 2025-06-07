export interface CreateStateRequest {
  code: string;
  name: string;
  countryId: string;
}

export interface UpdateStateRequest {
  code?: string;
  name?: string;
  countryId?: string;
}