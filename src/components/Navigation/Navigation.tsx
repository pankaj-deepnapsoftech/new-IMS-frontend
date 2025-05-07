import { FaAngleDown, FaAngleUp, FaSignOutAlt } from "react-icons/fa";
import routes from "../../routes/routes";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { RiMenu2Line } from "react-icons/ri";
import logo from "../../assets/images/logo/logo.png";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";


const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const [cookie, _, removeCookie] = useCookies();
  const { allowedroutes, isSuper } = useSelector((state: any) => state.auth);
  const [checkMenu, setCheckMenu] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIcon(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);


  const handleCloseMenu = () => {
    if (window.innerWidth < 800) {
      setCheckMenu(false)
    }
  }


  const toggleSubMenusHandler = (path: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };
  const logoutHandler = () => {
    try {
      removeCookie("access_token");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };
  return (
    <>
      {/* Mobile Menu Button */}
      <div className="absolute top-4 left-4 z-50 md:hidden ">
        <div onClick={() => setCheckMenu(!checkMenu)}>
          {checkMenu ? (
            <IoCloseSharp
              size={30}
              className={` absolute left-[12rem] text-white ${showIcon ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
            />
          ) : (
            <RiMenu2Line size={30} className="text-white" />
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-gradient-to-b from-[#252531] to-[#214555] backdrop-blur-xl text-white h-full overflow-auto scrollbar-hidden  
         md:block  ${checkMenu ? "block" : "hidden"
          } 
             fixed z-40 w-64 md:w-auto top-0 left-0 px-3 py-3`}
      >

        {/* Logo */}
        <div className="pt-4 pb-4">
          <img src={logo} alt="blogger" className="w-[190px] filter invert" />
        </div>
        <hr className=" border-1.5 w-[180px] ml-4  relative top-10 border-gray-300" />

        {/* Menu List */}
        <ul className="pt-[50px]">
          {routes.map((route, ind) => {
            const isAllowed =
              isSuper || allowedroutes.includes(route.path.replaceAll("/", ""));

            if (route.isSublink) {
              return (
                <div key={ind}>
                  <li
                    className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-gradient-to-b from-[#83838383] to-[#83838383] hover:text-white text-[15px] font-semibold"
                    onClick={() => toggleSubMenusHandler(route.path)}
                    style={{
                      cursor: isAllowed ? "pointer" : "not-allowed",
                      opacity: isAllowed ? 1 : 0.5,
                      pointerEvents: isAllowed ? "auto" : "none",
                    }}
                  >
                    <span className="text-[25px]">{route.icon}</span>
                    <span>{route.name}</span>
                    <span className="pt-1">
                      {openSubMenus[route.path] ? <FaAngleUp /> : <FaAngleDown />}
                    </span>
                  </li>
                  {openSubMenus[route.path] &&
                    route.sublink?.map((sublink, index) => (
                      <NavLink
                        onClick={handleCloseMenu}
                        key={index}
                        to={route.path + "/" + sublink.path}
                        style={{
                          cursor: isAllowed ? "pointer" : "not-allowed",
                          opacity: isAllowed ? 1 : 0.5,
                          pointerEvents: isAllowed ? "auto" : "none",
                        }}
                      >
                        <li className="flex gap-x-2 pl-5 pr-9 py-3 rounded-lg hover:bg-gradient-to-b from-[#83838383] to-[#83838383] hover:text-white text-[15px] font-semibold">
                          <span className="text-[25px]">{sublink.icon}</span>
                          <span>{sublink.name}</span>
                        </li>
                      </NavLink>
                    ))}
                </div>
              );
            } else if (route.name === "Approval" && isSuper) {
              return (
                <NavLink
                  onClick={handleCloseMenu}
                  key={ind}
                  to={route.path || ""}
                  style={{
                    cursor: isAllowed ? "pointer" : "not-allowed",
                    opacity: isAllowed ? 1 : 0.5,
                    pointerEvents: isAllowed ? "auto" : "none",
                  }}
                >
                  <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-gradient-to-b from-[#83838383] to-[#83838383] hover:text-white text-[15px] font-semibold">
                    <span className="text-[25px]">{route.icon}</span>
                    <span>{route.name}</span>
                  </li>
                </NavLink>
              );
            } else if (route.name !== "Approval") {
              return (
                <NavLink
                  onClick={handleCloseMenu}
                  key={ind}
                  to={route.path || ""}
                  style={{
                    cursor: isAllowed ? "pointer" : "not-allowed",
                    opacity: isAllowed ? 1 : 0.5,
                    pointerEvents: isAllowed ? "auto" : "none",
                  }}
                >
                  <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-gradient-to-b from-[#83838383] to-[#83838383] hover:text-whitetext-[15px] font-semibold">
                    <span className="text-[25px]">{route.icon}</span>
                    <span>{route.name}</span>
                  </li>
                </NavLink>
              );
            }
          })}
        </ul>
        <hr className="my-4 border-1.5 w-[180px] ml-4 relative top-0 border-gray-300" />
        <div className="mt-[40px]">
          <button onClick={logoutHandler} className="flex items-center text-black shadow-2xl justify-center ml-4 h-[40px] w-[150px] gap-2 bg-gradient-to-r from-white to-white hover:scale-105 font-[700] py-2 rounded-md transition-all">
            Log Out
            <FaSignOutAlt
            
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;