# Workflow Step Manager

A Next.js application for managing workflow automation steps with complex data dependencies. This application allows users to create, edit, delete, and reorder workflow steps while maintaining referential integrity across step mappings.

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone or download this repository

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Tech Stack

This application is built using modern web technologies with a focus on simplicity, performance, and maintainability.

### Core Framework & Runtime

- **Next.js 16** - React framework for production with server-side rendering capabilities
- **React 19** - UI library for building interactive user interfaces
- **TypeScript 5** - Type-safe JavaScript for improved developer experience and code quality
- **Node.js 18+** - JavaScript runtime environment

### State Management

- **Zustand 5** - Lightweight state management library for React
  - Used for managing workflow state, history, and UI state
  - Provides immutable state updates and optimistic UI updates

### Styling

- **Tailwind CSS 4** - Utility-first CSS framework
  - Custom UI components built without external component libraries
  - Responsive design with mobile-first approach
  - Consistent design system with custom component library

### Development Tools

- **ESLint** - Code linting with Next.js configuration
- **TypeScript** - Static type checking and type safety
- **PostCSS** - CSS processing with Tailwind CSS

### Browser APIs

- **localStorage** - Client-side persistence for workflow data
- **HTML5 Drag-and-Drop API** - Native browser API for step reordering
- **File API** - For importing/exporting workflows as JSON files

### Architecture Patterns

- **Client-side Rendering** - All components use "use client" directive for React Server Components compatibility
- **Component-based Architecture** - Modular, reusable React components
- **State-centric Design** - Zustand store as single source of truth
- **Custom UI Components** - No external UI libraries (built from scratch with Tailwind CSS)

### Key Dependencies

```
Production Dependencies:
- next@16.0.0
- react@19.2.0
- react-dom@19.2.0
- zustand@^5.0.8

Development Dependencies:
- typescript@^5
- tailwindcss@^4
- eslint@^9
- @types/node@^20
- @types/react@^19
```

## Brief Explanation of Approach

### Architecture Overview

The application follows a **state-centric architecture** using Zustand for state management, with a clear separation between:

- **State Layer**: Zustand store (`workflowStore.ts`) managing all workflow operations
- **UI Layer**: React components handling user interactions
- **Utility Layer**: Helper functions for I/O operations and validation

### Core Implementation Strategy

#### 1. Referential Integrity Management

The main technical challenge is maintaining data integrity when steps are modified. The solution uses a **string-based mapping system** where mappings reference steps using patterns like `${step_2.response.data}`.

**Step Deletion Algorithm:**

1. Remove the deleted step from the array
2. Recalculate step numbers sequentially (1, 2, 3...)
3. Remove mappings that reference the deleted step
4. Update all other mappings by decrementing step numbers that were after the deleted step

**Step Reordering Algorithm:**

1. User drags step to new position (native HTML5 drag-and-drop)
2. `StepList` component reorders step IDs array
3. Store creates a mapping table of old step numbers → new step numbers
4. Use a two-pass replacement strategy:
   - First pass: Replace old step numbers with temporary placeholders (`__TEMP_X__.`)
   - Second pass: Replace placeholders with final step numbers
5. This prevents conflicts when swapping step positions (e.g., step_2 ↔ step_4)

#### 2. State Management Pattern

- **Immutable Updates**: All state changes create new objects, following Zustand best practices
- **History Management**: Implements undo/redo with a bounded history stack (max 10 entries)
- **Local Persistence**: Workflows are saved to `localStorage` via manual "Save Workflow" button
- **Optimistic Updates**: UI updates immediately, with manual localStorage sync on save

#### 3. Component Architecture

- **WorkflowApp**: Main orchestrator component, handles initial data loading from localStorage or sample data
- **StepList**: Displays steps with drag-and-drop reordering and delete functionality
- **Step**: Individual step component with edit/delete/move actions, shows mappings count
- **StepEditor**: Slide-over panel (Sheet) for editing step properties and managing mappings
- **AddStepForm**: Form for creating new steps with type selection and default configuration
- **WorkflowToolbar**: Actions for save/load, import/export, undo/redo with loading states

#### 4. Drag-and-Drop Reordering

Reordering is implemented using native HTML5 drag-and-drop API:

- Drag starts from drag handle on each step
- On drag over, steps are reordered immediately
- `reorderSteps` is called with new step ID array
- All mappings are updated using the two-pass algorithm

## Trade-offs and Assumptions

### Trade-offs

1. **String-based Mapping References**:

   - ✅ **Pros**: Simple, flexible, human-readable
   - ❌ **Cons**: Requires regex replacement for updates, potential for edge cases with partial matches
   - **Mitigation**: Uses `replaceAll()` with exact pattern matching (`step_X.`) to avoid false positives
   - **Note**: Mapping validation requires format `${step_N.response...}` in StepEditor

2. **Auto-complete for Mappings (Future Enhancement)**

   - **Current Behavior**:  
     Users manually type mapping sources like `${step_1.response.data.id}` and targets like `request.body.userId`.

   - **Proposed Enhancement**:  
     Each step should define an **input schema** and **output schema**, allowing the app to provide **auto-complete suggestions** when creating mappings.

   - **Trade-offs**:
     - ✅ **Pros**:
       - Greatly improves UX by reducing typing errors.
       - Enforces data consistency between steps.
       - Enables type-safe mapping validation.
     - ❌ **Cons**:
       - Requires defining schemas for every step type.
       - Increases implementation complexity — needs a central registry of step input/output models.
       - Auto-complete logic must track dependencies dynamically (changes in step order or deletion).
     - **Assumption**:  
       For the current scope, manual mapping entry is sufficient. Auto-complete can be implemented in the next iteration using schema-based metadata per step type.

