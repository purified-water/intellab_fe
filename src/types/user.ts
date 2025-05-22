interface IUser {
  userId?: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  photoUrl?: string | null;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  role: string;
  lastSignIn?: string;
  disabled?: boolean;
  courseCount?: number;

  // Admin specific
  creationTimestamp?: string;
  lastSignInTimestamp?: string;
  userUid?: string;
  premiumType?: string;
  packageDuration?: string;
}

export type { IUser };
