# Email to Matt - V&V API Update

**Subject: V&V API Integration Update - IPL Working Great!**

Hi Matt,

Good news! I've been testing the V&V API integration and discovered that the IPL (Illustrated Parts List) API is working perfectly with the credentials you provided.

**What's Working:**
- The IPL API endpoints (`/iplvandv/get-diagrams` and `/iplvandv/get-diagram-parts`) are fully functional
- We're getting exploded view diagrams with image URLs
- Parts data includes pricing, availability, and some part images
- This gives us everything we need for the repair documentation features

**Quick Issue:**
The main parts API endpoints (`/vandvapi/GetPartsInfo` and `/vandvapi/CreatePartOrder`) are returning authentication errors (401 - "Invalid Token or Username/Password") with the same credentials. Not sure if these need separate activation or if there's a different setup required.

Since the IPL API provides all the parts data we need along with the visual diagrams, we might not need the other endpoints unless we want to create orders directly through the API.

Would it be possible to check if the parts ordering endpoints need to be activated separately? For now, the IPL API is giving us great functionality for the repair guide features.

Thanks for setting this up!

Best,
[Your name] 