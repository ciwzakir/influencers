"use client";

import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  MenuProps,
  Row,
  Space,
  Spin,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { getUserInfo, removeUserInfo } from "@/app/services/auth.service";
import { useMyProfileQuery } from "@/redux/api/authApi";
import { useState } from "react";

const { Header: AntHeader } = Layout;

const Header = () => {
  const { user_id: id } = getUserInfo() as any;

  // Use the logged-in user's ID to fetch their profile
  const { data, isLoading } = useMyProfileQuery(
    id // Pass the user ID here

    // { refetchOnMountOrArgChange: true }
  );

  const [imgError, setImgError] = useState(false);
  const router = useRouter();

  // console.log(
  //   "data.personal_info.profile_picture",
  //   data?.personal_info?.profile_picture
  // );

  const logOut = () => {
    removeUserInfo();
    localStorage.clear();
    router.push("/login");
  };

  const items: MenuProps["items"] = [
    {
      key: "0",
      label: (
        <Button type="text" danger onClick={logOut}>
          Logout
        </Button>
      ),
    },
    {
      key: "1",
      label: <Button type="text">{id}</Button>,
    },
  ];

  // Fallback while loading or on error
  <Avatar size="large" icon={<UserOutlined />} />;

  // Wait for data to load and only construct image URL when available
  // const imageUrl = data?.personal_info?.profile_picture
  //   ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${data?.personal_info?.profile_picture}`
  //   : null;
  const imageUrl = data?.personal_info?.profile_picture
    ? `${data?.personal_info?.profile_picture}`
    : null;

  return (
    <AntHeader style={{ background: "#fff" }}>
      <Row justify="end" align="middle" style={{ height: "100%" }}>
        <Dropdown menu={{ items }}>
          <a>
            <Space wrap size={16}>
              {isLoading ? (
                // Display a loading spinner while fetching profile data
                <Spin />
              ) : (
                <Avatar
                  size="large"
                  src={imgError || !imageUrl ? null : imageUrl}
                  icon={imgError || !imageUrl ? <UserOutlined /> : null}
                  // @ts-expect-error: Ignoring type error because the Avatar component doesn't require onLoad/onError to return a value
                  onError={() => setImgError(true)}
                  onLoad={() => setImgError(false)}
                />
              )}
            </Space>
          </a>
        </Dropdown>
      </Row>
    </AntHeader>
  );
};

export default Header;
