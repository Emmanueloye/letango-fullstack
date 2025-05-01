import { InferSchemaType, Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
  {
    userRef: {
      type: String,
      required: [true, 'User reference field is required.'],
      unique: true,
      trim: true,
    },
    surname: {
      type: String,
      required: [true, 'Surname field is required.'],
      lowercase: true,
      trim: true,
    },
    otherNames: {
      type: String,
      required: [true, 'Other names field is required.'],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email field is required.'],
      unique: true,
      validate: [validator.isEmail, 'Email must be a valid email.'],
      trim: true,
    },
    emailVerificationToken: String,
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    verificationDate: Date,
    password: {
      type: String,
      required: [true, 'Password field is required.'],
      minlength: [6, 'Password must be at least 6 characters long.'],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, 'Confirm password field is required.'],
      validate: {
        validator: function (this: any, inputtedPassword: string) {
          return this.password === inputtedPassword;
        },
        message: 'Password and confirm password must match.',
      },
      select: false,
    },
    loginOTP: String,
    loginOTPExpiresAt: Date,
    loginToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
    photo: String,
    photoPublicId: String,
    phone: String,
    role: {
      type: String,
      enum: {
        values: ['user', 'admin', 'super-admin'],
        message: 'Invalid role values.',
      },
      default: 'user',
    },
    personalWallet: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      required: [true, 'User status field is required.'],
      enum: {
        values: ['suspend', 'banned', 'active'],
        message: 'Invalid user status values.',
      },
      default: 'active',
      lowercase: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = '';
});

userSchema.methods.isPasswordCorrect = async function (
  inputtedPassword: string,
  savedPassword: string
) {
  return bcrypt.compare(inputtedPassword, savedPassword);
};

userSchema.methods.detectPasswordChange = function (JWTTimeStamp: number) {
  if (this.passwordChangedAt) {
    const changedTime = parseInt(
      `${this.passwordChangedAt.getTime() / 1000}`,
      0
    );
    return changedTime > JWTTimeStamp;
  }
  return false;
};

// Get the schema type annotation and extend it with the other methods functions.
export type IUser = InferSchemaType<typeof userSchema> & {
  isPasswordCorrect: (
    inputtedPassword: string,
    savedPassword: string
  ) => Promise<boolean>;
  detectPasswordChange: (JWTTimeStamp: number) => boolean;
};

export default model<IUser>('User', userSchema);
