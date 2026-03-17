This project is a visual design sandbox only. Imagine Figma.

Context for the design sandbox project.
You are working inside a local React + Vite project that serves as a visual design sandbox for a translation learning application. The purpose of this project is UI iteration and layout development only, not production application logic. All work should focus on visual structure, hierarchy, spacing, and component layout.
Application concept:
This application is a guided translation practice tool. A user imports a text in any language, segments it on earlier screens (not part of this sandbox), and then arrives at the Main Translation Page where they translate each segment one by one.
Core workflow of the product:
User sees a segment of the source text.
The interface provides optional lexicography hints for difficult words or phrases.
The user writes their own translation.
The user submits their translation.
The system reveals:
a high-quality reference translation
a grade evaluating the user’s attempt
feedback and suggestions for improvement
The user can then:
move to the next segment
navigate to previous segments
open a discussion if something is unclear.
The goal of the interface is to make the translation loop feel simple and approachable for new users while still supporting deeper learning.
Design principles:
The interface should feel clear, approachable, and modern, not academic or intimidating.
The central activity is translation practice, so the center column should be visually dominant.
Assistance tools should be available but not overwhelming.
Primary layout structure:
The application uses a three-column layout.
Left column
Segment navigation tree. Allows users to move between segments of the imported text.
Center column
The primary translation workspace. This contains:
source text
quick lexicography hints
translation editor
submission action
Right column
Support and analysis panels. These are card-based components that can include:
guidance
reference translation
grade
feedback
discussion.

Important UX feature:
Lexicography hints appear directly below the source text in the center column as small quick-access hints. Users can expand them to see deeper lexical explanations. This allows users to get help without leaving the translation flow.
Development constraints for this sandbox:
This project is not the production app, it is only for UI design iteration.
Do not implement backend logic.
Do not add API calls.
Do not add state management unless explicitly requested.
Components should remain simple and visually focused.
The goal is to recreate and refine the interface design exported from Figma.
File structure expectations:
React components represent visual panels.
The screen layout is composed of:
Sidebar (global navigation)
LeftPanel (segment navigation)
CenterPanel (translation workspace)
RightPanel (support cards)
Your task when editing code in this repository is to improve visual design and structure without altering the conceptual workflow of the app.


Rules:
- Focus on front-end visual design only
- Do not add backend code outside of what allows us to navigate screens or functionally see items working 
- Use dummy data and information as needed
- Do not add real app logic to actually get it to work
- Keep code clean and readable and segment code logically so each section can be worked on individually
- The product is a guided translation practice app
- the çentral flow is: Read source > Use hints if needed > Write translation > Submit > See best translation + grade + discuss if needed + Learn from feedback > Go to next segment
- side workflows include creating logical segments from long text
- failure screens that require re-tries
- exam screen for testing prior knowledge
- The center column is the primary focus
- The left side is primarily for navigation and the right hand side is for hints / tips / grading (additional info)
- Optimize for approachable, premium, award winning, always 9.5/10 or more styling
- ensure consistency in sizes, fonts, accent colours and so on. 
- Stunning designs

Cleanup instruction:
Whenever the user asks for "cleanup", interpret that as a UI consistency audit and polish pass, not a redesign by default.

What "cleanup" means in this project:
- align all cards, headers, labels, inputs, and buttons
- implement a consistent spacing system
- apply consistent padding inside cards and panels
- standardize border radius across similar components
- standardize font sizes, weights, and line heights
- establish consistent vertical rhythm between sections
- fix awkward indents, off-center content, uneven gaps, and misaligned text or icons
- ensure columns and panel edges line up cleanly
- remove one-off styling values where possible
- avoid overlapping texts and boxes

When performing cleanup:
1. First identify rule violations.
2. Then propose structural adjustments.
3. Then implement the minimal fixes.

Cleanup constraints:
- do not redesign the component unless the user explicitly asks
- do not invent new components unless necessary
- do not change colors or fonts unless the user explicitly asks
- do not alter the layout concept unless the user explicitly asks
- focus only on spacing, alignment, grouping, consistency, and layout polish

Cleanup checklist:
- consistent left alignment
- consistent vertical spacing scale
- balanced whitespace distribution
- grouped metadata chips
- action button placed in action region
- text blocks visually connected to related controls
- no floating elements disconnected from layout flow
