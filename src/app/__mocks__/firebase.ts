// src/app/__mocks__/firebase.ts
export const getAuth = jest.fn(() => ({
  currentUser: null,
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

export const getFirestore = jest.fn(() => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  where: jest.fn(),
  query: jest.fn(),
}));

export const getStorage = jest.fn(() => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

export const initializeApp = jest.fn(() => ({}));
