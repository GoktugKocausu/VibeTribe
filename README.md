

Vibe Tribe is a social platform designed to simplify event planning and foster community engagement.
The application enables users to create and join events, share real-time updates, and connect with others based on shared interests and proximity. 
Developed as part of a Senior Design Project at MEF University, this project emphasizes scalability, security, and usability.

Features
User Profiles: Create, update, and manage user profiles with privacy settings.
Event Management: Create and join events, manage invitations, and track attendees.
Interactive Maps: Real-time event visualization using Google Maps API.
Real-Time Updates: Share live event updates and notifications.
Reputation System: Earn badges and reputation points for engagement.
Secure Authentication: JWT-based authentication with role-based access control.
Admin Tools: Manage users, events, and reports.

Tech Stack
Backend:
Spring Boot: For scalable and modular backend development.
PostgreSQL: As the primary relational database.
JWT (JSON Web Tokens): For secure authentication and authorization.
WebSocket: For real-time updates.
Frontend:
React: For a responsive and user-friendly interface.
Google Maps API: For interactive event mapping.
Tools:
Postman: Used for thorough API testing.
GitHub: Version control and collaboration.

Installation and Setup
Prerequisites:
Java 17 installed
Maven
PostgreSQL installed and configured
Node.js and npm for frontend development and React
Backend Setup:
Clone the repository:

bash
git clone https://github.com/yourusername/vibe-tribe.git
cd vibe-tribe/backend


Configure the application.properties file in src/main/resources with your database details.
Build and run the application:

bash
./mvnw spring-boot:run


Frontend Setup:
Navigate to the frontend folder:

bash
cd ../frontend


Install dependencies:

bash
npm install


Start the development server:

bash
npm start



Usage
Register a new user and log in to access features.
Create and join events via the event dashboard.
View nearby events on the interactive map.
Share real-time updates in event chats.

Contributing
Contributions are welcome! Please follow these steps:
Fork the repository.
Create a feature branch: git checkout -b feature-name.
Commit your changes: git commit -m "Add feature".
Push to the branch: git push origin feature-name.
Submit a pull request.

License
This project is licensed under the MIT License.

Acknowledgments
Developed as part of the Senior Design Project at MEF University.
Special thanks to Prof. Dr. İlker Bekmezci for guidance and support.
Contributions from team members: Göktuğ Kocauşu, Berkay Özcan, Ali Boray Celpiş, and Emir Yasin Yetkin.
