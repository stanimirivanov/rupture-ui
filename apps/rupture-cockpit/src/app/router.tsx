import { createBrowserRouter, type RouteObject } from 'react-router';

import { CockpitLayout } from './layout';
import { Home } from './home';
import { NotFound } from './not-found';
import { AgentRoute } from '../features/agent/components/agent-route';
import { TopologyRoute } from '../features/canvas/components/topology-route';

export const cockpitRoutes: RouteObject[] = [
  {
    path: '/',
    Component: CockpitLayout,
    children: [
      { index: true, Component: Home },
      { path: 'topology', Component: TopologyRoute },
      { path: 'agent', Component: AgentRoute },
      { path: '*', Component: NotFound },
    ],
  },
];

export const router = createBrowserRouter(cockpitRoutes);
