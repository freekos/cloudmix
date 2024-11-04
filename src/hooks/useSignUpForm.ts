import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

const signUpSchema = z
  .object({
    username: z
      .string({ required_error: 'Required field' })
      .min(3, { message: 'Username must be at least 3 characters long' })
      .max(20, { message: 'Username must be at most 20 characters long' }),
    password: z
      .string({ required_error: 'Required field' })
      .min(6, { message: 'Password must be at least 6 characters long' })
      .max(20, { message: 'Password must be at most 20 characters long' }),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });
type SignUpSchema = z.infer<typeof signUpSchema>;
export type SignUpFormReturn = UseFormReturn<SignUpSchema>;

export const useSignUpForm = () => {
  return useForm<SignUpSchema>({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(signUpSchema),
  });
};
