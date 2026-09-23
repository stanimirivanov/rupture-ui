import { createBrowserRouter, type RouteObject } from 'react-router';

import { CockpitLayout } from './layout';
import { Home } from './home';
import { NotFound } from './not-found';
import { TopologyRoute } from '../features/canvas/components/topology-route';

export const cockpitRoutes: RouteObject[] = [
  {
    path: '/',
    Component: CockpitLayout,
    children: [
      { index: true, Component: Home },
      { path: 'topology', Component: TopologyRoute },
      { path: '*', Component: NotFound },
    ],
  },
];

export const router = createBrowserRouter(cockpitRoutes);
