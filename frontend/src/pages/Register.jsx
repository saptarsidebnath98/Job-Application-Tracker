import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../utils/utility";
import toast from "react-hot-toast";


const Register = () => {

    const [registerName, setRegisterName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();


    const handleChange = (e, setFunc) => {
        setFunc(e.target.value);
    }



    const handleRegister = async () => {
        setError(null);
        const errorObject = {};

        if (!registerName) {

            errorObject.name = "Please provide name";

        }
        if (!registerEmail) {

            errorObject.email = "Please provide email";

        }
        if (!registerPassword) {

            errorObject.password = "Please provide password";

        }

        if (registerEmail && !validateEmail(registerEmail)) {

            errorObject.email = "Invalid email format";

        }
        if (registerPassword && !validatePassword(registerPassword)) {

            errorObject.password = "Password length must be 8 or above";

        }

        setError(errorObject);


        if (Object.keys(errorObject).length === 0) {

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name: registerName, email: registerEmail, password: registerPassword })
                });
                if (!response.ok) {
                    const resErr = await response.json();
                    toast.error(resErr.message);
                    return

                }

                // eslint-disable-next-line no-unused-vars
                const data = await response.json();
                toast.success("User registered successfully!");
                setRegisterName("");
                setRegisterEmail("");
                setRegisterPassword("");
                setError(null);
                navigate('/login');

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
                <h1>Register</h1>
            </header>

            <main>
                <section id="register_form">
                    <label htmlFor="register_name">Name:</label>
                    <input type="text" id="register_name" placeholder="name" value={registerName} onChange={(e) => handleChange(e, setRegisterName)}/>
                    <span className="error_text">{error && error.name}</span>
                    <label htmlFor="register_email">Email:</label>
                    <input type="text" id="register_email" placeholder="email" value={registerEmail} onChange={(e) => handleChange(e, setRegisterEmail)}/>
                    <span className="error_text">{error && error.email}</span>
                    <label htmlFor="register_password">Password:</label>
                    <input type="password" id="register_password" placeholder="password" value={registerPassword} onChange={(e) => handleChange(e, setRegisterPassword)}/>
                    <span className="error_text">{error && error.password}</span>
                    <div className="register_login_message">already have account?
                        <span>
                            <Link to="/login">Login</Link>
                        </span>
                    </div>
                    <button onClick={handleRegister}>Register</button>
                </section>
            </main>
            <footer></footer>
        </div>
    )
}

export default Register
