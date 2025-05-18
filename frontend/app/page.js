import Image from "next/image";
import Logo from '../public/images/hris-logo.png';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export default function Home() {
  return (
    <div className="items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      <header className="w-full sticky top-10 z-50"> {/* z-50 untuk memastikan navbar berada di atas */}
        <nav className="bg-black text-white px-20 py-5 flex justify-between items-center rounded-full shadow-md max-w-4xl mx-auto">
          {/* Menu */}
          <ul className="flex space-x-10 text-sm font-medium">
            <li><a href="#home" className="hover:text-[#7CA5BF] transition">Home</a></li>
            <li><a href="#about" className="hover:text-[#7CA5BF] transition">Tentang HRIS</a></li>
            <li><a href="#services" className="hover:text-[#7CA5BF] transition">Fitur</a></li>
          </ul>
          
          {/* Logo */}
          <div className="group flex items-center justify-center w-24 h-12 bg-white rounded-full overflow-hidden">
            <Image 
              src={Logo} 
              alt="Logo HRIS" 
              width={40} 
              height={40} 
              className="rounded-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-80"
            />
          </div>

          {/* Menu */}
          <ul className="flex space-x-10 text-sm font-medium">
            <li><a href="#resume" className="hover:text-[#7CA5BF] transition">Galeri</a></li>
            <li><a href="#projects" className="hover:text-[#7CA5BF] transition">Tim Pengembang</a></li>
            <li><a href="/sign-in" className="hover:text-[#7CA5BF] transition">Sign In</a></li>
          </ul>
        </nav>
      </header>
      
      <main className="row-start-2 flex flex-col items-center sm:items-start text-center sm:text-left">
        <section id="hero" className="w-full text-center flex flex-col items-center py-16 bg-white px-6 sm:px-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight max-w-3xl">
          CMLABS HRIS <br />
          <span className="text-[#1E3A5F]">Human Resource Information System</span>
        </h1>
        <p className="mt-4 text-gray-600 text-lg max-w-xl">
          Solusi terintegrasi untuk manajemen kehadiran, penggajian, dan data karyawan dalam satu platform efisien.
        </p>


          <div className="mt-8 flex gap-4">
          <a
            href="/dashboard"
            className="px-6 py-3 bg-[#1E3A5F] text-white font-semibold rounded-full hover:bg-[#162e49] transition"
          >
            Coba Demo
          </a>

          <a
            href="#contact"
            className="px-6 py-3 border border-gray-400 text-gray-700 rounded-full hover:border-[#1E3A5F] hover:text-[#1E3A5F] transition"
          >
            Hubungi Kami
          </a>
          </div>

          {/* Optional: Add image */}
          {/* <div className="mt-12">
            <img src="/images/hris-illustration.png" alt="HRIS Illustration" className="w-full max-w-md" />
          </div> */}
        </section>

        <section id="services" className="bg-black text-white py-20 px-6 sm:px-12 rounded-4xl">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h2 className="text-3xl font-bold">
                <span className="text-[#1E3A5F]">My</span> Services
              </h2>
              <p className="text-white max-w-md text-sm sm:text-base mt-4 sm:mt-0">
                Kami menyediakan solusi HRIS berbasis web dan mobile untuk memenuhi kebutuhan perusahaan modern.
              </p>
            </div>

            <div className="w-full h-0.5 bg-[#1E3A5F] rounded-full mt-4 sm:mt-6 mb-8"></div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Service Card 1 */}
              <div className="bg-[#1a1a1a] p-6 rounded-t-xl shadow hover:shadow-lg transition">
                <h3 className="text-lg font-bold mb-3">Absensi & Lembur</h3>
                <img src="/images/absensi.png" alt="Absensi" className="rounded-xl mb-4" />
                <p className="text-gray-400 text-sm">Pencatatan kehadiran otomatis dengan dukungan GPS, biometrik, dan cuti.</p>
              </div>

              {/* Service Card 2 */}
              <div className="bg-[#1a1a1a] p-6 rounded-t-xl shadow hover:shadow-lg transition border-t-4 border-[#1E3A5F]">
                <h3 className="text-lg font-bold mb-3">Payroll System</h3>
                <img src="/images/payroll.png" alt="Payroll" className="rounded-xl mb-4" />
                <p className="text-gray-400 text-sm">Penggajian otomatis lengkap dengan tunjangan, potongan, dan slip gaji.</p>
              </div>

              {/* Service Card 3 */}
              <div className="bg-[#1a1a1a] p-6 rounded-t-xl shadow hover:shadow-lg transition">
                <h3 className="text-lg font-bold mb-3">Manajemen Karyawan</h3>
                <img src="/images/employee-management.png" alt="Manajemen" className="rounded-xl mb-4" />
                <p className="text-gray-400 text-sm">Pantau status, dokumen, dan histori karyawan secara real-time.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="resume" className="py-20 bg-white px-6 sm:px-12">
          <div className="max-w-full mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Let’s Have a Look at <span className="text-[#1E3A5F]">my Portfolio</span>
            </h2>

            <div className="relative flex items-center justify-center mt-10">
              {/* Arrow Left */}
              <button className="absolute left-0 bg-gray-100 p-2 rounded-full shadow hover:scale-105 transition">
                <span className="text-xl">{'‹'}</span>
              </button>

              {/* Portfolio Images */}
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-gray-50 rounded-xl shadow p-6">
                <img src="/images/portfolio1.png" alt="Portfolio 1" className="w-full sm:w-1/2 rounded-lg" />
                <img src="/images/portfolio2.png" alt="Portfolio 2" className="w-full sm:w-1/2 rounded-lg" />
              </div>

              {/* Arrow Right */}
              <button className="absolute right-0 bg-gray-100 p-2 rounded-full shadow hover:scale-105 transition">
                <span className="text-xl">{'›'}</span>
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-6 text-sm">
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full">UI/UX Design</span>
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full">Landing Page</span>
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full">Workflow</span>
            </div>

            <div className="mt-4 text-gray-500 max-w-xl mx-auto text-sm">
              <p>
                Food Express - Food Delivery Solution. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Vestibulum et libero et metus dignissim...
              </p>
            </div>

            <a
              href="#"
              className="inline-block mt-8 px-6 py-3 bg-[#1E3A5F] text-white rounded-full hover:bg-[#162e49] transition"
            >
              See More
            </a>
          </div>
        </section>

        <section id="contact" className="bg-white py-20 px-6 sm:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Punya pertanyaan? Silakan hubungi kami melalui form di bawah ini atau media sosial kami.
            </p>

            <form className="grid gap-6 text-left">
              <div className="grid sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                />
                <input
                  type="email"
                  placeholder="Alamat Email"
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                />
              </div>
              <textarea
                placeholder="Pesan Anda"
                rows={5}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
              ></textarea>
              <button
                type="submit"
                className="bg-[#1E3A5F] text-white px-6 py-3 rounded-full hover:bg-[#162e49] transition"
              >
                Kirim Pesan
              </button>
            </form>
          </div>
        </section>

      </main>


      <footer className="row-start-3 w-full bg-gray-100 py-8 px-6 text-sm text-gray-600 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          
          {/* Left: Copyright */}
          <p>&copy; {new Date().getFullYear()} CMLABS. All rights reserved.</p>
          
          {/* Middle: Links */}
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-[#1E3A5F] transition">Privacy Policy</a>
            <a href="#terms" className="hover:text-[#1E3A5F] transition">Terms</a>
            <a href="#contact" className="hover:text-[#1E3A5F] transition">Contact</a>
          </div>

          {/* Right: Social Media */}
          <div className="flex gap-4 text-gray-600">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1E3A5F] transition">
              <Facebook size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1E3A5F] transition">
              <Instagram size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1E3A5F] transition">
              <Linkedin size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1E3A5F] transition">
              <Twitter size={20} />
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}
