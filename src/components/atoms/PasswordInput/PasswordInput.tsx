'use client';

import { PasswordInput } from '@mantine/core';
import styles from './PasswordInput.module.scss';

const PasswordInputExtend = PasswordInput.extend({
  classNames: {
    root: styles.password_input,
    input: styles.password_input_input,
    visibilityToggle: styles.password_input_visibility_toggle,
  },
});

export { PasswordInput, PasswordInputExtend };
