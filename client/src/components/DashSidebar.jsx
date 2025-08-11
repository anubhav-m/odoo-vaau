import {
  Sidebar,
  SidebarItems,
  SidebarItemGroup,
  SidebarItem,
} from "flowbite-react";
import {
  HiArrowSmRight,
  HiDocumentText,
  HiUser,
  HiOutlineUserGroup,
  HiChartPie,
  HiAnnotation,
} from "react-icons/hi";
import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signOutStart,
  signOutSuccess,
  signOutFailure,
} from "../redux/user/userSlice";

export default function DashSidebar() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) setTab(tabFromUrl);
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/user/signout", {
        method: "POST",
        "Content-Type": "application/json",
      });

      if (!res.ok) {
        dispatch(signOutFailure());
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      dispatch(signOutFailure());
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <SidebarItems>
        <SidebarItemGroup className="flex flex-col gap-1">
          {currentUser && currentUser.isAdmin && (
            <Link to="/dashboard?tab=dash">
              <SidebarItem
                active={tab === "dash" || !tab}
                icon={HiChartPie}
                as="div"
              >
                Dashboard
              </SidebarItem>
            </Link>
          )}

          <Link to="/dashboard?tab=profile">
            <SidebarItem
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </SidebarItem>
          </Link>

          {currentUser &&
            (currentUser.isFacilityOwner || currentUser.isAdmin) && (
              <Link to="/dashboard?tab=facilities">
                <SidebarItem
                  active={tab === "facilities"}
                  icon={HiDocumentText}
                  as="div"
                >
                  Facilities
                </SidebarItem>
              </Link>
            )}

          {currentUser && currentUser.isFacilityOwner && (
            <Link to="/dashboard?tab=courts">
              <SidebarItem
                active={tab === "courts"}
                icon={HiDocumentText}
                as="div"
              >
                Courts
              </SidebarItem>
            </Link>
          )}

          {currentUser && currentUser.isAdmin && (
            <Link to="/dashboard?tab=users">
              <SidebarItem
                active={tab === "users"}
                icon={HiOutlineUserGroup}
                as="div"
              >
                Users
              </SidebarItem>
            </Link>
          )}

          {currentUser && currentUser.isAdmin && (
            <Link to="/dashboard?tab=comments">
              <SidebarItem
                active={tab === "comments"}
                icon={HiAnnotation}
                as="div"
              >
                Feedback
              </SidebarItem>
            </Link>
          )}
        </SidebarItemGroup>

        <SidebarItemGroup>
          <SidebarItem
            icon={HiArrowSmRight}
            onClick={handleSignOut}
            className="cursor-pointer"
          >
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
