export interface LohealthyUser {
  userName: string;
  password: string;
  email: string;
  image?: string;
}

export interface LoginUser {
  userName: string;
  password: string;
}

export interface DatabaseUser {
  userName: string;
  email: string;
  image: string;
  id: string;
  password: string;
}
