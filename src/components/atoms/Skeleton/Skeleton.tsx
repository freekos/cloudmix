'use client';

import { Skeleton } from '@mantine/core';
import styles from './Skeleton.module.scss';

const SkeletonExtend = Skeleton.extend({
  classNames: {
    root: styles.skeleton,
  },
});

export { Skeleton, SkeletonExtend };
