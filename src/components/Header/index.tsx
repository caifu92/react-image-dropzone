import React from 'react';
import './style.scss';

const Header = (): JSX.Element => {
    return (
        <div className="header">
            <div className="header__logo">Company Logo</div>
            <div className="header__description">Logo should be square, 100px size and in png, jpeg file format.</div>
        </div>
    )
};

export default Header;
