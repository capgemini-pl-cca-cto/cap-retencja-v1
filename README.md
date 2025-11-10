# LiczyDeszcz v1 🌧️

This project is built with modern web technologies to provide a robust and developer-friendly experience:

- React 19 with TypeScript for type-safe development
- Vite 7 for lightning-fast development and builds
- shadcn/ui for pre-built, accessible components
  - Built on top of Tailwind CSS and Radix UI
  - Customizable and maintainable component system
- ESLint and Prettier for code quality

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (project uses `.nvmrc` file to specify the correct version)
  ```bash
  # If you use nvm, run:
  nvm use
  # This will automatically switch to the correct Node.js version
  ```
- pnpm (recommended package manager)
  ```bash
  npm install -g pnpm
  ```
- Visual Studio Code (recommended editor)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/capgemini-pl-cca-cto/cap-retencja-v1.git
   cd cap-retencja-v1
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:5173`

## Recommended VS Code Extensions

For the best development experience, install these extensions:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- Vitest Explorer

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the project for production
- `pnpm preview` - Preview the production build locally
- `pnpm lint` - Run ESLint to check code quality
- `pnpm test` - Run unit tests with Vitest
- `pnpm generate` - Generate new components using plop templates

## Project Structure

```
src/
├── app/                   # App-level components and styles
├── assets/                # Static assets like images
├── components/            # Reusable UI components
│   └── ui/                # Base UI components
├── features/              # Feature-based modules
│   ├── kalkulator/        # Calculator feature
│   ├── inwestycja/        # Map feature
│   └── raport/            # Report feature
└── lib/                   # Utility functions and shared code
```

## Development Guidelines

### Creating New Components

We use plop for generating consistent component templates. To create a new component:

```bash
pnpm generate component
```

Follow the prompts to specify the component name and location.

### Code Style

This project uses ESLint and Prettier for code formatting. The configuration is already set up in the project. VS Code will automatically format your code on save if you have the recommended extensions installed.

### Testing

#### Unit testing

We use Vitest for integration unit testing. Tests are located alongside the components they test, following the `.test.tsx` naming convention.

#### Integration and E2E testing

For end-to-end testing, we use Playwright. Test files are located in the `/tests` directory. You can run the tests using:

```bash
pnpm test:e2e
```

### Components and Styling

We use [shadcn/ui](https://ui.shadcn.com/) for our component system. It provides a collection of re-usable components that you can copy and paste into your apps.

Key aspects:

- Components are built on top of Tailwind CSS and Radix UI
- All components are customizable through the `components.json` configuration
- New components can be added using the shadcn/ui CLI

#### Adding New shadcn/ui Components

To add a new component from the shadcn/ui collection:

```bash
pnpm dlx shadcn@latest add <component-name>
# Example: pnpm dlx shadcn@latest add button
```

#### Custom Components Styling

For custom components, follow these patterns:

- Use the `className` prop with Tailwind utility classes
- Leverage the `cva` function from `class-variance-authority` for component variants
- Use the `cn` utility from `lib/utils.ts` for conditional classes

Example:

```tsx
import { cn } from '@/lib/utils';

const MyComponent = ({ className, variant = 'default', ...props }) => {
  const styles = cva(
    // Base styles
    'rounded-lg p-4',
    {
      variants: {
        variant: {
          default: 'bg-white text-gray-900',
          primary: 'bg-blue-500 text-white',
        },
      },
    },
  );

  return (
    <div className={cn(styles({ variant }), className)} {...props}>
      {/* content */}
    </div>
  );
};
```

#### Component Configuration

The `components.json` file in the root directory controls the theming and styling of shadcn/ui components. You can modify this file to:

- Change the color scheme
- Update typography
- Modify component default styles
- Configure the base layer`

## Troubleshooting

Common issues and solutions:

1. **Node.js version mismatch**

   ```bash
   # Check if you're using the correct Node.js version
   node --version
   # If not, and you're using nvm:
   nvm use
   # Then reinstall dependencies
   pnpm install
   ```

2. **Build errors after pulling new changes**

   ```bash
   pnpm install && pnpm build
   ```

3. **ESLint/TypeScript errors**
   - Make sure VS Code is using the workspace TypeScript version
   - Run `pnpm lint` to see detailed error messages

4. **Hot reload not working**
   - Check if you have other dev servers running
   - Try clearing the Vite cache: delete `.vite` folder and restart

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Hosting

The application is designed to be easily deployable on any hosting platforms: [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html). But any web server like Nginx is enough to provide application assets. The build output is located in the `dist` directory. For more details check the [Installation Guide (pl)](INSTALLATION.md).

## Need Help?

- Check the [React documentation](https://react.dev/)
- Explore [Vite guides](https://vitejs.dev/guide/)
- Review [Tailwind CSS documentation](https://tailwindcss.com/docs)
- Browse [shadcn/ui documentation](https://ui.shadcn.com/docs) for component examples
- Ask team members in the project chat
