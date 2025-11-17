import logo from "./Logo.png";
const Logo = ({ white }) => {
  return (
    <img
      src={logo}
      alt="logo"
      width="100%"
      style={{
        filter: !white ? "none" : "invert(1)",
        margin: "auto",
        maxWidth: "15em",
      }}
    />
  );
};

export default Logo;
