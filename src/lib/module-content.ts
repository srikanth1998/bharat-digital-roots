import type { ModuleSection } from "@/components/module-page";

export const corporateSections: ModuleSection[] = [
  {
    kind: "rich",
    heading: "Vision & Mission",
    lead: "Vision: To be a globally recognized group of companies known for our excellence, innovation, and commitment to sustainable growth.",
    paragraphs: [
      "Mission: To empower our companies to excel in their industries through strategic guidance, resource sharing, and collaborative innovation, while delivering high-quality solutions that meet the needs of our clients.",
    ],
  },
  {
    kind: "values",
    heading: "Core Values",
    items: [
      { title: "Excellence", body: "We strive for excellence in everything we do, ensuring high-quality outcomes across all our business sectors." },
      { title: "Integrity", body: "Ethical business practices and transparency are at the heart of our operations." },
      { title: "Collaboration", body: "Our group fosters a collaborative culture, allowing each business to thrive while leveraging the collective strength of the group." },
      { title: "Innovation", body: "We are committed to staying ahead of industry trends by encouraging innovation and adaptability in every aspect of our operations." },
      { title: "Sustainability", body: "We believe in building sustainable businesses that positively impact the environment and society." },
    ],
  },
  {
    kind: "rich",
    heading: "Sustainability & Corporate Responsibility",
    paragraphs: [
      "We are committed to responsible business practices that benefit our employees, communities, and the environment. We promote sustainability across all our operations, ensuring that we minimize our ecological footprint while maximizing positive social impact.",
      "Our group supports environmental sustainability projects, community development programs, and employee engagement and welfare initiatives.",
    ],
  },
  {
    kind: "list",
    heading: "Industries We Serve",
    items: [
      "Manufacturing",
      "Finance & Investments",
      "Real Estate & Construction",
      "Technology & IT Services",
      "Energy & Resources",
      "Healthcare",
      "Retail & Consumer Goods",
    ],
  },
];

export const welfareMissionSection: ModuleSection = {
  kind: "mission",
  heading: "Welfare Vision & Mission",
  lead: "To create a compassionate and empowered community where every individual has access to resources, opportunities, and support — fostering social equity and well-being for all.",
  items: [
    { title: "Advocating for marginalized groups", body: "Amplifying voices and addressing the needs of underserved populations." },
    { title: "Facilitating community engagement", body: "Encouraging active participation and collaboration among community members, organizations, and stakeholders." },
    { title: "Providing resources and support", body: "Offering programs, workshops, and services that educate, empower, and uplift individuals and families." },
    { title: "Raising awareness", body: "Increasing understanding of social issues through outreach and advocacy campaigns." },
  ],
};
