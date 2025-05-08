import { NavLink } from "react-router-dom"; // or use Link

function HomePage() {
  return (
    <div>
      <h1>WELCOME TO MY PROJECT!</h1>
      <NavLink to="/spots">View All Spots</NavLink>
      {}
    </div>
  );
}

export default HomePage;
