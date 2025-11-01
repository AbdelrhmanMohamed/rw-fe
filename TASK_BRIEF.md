# Senior Frontend Developer Technical Interview Task

## Workflow Step Manager

### Overview

You're building a workflow automation tool similar to Zapier or Make.com. Users create workflows with multiple steps, where each step can use data from previous steps. The core challenge is maintaining data integrity when steps are modified, deleted, or reordered.

### The Challenge

Build a Next.js application that manages workflow steps with complex data dependencies. The main technical challenge is handling **referential integrity** when steps are deleted or reordered - all mappings that reference other steps must be updated correctly.

## Project Setup

The project is already set up with:

- **Next.js 16** with **React 19** and TypeScript
- **Zustand** for state management (already installed)
- **Tailwind CSS** for styling (already configured)
- **Component structure** with placeholder implementations
- **Type definitions** in `src/types/index.ts`
- **Sample data** in `SAMPLE_DATA.json`

### Current Project Structure

```
src/
├── components/
│   ├── WorkflowApp.tsx      # Main app component (needs implementation)
│   ├── StepList.tsx         # Step list display (needs implementation)
│   ├── StepEditor.tsx       # Step editing form (needs implementation)
│   └── AddStepForm.tsx      # Add new step form (partially implemented)
├── store/
│   └── workflowStore.ts     # Zustand store (needs implementation)
└── types/
    └── index.ts             # TypeScript interfaces (complete)
```

### Running the Application

To get started with development:

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

The application will start with placeholder components. You'll need to implement the core functionality in the store and components as described below.

## Requirements

### Must-Have Features

- [ ] As a user, I can add a new step to my workflow
- [ ] As a user, I can delete a step from my workflow
- [ ] As a user, I can see all steps in my workflow
- [ ] As a user, when I delete a step, all mappings referencing it are removed
- [ ] As a user, I can save my workflow and load it later
- [ ] As a user, I can reorder steps in my workflow
- [ ] As a user, when I reorder steps, all mappings are updated to new positions
- [ ] As a user, I can edit step properties
- [ ] As a user, I can add mappings between steps
- [ ] As a user, I can see which steps reference which other steps

### Should-Have Features



### Nice-to-Have Features

- [ ] As a user, I can undo/redo my actions
- [ ] As a user, I can export my workflow as JSON
- [ ] As a user, I can import a workflow from JSON
- [ ] As a user, I can see a visual representation of my workflow
- [ ] As a user, I can validate my workflow for errors

### Technical Requirements

- **No external UI libraries** (build components from scratch)
- **Clean, maintainable code**
- **Client-side rendering** (use "use client" directive where needed)

## Data Structure

The application already includes these interfaces in `src/types/index.ts`:

```typescript
enum StepType {
    API_CALL = "API_CALL",
    FILTER = "FILTER",
    TRANSFORM = "TRANSFORM",
    CONDITION = "CONDITION"
}

interface Step {
    id: string;
    stepNumber: number;
    type: StepType;
    name: string;
    mappings: Mapping[];
    config: Record<string, any>;
}

interface Mapping {
    id: string;
    source: string; // e.g., "${step_2.response.data}"
    target: string; // e.g., "request.body.email"
    dataType: "string" | "number" | "object" | "array";
}

interface Workflow {
    id: string;
    name: string;
    steps: Step[];
}
```

## Key Technical Challenges

### 1. Referential Integrity (Core Challenge)

The main challenge is maintaining data integrity when steps are modified:

**Step Deletion Example:**

- When Step 2 is deleted from a 5-step workflow:
    - Steps 3, 4, 5 become 2, 3, 4 (step numbers update)
    - Any mapping referencing step 2 must be removed
    - Any mapping referencing steps 3+ must be updated to new numbers
    - Must preserve unique IDs for steps

**Step Reordering Example:**

- When Step 4 is moved to position 2:
    - All step numbers must be recalculated
    - All mappings must be updated to reference new step numbers
    - `${step_4.response.data}` becomes `${step_2.response.data}`

### 2. State Management with Zustand

- Handle cascading updates when steps change
- Maintain immutability in state updates
- Optimize re-renders with proper selectors
- Integrate with Next.js "use client" directives

### 3. Component Implementation

The current codebase has placeholder components that need full implementation:

- **WorkflowApp**: Main orchestrator component
- **StepList**: Display and manage step list with reordering
- **StepEditor**: Edit individual step properties and mappings
- **AddStepForm**: Already partially implemented, needs completion

Each component needs to integrate properly with the Zustand store and handle the complex state updates.

## Sample Data & Testing

The application includes comprehensive sample data in `SAMPLE_DATA.json` with:

- **Complete workflow example** with 4 steps demonstrating different step types
- **Test cases** for step deletion and reordering scenarios
- **Edge cases** including empty workflows and complex mappings
- **Real-world examples** with nested object mappings

The sample data includes:

- User onboarding workflow with API calls, filters, and transforms
- Test cases for deleting middle steps, first steps, and reordering
- Edge cases for empty workflows and single-step workflows
- Complex mappings with nested object references

Use `SAMPLE_DATA.json` as your primary reference for testing and development.

## Implementation Approach

### Recommended Development Order

1. **Start with the Zustand Store** (`src/store/workflowStore.ts`)
    - Implement basic CRUD operations first
    - Add step deletion logic with mapping cleanup
    - Add step reordering with mapping updates
    - Add localStorage persistence

2. **Build Core Components**
    - Complete `WorkflowApp` main component
    - Implement `StepList` with basic display and delete functionality
    - Add step reordering to `StepList`
    - Complete `StepEditor` for editing step properties

3. **Add Advanced Features**
    - Implement mapping management
    - Add validation and error handling
    - Test with sample data scenarios

4. **Polish & Testing**
    - Add responsive design with Tailwind CSS
    - Test edge cases from sample data
    - Add proper error boundaries and loading states

### Key Implementation Notes

- **Store Implementation**: The `workflowStore.ts` file has all method signatures but needs implementation
- **Component Props**: All components have proper TypeScript interfaces defined
- **Sample Data**: Use `SAMPLE_DATA.json` to test your implementation
- **Client Components**: Remember to use "use client" directive for components that use state
- **Styling**: Use Tailwind CSS classes for responsive design

## What We're Looking For

### Core Skills Assessment

**Code Quality (40%)**

- Clean, readable code with good naming conventions
- Proper TypeScript usage with strict typing
- Good component structure and separation of concerns
- Error handling and edge cases
- Proper use of Next.js patterns and "use client" directives
- Tailwind CSS styling implementation

**Functionality (30%)**

- All must-have features working correctly
- Proper handling of step deletion and reordering
- Data integrity maintained across all operations
- Correct mapping updates when steps change
- localStorage persistence working correctly

**State Management (20%)**

- Effective use of Zustand with proper store implementation
- Immutable state updates following Zustand patterns
- Performance considerations and proper re-rendering
- Clean separation between state and UI logic

**Documentation (10%)**

- Clear README with setup instructions
- Code comments for complex logic (especially mapping updates)
- Brief explanation of approach and trade-offs
- Comments explaining the referential integrity logic

## Submission

1. **Fork or clone** this repository
2. **Implement** the required functionality
3. **Test** your implementation with the provided sample data
4. **Create a README** with:
    - Setup instructions
    - Brief explanation of your approach
    - Any trade-offs or assumptions made
    - How to test the key features
5. **Submit** the repository link or zip file

## Questions?

If you have any questions about the requirements, please ask! It's better to clarify upfront than make assumptions.

Good luck! 🚀
