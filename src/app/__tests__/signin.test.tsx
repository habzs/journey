import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { UserRole } from "@/app/models/users";
import { ADMIN_URL, AGENCY_URL, HOME_URL } from "@/app/utils/constants";
import Signin from "../containers/Signin";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("@/app/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Signin Component", () => {
  const mockRouter = {
    push: jest.fn(),
  };
  const mockSignin = jest.fn();
  const mockSearchParams = {
    get: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    (useAuth as jest.Mock).mockReturnValue({
      signin: mockSignin,
      currentUser: null,
      loading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders signin form", () => {
    render(<Signin />);
    expect(
      screen.getByRole("heading", { name: "Sign In" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Remember me" })
    ).toBeInTheDocument();
    expect(screen.getByText("Sign up.")).toBeInTheDocument();
    expect(screen.getByText("Reset it here.")).toBeInTheDocument();
  });

  it("shows validation errors for required fields", async () => {
    render(<Signin />);
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    render(<Signin />);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });
  });

  it("handles successful signin", async () => {
    render(<Signin />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    mockSignin.mockResolvedValueOnce(undefined);

    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(mockSignin).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        true
      );
      expect(toast.success).toHaveBeenCalledWith("Sign in successful!");
    });
  });

  it("handles signin error", async () => {
    render(<Signin />);

    const error = new Error("Invalid credentials");
    mockSignin.mockRejectedValueOnce(error);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error: Invalid credentials");
    });
  });

  it("redirects to correct URL based on user role", async () => {
    const testCases = [
      { role: UserRole.Volunteer, expectedUrl: HOME_URL },
      { role: UserRole.Agency, expectedUrl: AGENCY_URL },
      { role: UserRole.Admin, expectedUrl: ADMIN_URL },
    ];

    for (const { role, expectedUrl } of testCases) {
      mockSearchParams.get.mockReturnValue(null);
      (useAuth as jest.Mock).mockReturnValue({
        signin: mockSignin,
        currentUser: { role },
        loading: false,
      });

      render(<Signin />);

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith(expectedUrl);
      });
    }
  });

  it("redirects to return URL if provided", async () => {
    const returnUrl = "/dashboard";
    mockSearchParams.get.mockReturnValue(encodeURIComponent(returnUrl));
    (useAuth as jest.Mock).mockReturnValue({
      signin: mockSignin,
      currentUser: { role: UserRole.Volunteer },
      loading: false,
    });

    render(<Signin />);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(returnUrl);
    });
  });

  it("toggles remember me checkbox", () => {
    render(<Signin />);

    const checkbox = screen.getByRole("checkbox", { name: "Remember me" });
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
