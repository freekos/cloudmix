import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

const signUpSchema = z
  .object({
    username: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
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
