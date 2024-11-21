'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@/i18n/routing';
import { loginWithCredentials } from '@/actions/auth.actions';
import { useTranslations } from 'next-intl';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import PasswordInput from '@/components/ui/password-input';
import { useRouter } from 'next/navigation';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

export const CredentialsLogin = () => {
  const t = useTranslations('auth.login');
  const router = useRouter();
  const { errorToast } = useServerErrorToast();

  const FormSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
    rememberMe: z.boolean(),
  });

  type FormData = z.infer<typeof FormSchema>;

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: true,
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      form.clearErrors();

      const response = await loginWithCredentials(
        data.username,
        data.password,
        data.rememberMe,
      );

      if (!response) {
        form.setError('root', { message: t('field.error') });
      } else {
        localStorage.setItem('user', JSON.stringify(response));
        router.replace('/');
      }
    } catch (error) {
      errorToast();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="grid items-center w-full gap-2 my-6">
              <Label htmlFor="username">{t('field.username')}</Label>
              <Input {...field} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid items-center w-full gap-2 my-6">
              <Label htmlFor="password">{t('field.password')}</Label>
              <PasswordInput {...field} />
              {/* <Input {...field} type="password" /> */}
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between mb-6">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
                <Label className="text-neutral-800">{t('rememberMe')}</Label>
              </div>
            )}
          />
          <Link className="text-sm" href="/password-reset">{t('passwordReset')}</Link>
        </div>
        <FormMessage>
          {form.formState.errors.root?.message}
        </FormMessage>
        <Button
          size="big"
          className="w-[100%] my-4"
          type="submit"
          disabled={!form.formState.isValid}
          loading={form.formState.isSubmitting}
        >
          {t('button.login')}
        </Button>
      </form>
    </Form>
  );
};