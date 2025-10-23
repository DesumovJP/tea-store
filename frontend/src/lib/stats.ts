// Simple in-memory stats. Resets on server restart. Suitable for lightweight admin analytics.

type Stats = {
  orders: number;
};

const stats: Stats = {
  orders: 0,
};

export function incrementOrders(): void {
  stats.orders += 1;
}

export function getStats(): Stats {
  return stats;
}


