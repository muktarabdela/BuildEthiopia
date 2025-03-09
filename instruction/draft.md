draft.md

## Project overview

- Project Name: EtoDev Hub
- Objective: Create a web platform for the Ethiopian developer community to showcase projects, receive feedback, and connect for hiring opportunities.

## Core functionalities

1. Developer Project Showcase

1. Users can see a list of available projects submitted by developers, displayed in cards/grid format.
1. Each project card includes:

    - Project title
    - Description
    - Developer name
    - Tech stack
    - Upvote/Downvote count
    - Comments count
    - A “View More” button to open the detailed project page.

3. Users can submit a new project by clicking an “Add Project” button, which opens a modal to input:


    - Project title
    - Short description
    - Tech stack used
    - Live demo link (optional)
    - GitHub/Source code link
    - Upload cover image (optional)
    - Tags (e.g., "AI", "Web App", "Mobile App")

4. Once submitted, the project is added to the public showcase list.

5. Project Detail Page

6. Clicking on a project opens a dedicated project page with:


    - Full project details
    - Tech stack icons
    - Screenshots (if uploaded)
    - Live demo & GitHub links
    - Upvote/Downvote system
    - Comments section for community feedback
    - "Save to Portfolio" button for users who want to bookmark projects.

2. Users can edit their own submitted projects.
3. Users can delete their own projects.

4. Upvote/Downvote System

5. Each project has an upvote and downvote button.
6. Logged-in users can click to upvote or downvote.
7. A project’s rank is calculated based on total votes.
8. Sorting options:


    - Most upvoted
    - Recently added
    - Most commented

4. Community Feedback & Comments

1. Users can comment on a project.
1. Comment features:


    - Markdown support
    - Reply to comments
    - Upvote/downvote comments

3. Comments are displayed in a threaded format.
4. Users can edit or delete their own comments.

5. User Portfolios (For Hiring Opportunities

6. Each user has a profile page that acts as their portfolio.
7. Profile page includes:


    - Name, bio, profile picture
    - List of submitted projects
    - Upvote/downvote stats on projects
    - GitHub & LinkedIn links
    - "Contact Me" button (optional for job opportunities)

3. Users can browse other developers' portfolios.
4. Sorting/filtering developers by skills and top-rated projects.

5. Search & Filtering System

6. Users can search for projects by:


    - Title
    - Developer name
    - Tech stack

2. Filtering options:


    - Most upvoted
    - Recently added
    - Most commented
    - Specific tech stacks (React, Python, etc.)

7. Authentication & User Roles

1. Users can sign up and log in using:


    - Email & password
    - GitHub authentication

2. Roles:


    - **Regular users**: Can submit projects, vote, and comment.
    - **Moderators**: Can remove inappropriate content.
    - **Admins**: Full control over the platform.

## Doc (API, Config, Usage)

when writing doc use Core functionalities step by step

xxxx

## Current file structure

app
├── favicon.ico
├── fonts
├── globals.css
├── layout.tsx
└── page.tsx
components
└── ui
components.json
instructions
└── draft.md
lib
└── utils.ts
next-env.d.ts
next.config.js
package.json
postcss.config.js
tailwind.config.ts
tsconfig.json
yarn.lock

## Additional requirements

1. **Project setup**

   - All new components should go in `/components` at the root (not in the app folder) and be named like `example-component.tsx` unless otherwise specified.
   - All new pages go in `/app`.
   - Use the Next.js 14 app router.
   - All data fetching should be done in a server component and pass the data down as props.
   - Client components (useState, hooks, etc.) require that `'use client'` is set at the top of the file.

2. **Server-Side API Calls**

   - All interactions with external APIs (e.g., Reddit, OpenAI) should be performed server-side.
   - Create dedicated API routes in the `pages/api` directory for each external API interaction.
   - Client-side components should fetch data through these API routes, not directly from external APIs.

3. **Environment Variables**

   - Store all sensitive information (API keys, credentials) in environment variables.
   - Use a `.env.local` file for local development and ensure it's listed in `.gitignore`.
   - For production, set environment variables in the deployment platform (e.g., Vercel).
   - Access environment variables only in server-side code or API routes.

4. **Error Handling and Logging**

   - Implement comprehensive error handling in both client-side components and server-side API routes.
   - Log errors on the server-side for debugging purposes.
   - Display user-friendly error messages on the client-side.

5. **Type Safety**

   - Use TypeScript interfaces for all data structures, especially API responses.
   - Avoid using `any` type; instead, define proper types for all variables and function parameters.

6. **API Client Initialization**

7. **Data Fetching in Components**
   - Use React hooks (e.g., `useEffect`, `useState`) for client-side data fetching.
   - Implement loading states and error messages during data fetching.
