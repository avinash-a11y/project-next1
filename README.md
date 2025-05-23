# Financial Dashboard App

A Next.js application for managing finances, transfers, and tracking transactions.

## Features

- User authentication with NextAuth.js
- Dashboard with transaction visualization
- Money transfers between accounts
- Transaction history and tracking
- Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- PostgreSQL database (for production)

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```

4. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Automatic Deployment

1. Push your code to GitHub.
2. Import your repository in the Vercel dashboard.
3. Add the following environment variables in the Vercel project settings:
   - `NEXT_PUBLIC_API_URL`: Your production URL (e.g., https://your-app.vercel.app)
   - `NEXTAUTH_URL`: Your production URL (e.g., https://your-app.vercel.app)
   - `NEXTAUTH_SECRET`: A secure random string (generate with `openssl rand -base64 32`)
4. Deploy the project.

### Manual Deployment

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```
   vercel login
   ```

3. Deploy your application:
   ```
   vercel
   ```

4. Follow the prompts to configure your deployment.

## Environment Variables

- `NEXT_PUBLIC_API_URL`: The base URL for API requests
- `NEXTAUTH_URL`: Your app's URL (required for NextAuth.js)
- `NEXTAUTH_SECRET`: Secret used to encrypt sessions and tokens

## Project Structure

- `/app`: Application pages and components
- `/app/api`: API routes
- `/app/components`: Reusable UI components
- `/app/dashboard`: Dashboard pages
- `/app/utils`: Utility functions
- `/public`: Static assets
- `/styles`: Global styles

## Technologies Used

- Next.js 13+ (App Router)
- React 18
- NextAuth.js for authentication
- Tailwind CSS for styling
- Chart.js for data visualization
- Prisma for database access

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!