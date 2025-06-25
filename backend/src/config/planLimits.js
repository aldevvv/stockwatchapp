export const PLAN_LIMITS = {
  Free: {
    stok: 10,
    produk: 10,
    supplier: 5,
    notifikasi: ['Email'],
  },
  Basic: {
    stok: 75,
    produk: 75,
    supplier: 50,
    notifikasi: ['Email', 'WhatsApp'],
  },
  Pro: {
    stok: Infinity,
    produk: Infinity,
    supplier: Infinity,
    notifikasi: ['Email', 'WhatsApp'],
  },
  Enterprise: {
    stok: Infinity,
    produk: Infinity,
    supplier: Infinity,
    notifikasi: ['Email', 'WhatsApp'],
  }
};