3. **Manual Save to localStorage**:

   - ✅ **Pros**: No backend required, works offline, user controls when to save
   - ❌ **Cons**: Limited storage (~5-10MB), browser-specific, no sync across devices, manual save required
   - **Assumption**: This is acceptable for a demo/prototype. Production would need backend storage with auto-save

4. **No External UI Libraries**:

   - ✅ **Pros**: Full control, smaller bundle, no dependencies
   - ❌ **Cons**: More code to write, must handle accessibility manually
   - **Note**: Custom UI components built with Tailwind CSS for styling

5. **Visual Workflow Representation**:
   - ✅ **Current**: List-based view with drag-and-drop reordering
   - ❌ **Missing**: Visual flow diagram showing connections between steps
   - **Recommendation**: For visual flow presentation, consider using **React Flow** (`reactflow`):
     - Node-based flow diagrams with connections between steps
     - Pan/zoom functionality for large workflows
     - Customizable nodes representing each step type
     - Interactive edges showing data mappings between steps
     - Built-in controls for node manipulation
   - **Trade-off**: Adding React Flow would require:
     - Converting steps to nodes and mappings to edges
     - Handling visual reordering (drag nodes) that updates the underlying data
     - Maintaining sync between visual view and list view
     - Additional bundle size (~100KB+ for reactflow)
   - **Note**: Currently implemented as a list view for simplicity and performance

## How to Test the Key Features

This section provides step-by-step instructions for testing all the key features of the Workflow Step Manager application.

### Prerequisites for Testing

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. The application will load with sample data if no saved workflow exists

### Must-Have Features

#### 1. Add a New Step to Workflow

**Steps:**

1. Scroll to the "Add New Step" form at the top of the page
2. Enter a step name (e.g., "Send Email")
3. Select a step type from the dropdown:
   - `API_CALL` - For making API requests
   - `FILTER` - For filtering data
   - `TRANSFORM` - For transforming data
   - `CONDITION` - For conditional logic
4. Click the "Add Step" button
5. **Expected Result:** The new step appears in the step list below with the correct step number

#### 2. Delete a Step from Workflow

**Steps:**

1. Locate a step in the step list
2. Click the "Delete" button (trash icon) on the step card
3. Confirm the deletion if prompted
4. **Expected Result:**
   - The step is removed from the list
   - Step numbers are recalculated (e.g., if Step 2 was deleted, Step 3 becomes Step 2, Step 4 becomes Step 3, etc.)
   - Any mappings that referenced the deleted step are automatically removed
   - Mappings referencing steps after the deleted one are updated with new step numbers

**Test Case:**

- Delete Step 2 from a 4-step workflow
- Verify that mappings like `${step_2.response.data}` are removed
- Verify that mappings like `${step_3.response.data}` become `${step_2.response.data}`

#### 3. View All Steps in Workflow

**Steps:**

1. Open the application - steps should be visible immediately
2. Scroll through the step list
3. **Expected Result:**
   - All steps are displayed in a vertical list
   - Each step shows:
     - Step number (e.g., "Step 1", "Step 2")
     - Step name
     - Step type badge
     - Number of mappings (if any)
     - Action buttons (Edit, Delete, Move Up/Down)

#### 4. Verify Mapping Cleanup on Step Deletion

**Steps:**

1. Open a step that has mappings (click "Edit" button)
2. Note which steps are referenced in the mappings (e.g., `${step_2.response.data}`)
3. Delete one of the referenced steps (e.g., Step 2)
4. Open other steps that had mappings referencing the deleted step
5. **Expected Result:**
   - Mappings referencing the deleted step are completely removed
   - Only mappings that referenced other steps remain
   - Step numbers in remaining mappings are updated correctly

#### 5. Save and Load Workflow

**Steps to Save:**

1. Make any changes to the workflow (add/delete/edit steps)
2. Click the "Save Workflow" button in the toolbar
3. Check the browser's Developer Tools → Application → Local Storage
4. **Expected Result:**
   - A "workflow" key is created in localStorage
   - The workflow data is stored as JSON

**Steps to Load:**

1. Refresh the page or close and reopen the browser
2. **Expected Result:**
   - The saved workflow loads automatically from localStorage
   - All steps and mappings are restored correctly

### Quick Feature Checklist

Use this checklist to verify all features work:

- [ ] Can add new steps with different types
- [ ] Can delete steps
- [ ] Step numbers recalculate after deletion
- [ ] Mappings referencing deleted steps are removed
- [ ] Mappings referencing other steps are updated after deletion
- [ ] Can reorder steps by dragging
- [ ] Mappings update correctly after reordering
- [ ] Can edit step names and properties
- [ ] Can add mappings in correct format
- [ ] Can see mapping count on step cards
- [ ] Can save workflow to localStorage
- [ ] Can load workflow from localStorage
- [ ] Can undo last action (up to 10)
- [ ] Can redo undone action
- [ ] Can export workflow as JSON
- [ ] Can import workflow from JSON
- [ ] Sample data loads if no saved workflow exists
