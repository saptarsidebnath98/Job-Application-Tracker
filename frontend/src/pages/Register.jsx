import { useState } from "react"
import { Link } from "react-router-dom";
import { validateEmail, validatePassword } from "../utils/utility";


const Register = () => {

    const [registerName, setRegisterName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [error, setError] = useState({});


    const handleChange = (e, setFunc) => {
        setFunc(e.target.value);
    }



    const handleRegister = () => {
        if(!registerName){
            setError(prevState => {
                return {...prevState, name: "Please provide name"}
            })
        }
        if(!registerEmail){
            setError(prevState => {
                return {...prevState, email: "Please provide email"}
            })
        }
        if(!registerPassword){
            setError(prevState => {
                return {...prevState, password: "Please provide password"}
            })
        }
        if(registerPassword && !validatePassword(registerEmail)){
            setError(prevState => {
                return {...prevState, password: "Password length must be 8 or above"}
            })
        }
       

        if(registerName && registerEmail && registerPassword && validateEmail(registerEmail) && validatePassword(registerEmail)){
            console.log({name: registerName, email: registerEmail, password: registerPassword});
            setRegisterName("");
            setRegisterEmail("");
            setRegisterPassword("");
            setError({});
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
                    <span className="error_text">{error.name && error.name}</span>
                    <label htmlFor="register_email">Email:</label>
                    <input type="text" id="register_email" placeholder="email" value={registerEmail} onChange={(e) => handleChange(e, setRegisterEmail)}/>
                    <span className="error_text">{error.email && error.email}</span>
                    <label htmlFor="register_password">Password:</label>
                    <input type="password" id="register_password" placeholder="password" value={registerPassword} onChange={(e) => handleChange(e, setRegisterPassword)}/>
                    <span className="error_text">{error.password && error.password}</span>
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
