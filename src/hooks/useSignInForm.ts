import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

const signInSchema = z.object({
  username: z.string(),
  password: z.string(),
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
