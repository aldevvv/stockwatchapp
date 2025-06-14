export const PLAN_LIMITS = {
  Free: {
    stok: 10,
    produk: 10,
    supplier: 5,
    notifikasi: ['Email'],
    // Tambahkan batasan lain di sini
  },
  Basic: {
    stok: 50,
    produk: 50,
    supplier: 25,
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