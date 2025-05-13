// frontend/src/components/Navigation/Navigation.jsx

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
 
  return (
 <ul className="navigation-bar">
<li>
  <NavLink to="/" className="logo-link">
<img
  src="https://images.pexels.com/photos/2002719/pexels-photo-2002719.jpeg?auto=compress&cs=tinysrgb&w=1200"
  alt="Logo"
  className="logo-img"   
/>
</NavLink>
</li>


<li>
  <NavLink to="/spots/new" className="create-spot-link">
 Create A New Spot
  </NavLink>
</li>

      
{isLoaded && (
 <li className="profile-nav-item">
  <ProfileButton user={sessionUser} />
</li>

)}

</ul>
  );
}

export default Navigation;