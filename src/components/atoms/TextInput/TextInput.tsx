'use client';

import { TextInput } from '@mantine/core';
import styles from './TextInput.module.scss';

const TextInputExtend = TextInput.extend({
  classNames: {
    root: styles.text_input,
    input: styles.text_input_input,
  },
});

export { TextInput, TextInputExtend };
