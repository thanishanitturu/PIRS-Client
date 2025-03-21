import { useContext, useEffect, useState } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const navigation = [
  { name: "Home", href: "/", current: false },
  { name: "About Us", href: "/about", current: false },
  { name: "Report an issue", href: "/issue-report", current: false },
  { name: "Community", href: "/community", current: false },
  { name: "Dashboard", href: "/dashboard", current: false },
];

const adminNavigation = [
  { name: "Issues", href: "admin/issues", current: false },
  { name: "Users", href: "admin/users", current: false },
  { name: "Statistics", href: "admin/statistics", current: false },
];

const departmentAdminNavigation = [
  { name: "Issues", href: "department/issues", current: false },
  { name: "Statistics", href: "department/statistics", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const { role, notifications, setNotifications } = useContext(AppContext);

  const location = useLocation();

  const handleViewAll = () => {
    navigate("/notifications");
  };

  const updateNavigation = (navItems) => {
    return navItems.map((item) => ({
      ...item,
      current: location.pathname === item.href,
    }));
  };

  const updatedNavigation = updateNavigation(navigation);
  const updatedAdminNavigation = updateNavigation(adminNavigation);
  const updatedDepartmentAdminNavigation = updateNavigation(departmentAdminNavigation);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadNotifications = notifications.filter((notif) => !notif.read);

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
                  {open ? <XMarkIcon className="block size-6" /> : <Bars3Icon className="block size-6" />}
                </DisclosureButton>
              </div>

              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-between">
                <div className="flex shrink-0 items-center">
                  <img alt="Your Company" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" className="h-8 w-auto rounded-full" />
                  <span className="ml-6 text-white text-xl font-semibold">PIRS</span>
                </div>
                <div className="hidden sm:flex justify-center space-x-4">
                  {role === "user" && updatedNavigation.map((item) => (
                    <Link key={item.name} to={item.href} className={classNames(item.current ? "bg-gray-900 text-white border-2" : "text-gray-300 hover:bg-gray-700 hover:text-white", "rounded-md px-3 py-2 text-sm font-medium")}>
                      {item.name}
                    </Link>
                  ))}
                  {role === "admin" && updatedAdminNavigation.map((item) => (
                    <Link key={item.name} to={item.href} className={classNames(item.current ? "bg-gray-900 text-white border-2" : "text-gray-300 hover:bg-gray-700 hover:text-white", "rounded-md px-3 py-2 text-sm font-medium")}>
                      {item.name}
                    </Link>
                  ))}
                  {role?.includes("DeptAdmin") && updatedDepartmentAdminNavigation.map((item) => (
                    <Link key={item.name} to={item.href} className={classNames(item.current ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white", "rounded-md px-3 py-2 text-sm font-medium")}>
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
