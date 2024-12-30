import ModeToggle from "./modeToggle";

const Footer = () => {
  return (
    <div className="flex px-2 text-xl flex-row justify-between h-min">
      <div className="flex flex-row whitespace-pre items-center">
        <p className="font-bold text-sm">Made By </p>
        <a
          className="link text-sm text-[#1da1f2] font-bold"
          href="https://www.linkedin.com/in/sohamnagi/"
        >
          Soham Nagi
        </a>
      </div>
      <div>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Footer;
