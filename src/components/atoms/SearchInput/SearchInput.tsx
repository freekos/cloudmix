import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ComponentProps, ComponentRef, forwardRef } from 'react';
import { TextInput } from '../TextInput';
import styles from './SearchInput.module.scss';

export interface SearchInputProps extends ComponentProps<typeof TextInput> {}

export const SearchInput = forwardRef<
  ComponentRef<typeof TextInput>,
  SearchInputProps
>((props, ref) => {
  return (
    <TextInput
      ref={ref}
      classNames={{
        input: styles.search_input,
      }}
      leftSection={<MagnifyingGlassIcon className={styles.search_icon} />}
      {...props}
    />
  );
});
