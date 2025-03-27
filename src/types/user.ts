interface IUser {
  userId: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  photoUrl: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  role: string;
  lastSignIn: string;
  disabled: boolean;
  courseCount?: number;
}

export type { IUser };
