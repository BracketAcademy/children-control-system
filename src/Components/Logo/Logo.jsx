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
        marginTop: "1em",
        maxWidth: "10em",
      }}
    />
  );
};

export default Logo;
