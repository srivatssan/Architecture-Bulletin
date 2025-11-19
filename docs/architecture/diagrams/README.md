# Architecture Diagrams

This directory contains all architecture diagrams for the Architecture-Bulletin project.

## Available Diagrams

### 1. Sequence Diagrams (PlantUML)
- **sequence-auth.puml** - GitHub OAuth authentication flow
- **sequence-create-post.puml** - Create post with attachments flow

### 2. C4 Diagrams (PlantUML)
- **c4-context.puml** - System context showing external dependencies

## Generating Diagrams

### Prerequisites

**For PlantUML diagrams:**

**Option 1: Command Line (requires Java)**
```bash
# macOS
brew install plantuml

# Ubuntu/Debian
sudo apt-get install plantuml

# Generate all diagrams as PNG
plantuml docs/architecture/diagrams/*.puml

# Generate as SVG (scalable)
plantuml -tsvg docs/architecture/diagrams/*.puml
```

**Option 2: VS Code Extension**
1. Install "PlantUML" extension by jebbs
2. Open any `.puml` file
3. Press `Alt+D` (or `Cmd+D` on Mac) to preview
4. Right-click in preview → Export to save as PNG/SVG

**Option 3: Online Editor**
- Visit: http://www.plantuml.com/plantuml/uml/
- Copy/paste PlantUML code
- View and download generated diagram

## Viewing Diagrams

### PlantUML Files (.puml)
- **VS Code**: Use PlantUML extension for live preview
- **Command Line**: Generate PNG/SVG and view in any image viewer
- **Online**: Use PlantUML web editor

## Updating Diagrams

When the architecture changes:

1. **Edit the .puml source file**
2. **Regenerate the diagram:**
   ```bash
   plantuml diagram-name.puml
   ```
3. **Commit both source and generated files**

## Diagram Conventions

- **Actors**: Users interacting with the system (Admin, Architect)
- **Participants**: System components (App, Service, API, Database)
- **Arrows**: Communication between components
- **Notes**: Additional context and explanations
- **Alt blocks**: Conditional logic (if/else)
- **Loop blocks**: Repeated operations

## Quick Reference

### PlantUML Sequence Diagram Syntax

```plantuml
actor User
participant App
participant API

User -> App: Action
App -> API: Request
API --> App: Response
App --> User: Result

alt Success case
    App -> API: Do something
else Error case
    App -> User: Show error
end

loop For each item
    App -> API: Process item
end
```

### C4 Diagram Syntax

```plantuml
Person(user, "User", "Description")
System(app, "App Name", "Description")
System_Ext(external, "External System", "Description")

Rel(user, app, "Uses", "HTTPS")
Rel(app, external, "Calls", "REST API")
```

## Troubleshooting

**Issue**: PlantUML command not found
- **Solution**: Install PlantUML via package manager or download from https://plantuml.com/

**Issue**: "java.lang.NoClassDefFoundError"
- **Solution**: Ensure Java is installed: `java --version`

**Issue**: Diagram not rendering in VS Code
- **Solution**: Install PlantUML extension and restart VS Code

**Issue**: Online editor shows syntax error
- **Solution**: Check PlantUML syntax, ensure proper includes for C4 diagrams

## Additional Resources

- [PlantUML Documentation](https://plantuml.com/)
- [PlantUML Sequence Diagram Guide](https://plantuml.com/sequence-diagram)
- [C4 Model with PlantUML](https://github.com/plantuml-stdlib/C4-PlantUML)
- [PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/)

---

**Note**: All diagrams should be kept up-to-date with implementation. When making architectural changes, update the corresponding diagrams and regenerate outputs.
