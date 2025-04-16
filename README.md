# INSA Personality Testing Platform

A cloud-native multi-tenant SaaS web application for psychology-based internal testing.

## Overview

The INSA Personality Testing Platform is designed to replace traditional paper-based personality tests with a modern, web-native solution. It provides a comprehensive testing environment for organizations to assess their employees' personality traits and psychological profiles in a secure and efficient manner.

## Features

### Multi-tenancy Architecture

- Support for multiple organizations with isolated data
- Hierarchical structure: Superadmin > Organization Admin > Branch Admin > Employee
- Customizable settings at each level

### Role-based Access Control

- **Superadmin**: Full platform oversight, organization management, and compliance monitoring
- **Organization Admin**: Branch management, employee oversight, and test monitoring
- **Branch Admin**: Employee management, test administration, and results analysis
- **Employee**: Test-taking and personal results viewing

### Custom Test Engine

- Four distinct personality tests:
  - Personality Type Indicator (MBTI-style)
  - Five Factor Assessment (Big Five)
  - Behavioral Style Assessment (DISC)
  - Enneagram Profile
- Sequential question presentation
- Fullscreen, distraction-free test-taking experience
- One-time test completion with results storage

### User Management

- Bulk employee upload via Excel
- Individual employee addition
- Email notifications for account creation and test assignments
- Comprehensive user profiles

### Results Analysis

- Detailed personality profiles
- Strengths and areas for development
- Insightful summaries without academic scoring
- Visualization of personality traits

### Enhanced User Experience

- Responsive, mobile-first design
- Animations and transitions for improved engagement
- Light and dark mode support
- Multi-language support (English and Amharic)

## Technology Stack

- **Frontend**: Next.js 14 with App Router, React 18, Tailwind CSS
- **UI Components**: shadcn/ui component library
- **State Management**: React Context API
- **Data Visualization**: Recharts for charts, React Simple Maps for geographical data
- **Styling**: Tailwind CSS with theming support
- **Animations**: Framer Motion
- **Internationalization**: Custom i18n implementation

## Project Structure

\`\`\`
insa-personality-testing/
├── app/ # Next.js App Router
│ ├── dashboard/ # Dashboard routes
│ │ ├── superadmin/ # Superadmin specific pages
│ │ ├── organization/ # Organization admin pages
│ │ ├── branch/ # Branch admin pages
│ │ └── employee/ # Employee pages
│ ├── layout.tsx # Root layout
│ └── page.tsx # Login page
├── components/ # React components
│ ├── dashboard/ # Dashboard-specific components
│ ├── employee/ # Employee-specific components
│ ├── superadmin/ # Superadmin-specific components
│ ├── ui/ # UI components (shadcn)
│ └── ... # Other shared components
├── hooks/ # Custom React hooks
├── lib/ # Utility functions and shared code
│ ├── translations.ts # Translation strings
│ └── utils.ts # Helper functions
└── public/ # Static assets
\`\`\`

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/Aksumite-Platforms-Inc/INSA-PersonalityTest-saas-web-app.git
   cd INSA-PersonalityTest-saas-web-app
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install

   # or

   yarn install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev

   # or

   yarn dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Login

The application starts with a login page where users can enter their credentials and select their role:

- **Superadmin**: Full access to all organizations, users, and settings
- **Organization Admin**: Manages branches and employees within their organization
- **Branch Admin**: Manages employees and tests within their branch
- **Employee**: Takes tests and views their results

### Employee Test-Taking Process

1. Employee logs in with provided credentials
2. Selects a personality test from the available options
3. Enters fullscreen mode for distraction-free test-taking
4. Answers questions sequentially
5. Submits the test upon completion
6. Views personalized results and insights

### Admin Workflows

#### Organization Admin

1. Register new branches
2. Assign Branch Admins via email
3. Monitor test completion rates across branches
4. View aggregated test results

#### Branch Admin

1. Upload employees in bulk via Excel template
2. Add employees individually
3. Monitor employee test completion
4. View individual and aggregated test results

#### Superadmin

1. Manage organizations
2. Monitor platform-wide compliance
3. Access all test results and analytics
4. Configure global platform settings

## Customization

### Adding New Tests

To add a new personality test:

1. Create a new test definition in the `testData` object
2. Define questions and response options
3. Implement scoring logic
4. Add visualization components for results

### Extending User Roles

To add a new user role:

1. Update the role definitions in the authentication system
2. Create appropriate dashboard views
3. Configure permissions and access controls
4. Update the login page to include the new role

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- INSA for the project requirements and domain expertise
- The shadcn/ui team for the excellent component library
- The Next.js team for the powerful framework
  \`\`\`
