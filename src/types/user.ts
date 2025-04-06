interface IUser {
  userId: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  photoUrl: string | null;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  role: string;
  lastSignIn: string;
  disabled: boolean;
  courseCount?: number;
}

export type { IUser };
