import React from 'react';
import gfgLogo from '../public/img/Evidencia1.png';

const Intro: React.FC = () => {
    return (
        <div className="App">
            Image at public/img/Evidencia1.png : <br />
            <img src={gfgLogo} alt="GFG Logo" />
            <br />
            Image at public/img/Evidencia1.png: <br />
            <img
                src={process.env.PUBLIC_URL + "/logo512.png"}
                alt="Public GFG Logo"
            />
            <br />
        </div>
    );
};

export default Intro;
