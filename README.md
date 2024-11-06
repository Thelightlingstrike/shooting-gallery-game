# shooting-gallery-game
Shooting Game Gallery: A customizable HTML-based shooting gallery game for Twitch streams. Allows viewers to trigger in-game actions through channel points. Features uploadable images for targets, shooter, and ammo, plus adjustable speeds and sizes. Integrates with Twitch via Streamer.bot for interactive, viewer-driven gameplay.
Features:
Customizable Targets and Shooter: Upload your own images for the targets, shooter, and ammo.
Adjustable Settings: Control speed, size, and other properties to personalize the gameplay experience.
Channel Points Integration: Set up interactions with Twitch channel points to let viewers participate in shooting actions.
Interactive Controls: Toggle the game controls for quick adjustments during gameplay.
Installation
Clone or Download the Repository:
Clone the repository using Git:
bash
Copy code
git clone https://github.com/Thelightlingstrike/shooting-gallery-game.git
Or download the repository as a ZIP file from GitHub and extract it to your desired location.
Open the Game in Your Browser:

Open the index.html file in any web browser to start the game locally.
Upload Custom Images (Optional):

Use the control panel in the game to upload custom images for the targets, shooter, and ammo.
Integration with Twitch (Using Streamer.bot)
To allow viewers to trigger shooting actions through channel point redemptions:

Set up Streamer.bot:

In Streamer.bot, configure a new action that runs whenever a specific channel point reward is redeemed.
Link this action to a WebSocket or local HTTP request that sends a command to the game.
Modify the HTML Game to Listen for Commands:

If using WebSockets, add a listener in the HTML game to detect incoming commands and trigger the shoot() function.
If using local HTTP requests, set up a listener using a lightweight server, like http-server, to process commands.
Test the Integration:

Trigger the channel point redemption on Twitch and verify that the game responds with a shooting action.
