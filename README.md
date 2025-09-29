# User Stories:
- As a user, I want to sign up so that I can create my personal account
- As a user, I want to log in so that I can securely access my portfolio and notes
- As a user, I want to be redirected to the main dashboard after login so that I can see my portfolio at a glance
- As a user, I want to see the main dashboard with total portfolio value and recent activity so that I have an overview of my investments
- As a user, I want to log out so that my account remains secure
- As a user, I want to see all my stocks in a list on the portfolio page so that I can review my investments quickly
- As a user, I want to add a new stock with symbol, shares, and purchase price so that my portfolio stays updated
- As a user, I want to edit a stock to update shares or purchase price so that my portfolio reflects reality
- As a user, I want to delete a stock if I have sold it so that my portfolio contains only current holdings
- As a user, I want to click on a stock to see its details including live price and profit/loss so that I can analyze performance
- As a user, I want to see all notes linked to a stock so that I can review my research or analysis
- As a user, I want to add a new note with a title and content so that I can document observations or strategies
- As a user, I want to edit a note if I need to update my analysis or correct mistakes
- As a user, I want to delete a note if it’s outdated or irrelevant so that my notes stay organized
- As a user, I want to click on a note to view its full content so that I can read my observations completely

# RESTFUL Routes:
| HTTP Method | Path/Endpoint             | CRUD Operation |
|-------------|---------------------------|----------------|
| GET         | /stocks                   | READ           |
| POST        | /stocks                   | CREATE         |
| GET         | /stocks/:id               | READ           |
| PUT         | /stocks/:id               | UPDATE         |
| DELETE      | /stocks/:id               | DELETE         |

# ERD:
User Schema
| Field        | Type     | Options |
|--------------|----------|---------|
| username     | string   | true    |
| password     | string   | true    |
| stocks       | ObjectId |         |
| user         | ObjectId |         |

Stock Schema
| Field        | Type     | Options |
|--------------|----------|---------|
| shares       | Number   | Min: 0  |
| price        | Number   | Min: 0  |
| purchaseDate | Date     |         |
| user         | ObjectId |         |

# Stock Market App Wireframes:
```mermaid
graph TD
    A["📊 Stock Portfolio Dashboard<br/>GET /stocks<br/><br/>User sees:<br/>• List of all stocks<br/>• Stock symbols & prices<br/>• Total portfolio value<br/>• Add New Stock button<br/>• Search/filter options"] 
    
    B["📈 Stock Details Page<br/>GET /stocks/:id<br/><br/>User sees:<br/>• Full stock information<br/>• Purchase date & history<br/>• Current value & P/L<br/>• Edit/Delete buttons"]
    
    E["➕ Add New Stock Form<br/>POST /stocks<br/><br/>Form fields:<br/>• Shares (number, min: 0)<br/>• Price (number, min: 0)<br/>• Purchase Date<br/>• Save/Cancel buttons"]
    
    F["✏️ Edit Stock Form<br/>PUT /stocks/:id<br/><br/>Pre-filled form:<br/>• Current shares value<br/>• Current price value<br/>• Current purchase date<br/>• Update/Delete/Cancel buttons"]
    
    I["🗑️ Delete Confirmation<br/>DELETE /stocks/:id<br/><br/>User sees:<br/>• Confirmation message<br/>• Stock details summary<br/>• Confirm/Cancel buttons<br/>• Warning about data loss"]

    %% Main navigation flow
    A -->|"Click stock"| B
    
    %% Create actions
    A -->|"Add New Stock"| E
    E -->|"Save successful"| A
    E -->|"Cancel"| A
    
    %% Edit/Delete stock actions
    B -->|"Edit Stock"| F
    F -->|"Update successful"| B
    F -->|"Cancel"| B
    B -->|"Delete Stock"| I
    I -->|"Confirm delete"| A
    I -->|"Cancel"| B
    F -->|"Delete from edit"| I
    
    %% Back navigation
    B -->|"Back to portfolio"| A

    %% Styling
    classDef primaryPage fill:#e8f5e8,stroke:#27ae60,stroke-width:3px
    classDef formPage fill:#fff3cd,stroke:#ffc107,stroke-width:2px
    classDef deletePage fill:#f8d7da,stroke:#dc3545,stroke-width:2px
    
    class A,B primaryPage
    class E,F formPage
    class I deletePage
