import { render, screen } from "@testing-library/react";
import { useAuth } from "@/app/context/AuthContext";
import useFetchUserRecommend from "@/app/hooks/useFetchUserRecommendation";
import useFetchFilteredOpportunities from "@/app/hooks/useFetchFilteredOpportunities";
import { SIGNIN_URL, SIGNUP_URL } from "@/app/utils/constants";
import Opportunities from "../containers/Opportunities";

// Mock the hooks and components
jest.mock("@/app/context/AuthContext");
jest.mock("@/app/hooks/useFetchUserRecommendation");
jest.mock("@/app/hooks/useFetchFilteredOpportunities");

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Opportunities - Recommendations Section", () => {
  beforeEach(() => {
    // Default mock for filtered opportunities
    (useFetchFilteredOpportunities as jest.Mock).mockReturnValue({
      opportunities: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 0,
      goToPage: jest.fn(),
    });
  });

  describe("when user is not logged in", () => {
    beforeEach(() => {
      (useAuth as jest.Mock).mockReturnValue({ currentUser: null });
      (useFetchUserRecommend as jest.Mock).mockReturnValue({
        opportunities: [],
        loading: false,
        error: null,
      });
    });

    it("should render sign in/sign up card", () => {
      render(<Opportunities />);
      expect(
        screen.getByText(
          "Sign in to get personalized opportunity recommendations!"
        )
      ).toBeInTheDocument();
    });

    it("should render sign in and sign up buttons with correct links", () => {
      render(<Opportunities />);
      const signUpButton = screen.getByText("Sign Up");
      const signInButton = screen.getByText("Sign In");

      expect(signUpButton).toHaveAttribute("href", SIGNUP_URL);
      expect(signInButton).toHaveAttribute("href", SIGNIN_URL);
    });
  });

  describe("when user is logged in", () => {
    beforeEach(() => {
      (useAuth as jest.Mock).mockReturnValue({ currentUser: { id: "1" } });
    });

    it("should show loading skeletons when loading recommendations", () => {
      (useFetchUserRecommend as jest.Mock).mockReturnValue({
        opportunities: [],
        loading: true,
        error: null,
      });

      render(<Opportunities />);
      expect(screen.getAllByTestId("opportunity-card-skeleton")).toHaveLength(
        4
      );
    });

    it("should show error message when recommendation fetch fails", () => {
      const errorMessage = "Failed to fetch";
      (useFetchUserRecommend as jest.Mock).mockReturnValue({
        opportunities: [],
        loading: false,
        error: errorMessage,
      });

      render(<Opportunities />);
      expect(
        screen.getByText(`Error loading recommendations: ${errorMessage}`)
      ).toBeInTheDocument();
    });

    it("should show recommended opportunities when data exists", () => {
      const mockOpportunities = [
        {
          id: "1",
          title: "Test Opportunity",
          location: "Test Location",
          date: "2024-01-01",
          category: ["TEST"],
        },
      ];

      (useFetchUserRecommend as jest.Mock).mockReturnValue({
        opportunities: mockOpportunities,
        loading: false,
        error: null,
      });

      render(<Opportunities />);
      expect(screen.getByText("Test Opportunity")).toBeInTheDocument();
    });

    it("should show no recommendations message when data is empty", () => {
      (useFetchUserRecommend as jest.Mock).mockReturnValue({
        opportunities: [],
        loading: false,
        error: null,
      });

      render(<Opportunities />);
      expect(
        screen.getByText(
          "We don't have any recommendations for you yet. Keep exploring opportunities to help us understand your interests!"
        )
      ).toBeInTheDocument();
    });
  });
});
