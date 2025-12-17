# Game Inventory API

A backend-only inventory management system built with Strapi v5 and PostgreSQL. Designed to model real-world inventory logic such as stock tracking, platform availability validation, and transactional inventory operations.

**Tech Stack:**

- Strapi v5 (Headless CMS)
- PostgreSQL
- TypeScript
- Custom Strapi services, controllers & lifecycle hooks

## 🔹 Data Model Overview

**Relationships explained:**

- **Game ↔ Console** (many-to-many): Games can be available on multiple consoles, consoles can have multiple games
- **InventoryItem → Game** (many-to-one): Each inventory item represents a specific game
- **InventoryItem → Console** (many-to-one): Each inventory item is for a specific console
- **Game ↔ Genre** (many-to-many): Games can have multiple genres, genres apply to multiple games

**Key Entities:**

- `Game`: Title, release date, supported consoles, genres, image
- `Console`: Name, manufacturer, release year, supported games, image
- `InventoryItem`: Game-console pair with quantity, price, SKU, availability status
- `Genre`: Predefined enumeration (Action, RPG, Strategy, etc.)

_This relational design ensures data integrity and reflects real gaming industry constraints._

---

## 📋 API Endpoints

### Core CRUD Operations

#### Games API

**Public Endpoints:**

##### `GET /api/games`

Returns all games with populated console and genre data.

- **Auth Required:** ❌
- **Response Example:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "The Legend of Zelda: Breath of the Wild",
      "releaseDate": "2017-03-03",
      "image": { "url": "/uploads/zelda_botw.jpg" },
      "consoles": [
        { "id": 1, "name": "Nintendo Switch" },
        { "id": 2, "name": "Wii U" }
      ],
      "genres": [
        { "id": 1, "name": "Action-adventure" },
        { "id": 2, "name": "Open world" }
      ]
    }
  ]
}
```

##### `GET /api/games/:id`

Returns a specific game by ID with full relationship data.

- **Auth Required:** ❌

**Protected Endpoints:**

##### `POST /api/games`

Creates a new game.

- **Auth Required:** ✅
- **Request Body:**

```json
{
  "data": {
    "title": "Elden Ring",
    "releaseDate": "2022-02-25",
    "consoles": { "connect": [{ "id": 3 }, { "id": 4 }, { "id": 5 }] },
    "genres": { "connect": [{ "id": 1 }, { "id": 6 }] }
  }
}
```

- **Response Example:**

```json
{
  "data": {
    "id": 2,
    "title": "Elden Ring",
    "releaseDate": "2022-02-25",
    "publishedAt": "2024-12-17T10:30:00.000Z"
  }
}
```

##### `PUT /api/games/:id`

Updates an existing game.

- **Auth Required:** ✅
- **Request Body:** Same structure as POST

##### `DELETE /api/games/:id`

Removes a game from the system.

- **Auth Required:** ✅

---

#### Consoles API

**Public Endpoints:**

##### `GET /api/consoles`

Returns all consoles.

- **Auth Required:** ❌
- **Response Example:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "PlayStation 5",
      "manufacturer": "Sony",
      "releaseYear": 2020,
      "image": { "url": "/uploads/ps5.jpg" }
    }
  ]
}
```

##### `GET /api/consoles/:id`

Returns a specific console by ID.

- **Auth Required:** ❌

**Protected Endpoints:**

##### `POST /api/consoles`

Creates a new console.

- **Auth Required:** ✅
- **Request Body:**

```json
{
  "data": {
    "name": "Xbox Series X",
    "manufacturer": "Microsoft",
    "releaseYear": 2020,
    "games": { "connect": [{ "id": 1 }, { "id": 2 }] }
  }
}
```

- **Response Example:**

```json
{
  "data": {
    "id": 3,
    "name": "Xbox Series X",
    "manufacturer": "Microsoft",
    "releaseYear": 2020,
    "publishedAt": "2024-12-17T10:30:00.000Z"
  }
}
```

##### `PUT /api/consoles/:id`

Updates an existing console.

- **Auth Required:** ✅
- **Request Body:** Same structure as POST

##### `DELETE /api/consoles/:id`

Removes a console from the system.

- **Auth Required:** ✅

---

#### Genres API

**Public Endpoints:**

##### `GET /api/genres`

Returns all available genres.

