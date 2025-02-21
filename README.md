# Helix

## Set up the database (PostgreSQL)

The database uses PostgreSQL with sqlalchemy as the ORM.
In mvp implementation, only message `threads` and outreach `sequences` are stored.

1. Create a database named `helix` in PostgreSQL.

    ```bash
    createdb helix
    ```

## Setting up the server (Flask / Python)

1. **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd Helix/server
    ```

2. **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

3. **Set environment variables:** 
    
    Create a `.env` file in the `server` directory.
    Add your OpenAI API key and Database Url.

   ```bash
   # .env file
   OPENAI_API_KEY=your_api_key_here
   DATABASE_URL=postgresql://localhost/helix
   ```

4. **Run the server:**

   ```bash
   Flask run # or Flask run --debug
   ```

   The server will start on `http://localhost:5000`.

## Setting up the Client (React / Javascript)

The frontend in built in React, bootstrapped with Vite.

1. **Navigate to the client directory:**

   ```bash
   cd ../client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
