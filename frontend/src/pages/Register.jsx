import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../utils/utility";


const Register = () => {

    const [registerName, setRegisterName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [error, setError] = useState(null);
    const [serverError, setServerError] = useState(null);

    const navigate = useNavigate();


    const handleChange = (e, setFunc) => {
        setFunc(e.target.value);
    }



    const handleRegister = async () => {
        setError(null);
        setServerError(null);
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
                const response = await fetch("http://localhost:5000/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name: registerName, email: registerEmail, password: registerPassword })
                });
                if (!response.ok) {
                    const resErr = await response.json();

                    setServerError(resErr.message);
                    return

                }

                // eslint-disable-next-line no-unused-vars
                const data = await response.json();
          
                setRegisterName("");
                setRegisterEmail("");
                setRegisterPassword("");
                setError(null);
                setServerError(null);
                navigate('/login');

            } catch (err) {
                console.error(err.message);
                setServerError("Unable to connect to the server. Please try again.");
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
                    <span className="error_text">{serverError && serverError}</span>
                    <button onClick={handleRegister}>Register</button>
                </section>
            </main>
            <footer></footer>
        </div>
    )
}

export default Register
