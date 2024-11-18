"use client";

import { useAuth } from "@/app/context/AuthContext";
import { UserRole } from "@/app/models/users";
import {
  ADMIN_URL,
  AGENCY_URL,
  OPPORTUNITIES_URL,
  PROFILE_URL,
  SIGNIN_URL,
  SIGNUP_URL,
} from "@/app/utils/constants";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Image,
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const Header = () => {
  const { logout, currentUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isActiveLink = (url: string) =>
    pathname === url ? "primary" : "foreground";

  const menuItems = [{ name: "Opportunities", url: OPPORTUNITIES_URL }];

  const handleDropdownAction = (key: string) => {
    switch (key) {
      case "profile":
        router.push(PROFILE_URL);
        break;
      case "dashboard":
        router.push(ADMIN_URL);
        break;
      case "agencyDashboard":
        router.push(AGENCY_URL);
        break;
      case "signout":
        logout();
        break;
    }
  };

  const renderActionButton = () => {
    if (!currentUser)
      return (
        <div className="space-x-3">
          <Link href={SIGNUP_URL} color={isActiveLink(SIGNUP_URL)}>
            Sign Up
          </Link>
          <Button color="primary" variant="flat" as={Link} href={SIGNIN_URL}>
            Sign In
          </Button>
        </div>
      );

    // TODO: this is damn messy but it's the best way to do dynamic items in a dropdown since the dropdownitem doesnt accept a null component yikes
    const items = [
      { key: "profile", label: "Profile" },
      ...(currentUser.role === UserRole.Admin
        ? [{ key: "dashboard", label: "Admin Dashboard" }]
        : []),
      ...(currentUser.role === UserRole.Agency
        ? [{ key: "agencyDashboard", label: "Agency Dashboard" }]
        : []),
      { key: "signout", label: "Sign Out" },
    ];

    return (
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            as="button"
            src={currentUser.avatarImageUrl}
            alt="Profile"
            isBordered
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" items={items}>
          {(item) => (
            <DropdownItem
              key={item.key}
              color={item.key === "signout" ? "danger" : "default"}
              className={item.key === "signout" ? "text-danger" : ""}
              onClick={() => handleDropdownAction(item.key)}
            >
              {item.label}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    );
  };

  return (
    <Navbar
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
      isBlurred={false}
      isBordered
      maxWidth="2xl"
    >
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />
      <NavbarBrand>
        <Link href="/" className="font-bold">
          <Image
            width={120}
            alt="Journey"
            src="https://i.ibb.co/yBW8Lgw/Frame-127.png"
          />
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={pathname === OPPORTUNITIES_URL}>
          <Link href={OPPORTUNITIES_URL}>Opportunities</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="flex items-center">
          {renderActionButton()}
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link className="w-full" href={item.url} size="lg">
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
