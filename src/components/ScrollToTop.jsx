import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  // Mengekstrak 'pathname' dari objek lokasi. Pathname adalah bagian URL setelah domain (misal: /about)
  const { pathname } = useLocation();

  // Gunakan useEffect untuk menjalankan sebuah "side effect" (efek samping)
  // setiap kali nilai 'pathname' berubah.
  useEffect(() => {
    // Perintahkan window browser untuk scroll ke posisi paling atas (x:0, y:0)
    window.scrollTo(0, 0);
  }, [pathname]); // <-- Dependency array: efek ini akan berjalan lagi HANYA JIKA pathname berubah

  // Komponen ini tidak merender elemen visual apapun ke layar
  return null;
}

export default ScrollToTop;