import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

const signInSchema = z.object({
  username: z
    .string({ required_error: 'Required field' })
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(20, { message: 'Username must be at most 20 characters long' }),
  password: z
    .string({ required_error: 'Required field' })
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(20, { message: 'Password must be at most 20 characters long' }),
});
type SignInSchema = z.infer<typeof signInSchema>;
export type SignInFormReturn = UseFormReturn<SignInSchema>;

export const useSignInForm = () => {
  return useForm<SignInSchema>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(signInSchema),
  });
};
