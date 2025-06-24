export const ACHIEVEMENTS = {
    // Lencana Transaksi
    TRANSAKSI_PERTAMA: { id: 'TRANSAKSI_PERTAMA', name: 'Pedagang Pemula', description: 'Anda berhasil mencatat transaksi penjualan pertama!', type: 'TRANSACTION_COUNT', threshold: 1 },
    TRANSAKSI_SEPULUH: { id: 'TRANSAKSI_SEPULUH', name: 'Pedagang Andal', description: 'Selamat! Anda telah mencapai 10 transaksi penjualan.', type: 'TRANSACTION_COUNT', threshold: 10 },
    TRANSAKSI_SERATUS: { id: 'TRANSAKSI_SERATUS', name: 'Juragan Pasar', description: 'Luar biasa! 100 transaksi penjualan telah tercatat.', type: 'TRANSACTION_COUNT', threshold: 100 },
    
    // Lencana Manajemen Stok
    STOK_PERTAMA: { id: 'STOK_PERTAMA', name: 'Kolektor Awal', description: 'Item stok pertama Anda berhasil ditambahkan.', type: 'STOK_COUNT', threshold: 1 },
    STOK_DUA_LIMA: { id: 'STOK_DUA_LIMA', name: 'Manajer Inventaris', description: 'Anda telah mengelola 25 jenis item stok berbeda.', type: 'STOK_COUNT', threshold: 25 },

    // Lencana StockShare
    LISTING_PERTAMA: { id: 'LISTING_PERTAMA', name: 'Rekan Bisnis', description: 'Anda telah berkontribusi di pasar dengan menjual stok pertama Anda!', type: 'LISTING_COUNT', threshold: 1 },

    // Lencana Billing
    UPGRADE_PAKET: { id: 'UPGRADE_PAKET', name: 'Investor Cerdas', description: 'Terima kasih telah upgrade! Nikmati fitur premiumnya.', type: 'PLAN_UPGRADE', threshold: 1 },
    REDEEM_PERTAMA: { id: 'REDEEM_PERTAMA', name: 'Pemburu Harta Karun', description: 'Anda berhasil menggunakan kode voucher pertama Anda!', type: 'REDEEM_COUNT', threshold: 1 },
};