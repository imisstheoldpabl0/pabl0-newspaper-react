import React from "react";
import { Link } from 'react-router-dom'
import "./Nav.css";

const Nav = () => {
  return <nav>
    <ul>
      <li className="nav-link active"><Link to='/ciudad/ameghino/'>AMEGHINO</Link></li>
      <li className="nav-link active"><Link to='/ciudad/arenales/'>ARENALES</Link></li>
      <li className="nav-link active"><Link to='/ciudad/bragado/'>BRAGADO</Link></li>
      <li className="nav-link active"><Link to='/ciudad/chacabuco/'>CHACABUCO</Link></li>
      <li className="nav-link active"><Link to='/ciudad/junin/'>JUNÍN</Link></li>
      <li className="nav-link active"><Link to='/ciudad/lincoln/'>LINCOLN</Link></li>
      <li className="nav-link active"><Link to='/ciudad/pinto/'>PINTO</Link></li>
      <li className="nav-link active"><Link to='/ciudad/rojas/'>ROJAS</Link></li>
    </ul>
  </nav>;
};

export default Nav;
