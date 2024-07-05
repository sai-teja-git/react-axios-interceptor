import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import apiService from "../services/api.service"

export default function Login() {

    const navigate = useNavigate()

    function login() {
        const body = {
            username: "test_user"
        }
        apiService.login(body).then((res) => {
            const data = res.data?.data ?? {}
            sessionStorage.setItem("access_token", data.token)
            sessionStorage.setItem("user_full_name", data.name)
            console.log('res', res)
            navigate("/data")
        }).catch(() => {
            toast.error("Login Failed", {
                id: "login-failed"
            })
        })
    }

    return (
        <>
            <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <button className="btn btn-outline-primary btn-lg" onClick={() => login()}>Login</button >
            </div >
        </>
    )
}