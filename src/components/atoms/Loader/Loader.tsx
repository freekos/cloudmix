'use client';

import { Loader } from '@mantine/core';
import styles from './Loader.module.scss';

const LoaderExtend = Loader.extend({
  classNames: {
    root: styles.loader,
  },
});

export { Loader, LoaderExtend };
