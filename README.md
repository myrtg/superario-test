# Superiamo Test Project

This project is a **Next.js** application that provides user authentication using **Google OAuth2** and allows users to update their profile information, including their first name, last name, date of birth, phone number, and address. The app integrates with **Firebase** for storing user data and performs address validation using the **adresse.data.gouv.fr** API to ensure the user address is within 50 km of Paris.

## Features

- **Google OAuth2**: Users can sign in using their Google accounts.
- **Profile Management**: Users can update their first name, last name, date of birth, phone number, and address.
- **Firebase Integration**: User data is stored in Firebase Firestore.
- **Address Validation**: The app uses the `adresse.data.gouv.fr` API to ensure the user's address is within 50 km of Paris.
- **Responsive UI**: Built with **Material UI** to provide a modern, responsive user interface.
- **Deployed on Vercel**: The app is hosted on Vercel for easy deployment and scalability.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v14 or later)
- **npm** or **yarn**
- **Firebase Account** with Firestore enabled
- **Google OAuth2 Client ID and Client Secret**
- **Vercel** account for deployment

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/superiamo-test.git
   cd superiamo-test
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. **Set up environment variables**:

   Create a `.env.local` file in the root directory and add your Firebase and Google OAuth credentials:

   ```bash
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
   ```

4. **Run the application**:

   ```bash
   npm run dev
   ```

   or

   ```bash
   yarn dev
   ```

   The application will be running at `http://localhost:3000`.

## Usage

### Sign In

- Navigate to the home page (`/`).
- Click on **"Sign in with Google"** to authenticate using your Google account.
- Once authenticated, you will be redirected to the **Profile** page.

### Profile Update

- After signing in, you can update your profile details (First Name, Last Name, Date of Birth, Phone Number, Address).
- The **Address** field will suggest valid addresses as you type.
- The **Phone Number** must be a valid French phone number (e.g., `+33612345678` or `0612345678`).
- The **Address** is validated to ensure it is within 50 km of Paris.

## Deployment

### Deploy on Vercel

1. **Create a Vercel account** at [Vercel](https://vercel.com/).
2. **Connect your GitHub repository** to Vercel.
3. Add your **environment variables** in the Vercel dashboard:
   - `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, etc.
4. **Deploy your application**: Vercel will automatically build and deploy your app.
5. Visit the live URL provided by Vercel after deployment.

## API References

- **Google OAuth2**: Used for user authentication.
- **Firebase Firestore**: Used to store user data.
- **Adresse Data Gouv API**: [adresse.data.gouv.fr](https://adresse.data.gouv.fr/) used for address validation.

## Technologies Used

- **Next.js**: A React framework for server-side rendering and static site generation.
- **NextAuth.js**: Authentication for Next.js with support for OAuth2.
- **Firebase**: Cloud database to store user data.
- **Material UI**: UI components library for React to build a responsive user interface.
- **Vercel**: Platform for deploying Next.js applications.

## License

This project is licensed under the MIT License.

---

### Notes

- If you encounter any issues or want to contribute, feel free to open an issue or submit a pull request.
