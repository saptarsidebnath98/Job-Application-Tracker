import { useState } from "react"
import { Link } from "react-router-dom";
import { validateEmail } from "../utils/utility";


const Register = () => {

    const [registerName, setRegisterName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");


    const handleChange = (e, setFunc) => {
        setFunc(e.target.value);
    }



    const handleRegister = () => {
        if(registerName && registerEmail && registerPassword && validateEmail(registerEmail)){
            console.log({name: registerEmail, email: registerEmail, password: registerPassword})
            setRegisterName("");
            setRegisterEmail("");
            setRegisterPassword("");
        }
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
                    <label htmlFor="register_email">Email:</label>
                    <input type="text" id="register_email" placeholder="email" value={registerEmail} onChange={(e) => handleChange(e, setRegisterEmail)}/>
                    <label htmlFor="register_password">Password:</label>
                    <input type="password" id="register_password" placeholder="password" value={registerPassword} onChange={(e) => handleChange(e, setRegisterPassword)}/>
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
