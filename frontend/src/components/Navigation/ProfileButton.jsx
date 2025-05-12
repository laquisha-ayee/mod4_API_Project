// frontend/src/components/Navigation/ProfileButton.jsx

import { useState } from "react";
import { useModal } from "../../context/Modal";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";

function ProfileButton({ user }) {
  const [showMenu, setShowMenu] = useState(false);
  const { setModalContent } = useModal();

  const openLoginModal = () => setModalContent(<LoginFormModal />);
  const openSignupModal = () => setModalContent(<SignupFormModal />);
  const toggleMenu = () => setShowMenu(prev => !prev);

  return (
    <div className="profile-menu-container">
      <button className="profile-menu-btn" onClick={toggleMenu}>
  <i className="fa fa-bars"></i>
  <i className="fa fa-user-circle"></i>
      </button>
  {showMenu && (
  <ul className="profile-dropdown">
    {!user && (
      <>
  <li>
<button onClick={openSignupModal}>Sign up</button>
  </li>
  <li>
<button onClick={openLoginModal}>Log in</button>
  </li>
  </>
    )}
          {/* Add user options here if logged in */}
    </ul>
      )}
    </div>
  );
}

export default ProfileButton;