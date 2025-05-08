// frontend/src/components/Navigation/ProfileButton.jsx

import { useState } from "react";
import { useModal } from "../../context/useModal";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";

function ProfileButton({ user }) {
  const [showMenu, setShowMenu] = useState(false);
  const { setModalContent } = useModal();

  const openLoginModal = () => setModalContent(<LoginFormModal />);
  const openSignupModal = () => setModalContent(<SignupFormModal />);

  const toggleMenu = () => setShowMenu(prev => !prev);

  return (
    <div className="profile-button">
      <button onClick={toggleMenu}>
        {user ? user.username : "Profile"}
      </button>
      {showMenu && (
        <ul className="profile-dropdown">
          {user ? (
            <>
              <li>{user.username}</li>
              <li>{user.email}</li>
              {/* Add logout or other user options here */}
            </>
          ) : (
            <>
              <li>
                <button onClick={openLoginModal}>Log In</button>
              </li>
              <li>
                <button onClick={openSignupModal}>Sign Up</button>
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;