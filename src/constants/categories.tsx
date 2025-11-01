export const JOB_CATEGORIES = [
  {
    label: "Business & Marketing",
    options: [
      { value: "business", label: "Business (General)" },
      { value: "marketing", label: "Marketing (General)" },
      { value: "marketing_advertising", label: "Marketing & Advertising" },
      { value: "digital marketing", label: "Digital Marketing" },
      { value: "social media", label: "Social Media Management" },
      { value: "brand management", label: "Brand Management" },
      { value: "sales", label: "Sales & Business Development" },
      { value: "product management", label: "Product Management" },
      { value: "community management", label: "Community Management & Moderation" },
    ]
  },
  {
    label: "Technology & Development",
    options: [
      { value: "technology", label: "Technology (General)" },
      { value: "development", label: "Development (General)" },
      { value: "web development", label: "Web Development" },
      { value: "mobile app", label: "Mobile App Development" },
      { value: "cybersecurity", label: "Cybersecurity" },
      { value: "it support", label: "IT Support & Networking" },
      { value: "blockchain", label: "Blockchain Development" },
      { value: "blockchain", label: "Smart Contract Development" },
      { value: "blockchain", label: "Rust Development" },
    ]
  },
  {
    label: "Creative & Design",
    options: [
      { value: "creative", label: "Creative (General)" },
      { value: "design", label: "Design (General)" },
      { value: "graphic design", label: "Graphic Design" },
      { value: "uiux", label: "UI/UX Design" },
      { value: "video editing", label: "Video Production & Editing Design" },
      { value: "animation", label: "Animation & Motion Graphics Design" },
      { value: "game design", label: "Game Design & Development Design" },
      { value: "writing", label: "Writing & Content" },
    ]
  },
  {
    label: "Human Resources & Management",
    options: [
      { value: "management", label: "Management (General)" },
      { value: "hr recruitment", label: "HR & Recruitment Management" },
      { value: "operations", label: "Operations Management" },
    ]
  }
];

// Helper component for rendering category options
export const CategoryOptions = () => (
  <>
    <option value="">Select category</option>
    {JOB_CATEGORIES.map((group) => (
      <optgroup key={group.label} label={group.label}>
        {group.options.map((option, index) => (
          <option key={`${option.value}-${index}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </optgroup>
    ))}
  </>
);