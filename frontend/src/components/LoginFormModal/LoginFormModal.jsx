// frontend/src/components/LoginFormModal/LoginFormModal.jsx

import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    setErrors({});
    setCredential("");
    setPassword("");
  }, []);

const isButtonDisabled = credential.length < 4 || password.length < 6;

const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
  const data = await res.json();
  if (data && data.errors) {
   setErrors(data.errors);
   }
  });
 };

const handleDemoLogin = (e) => {
  e.preventDefault();
  setErrors({});
  dispatch(sessionActions.login({ credential: 'demo@user.io', password: 'password' }))
  .then(closeModal)
  .catch(async (res) => {
const data = await res.json();
  if (data && data.errors) setErrors(data.errors);
    });
};

  return (
 <div className="login-modal">
  <button 
className="close-modal-btn" 
onClick={closeModal}>&times;</button>
<h1>Log in</h1>
<form onSubmit={handleSubmit}>
     
<label>
Username or Email
  <input
  type="text"
  value={credential}
  onChange={(e) => setCredential(e.target.value)}
  required
 />
</label>

<label>
Password
<input
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
/>
</label>
        
 {errors.credential && (
 <p className="error">{errors.credential}</p>
 )}
<button 
type="submit" 
className="login-button" 
disabled={isButtonDisabled}> 
  Log In</button>
</form>


<a href="#" className="demo-user-link" onClick={handleDemoLogin}>Demo User</a>
</div>
);
    }

export default LoginFormModal;