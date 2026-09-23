export type ServiceKind = 'gateway' | 'service' | 'datastore' | 'queue';

export interface ServiceFixture {
  readonly id: string;
  readonly label: string;
  readonly kind: ServiceKind;
  readonly tier: number;
}

export interface ConnectionFixture {
  readonly id: string;
  readonly source: string;
  readonly target: string;
}

export interface TopologyFixture {
  readonly services: readonly ServiceFixture[];
  readonly connections: readonly ConnectionFixture[];
}

export const topologyFixture: TopologyFixture = {
  services: [
    { id: 'gateway', label: 'API Gateway', kind: 'gateway', tier: 0 },
    { id: 'checkout', label: 'Checkout', kind: 'service', tier: 1 },
    { id: 'inventory', label: 'Inventory', kind: 'service', tier: 1 },
    { id: 'payments', label: 'Payments', kind: 'service', tier: 1 },
    { id: 'orders-db', label: 'Orders DB', kind: 'datastore', tier: 2 },
    { id: 'events', label: 'Event Bus', kind: 'queue', tier: 2 },
  ],
  connections: [
    { id: 'gw-checkout', source: 'gateway', target: 'checkout' },
    { id: 'gw-inventory', source: 'gateway', target: 'inventory' },
    { id: 'checkout-payments', source: 'checkout', target: 'payments' },
    { id: 'checkout-orders', source: 'checkout', target: 'orders-db' },
    { id: 'checkout-events', source: 'checkout', target: 'events' },
    { id: 'inventory-orders', source: 'inventory', target: 'orders-db' },
  ],
};
