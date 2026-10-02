type Entry=[name:string,slug:string,url:string,description:string,color:string];
export const catalog:{name:string;slug:string;description:string;products:Entry[]}[]=[
 {name:'AI',slug:'ai',description:'Compare the most popular AI tools based on ratings and reviews from our community.',products:[
 ['ChatGPT','chatgpt','https://chatgpt.com','Your everyday companion for ideas, answers, and getting things done.','#17816a'],
 ['Claude','claude','https://claude.ai','A thoughtful AI assistant for writing, analysis, and complex work.','#c98166'],
 ['Gemini','gemini','https://gemini.google.com','Google’s AI assistant for curious minds and ambitious ideas.','#6585df'],
 ['Perplexity','perplexity','https://www.perplexity.ai','Explore questions with an AI-powered approach to search.','#42858c'],
 ['Microsoft Copilot','microsoft-copilot','https://copilot.microsoft.com','An AI companion for work, creativity, and everyday questions.','#6294bd'],
 ['Grok','grok','https://grok.com','Explore ideas and conversations with an AI assistant.','#32323b']]},
 {name:'Music',slug:'music',description:'Find the soundtrack to your life. Compare music streaming services and listening experiences.',products:[
 ['Spotify','spotify','https://www.spotify.com','Music, podcasts, and a soundtrack for every moment.','#28945e'],
 ['Apple Music','apple-music','https://music.apple.com','A music library built for discovering your next favorite song.','#e66680'],
 ['Amazon Music','amazon-music','https://music.amazon.com','Explore playlists, podcasts, and music for every mood.','#51a6bb'],
 ['YouTube Music','youtube-music','https://music.youtube.com','Discover songs, performances, and music videos in one place.','#d85858'],
 ['Tidal','tidal','https://tidal.com','Music streaming with a focus on listening and discovery.','#353440']]},
 {name:'Video Streaming',slug:'video-streaming',description:'Find your next watch. Compare the platforms behind your favorite shows, films, and creators.',products:[
 ['Netflix','netflix','https://www.netflix.com','Films, series, and stories worth staying in for.','#c74448'],
 ['Prime Video','prime-video','https://www.primevideo.com','Stream movies, originals, and shows from around the world.','#4c8fbf'],
 ['Disney+','disney-plus','https://www.disneyplus.com','Discover familiar favorites and new stories to share.','#47578d'],
 ['Hulu','hulu','https://www.hulu.com','A home for streaming television, films, and originals.','#409a6b'],
 ['YouTube','youtube','https://www.youtube.com','A world of videos, creators, and things to learn.','#d25959']]},
 {name:'Browsers',slug:'browsers',description:'Your window to the web. Compare speed, usability, privacy, and everyday browsing experiences.',products:[
 ['Chrome','chrome','https://www.google.com/chrome','A familiar browser for exploring the web and staying connected.','#558abd'],
 ['Firefox','firefox','https://www.mozilla.org/firefox','An independent browser with a focus on choice and privacy.','#ce7957'],
 ['Safari','safari','https://www.apple.com/safari','Browse the web across Apple devices.','#559cbd'],
 ['Edge','edge','https://www.microsoft.com/edge','A browser for work, research, and everyday discovery.','#439d96'],
 ['Brave','brave','https://brave.com','An alternative browsing experience built around privacy.','#d07848']]},
 {name:'Cloud Storage',slug:'cloud-storage',description:'Keep your files close, wherever you go. Find the right home for your documents, photos, and projects.',products:[
 ['Google Drive','google-drive','https://drive.google.com','Store files and collaborate across your connected workspace.','#68a375'],
 ['Dropbox','dropbox','https://www.dropbox.com','Organize, share, and access your important files.','#527acf'],
 ['OneDrive','onedrive','https://www.microsoft.com/microsoft-365/onedrive','Cloud storage that connects with your Microsoft workspace.','#508dc2'],
 ['iCloud','icloud','https://www.icloud.com','Keep photos and files connected across Apple devices.','#74a4cb'],
 ['Box','box','https://www.box.com','Cloud content management for teams and organizations.','#567fbe']]},
 {name:'Productivity',slug:'productivity',description:'Make space for your best work. Compare tools for notes, projects, and everyday organization.',products:[
 ['Notion','notion','https://www.notion.com','Your ideas, notes, and projects, together in one workspace.','#42414a'],
 ['Todoist','todoist','https://todoist.com','A focused place to organize tasks and plan your day.','#ce736d'],
 ['Trello','trello','https://trello.com','Visual boards that help teams keep projects moving.','#548ac3']]},
 {name:'Social Media',slug:'social-media',description:'Discover where communities connect, create, and share.',products:[['Instagram','instagram','https://www.instagram.com','Share moments and discover visual stories.','#b56696'],['Reddit','reddit','https://www.reddit.com','Conversations and communities for every interest.','#cf7757'],['Bluesky','bluesky','https://bsky.app','Connect through conversations on an open social network.','#6996da']]},
 {name:'Messaging',slug:'messaging',description:'Find better ways to stay in touch with the people who matter.',products:[['WhatsApp','whatsapp','https://www.whatsapp.com','Everyday messages and calls with friends and family.','#589f71'],['Signal','signal','https://signal.org','A messaging app centered on private conversations.','#6b8dcc'],['Telegram','telegram','https://telegram.org','Chat, share, and keep up with your communities.','#65a2c7']]},
 {name:'Shopping',slug:'shopping',description:'Compare the places you discover, shop, and find your next favorite thing.',products:[['Amazon','amazon','https://www.amazon.com','Explore products across everyday shopping categories.','#c9954c'],['eBay','ebay','https://www.ebay.com','Find new, pre-loved, and collectible items.','#6b90bd'],['Etsy','etsy','https://www.etsy.com','Discover handmade, vintage, and creative goods.','#bc785a']]},
 {name:'Food Delivery',slug:'food-delivery',description:'Compare services that bring local flavors to your door.',products:[['DoorDash','doordash','https://www.doordash.com','Order food from restaurants in your area.','#cc7365'],['Uber Eats','uber-eats','https://www.ubereats.com','Discover meals and delivery from nearby restaurants.','#5c976d']]},
 {name:'Ride Sharing',slug:'ride-sharing',description:'Find a better way to get from here to there.',products:[['Uber','uber','https://www.uber.com','Request rides and plan your everyday trips.','#40434c'],['Lyft','lyft','https://www.lyft.com','Connect with local rides for your next journey.','#bb70ab']]},
 {name:'Finance',slug:'finance',description:'Compare the usability and features of everyday finance tools. Reviews are not financial advice.',products:[['PayPal','paypal','https://www.paypal.com','Send payments and manage online transactions.','#5c79af'],['Wise','wise','https://wise.com','A platform for international money transfers.','#789952']]},
 {name:'Education',slug:'education',description:'Learn something new with tools the community loves.',products:[['Duolingo','duolingo','https://www.duolingo.com','Build a language-learning habit one lesson at a time.','#79a954'],['Khan Academy','khan-academy','https://www.khanacademy.org','Explore learning resources across a range of subjects.','#5d9c91'],['Coursera','coursera','https://www.coursera.org','Explore online courses and learning programs.','#5683b7']]},
 {name:'Gaming',slug:'gaming',description:'Discover platforms that make play, connection, and exploration better.',products:[['Steam','steam','https://store.steampowered.com','Discover PC games and connect with gaming communities.','#4d6689'],['Epic Games','epic-games','https://store.epicgames.com','Browse a digital store for PC games.','#50505a']]},
 {name:'Developer Tools',slug:'developer-tools',description:'Build your best work with tools reviewed by fellow makers.',products:[['GitHub','github','https://github.com','Collaborate on code and build software together.','#4b455c'],['VS Code','vs-code','https://code.visualstudio.com','A flexible editor for code, projects, and development.','#5f99c7'],['GitLab','gitlab','https://gitlab.com','Plan, build, and collaborate across the software lifecycle.','#c88762']]},
 {name:'Photo & Video',slug:'photo-video',description:'Find your creative toolkit for photos, videos, and visual stories.',products:[['Canva','canva','https://www.canva.com','Create designs, presentations, and visual content.','#6e9db2'],['Adobe Lightroom','lightroom','https://www.adobe.com/products/photoshop-lightroom.html','Organize and edit your photography.','#547992'],['DaVinci Resolve','davinci-resolve','https://www.blackmagicdesign.com/products/davinciresolve','A creative workspace for video editing and color.','#746d9f']]},
 {name:'Fitness',slug:'fitness',description:'Find tools that fit your movement, training, and everyday goals.',products:[['Strava','strava','https://www.strava.com','Track activities and connect with a movement community.','#c7855b'],['Nike Run Club','nike-run-club','https://www.nike.com/nrc-app','A companion for logging runs and building a routine.','#777a5b']]}
];
