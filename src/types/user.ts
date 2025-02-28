interface IUser {
  userId: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  photoUrl: string;
}

// extend the TUser type to include the new field
interface IUserMe extends IUser {
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  role: string;
  lastSignIn: string;
  disabled: boolean;
}

export type { IUser, IUserMe };
