import type { MenuProps } from "antd";
import {
  TableOutlined,
  BankOutlined,
  ExpandOutlined,
  UserAddOutlined,
  ProfileOutlined,
  FundViewOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { USER_ROLE } from "./role";
import { getUserInfo } from "@/app/services/auth.service";

export const sidebarItems = (role: string): MenuProps["items"] => {
  const { user_id: id } = getUserInfo() as any;

  const defaultSidebarItems: MenuProps["items"] = [
    {
      label: "Profile",
      key: "profile",
      icon: <ProfileOutlined />,
      children: [
        {
          label: <Link href={`/profiles`}>My Profile</Link>,
          key: `/${role}/profile`,
        },
        {
          label: <Link href={`/profiles/edit/${id}`}>Edit Profile</Link>,
          key: `/${role}/edit_profile`,
        },
      ],
    },
  ];
  const usersSidebarItems: MenuProps["items"] = [
    {
      label: "Users",
      key: "users",
      icon: <UserAddOutlined />,
      children: [
        {
          label: <Link href={`/users`}>All Members</Link>,
          icon: <TableOutlined />,
          key: `users`,
        },
      ],
    },
  ];

  const adminSidebarItems: MenuProps["items"] = [
    ...defaultSidebarItems,
    {
      label: "Subscriptions",
      key: "collections",
      icon: <FundViewOutlined />,
      children: [
        {
          label: <Link href={`/${role}/collections/dues`}>Dues List</Link>,
          key: `/${role}/dues`,
        },

        {
          label: (
            <Link href={`/${role}/collections/verification`}>
              Verification Pending
            </Link>
          ),
          key: `/${role}/verifications`,
        },
        {
          label: <Link href={`/${role}/collections/paid`}>Paid List</Link>,
          key: `/${role}/paid`,
        },
        {
          label: (
            <Link href={`/${role}/collections/summary`}>
              Subscription Summary
            </Link>
          ),
          key: `/${role}/summary`,
        },
      ],
    },
    {
      label: "Trackers",
      key: "trackers",
      icon: <EyeOutlined />,
      children: [
        {
          label: <Link href={`/${role}/cashbook`}> Cash Book</Link>,
          key: `/${role}/cashbook`,
        },
        {
          label: (
            <Link href={`/${role}/cashbook/inflows`}>Inflows Summary</Link>
          ),
          key: `/${role}/inflows-summary`,
        },
        {
          label: (
            <Link href={`/${role}/cashbook/outflows`}>Outflows Summary</Link>
          ),
          key: `/${role}/outflow-summary`,
        },
      ],
    },

    {
      label: "Monthly Subscriptions",
      key: "subscriptions",
      icon: <BankOutlined />,
      children: [
        {
          label: (
            <Link href={`/${role}/contributions`}>Monthly Subscriptions</Link>
          ),
          key: `/${role}/contributes`,
        },
        {
          label: (
            <Link href={`/${role}/contributions/create`}>
              Add Subscriptions
            </Link>
          ),
          key: `/${role}/contributes-create`,
        },
      ],
    },

    {
      label: "Expense",
      key: "expense",
      icon: <ExpandOutlined />,
      children: [
        {
          label: (
            <Link href={`/${role}/expense/suppliers/draft/views`}>
              Draft Bills
            </Link>
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
  const uttoronApprovalIUserSidebarItems: MenuProps["items"] = [
    ...defaultSidebarItems,
    ...usersSidebarItems,
    {
      label: "Subscriptions",
      key: "collections",
      icon: <FundViewOutlined />,
      children: [
        {
          label: <Link href={`/${role}/collections/dues`}>Dues List</Link>,
          key: `/${role}/dues`,
        },

        {
          label: (
            <Link href={`/${role}/collections/verification`}>
              Verification Pending
            </Link>
          ),
          key: `/${role}/verifications`,
        },
        {
          label: <Link href={`/${role}/collections/paid`}>Paid List</Link>,
          key: `/${role}/paid`,
        },
        {
          label: (
            <Link href={`/${role}/collections/summary`}>
              Subscription Summary
            </Link>
          ),
          key: `/${role}/summary`,
        },
      ],
    },
    {
      label: "Trackers",
      key: "trackers",
      icon: <EyeOutlined />,
      children: [
        {
          label: <Link href={`/${role}/cashbook`}> Cash Book</Link>,
          key: `/${role}/cashbook`,
        },
        {
          label: (
            <Link href={`/${role}/cashbook/inflows`}>Inflows Summary</Link>
          ),
          key: `/${role}/inflows-summary`,
        },
        {
          label: (
            <Link href={`/${role}/cashbook/outflows`}>Outflows Summary</Link>
          ),
          key: `/${role}/outflow-summary`,
        },
      ],
    },

    {
      label: "Subscription Rates",
      key: "subscriptions",
      icon: <BankOutlined />,
      children: [
        {
          label: (
            <Link href={`/${role}/contributions`}>Monthly Subscriptions</Link>
          ),
          key: `/${role}/contributes`,
        },
        {
          label: (
            <Link href={`/${role}/contributions/create`}>
              Add Subscriptions
            </Link>
          ),
          key: `/${role}/contributes-create`,
        },
      ],
    },
  ];

  const uttoronEntryIUserSidebarItems: MenuProps["items"] = [
    ...defaultSidebarItems,
    ...usersSidebarItems,
    {
      label: "Subscriptions",
      key: "collections",
      icon: <FundViewOutlined />,
      children: [
        {
          label: <Link href={`/${role}/collections/dues`}>Dues List</Link>,
          key: `/${role}/dues`,
        },
        {
          label: <Link href={`/${role}/collections/paid`}>Paid List</Link>,
          key: `/${role}/paid`,
        },
        {
          label: (
            <Link href={`/${role}/collections/summary`}>
              Subscription Summary
            </Link>
          ),
          key: `/${role}/summary`,
        },
      ],
    },
    {
      label: "Trackers",
      key: "trackers",
      icon: <EyeOutlined />,
      children: [
        {
          label: <Link href={`/${role}/cashbook`}> Cash Book</Link>,
          key: `/${role}/cashbook`,
        },
        {
          label: (
            <Link href={`/${role}/cashbook/inflows`}>Inflows Summary</Link>
          ),
          key: `/${role}/inflows-summary`,
        },
        {
          label: (
            <Link href={`/${role}/cashbook/outflows`}>Outflows Summary</Link>
          ),
          key: `/${role}/outflow-summary`,
        },
      ],
    },

    {
      label: "Subscription Rates",
      key: "subscriptions",
      icon: <BankOutlined />,
      children: [
        {
          label: (
            <Link href={`/${role}/contributions`}>Monthly Subscriptions</Link>
          ),
          key: `/${role}/contributes`,
        },
      ],
    },
  ];

  const acctsAppIUserSidebarItems: MenuProps["items"] = [
    ...defaultSidebarItems,
    {
      label: "Expense",
      key: "expense",
      icon: <ExpandOutlined />,
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
  const acctsEntryIUserSidebarItems: MenuProps["items"] = [
    ...defaultSidebarItems,
    {
      label: "Expense",
      key: "expense",
      icon: <ExpandOutlined />,
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
    ...adminSidebarItems,
    {
      label: "Users",
      key: "users",
      icon: <UserAddOutlined />,
      children: [
        {
          label: <Link href={`/users`}>All Members</Link>,
          icon: <TableOutlined />,
          key: `users`,
        },
        {
          label: <Link href={`/register`}>Add New</Link>,
          icon: <UserAddOutlined />,
          key: `add-new-user`,
        },
      ],
    },
  ];

  if (role === USER_ROLE.SUPER_USER) return superAdminSidebarItems;
  else if (role === USER_ROLE.ADMIN) return adminSidebarItems;
  else if (role === USER_ROLE.UTTORON_ENTRY_USER_ID)
    return uttoronEntryIUserSidebarItems;
  else if (role === USER_ROLE.UTTORON_APPROVAL_ID)
    return uttoronApprovalIUserSidebarItems;
  else if (role === USER_ROLE.ACCOUNTS_APPROVAL_ID)
    return acctsAppIUserSidebarItems;
  else if (role === USER_ROLE.ACCOUNTS_ENTRY_USER_ID)
    return acctsEntryIUserSidebarItems;
  else {
    return defaultSidebarItems;
  }
};
