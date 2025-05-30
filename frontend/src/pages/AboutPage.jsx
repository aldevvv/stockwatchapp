import React from 'react';
import { Link } from 'react-router-dom';
import './InfoPage.css'; // Kita tetap gunakan dasar dari InfoPage.css
import './AboutPage.css'; // CSS spesifik yang akan kita perbarui

// Anda bisa menambahkan path ke gambar tim jika ada
// import teamMember1 from '../assets/images/team1.jpg'; 
// import teamMember2 from '../assets/images/team2.jpg';
// import teamMember3 from '../assets/images/team3.jpg';

function AboutPage() {
  const teamMembers = [
    { name: "Sukaina Ilham", role: "Product Owner & UX Strategist", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3jIVWlH-B_YLL3UnQCN2AHr819XZJFTXB-w&s" },
    { name: "Muh Alif", role: "Web Developer & Automation", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3jIVWlH-B_YLL3UnQCN2AHr819XZJFTXB-w&s" },
    { name: "Rejekki Manalu", role: "UI/UX Designer", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3jIVWlH-B_YLL3UnQCN2AHr819XZJFTXB-w&s" },
    { name: "Ilfa El Zahra", role: "Marketing & Edukasi", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3jIVWlH-B_YLL3UnQCN2AHr819XZJFTXB-w&s" },
    { name: "Muh Fathir", role: "CS & Onboarding Trainer", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3jIVWlH-B_YLL3UnQCN2AHr819XZJFTXB-w&s" },
  ];

  return (
    <div className="about-page-new"> {/* Gunakan class baru agar tidak bentrok dengan CSS AboutPage lama jika masih ada */}
      
      <section className="about-hero-new">
        <div className="about-hero-content-new">
          <h1>Kami Percaya Setiap UMKM Berhak Berkembang.</h1>
          <p>StockWatch lahir dari semangat untuk memberdayakan bisnis lokal dengan teknologi yang tepat guna dan mudah diakses.</p>
        </div>
      </section>

      <section className="about-section-new story-section">
        <div className="container-new">
          <h2>Latar Belakang - Dari Ide Hingga Solusi</h2>
          <div className="two-column-layout-new">
            <div className="column-text-new">
              <p>
                Semuanya berawal dari pengamatan sederhana terhadap tantangan sehari-hari yang dihadapi para pelaku UMKM di sekitar kami, khususnya dalam pengelolaan inventaris. Banyak waktu terbuang, potensi kerugian akibat stok mati atau kehabisan barang, dan kesulitan dalam mengambil keputusan berdasarkan data yang akurat.
              </p>
              <p>
                Sebagai tim mahasiswa yang terlibat dalam Program Pembinaan Mahasiswa Wirausaha (P2MW), kami tertantang untuk menciptakan solusi nyata. StockWatch adalah jawaban kami: sebuah platform yang intuitif, kuat, dan dirancang khusus untuk kebutuhan UMKM di Indonesia, membantu mereka bertransformasi secara digital tanpa beban teknis yang berat.
              </p>
            </div>
            <div className="column-image-new">
              <img src="https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Tim StockWatch Berdiskusi" />
            </div>
          </div>
        </div>
      </section>

      <section className="about-section-new mission-vision-section">
        <div className="container-new">
          <div className="two-column-layout-new reverse">
            <div className="column-text-new">
              <h2>Misi & Visi Kami</h2>
              <p><strong>Misi:</strong> Memberikan solusi manajemen stok yang sederhana, cerdas, dan terjangkau bagi UMKM agar dapat meningkatkan efisiensi dan profitabilitas bisnis mereka.</p>
              <p><strong>Visi:</strong> Menjadi platform pendukung utama bagi digitalisasi dan pertumbuhan UMKM di Indonesia melalui teknologi yang inovatif dan mudah diimplementasikan.</p>
            </div>
            <div className="column-image-new">
              <img src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Visi StockWatch untuk UMKM" />
            </div>
          </div>
        </div>
      </section>

      <section className="about-section-new values-section">
        <div className="container-new">
          <h2 className="section-title-new">Nilai-Nilai yang Kami Junjung</h2>
          <div className="values-grid-new">
            <div className="value-card-new">
              <div className="value-icon-new">💡</div>
              <h3>Inovasi</h3>
              <p>Terus mencari cara baru untuk menyederhanakan kompleksitas.</p>
            </div>
            <div className="value-card-new">
              <div className="value-icon-new">🤝</div>
              <h3>Pemberdayaan</h3>
              <p>Membantu UMKM tumbuh dan bersaing secara digital.</p>
            </div>
            <div className="value-card-new">
              <div className="value-icon-new">✅</div>
              <h3>Kemudahan</h3>
              <p>Fokus pada solusi yang intuitif dan mudah digunakan semua kalangan.</p>
            </div>
            <div className="value-card-new">
              <div className="value-icon-new">🌍</div>
              <h3>Dampak Lokal</h3>
              <p>Berkomitmen untuk memberikan kontribusi positif bagi ekonomi lokal.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="about-section-new team-section">
        <div className="container-new">
          <h2 className="section-title-new">Tim di Balik StockWatch</h2>
          <div className="team-grid-new">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member-card-new">
                <img src={member.img} alt={member.name} className="team-member-img-new" />
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section-new final-cta-about">
        <div className="container-new">
          <h2>Mari Berkolaborasi!</h2>
          <p>
            Punya ide, masukan, atau tertarik untuk bekerja sama? Kami sangat senang mendengar dari Anda. Bersama kita bisa membuat StockWatch menjadi lebih baik.
          </p>
          <Link to="/contact" className="btn-new btn-primary-new">Hubungi Kami</Link> 
          {/* Asumsi Anda akan membuat halaman /contact nanti */}
        </div>
      </section>
    </div>
  );
}

export default AboutPage;