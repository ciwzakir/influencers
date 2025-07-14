"use client";

import { Col, Row, message, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import dayjs from "dayjs";

import { getUserInfo } from "@/app/services/auth.service";
import {
  useMyProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/api/authApi";

import StepperForm from "@/components/stepperForm/stepperForm";
import updateProfileSchema from "@/validatorsSchema/user/update";

import PersonalInformation from "@/components/user/update/PersonalInformation";
import MemberInformation from "@/components/user/update/MemberInfo";

const EditProfilePage = () => {
  const router = useRouter();
  const { user_id: id } = getUserInfo() as any;

  useEffect(() => {
    if (!id) {
      message.error("User ID is not available. Please log in again.");
      router.push("/login");
    }
  }, [id, router]);

  const {
    data: profileData,
    refetch,
    isLoading,
    isFetching,
  } = useMyProfileQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const [updateProfile] = useUpdateProfileMutation();
  const profile_picture = profileData?.personal_info?.profile_picture || null;

  const myProfileDefaultValues = {
    email: profileData?.email || "",
    first_name: profileData?.first_name || "",
    last_name: profileData?.last_name || "",
    member_info: {
      short_bio: profileData?.member_info?.short_bio || "",
      share: profileData?.member_info?.share || "",
      user_role: profileData?.member_info?.user_role || "",
    },
    personal_info: {
      father_name: profileData?.personal_info?.father_name || "",
      mother_name: profileData?.personal_info?.mother_name || "",
      gender: profileData?.personal_info?.gender || "",
      marital_status: profileData?.personal_info?.marital_status || "",
      blood_group: profileData?.personal_info?.blood_group || "",
      dob: profileData?.personal_info?.dob
        ? dayjs(profileData.personal_info.dob)
        : null,
      nationality: profileData?.personal_info?.nationality || "",
      present_address: profileData?.personal_info?.present_address || "",
      permanent_address: profileData?.personal_info?.permanent_address || "",
      employment_address: profileData?.personal_info?.employment_address || "",
      phone_number: profileData?.personal_info?.phone_number || "",
    },
    qualifications: profileData?.qualifications?.length
      ? profileData.qualifications
      : [{}],
    experiences_info: profileData?.experiences_info?.length
      ? profileData.experiences_info
      : [{}],
  };

  const steps = [
    {
      title: "Personal Info",
      content: <PersonalInformation profile_picture={profile_picture} />,
    },
    { title: "Member Info", content: <MemberInformation /> },
    // { title: "Education", content: <EdnFormDynamicFields /> },
    // { title: "Plans", content: <ExperienceFormDynamicFields /> },
  ];

  const appendObjectToFormData = (
    formData: FormData,
    prefix: string,
    obj: Record<string, any>
  ) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(`${prefix}.${key}`, String(value));
      }
    });
  };

  const handleProfileUpdateSubmit = async (values: any) => {
    if (!id) {
      message.error("User ID not found");
      return;
    }

    try {
      const transformedValues = {
        ...values,
        personal_info: {
          ...values.personal_info,
          dob: values.personal_info.dob
            ? dayjs(values.personal_info.dob).format("YYYY-MM-DD")
            : null,
        },
        qualifications: values.qualifications || [],
        experiences_info: values.experiences_info || [],
      };

      const formData = new FormData();

      // Append top-level fields
      formData.append("email", transformedValues.email);
      formData.append("first_name", transformedValues.first_name);
      formData.append("last_name", transformedValues.last_name);

      // Append file (profile picture)
      const profilePicture = values.profile_picture;
      if (profilePicture instanceof File) {
        formData.append("personal_info.profile_picture", profilePicture);
      }
      // Append nested fields
      appendObjectToFormData(
        formData,
        "member_info",
        transformedValues.member_info
      );
      appendObjectToFormData(
        formData,
        "personal_info",
        transformedValues.personal_info
      );

      // Append qualifications
      transformedValues.qualifications.forEach((qual: any, index: number) => {
        for (const [key, value] of Object.entries(qual)) {
          if (value !== undefined && value !== null) {
            formData.append(`qualifications[${index}][${key}]`, String(value));
          }
        }
      });

      // Submit using FormData
      await updateProfile({ id, data: formData }).unwrap();

      message.success("Profile updated successfully!");
      await refetch();
      router.push("/profiles");
    } catch (err: any) {
      console.error("Profile update error:", err);
      message.error(err?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading || isFetching) {
    return (
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
        <Spin tip="Loading Profile..." size="large" />
      </Row>
    );
  }

  return (
    <div className="main">
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
        <Col xs={24} md={16} lg={12}>
          <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
            Update Profile
          </h1>
          <StepperForm
            steps={steps}
            submitHandler={handleProfileUpdateSubmit}
            defaultValues={myProfileDefaultValues}
            persistKey="editProfilePersistKey"
            validationSchema={updateProfileSchema}
          />
        </Col>
      </Row>
    </div>
  );
};

export default EditProfilePage;
