<h1 align="center"><strong>🚇 MRT WEB</strong></h1>

A web-based fare and travel tracking system designed to simulate an MRT card platform. Users can tap in/out at stations, and the system calculates distances and fares between stations.
> 💻 Built as part of my internship training projects.
<img width="1880" height="1012" alt="image" src="https://github.com/user-attachments/assets/14c8749f-5dbe-4baa-87f4-a821c6aff191" />

## 🔧 Features

- 👥 Card registration and management
- 🎫 Tap in / Tap out at train stations
- 🚉 Fare calculation based on distance
- 📊 Admin dashboard to view cards
- 📍 Station and line management
- 🔐 Secure authentication with Mongodb

## 🚀 How to run
**1. Install frontend dependencies**<br>
From the root of this project:

     npm install

**2. Set up and run the backend**<br>
Clone and start the backend server from this repository:<br>
👉 [MoriiSan/BE-mrt-system](https://github.com/MoriiSan/BE-mrt-system)

**3. Start the frontend development server**

    npm run start

**4. Login with test credentials**

Username: `sample`<br>
Password: `sample`<br>

<p align="center">
<img width="652" height="647" alt="image" src="https://github.com/user-attachments/assets/522e7660-7c90-425d-a53a-4a0a641548ce" />
</p>

**5. Explore the App Features**<br>
After logging in, you’ll be redirected to the Cards page:
- ➕ **Add / Delete Cards:** Manage MRT cards by creating or removing them.
- 💰 **Top-Up:** Increase card balances as needed.

<img width="1878" height="1014" alt="image" src="https://github.com/user-attachments/assets/a7b4c897-8fd6-4a9d-a0fc-4aadfe635227" />

Navigate to the Stations tab to manage station-related data:
- 🛠️ **Maintenance Mode:** Toggle this to enable editing capabilities.
- ➕ **Add / Edit Stations:** Update station names and data.
- 💵 **Set Fare Values:** Modify fare costs based on station distances.
> 📝 **Note:** Admin features are only accessible after login.
 
<img width="1878" height="985" alt="image" src="https://github.com/user-attachments/assets/0cfd3732-71c3-4353-9507-519d8bb9e6ab" />

**6. Try the Commuter View**<br>
🌐 Navigate to http://localhost:3000/mrt to access the Commuter Interface.
- 🚉 Tap In: Click on a station to begin your journey.
- 🛬 Tap Out: Click another station to end your trip.
- 🎟️ A ticket will be displayed showing the calculated fare based on distance traveled.
> 🔁 You can repeat this to simulate multiple trips.

<img width="1879" height="1012" alt="image" src="https://github.com/user-attachments/assets/3bd722ac-ef00-4558-969a-7763ff6bfba6" />


