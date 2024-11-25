export const teamData = {
  currentUser: {
    id: 1,
    name: "John Doe",
    role: "Engineering Manager",
    email: "john.doe@company.com"
  },
  reportingHierarchy: [
    {
      id: 2,
      name: "Alice Smith",
      role: "Senior Software Engineer",
      email: "alice.smith@company.com",
      manager: 1
    },
    {
      id: 3,
      name: "Bob Johnson",
      role: "Software Engineer",
      email: "bob.johnson@company.com",
      manager: 1
    },
    {
      id: 4,
      name: "Carol Williams",
      role: "Software Engineer",
      email: "carol.williams@company.com",
      manager: 1
    },
    {
      id: 5,
      name: "David Brown",
      role: "Junior Software Engineer",
      email: "david.brown@company.com",
      manager: 2
    }
  ]
}
