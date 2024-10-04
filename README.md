# myTube

myTube is a web-based application similar to YouTube, allowing users to upload, view, and interact with videos. Users can explore publicly available videos and search for content based on video titles and descriptions. Registered users have additional functionalities such as uploading videos, managing their own content, and leaving comments on videos.

## Features

### Video Upload and Viewing
- **Video Uploads**: Registered and logged-in users can upload videos to the platform.
- **Public Video Viewing**: All users, whether logged in or not, can view uploaded videos.
- **Commenting**: Only registered and logged-in users can comment on videos, enabling richer interaction.

### User Account Management
- **Registration & Login**: Users must register and log in to access specific features, such as video uploads and commenting.
- **Profile Management**: After logging in, users can navigate to their profile page to view all their uploaded videos. They are also able to delete videos directly from their profile.

### Video Search
- **Keyword Search**: Users can search for videos using keywords. The search results are based on matches found in the titles and descriptions of the videos stored in the database.
- **Dynamic Home Page**: The home page displays videos most relevant to the user’s search keywords.

### Dropdown Menu
- **Logged-In User Navigation**: A dropdown menu in the user interface allows logged-in users to:
  - **Log Out**: Securely log out of their session.
  - **Profile Access**: Manage their posted videos.

## System Architecture and Technologies

- **Server Host**: Localhost
- **Operating System**: Windows / iOS
- **Database**: MySQL 8.0
- **Server-Side Language**: Node.js
- **Web Framework**: Express.js
- **IDE**: Visual Studio Code

## Build and Run Instructions

Follow these steps to set up and run the myTube application on your local machine:

1. **Create a `.env` File**:
   - Navigate to the `/myTube` directory.
   - Create a `.env` file with the following content, replacing `"YourSql-password"` with your actual SQL password:
     ```
     DB_HOST="localhost"
     DB_NAME="myTubeDB"
     DB_USER="root"
     DB_PASSWORD="YourSql-password"
     PORT=3000
     ```

2. **Install Dependencies**:
   - Open your terminal and navigate to the `/myTube/application` directory.
   - Run the command:
     ```
     npm install
     ```
   - This will install all the necessary project dependencies.

3. **Build the Database**:
   - In the same terminal session, execute:
     ```
     npm run builddb
     ```
   - This will build the database. If successful, you will see confirmation messages indicating that the database and tables have been created.

4. **Run the Application**:
   - Launch the project by running:
     ```
     npm start
     ```
   - The server will start, and you can access the application.

5. **Explore myTube**:
   - Open your web browser and go to [http://localhost:3000](http://localhost:3000) to start exploring and using myTube!
