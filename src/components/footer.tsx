import ModeToggle from "./modeToggle";

const Footer = () => {
  return (
    <div className=" w-100% flex flex-row w-100% justify-between items-center px-2 h-max overflow-hidden">
      <div className=" flex flex-row gap-1">
        <p className="font-bold text-sm">Made By </p>
        <a
          className="link text-sm text-sitemain font-bold"
          href="https://www.linkedin.com/in/sohamnagi/"
        >
          Soham Nagi
        </a>
      </div>
      <div>
        <ModeToggle></ModeToggle>
      </div>
    </div>
  );
};

export default Footer;
