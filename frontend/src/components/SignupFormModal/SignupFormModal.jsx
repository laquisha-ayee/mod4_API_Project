// frontend/src/components/SignupFormModal/SignupFormModal.jsx

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  
const isDisabled =
  !email ||
  !username ||
  !firstName ||
  !lastName ||
  !password ||
  !confirmPassword ||
password.length < 6 ||
username.length < 4 ||
password !== confirmPassword;

const handleSubmit = (e) => {
e.preventDefault();
if (password === confirmPassword) {
setErrors({});
  return dispatch(
sessionActions.signup({
  email,
  username,
  firstName,
  lastName,
  password
})
)
.then(closeModal)
.catch(async (res) => {
const data = await res.json();
  if (data?.errors) {
setErrors(data.errors);
}
  });
    }


return setErrors({
  confirmPassword: "Confirm Password field must be the same as the Password field"
});
  };

return (
<div className="signup-form">
  <div className="signup-form-content">
 <button className="close-modal-btnB" onClick={closeModal}>
    &times;
 </button>

<h1>Enter Your Information</h1>
  <form onSubmit={handleSubmit}>
   <label>
  Email
   <input
     type="text"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
   />
  </label>
{errors.email && <p className="error">{errors.email}</p>}

<label>
Username
  <input
 type="text"
value={username}
onChange={(e) => setUsername(e.target.value)}
required
/>
  </label>
{errors.username && <p className="error">{errors.username}</p>}

 <label>
 First Name
<input
 type="text"
 value={firstName}
  onChange={(e) => setFirstName(e.target.value)}
required
/>
  </label>
{errors.firstName && <p className="error">{errors.firstName}</p>}

<label>
 Last Name
  <input
type="text"
value={lastName}
onChange={(e) => setLastName(e.target.value)}
required
/>
  </label>
{errors.lastName && <p className="error">{errors.lastName}</p>}

 <label>
 Password
 <input
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
  />
  </label>
  {errors.password && <p className="error">{errors.password}</p>}

  <label>
 Confirm Password
 <input
type="password"
value={confirmPassword}
onChange={(e) => setConfirmPassword(e.target.value)}
required
/>
</label>
 {errors.confirmPassword && (
<p className="error">{errors.confirmPassword}</p>
)}

<button type="submit" className="signup-button" disabled={isDisabled}>Sign Up</button>
</form>
   </div>
      </div>
);
  }

export default SignupFormModal;