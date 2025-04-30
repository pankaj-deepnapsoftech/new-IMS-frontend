import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userExists } from "../redux/reducers/authSlice";
import Navigation from "../components/Navigation/Navigation";
import Container from "../components/Container/Container";
import Header from "../components/Header/Header";

const Layout: React.FC = () => {
  const [cookies, setCookie] = useCookies();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginWithTokenHandler = async (token: string) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "auth/login",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setCookie("access_token", data.token, { maxAge: 86400 });
      dispatch(userExists(data.user));
    } catch (err: any) {
      navigate('/login');
      toast.error(err?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (!cookies?.access_token) {
      navigate("/login");
    } else {
      loginWithTokenHandler(cookies?.access_token);
    }
  }, []);

  return (
    <div>
     <Header/>

      <div className="h-[95vh]  flex ">
        <div
          className="h-[inherit]  border: none overflow-x-hidden overflow-y-auto w-0 md:w-[245px]  "
          style={{ boxShadow: "0 0 20px 3px #96beee26" }}
        >
        </div>
        <div className="flex-1  w-[100%] overflow-auto ">
          <Navigation />
          <Container>
            <Outlet />
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Layout;
