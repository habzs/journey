import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import Signup from "../containers/Signup";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
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

describe("Signup Component", () => {
  const mockRouter = {
    push: jest.fn(),
  };
  const mockSignup = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue({
      signup: mockSignup,
      currentUser: null,
      loading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders signup form", () => {
    render(<Signup />);
    expect(
      screen.getByRole("heading", { name: "Sign Up", level: 4 })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Mobile Number")).toBeInTheDocument();
  });

  it("shows validation errors for required fields", async () => {
    render(<Signup />);

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Username is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
      expect(screen.getByText("Mobile number is required")).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    render(<Signup />);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });
  });

  it("validates password match", async () => {
    render(<Signup />);

    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password456" },
    });
    fireEvent.blur(confirmPasswordInput);

    await waitFor(() => {
      expect(screen.getByText("Passwords must match")).toBeInTheDocument();
    });
  });

  it("handles successful signup", async () => {
    render(<Signup />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Mobile Number"), {
      target: { value: "1234567890" },
    });

    mockSignup.mockResolvedValueOnce(undefined);

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        "testuser",
        "1234567890",
        "",
        [],
        null
      );
      expect(toast.success).toHaveBeenCalledWith("Signup successful!");
    });
  });

  it("handles signup error", async () => {
    render(<Signup />);

    const error = new Error("Signup failed");
    mockSignup.mockRejectedValueOnce(error);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Mobile Number"), {
      target: { value: "1234567890" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error: Signup failed");
    });
  });
});