- **Auth Required:** ❌
- **Response Example:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Action",
      "games": [
        { "id": 1, "title": "Call of Duty: Modern Warfare" },
        { "id": 2, "title": "Grand Theft Auto V" }
      ]
    }
  ]
}
```

##### `GET /api/genres/:id`

Returns a specific genre by ID.

- **Auth Required:** ❌

**Protected Endpoints:**

##### `POST /api/genres`

Creates a new genre.

- **Auth Required:** ✅
- **Request Body:**

```json
{
  "data": {
    "name": "Survival",
    "games": { "connect": [{ "id": 5 }] }
  }
}
```

- **Response Example:**

```json
{
  "data": {
    "id": 4,
    "name": "Survival",
    "publishedAt": "2024-12-17T10:30:00.000Z"
  }
}
```

##### `PUT /api/genres/:id`

Updates an existing genre.

- **Auth Required:** ✅
- **Request Body:** Same structure as POST

##### `DELETE /api/genres/:id`

Removes a genre from the system.

- **Auth Required:** ✅

---

#### Inventory Items API

**Public Endpoints:**

##### `GET /api/inventory-items`

Returns all inventory items with populated game and console data.

- **Auth Required:** ❌
- **Response Example:**

```json
{
  "data": [
    {
      "id": 1,
      "quantity": 25,
      "price": 59.99,
      "sku": "ZELDA-NSW-001",
      "available": true,
      "game": {
        "id": 1,
        "title": "The Legend of Zelda: Breath of the Wild"
      },
      "console": {
        "id": 1,
        "name": "Nintendo Switch"
      }
    }
  ]
}
```

##### `GET /api/inventory-items/:id`

Returns a specific inventory item by ID.

- **Auth Required:** ❌

**Protected Endpoints:**

##### `POST /api/inventory-items`

Creates a new inventory item.

- **Auth Required:** ✅
- **Validation:** Ensures game is available on selected console via lifecycle hooks
- **Request Body:**

```json
{
  "data": {
    "game": { "connect": [{ "id": 1 }] },
    "console": { "connect": [{ "id": 2 }] },
    "quantity": 50,
    "price": 59.99,
    "sku": "GAME-001-PS5",
    "available": true
  }
}
```

- **Response Example:**

```json
{
  "data": {
    "id": 2,
    "quantity": 50,
    "price": 59.99,
    "sku": "GAME-001-PS5",
    "available": true,
    "publishedAt": "2024-12-17T10:30:00.000Z"
  }
}
```

##### `PUT /api/inventory-items/:id`

Updates an existing inventory item.

- **Auth Required:** ✅
- **Validation:** Game-console compatibility checked on update
- **Request Body:** Same structure as POST

##### `DELETE /api/inventory-items/:id`

Removes an inventory item from the system.

- **Auth Required:** ✅

### Custom Inventory Operations

#### `POST /api/inventory-items/sell`

Processes a single inventory sale transaction.

- **Auth Required:** ✅
- **Body:**
  ```json
  {
    "inventoryItemId": 1,
    "amount": 3
  }
  ```
- **Business Logic:**
  - Validates sufficient stock exists
  - Updates quantity atomically
  - Sets `available: false` when quantity reaches 0
- **Errors:** Returns 400 if insufficient stock

#### `POST /api/inventory-items/bulk-sell`

Processes multiple inventory sales atomically.

- **Auth Required:** ✅
- **Body:**
  ```json
  {
    "items": [
      { "inventoryItemId": 1, "amount": 2 },
      { "inventoryItemId": 3, "amount": 1 }
    ]
  }
  ```
- **Business Logic:** All sales processed sequentially; if any fail, previous changes remain (not transactional)

#### `POST /api/inventory-items/restock`

Adds inventory to an existing item.

- **Auth Required:** ✅
- **Body:**
  ```json
  {
    "inventoryItemId": 1,
    "amount": 25
  }
  ```
- **Business Logic:**
  - Increases quantity by specified amount
  - Automatically sets `available: true`

---

## 🏗️ Business Logic & Validation

### Platform Compatibility Validation

**Implementation:** Custom lifecycle hooks in `lifecycles.ts`

```typescript
// Validates that inventory items can only be created for
// games that are actually available on the selected console
async function validateGameConsoleRelation(event) {
  // Fetches game's supported consoles
  // Validates selected console is in the supported list
  // Throws ValidationError if incompatible
}
```

### Inventory Rules

- **Stock Validation:** Cannot sell more items than available quantity
- **Availability Logic:** `available` field automatically managed based on quantity
- **Price Constraints:** Minimum price validation (≥ 0) enforced at database level
- **SKU Uniqueness:** Unique constraint prevents duplicate inventory items

### Error Handling

- **Insufficient Stock:** `400 Bad Request` - "Not enough stock for {game} on {console}"
- **Invalid Game-Console Pair:** `400 Validation Error` - "{game} is not available on {console}"
- **Not Found:** Standard Strapi 404 handling for missing resources

---

## 🔒 Authentication & Authorization

**Strategy:** Role-based permissions via Strapi Users & Permissions plugin

**Public Role:**

- `GET` operations on all content types (read-only access)
- Allows browsing inventory without authentication

**Authenticated Role:**

- Full CRUD access to all content types
- Access to custom inventory operations (sell, restock, bulk-sell)
- Required for any inventory-modifying operations

**Implementation:** Routes configured with `auth: false` for public endpoints, `auth: {}` (default) for protected endpoints.

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables (copy .env.example to .env)
# Configure DATABASE_URL for PostgreSQL

# Run database migrations
npm run develop

# Access admin panel at http://localhost:1337/admin
# API available at http://localhost:1337/api
```

**Key Features for Production:**

- TypeScript for type safety
- Database-level constraints for data integrity
- Custom validation logic for business rules
- RESTful API design with proper HTTP status codes
- Scalable PostgreSQL backend
