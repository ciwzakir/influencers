"use client";

import React from "react";
import { Collapse } from "antd";
import { useExperience } from "./contexts/ExperienceContext";

const MyPlan: React.FC = () => {
  const { experiences } = useExperience();

  return (
    <Collapse
      items={[
        {
          key: "1",
          label: "Share Your Plans/Experiences",
          children: (
            <div>
              {experiences?.length ? (
                experiences.map((exp) => (
                  <p
                    key={exp.id}
                    style={{ marginBottom: "12px", textAlign: "justify" }}
                  >
                    {exp.experiences}.
                  </p>
                ))
              ) : (
                <p>No experience found.</p>
              )}
            </div>
          ),
        },
      ]}
    />
  );
};

export default MyPlan;
