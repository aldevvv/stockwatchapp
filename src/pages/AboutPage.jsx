import React from 'react';
import { Link } from 'react-router-dom';
import './InfoPage.css'; 
import './AboutPage.css'; 

function AboutPage() {
  const teamMembers = [
    { name: "Sukaina Ilham", role: "Project Lead", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3jIVWlH-B_YLL3UnQCN2AHr819XZJFTXB-w&s" },
    { name: "Muh Alif", role: "Web Developer", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3jIVWlH-B_YLL3UnQCN2AHr819XZJFTXB-w&s" },
    { name: "Rejekki Manalu", role: "Graphic Designer", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3jIVWlH-B_YLL3UnQCN2AHr819XZJFTXB-w&s" },
    { name: "Ilfa El Zahra", role: "Education & Marketing", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3jIVWlH-B_YLL3UnQCN2AHr819XZJFTXB-w&s" },
    { name: "Fathir Anugrah", role: "Marketing", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3jIVWlH-B_YLL3UnQCN2AHr819XZJFTXB-w&s" },
  ];
  
  const coreValues = [
    {
      icon: "🎯",
      title: "Simpel & Praktis",
      description: "Semua fitur dibuat mudah dipahami dan langsung bisa dipakai. Tidak perlu training bertahun-tahun untuk menguasainya."
    },
    {
      icon: "🤝",
      title: "Fokus ke UMKM",
      description: "Kami memahami kebutuhan bisnis kecil dan menengah. Setiap fitur dirancang khusus untuk membantu UMKM tumbuh."
    },
    {
      icon: "📈",
      title: "Hasil Nyata",
      description: "Bukan hanya hanya hanya sekedar aplikasi, tapi solusi yang benar-benar membantu bisnis Anda lebih efisien dan menguntungkan."
    }
  ];

  return (
    <div className="about-page-new">
      
      <section className="about-hero-new">
        <div className="about-hero-content-new">
          <h1>Membantu UMKM Berkembang Lebih Mudah</h1>
          <p>StockWatch hadir untuk mempermudah pengelolaan stok barang Anda. Tanpa ribet, tanpa rumit - semuanya jadi lebih teratur dan menguntungkan.</p>
        </div>
      </section>

      <section className="about-section-new story-section">
        <div className="container-new">
          <h2>Cerita di Balik StockWatch</h2>
          <div className="two-column-layout-new">
            <div className="column-text-new">
              <p>
                Kami tahu betapa sibuknya menjalankan usaha kecil. Dari melayani pelanggan, mengurus keuangan, sampai memastikan stok barang selalu tersedia. Seringkali, karena terlalu fokus ke pelanggan, stok barang jadi berantakan tanpa sempat terpantau dengan baik hingga merusak cashflow.
              </p>
              <p>
                Ada yang kehabisan barang laris, ada yang malah menumpuk barang yang nggak laku. Dari situlah ide StockWatch muncul - untuk membantu Anda mengelola stok dengan cara yang simpel dan praktis, tanpa perlu belajar hal-hal rumit. Karena kami percaya, fokus utama Anda seharusnya adalah mengembangkan produk dan layanan, bukan terjebak dalam kerumitan administrasi. 
              </p>
            </div>
            <div className="column-image-new">
              <img src="https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Tim StockWatch memahami kesulitan UMKM" />
            </div>
          </div>
        </div>
      </section>

<section className="about-section-new mission-vision-section">
  <div className="container-new">
    <h2>Komitmen Kami untuk UMKM</h2>
    <div className="two-column-layout-new reverse">
      <div className="column-text-new">
        <div className="mv-block-final">
          <h3>Misi Kami</h3>
          <p>Membuat aplikasi pengelolaan stok yang mudah dipahami dan digunakan oleh siapa saja, bahkan yang tidak terlalu paham teknologi. Tujuannya sederhana: biar usaha Anda lebih untung dan teratur. Dengan data yang akurat, keputusan bisnis menjadi lebih cerdas dan strategis.</p>
        </div>
        <div className="mv-block-final">
          <h3>Visi Kami</h3>
          <p>Menjadi solusi terbaik untuk UMKM Indonesia dalam mengelola bisnis mereka. Kami ingin setiap pemilik usaha kecil bisa fokus mengembangkan bisnisnya, bukan pusing dengan urusan administrasi. Kami bermimpi untuk tumbuh bersama setiap UMKM, memberdayakan mereka untuk bersaing di era digital.</p>
        </div>
      </div>

      <div className="column-image-new">
        <img src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Visi StockWatch untuk membantu UMKM" />
      </div>
    </div>
  </div>
</section>

      <section className="about-section-new values-section">
        <div className="container-new">
          <h2 className="section-title-new">Nilai-Nilai Kami</h2>
          <div className="values-grid-new">
            {coreValues.map((value, index) => (
              <div key={index} className="value-card-new">
                <span className="value-icon-new">{value.icon}</span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
<section className="about-section-new team-section">
        <div className="container-new">
          <h2 className="section-title-new">Tim StockWatch</h2>
          
          {/* Team Introduction */}
          <div className="team-intro-new">
            <p>"Lima orang dengan satu misi: membuat pengelolaan stok jadi lebih mudah untuk semua UMKM di Indonesia."</p>
          </div>

          {/* Team Members Grid */}
          <div className="team-grid-new">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member-card-new">
                <img src={member.img} alt={member.name} className="team-member-img-new" />
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>

          {/* Team Culture */}
          <div className="team-culture-new">
            <h3>Prinsip Kami</h3>
            <div className="team-culture-quotes-new">
              <div className="culture-quote-new">
                <span className="quote-icon">💡</span>
                <p>"Solusi sederhana untuk masalah kompleks"</p>
              </div>
              <div className="culture-quote-new">
                <span className="quote-icon">🤝</span>
                <p>"Mendengarkan keluhan pengguna adalah prioritas utama"</p>
              </div>
              <div className="culture-quote-new">
                <span className="quote-icon">🚀</span>
                <p>"Berkembang bersama dengan UMKM Indonesia"</p>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="team-decoration-new decoration-1"></div>
          <div className="team-decoration-new decoration-2"></div>
          <div className="team-decoration-new decoration-3"></div>
        </div>
      </section>

      <section className="about-section-new final-cta-about">
        <div className="container-new">
          <h2>Yuk, Ngobrol dengan Kami!</h2>
          <p>
            Punya pertanyaan? Mau sharing pengalaman? Atau pengen tau lebih lanjut tentang StockWatch? 
            Jangan ragu untuk menghubungi kami. Tim kami siap membantu Anda.
          </p>
          <Link to="/contactus" className="btn-new btn-primary-new">Hubungi Kami Sekarang</Link>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;