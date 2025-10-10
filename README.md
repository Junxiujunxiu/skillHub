# SkillHub – Course Management App

SkillHub is a **full-stack course management platform** built with **Next.js** (frontend) and **Node.js + Express** (backend).  
It was developed as a **learning project**, where I researched documentation, explored tutorials, and practiced end-to-end software lifecycle concepts.  

---

## Features

- **Frontend**
  - Next.js + TypeScript
  - Redux Toolkit + RTK Query (state management & API interaction)
  - Tailwind CSS + shadcn/ui (modern styling & UI components)
  - Framer Motion (animations)
  - React Hook Form + Zod (forms & validation)
  - Clerk (authentication & session management)
  - Stripe integration (payments)
  - React Player (video playback)

- **Backend**
  - Node.js + Express REST API
  - Dockerized for consistent environment
  - AWS Lambda (serverless backend)
  - API Gateway (secure request routing)
  - DynamoDB (NoSQL database)
  - S3 (video storage)
  - CloudFront (CDN for low-latency delivery)
  - Multer (file uploads)

---

## VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- Prettier – Code formatter
- Tailwind CSS IntelliSense
- Tailwind Documentation

---

## Chrome Extensions

- Pesticide – visualize CSS layout
- Redux DevTools – debug Redux state

---

## Dependencies

- **Frontend**: next, typescript, redux, @reduxjs/toolkit, react-redux, framer-motion, react-hook-form, zod, @hookform/resolvers, @clerk/nextjs, @clerk/clerk-js, @clerk/themes, @stripe/react-stripe-js, @stripe/stripe-js, @hello-pangea/dnd, react-player, uuid, date-fns, shadcn/ui
- **Backend**: express, dotenv, pluralize, stripe, multer, serverless-http, uuid
- **Dev**: tailwindcss, postcss, autoprefixer, @types/node, @types/uuid, @types/multer, @types/pluralize, prettier-plugin-tailwindcss, cpx

---

## Cloud Deployment

- **Frontend**: hosted on Vercel
- **Backend**:
  - Docker image stored in AWS Elastic Container Registry (ECR)
  - AWS Lambda for execution
  - API Gateway for client-backend communication
  - DynamoDB for storage
  - S3 for video content
  - CloudFront for CDN delivery

---

## Authentication

- **Clerk authentication provides**:
  - Sign-up / sign-in flows
  - Session handling
  - Themed prebuilt UI

---

## Development Approach

- Project built as a **learning journey**
- Researched multiple resources, documentation, and tutorials
- Focused on **understanding how frontend communicates with backend**
- Explored **real-world cloud deployment** with Docker, AWS, and Vercel
- Emphasis on scalability and lifecycle of software development

---


