# Wade-USA.com Project

Welcome to the Wade-USA.com project! This repository hosts the development of a multi-feature website. The primary goal of this project is learning and building a comprehensive web application using modern web technologies, with a focus on modular design and reusable components.

## Project Vision

Wade-USA.com aims to be a platform incorporating various tools and informational resources. The development process emphasizes understanding core concepts, hence the codebase includes extensive comments and documentation.

## Technologies Used

* **Front End:** React (Vite), JavaScript (ES6+), HTML5, CSS3
    * *Styling:* (Please specify: e.g., CSS Modules, Tailwind CSS, Styled Components, plain CSS)
* **Back End:** Express.js, Node.js
* **Database:** PostgreSQL (hosted on DigitalOcean)
* **Deployment & Hosting:**
    * Server-side applications: DigitalOcean Droplets
    * Static Assets / Client-side Build: DigitalOcean Buckets
    * Database Hosting: DigitalOcean Buckets (for managed PostgreSQL)
* **Version Control:** Git & GitHub

## Current and Planned Projects/Features

This repository is structured to house several distinct but potentially interconnected projects:

1.  **Project 1: Core Website & Authentication**
    * **Status:** (e.g., In Progress, Completed, Planned)
    * **Description:** The foundational website structure, including a home page and user login/authentication system.
    * **Key Components:**
        * Site Header (`Project 1a`)
        * 404 Not Found Page (`Project 1b`)

2.  **Project 2: Picture Carousel**
    * **Status:** (e.g., In Progress, Completed, Planned)
    * **Description:** A dynamic picture carousel to be implemented, likely on the home page or other relevant sections.

3.  **Project 3: Current Weather Dashboard Widget**
    * **Status:** (e.g., In Progress, Completed, Planned)
    * **Description:** A widget to display the current weather information, likely integrated into a user dashboard.

4.  **Project 4: Unit Converter Widget**
    * **Status:** (e.g., In Progress - Currency Converter implemented)
    * **Description:** A widget for various unit conversions.
    * **Sub-components:**
        * Currency Converter (`currency-converter`): Allows conversion between different monetary currencies. (See `currency-converter/README.md` for more details).

5.  **Project 5: Blog Site - Moving to USA Guide**
    * **Status:** (e.g., In Progress, Completed, Planned)
    * **Description:** An informational blog focusing on an expatriate's journey and guide to moving to the USA.

6.  **Project 6: Motorcycle Trip Planner with Blog**
    * **Status:** (e.g., In Progress, Completed, Planned)
    * **Description:** A tool for planning motorcycle routes, possibly integrated with a blog to share trips and experiences.

7.  **Project 7: Travel Planner App**
    * **Status:** (e.g., In Progress, Completed, Planned)
    * **Description:** A broader travel planning application.

*(More projects may be added as development progresses.)*

## Repository Structure

The repository is organized to separate concerns for different projects or modules. You will typically find individual projects within their own directories (e.g., `/currency-converter`, `/blog-site`). Each major project/widget should ideally have its own `README.md` file detailing its specific setup and functionalities.

*(You can elaborate here if you have a more specific top-level directory structure, e.g., `/client`, `/server`, `/widgets`)*

## Getting Started

These instructions will help you get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (LTS version recommended - specify version if critical, e.g., v18.x or higher)
* npm (Node Package Manager) or yarn
* Git
* Access to a PostgreSQL instance (if running backend services locally that require it).
* Environment Variables: Some projects might require a `.env` file for API keys or database credentials. Refer to individual project READMEs for specifics. **Never commit `.env` files with sensitive credentials.** Use a `.env.example` as a template.

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/mark97543/wade-usa.com.git](https://github.com/mark97543/wade-usa.com.git)
    cd wade-usa.com
    ```

2.  **Navigate to a specific project directory:**
    Many front-end projects (especially those built with Vite/React) will have their own `package.json` and need dependencies installed within their specific folder.
    ```bash
    cd path/to/specific-project # e.g., cd currency-converter
    ```

3.  **Install dependencies for the specific project:**
    ```bash
    npm install
    # or
    yarn install
    ```

4.  **Run the development server for the specific project:**
    (Usually for front-end React/Vite projects)
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    This will typically start the application on a local port (e.g., `http://localhost:5173` for Vite). Check the terminal output for the exact URL.

5.  **Backend Setup (if applicable):**
    If you are setting up an Express.js backend service:
    ```bash
    cd path/to/server-project
    npm install
    # Create a .env file with necessary configurations (DB connection, API keys)
    # based on a .env.example if provided.
    npm start # or node server.js, depending on your package.json scripts
    ```

**Note:** As the project contains multiple independent or semi-independent modules, you might need to run different parts separately (e.g., a React front-end and an Express.js backend).

## Learning Focus & Code Comments

A significant aspect of this project is the learning process. The codebase is, and will continue to be, heavily commented. These comments aim to:
* Explain the "why" behind code structures and decisions.
* Clarify the functionality of different code blocks.
* Aid in understanding React concepts, JavaScript features, and Express.js patterns.

Feel free to dive into the code and use these comments as a self-guided learning resource!

## Documentation

We are actively working on improving documentation:
* This main `README.md` provides a project overview.
* Individual project/widget directories (e.g., `currency-converter/`) should contain their own detailed `README.md` files.
* Component-level READMEs (e.g., for `currency_converter.jsx`) are also being created to explain specific parts of the UI and logic.

## To-Do List & Progress Tracking

A detailed to-do list is maintained to track the progress of various features and bug fixes.
*(As the AI, I can't directly update this list in your repo. You should maintain this section or link to an issue tracker if you use one.)*

**Current High-Level To-Dos:**
* Project 1a: Finalize Header component.
* Project 2: Begin development of Picture Carousel.
* Project 3: Research APIs for Current Weather widget.
* Specify styling solution (e.g., Tailwind CSS, CSS Modules) and apply consistently.
* Set up backend for Project 1 (Authentication).
* *(Add more items as you define them)*

## Contributing

This is primarily a personal learning project. While direct contributions are not actively solicited at this moment, feedback, suggestions, and discussions about the code or project direction are always welcome! Please feel free to open an issue if you have ideas or questions.

---

This README provides a comprehensive overview. Remember to:

1.  **Update the "Status"** for each project as you work on them.
2.  **Specify your styling solution** in the "Technologies Used" section.
3.  **Elaborate on the "Repository Structure"** if you adopt a more specific layout.
4.  **Maintain the "To-Do List & Progress Tracking"** section regularly. This is crucial for keeping an overview of your project.
5.  **Link to sub-project READMEs** as you create them for easier navigation.

