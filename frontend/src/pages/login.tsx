import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Login</h1>

        <div className="google-wrapper">
          <GoogleLogin
            onSuccess={(res) => {
              const token = res.credential || "";
              const payload = JSON.parse(atob(token.split(".")[1]));
            
              localStorage.setItem("token", token);
              localStorage.setItem("user", JSON.stringify({
                name: payload.name,
                email: payload.email,
                avatar: payload.picture,
              }));
              navigate("/dashboard");
            }}
            onError={() => {
              console.error("Google login failed");
            }}
            theme="outline"
            size="large"
            shape="rectangular"
            width="275"
          />
        </div>

        <div className="divider">
          <span>or sign up through email</span>
        </div>

        <form>
          <input type="email" placeholder="Email ID" />

          <input type="password" placeholder="Password" />

          <button type="button" className="login-btn" disabled>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}