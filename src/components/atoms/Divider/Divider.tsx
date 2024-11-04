'use client';

import { Divider } from '@mantine/core';
import styles from './Divider.module.scss';

const DividerExtend = Divider.extend({
  classNames: {
    root: styles.divider,
  },
});

export { Divider, DividerExtend };
