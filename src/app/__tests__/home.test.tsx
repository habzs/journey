// import React from "react";
// import { render, screen } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import Home from "../page";
// import { useAuth } from "@/app/context/AuthContext";
// import useFetchAllOpportunities from "@/app/hooks/useFetchAllOpportunities";

// // Mock Firebase
// jest.mock("@/app/firebase/config", () => ({
//   auth: jest.fn(),
//   firestore: jest.fn(),
//   storage: jest.fn(),
//   db: jest.fn(),
// }));

// // Mock AuthContext
// jest.mock("@/app/context/AuthContext", () => ({
//   useAuth: jest.fn(() => ({
//     currentUser: { id: "user1" },
//     loading: false,
//     error: null,
//   })),
//   AuthProvider: ({ children }: { children: React.ReactNode }) => (
//     <div>{children}</div>
//   ),
// }));

// // Mock useFetchAllOpportunities
// jest.mock("@/app/hooks/useFetchAllOpportunities");

// // Mock components
// jest.mock("@/app/components/Carousel", () => () => (
//   <div>Carousel Component</div>
// ));
// jest.mock("@/app/components/Flipwords", () => ({
//   FlipWords: () => <div>FlipWords Component</div>,
// }));
// jest.mock("@/app/components/OpportunityCard", () => ({
//   OpportunityCard: () => <div>OpportunityCard Component</div>,
// }));

// // Mock NextUI components
// jest.mock("@nextui-org/react", () => ({
//   Button: ({ children, ...props }: any) => (
//     <button {...props}>{children}</button>
//   ),
//   Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
//   Image: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
// }));

// describe("Home Component", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     (useAuth as jest.Mock).mockReturnValue({ currentUser: { id: "user1" } });
//   });

//   test("renders without crashing", () => {
//     (useFetchAllOpportunities as jest.Mock).mockReturnValue({
//       opportunities: [],
//       loading: false,
//       error: null,
//     });
//     render(<Home />);
//     expect(screen.getByText("FlipWords Component")).toBeInTheDocument();
//   });

//   test("renders with loading state", () => {
//     (useFetchAllOpportunities as jest.Mock).mockReturnValue({
//       opportunities: [],
//       loading: true,
//       error: null,
//     });
//     render(<Home />);
//     expect(screen.getByText("Available Opportunities")).toBeInTheDocument();
//     expect(screen.getByText("Carousel Component")).toBeInTheDocument();
//   });

//   test("renders with error state", () => {
//     (useFetchAllOpportunities as jest.Mock).mockReturnValue({
//       opportunities: [],
//       loading: false,
//       error: "Error fetching data",
//     });
//     render(<Home />);
//     expect(screen.getByText("Available Opportunities")).toBeInTheDocument();
//     expect(screen.getByText("Carousel Component")).toBeInTheDocument();
//   });

//   test("renders opportunities correctly", () => {
//     const mockOpportunities = [
//       {
//         id: "1",
//         title: "Opportunity 1",
//         date: "2023-10-01",
//         location: "Location 1",
//         imageUrl: "image1.jpg",
//         category: ["category1"],
//       },
//       {
//         id: "2",
//         title: "Opportunity 2",
//         date: "2023-10-02",
//         location: "Location 2",
//         imageUrl: "image2.jpg",
//         category: ["category2"],
//       },
//     ];
//     (useFetchAllOpportunities as jest.Mock).mockReturnValue({
//       opportunities: mockOpportunities,
//       loading: false,
//       error: null,
//     });
//     render(<Home />);
//     expect(screen.getByText("Available Opportunities")).toBeInTheDocument();
//     expect(screen.getByText("Carousel Component")).toBeInTheDocument();
//   });

//   test("renders 'Get Started' button", () => {
//     (useFetchAllOpportunities as jest.Mock).mockReturnValue({
//       opportunities: [],
//       loading: false,
//       error: null,
//     });
//     render(<Home />);
//     expect(screen.getByText("Get Started")).toBeInTheDocument();
//   });
// });
