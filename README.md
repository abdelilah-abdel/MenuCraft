# MenuCraft - Digital Menu Generator

**Tagline:** "Digital Menus Made Simple"

A lightweight, optimized Next.js application for creating beautiful digital restaurant menus with QR code generation.

> **Version:** 1.0.0 (MVP)
> **Status:** Active Development
> **License:** MIT

## Features

- **Easy Menu Builder**: Intuitive form-based interface to create menu sections and items
- **3 Beautiful Templates**: Choose from Classic, Modern, or Minimal designs
- **Full Customization**: Customize colors, fonts, and visibility options
- **QR Code Generation**: Instant QR code creation for contactless menu access
- **Image Upload**: Support for menu item and restaurant logo images (base64 for now, easily migrated to cloud storage)
- **Export/Import**: Save menus as JSON for backup and sharing
- **Shareable Links**: Each menu gets a unique URL accessible via QR code
- **Owner Accounts**: Owners sign in to maintain one restaurant workspace and menu
- **Responsive Design**: Works perfectly on all devices
- **No External UI Libraries**: Lightweight and fast, using only Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **QR Codes**: qrcode library
- **Data Storage**: Owner accounts and menus are stored on the application server for a single persistent app instance

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd digital-menu-generator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Owner Accounts

Create an account at `/sign-up` and return to it at `/sign-in` whenever the owner session ends. In local development, account records, menus, and the generated session secret are stored under `.menucraft-data/`, which is excluded from Git. Set `MENUCRAFT_DATA_DIR` to use a different persistent data directory.

Production deployments must set `MENUCRAFT_SESSION_SECRET` to a secret with at least 32 characters. The account and menu stores use the server filesystem, so they require protected persistent storage and are intended for a single application instance. Use shared account and menu persistence before deploying multiple instances or an ephemeral serverless runtime.

## Project Structure

```
digital-menu-generator/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Homepage/Dashboard
│   ├── builder/                  # Menu builder page
│   │   └── page.tsx
│   ├── menu/[id]/                # Public menu preview
│   │   └── page.tsx
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── builder/                  # Menu builder components
│   │   ├── MenuBuilder.tsx       # Main builder form
│   │   └── TemplateSelector.tsx  # Template selection
│   ├── preview/                  # Preview components
│   │   ├── MenuPreview.tsx       # Menu preview wrapper
│   │   └── QRCodeDisplay.tsx     # QR code display and download
│   └── ui/                       # Reusable UI components
│       ├── Button.tsx
│       └── Input.tsx
├── lib/                          # Core logic and utilities
│   ├── types/                    # TypeScript type definitions
│   │   └── menu.ts
│   ├── services/                 # Service layer (abstraction)
│   │   ├── imageService.ts       # Image upload abstraction
│   │   ├── menuService.ts        # Menu CRUD operations
│   │   └── qrService.ts          # QR code generation
│   └── templates/                # Menu templates
│       ├── ClassicTemplate.tsx
│       ├── ModernTemplate.tsx
│       ├── MinimalTemplate.tsx
│       └── index.tsx
└── data/                         # Data storage (future use)
    └── menus/
```

## Architecture & Design Decisions

### Extensible Code

The project is built with extensibility in mind:

1. **Service Abstraction**: All services (image upload, menu storage, QR generation) are abstracted into service classes that can be easily swapped or extended.

2. **Template System**: Templates are React components that follow a consistent interface, making it easy to add new designs.

3. **Type Safety**: Full TypeScript coverage ensures type safety and better developer experience.

4. **JSON-Based Data**: Menus are stored as JSON, making them portable and easy to migrate to different storage solutions.

### Image Service Migration Path

Currently using base64 encoding for images (test phase). To migrate to cloud storage:

1. Open `lib/services/imageService.ts`
2. Uncomment the `CloudImageService` class
3. Add your cloud storage credentials to environment variables
4. Change the export at the bottom from `new Base64ImageService()` to `new CloudImageService()`

Example for Cloudinary:
```typescript
// .env.local
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
```

### Data Storage

Owner menus are stored on the application server in `.menucraft-data/menus.json` by default. Existing menus saved in browser localStorage are migrated when their owner first opens the builder.

To replace the file store with a database:

1. Replace the file-backed implementation in `lib/server/menuStore.ts`
2. Keep the owner and public menu API routes as the application boundary
3. Configure shared durable storage for the deployed application

## Templates

### Classic
Traditional elegant design with centered layout, perfect for fine dining restaurants.

### Modern
Contemporary dark theme with bold typography and card-based layout.

### Minimal
Clean and simple design focusing on content with subtle aesthetics.

## Customization

Each menu can be customized with:
- Primary and secondary colors
- Restaurant logo
- Toggle price visibility
- Toggle description visibility
- Toggle image visibility
- Restaurant name and description

## QR Code Features

- Customizable colors matching your brand
- High resolution (400x400px)
- Downloadable as PNG
- Shareable public URL
- Persistent - QR code stays the same even when menu is updated

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This project can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Any Node.js hosting**

### Vercel Deployment

1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy (no configuration needed)

## Future Enhancements

- [ ] User authentication and multi-user support
- [ ] Cloud image storage integration
- [ ] Database integration for menu persistence
- [ ] Menu analytics (views, scans)
- [ ] PDF export for printing
- [ ] Multiple language support
- [ ] Drag-and-drop menu item ordering
- [ ] Menu categories/tags filtering
- [ ] Online ordering integration
- [ ] Custom domain support

## 📚 Documentation

**Comprehensive guides for team collaboration:**

- [**docs/FRONTEND_GUIDE.md**](./docs/FRONTEND_GUIDE.md) - UI/UX development guide, design system, AI prompts
- [**docs/PROJECT_VISION.md**](./docs/PROJECT_VISION.md) - Business model, feature roadmap, revenue strategy
- [**docs/VERSIONING_STRATEGY.md**](./docs/VERSIONING_STRATEGY.md) - Git workflow, branching, commit conventions
- [**docs/COLLABORATION_GUIDE.md**](./docs/COLLABORATION_GUIDE.md) - Team workflow, code review process
- [**docs/README.md**](./docs/README.md) - Documentation hub with quick navigation

**For Contributors:**
- [**.github/PULL_REQUEST_TEMPLATE.md**](./.github/PULL_REQUEST_TEMPLATE.md) - PR template with checklist

## Contributing

We welcome contributions! Please follow these steps:

1. Read [COLLABORATION_GUIDE.md](./docs/COLLABORATION_GUIDE.md)
2. Check [PROJECT_VISION.md](./docs/PROJECT_VISION.md) for planned features
3. Follow [VERSIONING_STRATEGY.md](./docs/VERSIONING_STRATEGY.md) for Git workflow
4. Use [FRONTEND_GUIDE.md](./docs/FRONTEND_GUIDE.md) for code conventions
5. Submit PRs using the provided template

## Team Workflow

### For New Features

```bash
# 1. Create feature branch
git checkout -b feature/FEAT-001-description

# 2. Implement following FRONTEND_GUIDE.md
# ... code ...

# 3. Commit with convention
git commit -m "feat(builder): add feature (#FEAT-001)"

# 4. Push and create PR
git push origin feature/FEAT-001-description
```

See [VERSIONING_STRATEGY.md](./docs/VERSIONING_STRATEGY.md) for complete workflow.

## License

MIT License - feel free to use this project for commercial or personal use.

## Support

- **Documentation:** Check [docs/](./docs/) folder
- **Issues:** Create a GitHub issue
- **Questions:** Open a GitHub Discussion
