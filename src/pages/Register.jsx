import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    validateInvitation,
    acceptInvitation
} from "../services/invitationService";


function Register() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [loading, setLoading] = useState(true);
    const [invitation, setInvitation] = useState(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {

        console.log("Register page loaded");

        console.log("Token:", token);

        if (!token) {

            alert("Invalid invitation link");

            setLoading(false);

            return;

        }

        loadInvitation();

    }, []);

  const loadInvitation = async () => {

    console.log("Calling backend...");

    try {

        const invitationData = await validateInvitation(token);

        console.log("Backend Response:", invitationData);

        setInvitation(invitationData);

    } catch (error) {

        console.log(error);
        console.log(error.response);
        console.log(error.response?.data);

        alert(error.response?.data || error.message);

    } finally {

        setLoading(false);

    }
};

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {

            alert("Passwords do not match");

            return;

        }

        try {

            await acceptInvitation({

                token,
                firstName,
                lastName,
                phone,
                password

            });

            alert("Registration Successful");

            navigate("/login");

        } catch (error) {

            console.log(error);

            console.log(error.response);

            console.log(error.response?.data);

            alert(error.response?.data || error.message);

        }

    };

    if (loading) {

        return <h2>Loading...</h2>;

    }

    if (!invitation) {

        return <h2>Invitation not found.</h2>;

    }

    return (

        <div
            style={{
                width: "500px",
                margin: "40px auto",
                padding: "30px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                boxShadow: "0px 0px 10px lightgray"
            }}
        >

      <h2>Project Invitation</h2>

<hr />

<p><strong>Email:</strong> {invitation.email}</p>

<p><strong>Organization:</strong> {invitation.organizationName}</p>

<p><strong>Project:</strong> {invitation.projectName}</p>

<p><strong>Role:</strong> {invitation.role}</p>

<p><strong>Designation:</strong> {invitation.designation}</p>

<p><strong>Invited By:</strong> {invitation.invitedBy}</p>

<hr />

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    style={styles.input}
                />

                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    style={styles.input}
                />

                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    style={styles.input}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={styles.input}
                />

                <button
                    type="submit"
                    style={styles.button}
                >
                    Create Account
                </button>

            </form>

        </div>

    );

}

const styles = {

    input: {

        width: "100%",
        padding: "10px",
        marginBottom: "15px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        boxSizing: "border-box"

    },

    button: {

        width: "100%",
        padding: "12px",
        backgroundColor: "#1976d2",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"

    }

};

export default Register;