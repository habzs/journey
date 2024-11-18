// // src/app/__tests__/detailed-opportunity.test.tsx

// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import DetailedOpportunity from '../containers/DetailedOpportunity';
// import { useAuth } from '../context/AuthContext';
// import useFetchOpportunity from '../hooks/useFetchOpportunity';
// import { Timestamp } from 'firebase/firestore';

// // Mock the hooks and router
// jest.mock('../context/AuthContext');
// jest.mock('../hooks/useFetchOpportunity');
// jest.mock('next/navigation', () => ({
//   useRouter: () => ({
//     back: jest.fn(),
//     push: jest.fn(),
//   }),
// }));

// // Mock opportunity data
// const mockOpportunity = {
//   id: '123',
//   title: 'Test Opportunity',
//   description: 'Test Description',
//   imageUrl: 'test-image.jpg',
//   date: Timestamp.fromDate(new Date()),
//   location: 'Test Location',
//   registrationDeadline: Timestamp.fromDate(new Date()),
//   category: ['animal_welfare'],
//   agency: {
//     username: 'Test Agency',
//   },
//   duration: 2,
//   additionalInformation: 'Additional Info',
// };

// // Mock user data
// const mockUser = {
//   uid: 'user123',
//   opportunities: {},
// };

// describe('DetailedOpportunity Component', () => {
//   beforeEach(() => {
//     // Reset all mocks before each test
//     jest.clearAllMocks();
//   });

//   it('renders loading spinner when data is being fetched', () => {
//     (useFetchOpportunity as jest.Mock).mockReturnValue({
//       loading: true,
//       opportunity: null,
//       error: null,
//     });

//     render(<DetailedOpportunity params={{ id: '123' }} />);
//     expect(screen.getByRole('status')).toBeInTheDocument();
//   });

//   it('renders error message when fetch fails', () => {
//     (useFetchOpportunity as jest.Mock).mockReturnValue({
//       loading: false,
//       opportunity: null,
//       error: 'Failed to fetch opportunity',
//     });

//     render(<DetailedOpportunity params={{ id: '123' }} />);
//     expect(screen.getByText('Failed to fetch opportunity')).toBeInTheDocument();
//   });

//   it('renders opportunity details correctly', () => {
//     (useFetchOpportunity as jest.Mock).mockReturnValue({
//       loading: false,
//       opportunity: mockOpportunity,
//       error: null,
//     });
//     (useAuth as jest.Mock).mockReturnValue({
//       currentUser: mockUser,
//     });

//     render(<DetailedOpportunity params={{ id: '123' }} />);

//     // Check main content
//     expect(screen.getByText('Test Opportunity')).toBeInTheDocument();
//     expect(screen.getByText('Test Description')).toBeInTheDocument();
//     expect(screen.getByText('Test Agency')).toBeInTheDocument();
//     expect(screen.getByText('Test Location')).toBeInTheDocument();
//     expect(screen.getByText('Additional Info')).toBeInTheDocument();
//   });

//   it('renders register button correctly for non-registered user', () => {
//     (useFetchOpportunity as jest.Mock).mockReturnValue({
//       loading: false,
//       opportunity: mockOpportunity,
//       error: null,
//     });
//     (useAuth as jest.Mock).mockReturnValue({
//       currentUser: mockUser,
//     });

//     render(<DetailedOpportunity params={{ id: '123' }} />);
//     expect(screen.getByText('Register')).toBeInTheDocument();
//   });

//   it('renders registered status for registered user', () => {
//     const registeredUser = {
//       ...mockUser,
//       opportunities: { '123': 'pending' },
//     };

//     (useFetchOpportunity as jest.Mock).mockReturnValue({
//       loading: false,
//       opportunity: mockOpportunity,
//       error: null,
//     });
//     (useAuth as jest.Mock).mockReturnValue({
//       currentUser: registeredUser,
//     });

//     render(<DetailedOpportunity params={{ id: '123' }} />);
//     expect(screen.getByText('Registered')).toBeInTheDocument();
//     expect(screen.getByText('Registered')).toBeDisabled();
//   });

//   it('shows confirmation modal when register button is clicked', async () => {
//     (useFetchOpportunity as jest.Mock).mockReturnValue({
//       loading: false,
//       opportunity: mockOpportunity,
//       error: null,
//     });
//     (useAuth as jest.Mock).mockReturnValue({
//       currentUser: mockUser,
//     });

//     render(<DetailedOpportunity params={{ id: '123' }} />);

//     fireEvent.click(screen.getByText('Register'));

//     await waitFor(() => {
//       expect(screen.getByText('Confirm registration')).toBeInTheDocument();
//       expect(screen.getByText('Test Location')).toBeInTheDocument();
//     });
//   });

//   it('handles registration when user confirms', async () => {
//     const mockRefreshUserData = jest.fn();
//     (useFetchOpportunity as jest.Mock).mockReturnValue({
//       loading: false,
//       opportunity: mockOpportunity,
//       error: null,
//     });
//     (useAuth as jest.Mock).mockReturnValue({
//       currentUser: mockUser,
//       refreshUserData: mockRefreshUserData,
//     });

//     render(<DetailedOpportunity params={{ id: '123' }} />);

//     fireEvent.click(screen.getByText('Register'));

//     await waitFor(() => {
//       const confirmButton = screen.getByText('Confirm');
//       fireEvent.click(confirmButton);
//     });

//     // Verify registration process
//     await waitFor(() => {
//       expect(mockRefreshUserData).toHaveBeenCalled();
//     });
//   });

//   it('shows login message for non-authenticated users', () => {
//     (useFetchOpportunity as jest.Mock).mockReturnValue({
//       loading: false,
//       opportunity: mockOpportunity,
//       error: null,
//     });
//     (useAuth as jest.Mock).mockReturnValue({
//       currentUser: null,
//     });

//     render(<DetailedOpportunity params={{ id: '123' }} />);
//     expect(screen.getByText('Login to register')).toBeInTheDocument();
//     expect(screen.getByText('Login to register')).toBeDisabled();
//   });

//   it('renders back button and handles navigation', () => {
//     (useFetchOpportunity as jest.Mock).mockReturnValue({
//       loading: false,
//       opportunity: mockOpportunity,
//       error: null,
//     });
//     (useAuth as jest.Mock).mockReturnValue({
//       currentUser: mockUser,
//     });

//     render(<DetailedOpportunity params={{ id: '123' }} />);
//     expect(screen.getByText('Back')).toBeInTheDocument();
//   });

//   it('displays appropriate status for completed opportunities', () => {
//     const userWithCompletedOpportunity = {
//       ...mockUser,
//       opportunities: { '123': 'completed' },
//     };

//     (useFetchOpportunity as jest.Mock).mockReturnValue({
//       loading: false,
//       opportunity: mockOpportunity,
//       error: null,
//     });
//     (useAuth as jest.Mock).mockReturnValue({
//       currentUser: userWithCompletedOpportunity,
//     });

//     render(<DetailedOpportunity params={{ id: '123' }} />);
//     expect(screen.getByText('Completed')).toBeInTheDocument();
//     expect(screen.getByText('Completed')).toBeDisabled();
//   });
// });
