import { useState } from "react";
import { validateEmail, validatePassword } from "../utils/utility";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e, setFunc) => {
        setFunc(e.target.value);
    }

    const handleLogin = async () => {
        setError(null);

        const errorObject = {};

        if (!loginEmail) {

            errorObject.email = "Please provide email";

        }
        if (!loginPassword) {

            errorObject.password = "Please provide password";

        }

        if (loginEmail && !validateEmail(loginEmail)) {
            errorObject.email = "Invalid email format";
        }
        if (loginPassword && !validatePassword(loginPassword)) {
            errorObject.password = "Password length must be 8 or above";
        }

        setError(errorObject);


        if (Object.keys(errorObject).length === 0) {
            console.log({ email: loginEmail, password: loginPassword });
            try {
                const response = await fetch("http://localhost:5000/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email: loginEmail, password: loginPassword })
                });
                if (!response.ok) {
                    const resErr = await response.json();

                    toast.error(resErr.message);
                    return

                }

                const { token } = await response.json();

                localStorage.setItem("accessToken", token);
                toast.success("Welcome Back!")
                setLoginEmail("");
                setLoginPassword("");
                setError(null);
                navigate('/jobs');



                // eslint-disable-next-line no-unused-vars
            } catch (err) {
                toast.error("Unable to connect to the server. Please try again.");
            }

        }

        return;
    }
    return (
        <div>
            <header>
                <h1>Login</h1>
            </header>

            <main>
                <section id="login_form">
                    <label htmlFor="login_email">Email:</label>
                    <input type="text" id="login_email" placeholder="email" value={loginEmail} onChange={(e) => handleChange(e, setLoginEmail)} />
                    <span className="error_text">{error && error.email}</span>
                    <label htmlFor="login_password">Password:</label>
                    <input type="password" id="login_password" placeholder="password" value={loginPassword} onChange={(e) => handleChange(e, setLoginPassword)} />
                    <span className="error_text">{error && error.password}</span>
                    <div className="register_login_message">Don't have an account?
                        <span>
                            <Link to="/register">Register</Link>
                        </span>
                    </div>
                    <button onClick={handleLogin}>Login</button>
                </section>
            </main>
            <footer></footer>
        </div>
    )
}

export default Login
