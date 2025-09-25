export interface IApiResponse<T> {
  data?: T;
  message: string;
  status: string;
  code: number;
}


export interface IUserDetails {
  _id: string;
  name: string;
  email: string;
  role: string;
  authProvider: string;
  verified_onchain: boolean;
  about: string;
  avatar: string;
  email_verified: boolean;
  phoneNumber: string;
  skill: string[];
  address: string;
  onchain_status: string;
  createdAt: string;
  updatedAt: string;
}