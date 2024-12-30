import { Link } from "react-router";

export default function Navbar() {
  return (
    <div className="navbar mb-2 bg-[#276bff]">
      <div className="navbar-start">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/authors" className="font-bold">
              Authors
            </Link>
          </li>
          <li>
            <Link to="/songs" className="font-bold">
              Songs
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-center">
        <Link to="/" className="btn btn-ghost font-['Russo_One'] text-3xl">
          Lyrix
        </Link>
      </div>
      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
