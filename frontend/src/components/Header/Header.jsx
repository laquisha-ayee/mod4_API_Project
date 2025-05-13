import React from 'react';
import { NavLink } from 'react-router-dom';
import ProfileButton from '../Navigation/ProfileButton';
import './Header.css';

function Header() {
    return (
    <header className="header">
    <div className="header-content">
<NavLink to="/" className="logo-link">
<img src="https://images.pexels.com/photos/2002719/pexels-photo-2002719.jpeg?auto=compress&cs=tinysrgb&w=1200"></img>
</NavLink>
</div>

<div className="header-content">
<NavLink to>


</NavLink>

</div>




</header>


    );

}