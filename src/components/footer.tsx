import ModeToggle from "./modeToggle";

const Footer = () => {
  return (
    <div className="flex px-2 text-xl flex-row justify-between h-min">
      <div className="flex flex-row whitespace-pre">
        <p>Made By </p>
        <a
          className="link link-accent"
          href="https://www.linkedin.com/in/sohamnagi/"
        >
          Soham Nagi
        </a>
      </div>
      <div className="">
        <ModeToggle />
      </div>
    </div>
  );
};

export default Footer;
