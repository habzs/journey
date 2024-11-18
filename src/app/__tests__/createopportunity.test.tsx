import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { uploadOpportunityImage } from "@/app/utils/uploadOpportunityImage";
import CreateOpportunity from "../containers/Opportunities/CreateOpportunity";

// Mock all external dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  addDoc: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  Timestamp: {
    fromDate: jest.fn(() => ({ seconds: 1234567890, nanoseconds: 0 })),
    now: jest.fn(() => ({ seconds: 1234567890, nanoseconds: 0 })),
  },
}));

jest.mock("@/app/utils/uploadOpportunityImage", () => ({
  uploadOpportunityImage: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("CreateOpportunity", () => {
  const mockRouter = {
    push: jest.fn(),
  };
  const mockCurrentUser = {
    uid: "test-uid",
    username: "testuser",
    avatarImageUrl: "test-avatar.jpg",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue({ currentUser: mockCurrentUser });
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ role: "Agency" }),
    });
  });

  it("renders loading state initially", () => {
    render(<CreateOpportunity />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders form after role is loaded", async () => {
    render(<CreateOpportunity />);
    await waitFor(() => {
      expect(screen.getByText("Create Opportunity")).toBeInTheDocument();
    });
  });

  it("validates required fields", async () => {
    render(<CreateOpportunity />);
    await waitFor(() => {
      const submitButton = screen.getByRole("button", { name: /create/i });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
      expect(screen.getByText("Description is required")).toBeInTheDocument();
      expect(screen.getByText("Location is required")).toBeInTheDocument();
    });
  });

  it("handles successful opportunity creation", async () => {
    const mockDocRef = { id: "test-doc-id" };
    (addDoc as jest.Mock).mockResolvedValueOnce(mockDocRef);
    (uploadOpportunityImage as jest.Mock).mockResolvedValueOnce(
      "test-image-url"
    );

    render(<CreateOpportunity />);

    await waitFor(() => {
      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const locationInput = screen.getByLabelText(/location/i);

      fireEvent.change(titleInput, { target: { value: "Test Opportunity" } });
      fireEvent.change(descriptionInput, {
        target: { value: "Test Description" },
      });
      fireEvent.change(locationInput, { target: { value: "Test Location" } });
    });

    const submitButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        "Opportunity created successfully."
      );
      expect(mockRouter.push).toHaveBeenCalled();
    });
  });

  it("handles image upload", async () => {
    render(<CreateOpportunity />);

    await waitFor(() => {
      const fileInput = screen.getByLabelText(/upload image/i);
      const file = new File(["test"], "test.png", { type: "image/png" });
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(screen.getByAltText(/selected image/i)).toBeInTheDocument();
  });

  it("handles creation error", async () => {
    (addDoc as jest.Mock).mockRejectedValueOnce(new Error("Creation failed"));

    render(<CreateOpportunity />);

    await waitFor(() => {
      const submitButton = screen.getByRole("button", { name: /create/i });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to create opportunity.");
    });
  });

  it("sets correct agency info based on role", async () => {
    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ role: "Admin" }),
    });

    render(<CreateOpportunity />);

    await waitFor(() => {
      expect(screen.getByText("Create Opportunity")).toBeInTheDocument();
    });

    // Add assertions for agency selection visibility when role is Admin
    // Add assertions for agency info being set correctly in form submission
  });
});
