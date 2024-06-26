import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/auth.context"


const Navbar = () => {
  const {handleLogout, currentUser} = useContext(AuthContext);

  return (
    <nav>
    <Link to="/">
      <button>Home</button>
    </Link>

    {currentUser ? (
      <button onClick={handleLogout}>Logout</button>
    ) : (
      <>
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </>
    )}
  </nav>
  )
}
export default Navbar