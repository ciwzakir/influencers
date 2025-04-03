import type { MenuProps } from "antd";
import {
  UserOutlined,
  ProfileOutlined,
  DatabaseOutlined,
  TableOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { USER_ROLE } from "./role";

export const sidebarItems = (role: string): MenuProps["items"] => {
  const defaultSidebarItems: MenuProps["items"] = [
    {
      label: "Profile",
      key: "profile",
      icon: <UserOutlined />,
      children: [
        {
          label: <Link href={`/profiles`}>My Profile</Link>,
          key: `/${role}/profile`,
        },
        {
          label: <Link href={`/profiles/edit`}>Edit Profile</Link>,
          key: `/${role}/edit_profile`,
        },
      ],
    },
  ];

  const adminSidebarItems: MenuProps["items"] = [
    {
      label: "Collections",
      key: "collections",
      icon: <DatabaseOutlined />,
      children: [
        {
          label: <Link href={`/${role}/collections/dues`}>Dues List</Link>,
          key: `/${role}/dues`,
        },
        {
          label: (
            <Link href={`/${role}/collections/verification`}>
              Under Verification
            </Link>
          ),
          key: `/${role}/verification`,
        },
        {
          label: <Link href={`/${role}/collections/paid`}>Paid List</Link>,
          key: `/${role}/paid`,
        },
      ],
    },

    {
      label: "Expense",
      key: "expense",
      icon: <DatabaseOutlined />,
      children: [
        {
          label: (
            <Link href={`/${role}/expense/suppliers/draft`}>Draft Bills</Link>
          ),
          icon: <TableOutlined />,
          key: `/${role}/draft`,
        },
        {
          label: (
            <Link href={`/${role}/expense/suppliers/sent-backs`}>
              Sent backs
            </Link>
          ),
          icon: <TableOutlined />,
          key: `/${role}/sent-backs`,
        },
        {
          label: <Link href={`/${role}/expense/views`}>Master Data</Link>,
          icon: <TableOutlined />,
          key: `/${role}/expense`,
        },

        {
          label: <Link href={`/${role}/expense/year/code`}>Return Codes</Link>,
          icon: <TableOutlined />,
          key: `/${role}/expenseYearCodes`,
        },
        {
          label: (
            <Link href={`/${role}/expense/year/company`}>Return Company</Link>
          ),
          icon: <TableOutlined />,
          key: `/${role}/expenseYearCompany`,
        },
        {
          label: (
            <Link href={`/${role}/expense/suppliers/cheque-list`}>
              Cheque Payment
            </Link>
          ),
          icon: <TableOutlined />,
          key: `/${role}/chequeList`,
        },
        {
          label: (
            <Link href={`/${role}/expense/suppliers/cash-payment`}>
              Cash Payment
            </Link>
          ),
          icon: <TableOutlined />,
          key: `/${role}/cashPayment`,
        },
      ],
    },
  ];

  const superAdminSidebarItems: MenuProps["items"] = [
    ...defaultSidebarItems,
    ...adminSidebarItems,
    {
      label: "Users",
      key: "users",
      icon: <ProfileOutlined />,
      children: [
        {
          label: <Link href={`/users`}>All Users</Link>,
          icon: <TableOutlined />,
          key: `users`,
        },
      ],
    },
  ];

  if (role === USER_ROLE.SUPER_ADMIN) return superAdminSidebarItems;
  else if (role === USER_ROLE.ADMIN) return adminSidebarItems;
  else {
    return defaultSidebarItems;
  }
};
