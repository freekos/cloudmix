'use client';

import { Tabs } from '@mantine/core';
import styles from './Tabs.module.scss';

const TabsExtend = Tabs.extend({
  classNames: {
    root: styles.tabs,
    list: styles.tabs_list,
    tab: styles.tabs_tab,
    panel: styles.tabs_panel,
  },
});

export { Tabs, TabsExtend };
