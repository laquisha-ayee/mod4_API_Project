// frontend/src/components/Navigation/ProfileButton.jsx
import { useState, useEffect, useRef } from "react";
import { useModal } from "../../context/Modal";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import { useNavigate } from "react-router-dom";

function ProfileButton({ user }) {
  const [showMenu, setShowMenu] = useState(false);
  const { setModalContent } = useModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = useRef(null);


  const openLoginModal = () => { setModalContent(<LoginFormModal />); setShowMenu(false); };
  const openSignupModal = () => { setModalContent(<SignupFormModal />); setShowMenu(false); };
const toggleMenu = () => setShowMenu(prev => !prev);

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    setShowMenu(false);
  };

  return (
  <div className="profile-menu-container" ref={menuRef}>
  <button  className="profile-menu-btn" onClick={toggleMenu} aria-label="Profile menu">

 <span className="menu-icon">&#9776;</span>
<span className="profile-pic">
  <img
src="https://images.pexels.com/photos/1415378/pexels-photo-1415378.jpeg?auto=compress&cs=tinysrgb&w=1200"
alt="Profile"
 />
  </span>
</button>
  {showMenu && (
<ul className="profile-dropdown">
  {!user ? (
<>
<li>
  <button onClick={openSignupModal}>Sign up</button>
</li>
<li>
  <button onClick={openLoginModal}>Log in</button>
</li>
</>
  ) : (
<>
  <li>
    <button onClick={() => {
  navigate('/spots/current');
  setShowMenu(false);
}}>
  Manage Spots
  </button>
      </li>
      <li>
 <button onClick={() => {
  navigate('/reviews/current');
  setShowMenu(false);
 }}>
         Manage Reviews
 </button>
    </li>
 <li>
  <button onClick={logout}>
      Log Out
  </button>
  </li>
   </>
   )}
</ul>
      )}
    </div>
  );
}

export default ProfileButton;