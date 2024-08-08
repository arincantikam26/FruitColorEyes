// src/components/BaseLayout.jsx
import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./include/layout.css";
import { NavLink } from "react-router-dom";
import MenuItem from "./include/MenuItem";

const BaseLayout = () => {
  return (
    <div className="baseLayout">
      <aside>
        <div className="card">
          <div className="card-body sidebar">
            <img
              src="https://i2.cdn.turner.com/cnnnext/dam/assets/140926165711-john-sutter-profile-image-large-169.jpg"
              alt=""
            />
            <nav>
              <ul>
                <li>
                  <MenuItem to="/profile" label="Profile" />
                </li>
                <hr />
                <li>
                  <MenuItem to="/" label="Inspection" />
                </li>
                <li>
                  <MenuItem to="/train-data" label="Train Data" />
                </li>
                <li>
                  <MenuItem to="/monitoring" label="Monitoring" />
                </li>
                <hr />
                <li className="mt-4">
                  <Link to="#" className="menuItemLogout">
                    Logout
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </aside>
      <main>
        <div className="card">
          <div className="card-body">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BaseLayout;
