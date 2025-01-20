import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around text-base gap-4 sm:gap-6 xl:gap-[30rem] items-center bg-white text-black shadow-sm font-mono fixed bottom-0 left-0 z-20 xl:px-[12rem] xl:h-40 h-32 w-full px-4 py-6 sm:py-4">
      <div className="flex flex-col items-start gap-4 justify-start text-center sm:text-left">
        <div className="flex items-start justify-start gap-2">
          <img
            src="/images/Preview.png"
            alt="logo"
            className="w-24 h-[4rem] rounded-md p-2"
          />
        </div>
        <div>
          <h1 className="text-sm sm:text-base">
            In for all the haul, this is the best and most customizable platform for you
          </h1>
        </div>
      </div>

      <div className="flex flex-col items-start gap-2 justify-start text-center sm:text-left">
        <h1 className="text-lg">Contact</h1>
        <div>
          <h1 className="text-sm sm:text-base">Yaoundé, Jouvence</h1>
          <h1 className="text-sm sm:text-base">676184440</h1>
          <h1 className="text-sm sm:text-base">Ticks@gmail.com</h1>
        </div>
      </div>

      <div className="flex flex-col items-start gap-2 justify-start text-center sm:text-left">
        <h1 className="text-lg">Follow us on</h1>
        <div className="flex gap-4 text-2xl sm:text-3xl">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
            <FaFacebook />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
