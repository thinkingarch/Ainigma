document.addEventListener('DOMContentLoaded', () => {
    // --- Constants & State ---
    const MAX_ROUTES = 5;
    const MAX_LAIRS = 2;
    const XP_LEVELS = [100, 300, 700, 1500]; // XP needed for next level
    const TITLES = ["Novice Explorer", "Adept Scout", "Guild Artisan", "Master Cartographer", "AI Oracle"];

    const predefinedRoutes = [
        "Client Reporting Rituals",
        "Market Analysis Scrying",
        "Team Coordination Spells",
        "Resource Allocation Alchemy",
        "Process Optimization Incantations"
    ];

    const skills = {
        "summarization": {
            id: "summarization",
            name: "Scroll of Swift Summarization",
            description: "Condenses lengthy texts into brief summaries.",
            xpGain: 50, // XP for learning
            renownGain: 75 // XP for first successful application
        },
        "foresight": {
            id: "foresight",
            name: "Lens of Foresight",
            description: "Analyzes topics to predict potential futures and trends.",
            xpGain: 80,
            renownGain: 100
        }
    };

    let adventurerData = {
        name: "Adventurer", // Can be customized later
        class: "",
        realm: "",
        xp: 0,
        title: TITLES[0],
        routes: [], // {id: string, text: string, isLair: boolean}
        learnedSkills: [], // array of skill IDs
        insights: [], // {id: string, skillId: string, input: string, output: string, timestamp: date}
        invited: 0,
        linkedIn: false
    };

    // --- DOM Elements ---
    const sections = document.querySelectorAll('.main-section');
    const modals = document.querySelectorAll('.modal');

    // Onboarding Elements
    const onboardingContainer = document.getElementById('onboarding-container');
    const beginQuestBtn = document.getElementById('begin-quest-btn');
    const linkLinkedinBtn = document.getElementById('link-linkedin-btn');
    const skipLinkedinBtn = document.getElementById('skip-linkedin-btn');
    const storyForm = document.getElementById('story-form');
    const advClassInput = document.getElementById('adv-class');
    const advRealmInput = document.getElementById('adv-realm');
    const availableRoutesContainer = document.getElementById('available-routes');
    const chartedRoutesDropzone = document.getElementById('charted-routes-dropzone');
    const newRouteInput = document.getElementById('new-route-input');
    const addRouteBtn = document.getElementById('add-route-btn');
    const mapWorldBtn = document.getElementById('map-world-btn');
    const routeError = document.getElementById('route-error');
    const suggestedAllies = document.getElementById('suggested-allies');
    const inviteEmailInput = document.getElementById('invite-email');
    const inviteBtn = document.getElementById('invite-btn');
    const inviteFeedback = document.getElementById('invite-feedback');
    const invitedList = document.getElementById('invited-list');
    const finishOnboardingBtn = document.getElementById('finish-onboarding-btn');

    // Guild Hall Elements
    const guildHallContainer = document.getElementById('guild-hall-container');
    const advNameDisplay = document.getElementById('adv-name');
    const advTitleDisplay = document.getElementById('adv-title');
    const advXpDisplay = document.getElementById('adv-xp');
    const xpNextLevelDisplay = document.getElementById('xp-next-level');
    const xpBar = document.getElementById('xp-bar');
    const worldMapDisplay = document.getElementById('world-map-display');
    const questLogDisplay = document.getElementById('quest-log-display');
    const goToLibraryBtn = document.getElementById('go-to-library-btn');
    const viewInsightsBtn = document.getElementById('view-insights-btn');
    const insightRunesDisplay = document.getElementById('insight-runes-display');
    const insightList = document.getElementById('insight-list');
    const hideInsightsBtn = document.getElementById('hide-insights-btn');


    // Library Elements
    const libraryContainer = document.getElementById('library-container');
    const scrollsAvailableContainer = document.getElementById('scrolls-available');
    const backToGuildBtnLibrary = document.getElementById('back-to-guild-btn-library');

    // Tutelage Elements
    const tutelageContainer = document.getElementById('tutelage-container');
    const closeTutelageBtn = document.getElementById('close-tutelage-btn');
    const tutelageTitle = document.getElementById('tutelage-title');
    const tutelageSkillName = document.getElementById('tutelage-skill-name');
    const tutelageChallengeBtn = document.getElementById('tutelage-challenge-btn');
    const tutelageFeedback = document.getElementById('tutelage-feedback');
    const completeTutelageBtn = document.getElementById('complete-tutelage-btn');

    // Proving Ground Elements
    const provingGroundContainer = document.getElementById('proving-ground-container');
    const closeProvingGroundBtn = document.getElementById('close-proving-ground-btn');
    const provingGroundTitle = document.getElementById('proving-ground-title');
    const provingGroundSkillName = document.getElementById('proving-ground-skill-name');
    const applySummarizationUI = document.getElementById('apply-summarization-ui');
    const summarizationInput = document.getElementById('summarization-input');
    const applySummarizationBtn = document.getElementById('apply-summarization-btn');
    const applyForesightUI = document.getElementById('apply-foresight-ui');
    const foresightInput = document.getElementById('foresight-input');
    const applyForesightBtn = document.getElementById('apply-foresight-btn');
    const provingGroundResults = document.getElementById('proving-ground-results');
    const resultsOutput = document.getElementById('results-output');
    const resultsReasoning = document.getElementById('results-reasoning');
    const reasoningText = document.getElementById('reasoning-text');
    const resultsChoices = document.getElementById('results-choices');
    const saveInsightBtn = document.getElementById('save-insight-btn');
    const insightFeedback = document.getElementById('insight-feedback');

    // --- State Variables ---
    let currentSkillApplying = null; // Holds the skill ID being applied
    let currentTutelageSkill = null; // Holds the skill ID being tutored
    let draggedElement = null; // For drag and drop


    // --- Core Functions ---

    function showSection(sectionId) {
        sections.forEach(section => section.classList.add('hidden'));
        modals.forEach(modal => modal.classList.add('hidden')); // Hide modals too

        const elementToShow = document.getElementById(sectionId);
        if (elementToShow) {
            elementToShow.classList.remove('hidden');
            // If it's a modal, ensure its container flex properties work
             if (elementToShow.classList.contains('modal')) {
                 elementToShow.style.display = 'flex';
             } else {
                  elementToShow.style.display = 'block'; // Or 'grid' etc. based on original display type
             }
        } else {
            console.error("Section not found:", sectionId);
        }
    }

     function showModal(modalId) {
        modals.forEach(modal => modal.classList.add('hidden')); // Hide other modals
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
             modal.style.display = 'flex'; // Use flex for centering defined in CSS
        }
     }

     function hideModal(modalId) {
          const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
     }

    function saveData() {
        try {
            localStorage.setItem('adventurerData', JSON.stringify(adventurerData));
            console.log("Data Saved:", adventurerData);
        } catch (e) {
            console.error("Error saving data to localStorage:", e);
            // Optionally inform the user that progress might not be saved
        }
    }

    function loadData() {
        const savedData = localStorage.getItem('adventurerData');
        if (savedData) {
            try {
                adventurerData = JSON.parse(savedData);
                 // Basic validation after parsing
                 if (typeof adventurerData !== 'object' || adventurerData === null) {
                    throw new Error("Parsed data is not an object.");
                 }
                 // Ensure essential arrays/properties exist to prevent errors later
                 adventurerData.routes = adventurerData.routes || [];
                 adventurerData.learnedSkills = adventurerData.learnedSkills || [];
                 adventurerData.insights = adventurerData.insights || [];
                 adventurerData.xp = adventurerData.xp || 0;
                 adventurerData.title = adventurerData.title || TITLES[0];
                 // Add other checks as needed
                console.log("Data Loaded:", adventurerData);
                return true;
            } catch (e) {
                 console.error("Error parsing data from localStorage:", e);
                 // Could reset to default state here if parsing fails
                 // resetToDefaultState(); // Implement this function if needed
                 localStorage.removeItem('adventurerData'); // Remove corrupted data
                 return false;
            }
        }
        return false;
    }

     function getLevelInfo(xp) {
        let level = 0;
        let xpForNext = XP_LEVELS[0];
        let xpForCurrentLevel = 0; // Base XP for the current level

        for (let i = 0; i < XP_LEVELS.length; i++) {
            if (xp >= XP_LEVELS[i]) {
                level = i + 1;
                 // This threshold is what was needed TO REACH level i+1
                 // So the base for this level is the previous threshold
                xpForCurrentLevel = (i > 0) ? XP_LEVELS[i-1] : 0;
            } else {
                 // This is the threshold for the next level
                 xpForNext = XP_LEVELS[i];
                 break; // Stop when we find the level threshold the player hasn't reached
            }
        }
         // If max level reached (or exceeded last threshold)
        if (level >= XP_LEVELS.length) {
             level = XP_LEVELS.length; // Corresponds to TITLES[XP_LEVELS.length] index
             xpForCurrentLevel = XP_LEVELS[XP_LEVELS.length - 1]; // XP required for the last level
             xpForNext = xp; // Or display "Max Level" - no absolute next target
        }

        const xpProgressInLevel = xp - xpForCurrentLevel;
        const xpNeededForLevel = xpForNext - xpForCurrentLevel;


        return {
            level: level,
            title: TITLES[level] || TITLES[TITLES.length - 1], // Get title, fallback to last if calculation is off
            xpProgress: xpProgressInLevel, // XP earned *within* the current level
            xpToNext: xpNeededForLevel, // Total XP needed for *this* level range
            xpAbsoluteNext : xpForNext // Absolute XP threshold for next level
        };
    }


    function addXP(amount, reason) {
        if (amount <= 0) return;

        adventurerData.xp += amount;
        console.log(`Gained ${amount} XP for ${reason}. Total XP: ${adventurerData.xp}`);

        const oldTitle = adventurerData.title;
        const levelInfo = getLevelInfo(adventurerData.xp);
        adventurerData.title = levelInfo.title;

        updateDashboardUI(); // Update XP bar and potentially title display

        if (oldTitle !== adventurerData.title) {
            console.log(`Level Up! New Title: ${adventurerData.title}`);
            // Optional: Add a visual notification for level up
             showQuestLogMessage(`Congratulations! You have achieved the rank of ${adventurerData.title}!`, 'success');
        }

        saveData();
    }

    function updateDashboardUI() {
        if (!guildHallContainer || !advNameDisplay || !advTitleDisplay || !advXpDisplay || !xpNextLevelDisplay || !xpBar || !worldMapDisplay) {
            console.error("One or more dashboard elements are missing!");
            return; // Prevent errors if dashboard isn't fully loaded/visible yet
        }
        advNameDisplay.textContent = `Adventurer: ${adventurerData.name || 'Adventurer'}`; // Add name customization later
        advTitleDisplay.textContent = `Title: ${adventurerData.title || TITLES[0]}`;

        const levelInfo = getLevelInfo(adventurerData.xp);

        advXpDisplay.textContent = adventurerData.xp; // Show total XP
        if (levelInfo.level < TITLES.length - 1) {
            xpNextLevelDisplay.textContent = levelInfo.xpAbsoluteNext;
            xpBar.max = levelInfo.xpToNext > 0 ? levelInfo.xpToNext : 1; // Avoid max=0
            xpBar.value = levelInfo.xpProgress;
        } else {
            xpNextLevelDisplay.textContent = "Max"; // Max level reached
            xpBar.max = 1;
            xpBar.value = 1;
        }

        // Update World Map Display
        worldMapDisplay.innerHTML = '<h4>Charted Routes & Lairs</h4>'; // Clear previous
        if (!adventurerData.routes || adventurerData.routes.length === 0) {
            worldMapDisplay.innerHTML += '<p>No routes charted yet.</p>';
        } else {
            adventurerData.routes.forEach(route => {
                const routeEl = document.createElement('div');
                routeEl.classList.add('map-route');
                let icon = '🗺️'; // Map icon
                if (route.isLair) {
                    routeEl.classList.add('lair');
                    icon = '🐉'; // Dragon icon
                }
                // Sanitize text content slightly before inserting
                const routeTextSpan = document.createElement('span');
                routeTextSpan.textContent = route.text;
                routeEl.innerHTML = `${icon} `;
                routeEl.appendChild(routeTextSpan);
                worldMapDisplay.appendChild(routeEl);
            });
        }

         // Update Insight Runes display button
         viewInsightsBtn.textContent = `View Insight Runes (${adventurerData.insights?.length || 0})`;
         viewInsightsBtn.disabled = !adventurerData.insights || adventurerData.insights.length === 0;

         // Update Quest Log (just clear it for now, add dynamic quests later)
          questLogDisplay.innerHTML = '<p>Seek guidance from the Oracle or visit the Library.</p>';

    }

     function showQuestLogMessage(message, type = 'info') {
        if (!questLogDisplay) return;
         // Clear previous messages or limit the number shown
         // For simplicity, just prepend the new message
         const messageEl = document.createElement('p');
          messageEl.textContent = message; // Use textContent for security
         messageEl.style.fontWeight = (type === 'success') ? 'bold' : 'normal';
         messageEl.style.color = (type === 'success') ? 'green' : 'inherit';
         // Ensure the default message isn't prepended over indefinitely
         if(questLogDisplay.children.length > 5) { // Limit log size
             questLogDisplay.removeChild(questLogDisplay.lastElementChild);
         }
         if(questLogDisplay.firstElementChild && questLogDisplay.firstElementChild.textContent === 'Seek guidance from the Oracle or visit the Library.') {
             questLogDisplay.innerHTML = ''; // Clear default message before adding real ones
         }
         questLogDisplay.prepend(messageEl); // Add new message at the top
     }


    // --- Onboarding Logic ---

    function handleBeginQuest() {
        showSection('onboarding-step-2');
    }

    function handleLinkedInLink() {
        console.log("Simulating LinkedIn Link...");
        adventurerData.linkedIn = true;
        // Simulate data fetch
        advClassInput.value = "Simulated Role";
        advRealmInput.value = "Simulated Industry";
        if(suggestedAllies) suggestedAllies.classList.remove('hidden');
        showSection('onboarding-step-3');
        addXP(10, "Linking Lineage"); // Small XP bonus
    }

     function handleSkipLinkedIn() {
         adventurerData.linkedIn = false;
         advClassInput.value = ""; // Ensure fields are clear
         advRealmInput.value = "";
         if(suggestedAllies) suggestedAllies.classList.add('hidden');
         showSection('onboarding-step-3');
     }

     function handleSubmitStory(event) {
        event.preventDefault();
        adventurerData.class = advClassInput.value.trim();
        adventurerData.realm = advRealmInput.value.trim();
        if (adventurerData.class && adventurerData.realm) {
            console.log("Class/Realm Set:", adventurerData.class, "/", adventurerData.realm);
            setupRouteDragging();
            showSection('onboarding-step-4');
        } else {
            // Basic validation feedback
            alert("Please enter both your Class (Role) and Realm (Industry).");
        }
     }

     // --- Drag and Drop Logic ---
     function setupRouteDragging() {
         // Populate available routes
         availableRoutesContainer.innerHTML = ''; // Clear existing
         predefinedRoutes.forEach((routeText, index) => {
             const routeEl = document.createElement('div');
             routeEl.classList.add('draggable-route');
             routeEl.textContent = routeText;
             routeEl.draggable = true;
             routeEl.id = `predef-route-${index}`;
             routeEl.addEventListener('dragstart', handleDragStart);
             availableRoutesContainer.appendChild(routeEl);
         });

         // Setup dropzone listeners
         chartedRoutesDropzone.addEventListener('dragover', handleDragOver);
         chartedRoutesDropzone.addEventListener('dragleave', handleDragLeave);
         chartedRoutesDropzone.addEventListener('drop', handleDrop);

         // Setup listeners for adding custom routes
         addRouteBtn.addEventListener('click', handleAddCustomRoute);
         newRouteInput.addEventListener('keypress', (e) => {
             if (e.key === 'Enter') {
                 handleAddCustomRoute();
                 e.preventDefault(); // Prevent form submission if inside a form
             }
         });

         updateChartedRoutesUI(); // Initial display if loading data
         validateRoutesAndLairs(); // Check button state
     }

     function handleDragStart(e) {
        if(!e.target.classList.contains('draggable-route')) return; // Ensure we are dragging the right thing
         draggedElement = e.target;
         // Use text content as data as ID might not be perfectly reliable if elements are recreated
         e.dataTransfer.setData('text/plain', e.target.textContent);
         e.dataTransfer.effectAllowed = 'move';
         setTimeout(() => {
             // Optional: style the dragged element while dragging
             // draggedElement.classList.add('dragging');
         }, 0);
     }

     function handleDragOver(e) {
         e.preventDefault(); // Necessary to allow dropping
         e.dataTransfer.dropEffect = 'move';
         chartedRoutesDropzone.classList.add('drop-active');
     }

     function handleDragLeave(e) {
         chartedRoutesDropzone.classList.remove('drop-active');
     }

     function handleDrop(e) {
         e.preventDefault();
         chartedRoutesDropzone.classList.remove('drop-active');
         const routeText = e.dataTransfer.getData('text/plain').trim();

         if (routeText && adventurerData.routes.length < MAX_ROUTES) {
             // Avoid adding duplicates
             if (!adventurerData.routes.some(r => r.text === routeText)) {
                 const newRoute = {
                     id: `route-${Date.now()}-${Math.random().toString(16).slice(2)}`, // Unique ID
                     text: routeText,
                     isLair: false
                 };
                 adventurerData.routes.push(newRoute);
                 updateChartedRoutesUI();
                 validateRoutesAndLairs();
             } else {
                 showRouteError("This route has already been charted.");
             }
         } else if (adventurerData.routes.length >= MAX_ROUTES) {
              showRouteError(`You can only chart a maximum of ${MAX_ROUTES} routes.`);
         }
         draggedElement = null; // Reset dragged element
     }

      function handleAddCustomRoute() {
        const text = newRouteInput.value.trim();
        if (text && adventurerData.routes.length < MAX_ROUTES) {
            if (!adventurerData.routes.some(r => r.text === text)) {
                 const newRoute = {
                     id: `route-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                     text: text,
                     isLair: false
                 };
                 adventurerData.routes.push(newRoute);
                 updateChartedRoutesUI();
                 validateRoutesAndLairs();
                 newRouteInput.value = ''; // Clear input
                 hideRouteError(); // Hide previous error if successful
            } else {
                 showRouteError("This route has already been charted.");
            }
        } else if (adventurerData.routes.length >= MAX_ROUTES) {
             showRouteError(`Maximum of ${MAX_ROUTES} routes reached.`);
        }
        else if (!text) {
             showRouteError("Please enter text for the custom route.");
        }
     }

     function updateChartedRoutesUI() {
         chartedRoutesDropzone.innerHTML = '<h3>Your Charted Routes (Drag Here - Max 5)</h3>'; // Clear and add header back
         adventurerData.routes.forEach(route => {
             const routeEl = document.createElement('div');
             routeEl.classList.add('charted-route');
             routeEl.id = route.id;
             routeEl.textContent = route.text; // Use textContent for safety
             if (route.isLair) {
                 routeEl.classList.add('lair');
             }

             // Container for buttons
             const buttonsContainer = document.createElement('div');
             buttonsContainer.style.marginLeft = '10px'; // Space buttons from text

             // Add Dragon Icon for Lair Toggling
             const dragonIcon = document.createElement('span');
             dragonIcon.classList.add('dragon-icon');
             dragonIcon.textContent = '🐉';
             dragonIcon.title = "Mark/Unmark as Dragon's Lair (Pain Point)";
             dragonIcon.style.cursor = 'pointer'; // Make it obvious it's clickable
             dragonIcon.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering other events if needed
                toggleLair(route.id);
             });
             buttonsContainer.appendChild(dragonIcon);

             // Add Remove Button
             const removeBtn = document.createElement('button');
             removeBtn.textContent = '✖';
             removeBtn.title = 'Remove Route';
             removeBtn.classList.add('btn', 'btn-sm');
             removeBtn.style.marginLeft = '5px'; // Space from dragon icon
             removeBtn.style.padding = '2px 5px'; // Smaller padding
             removeBtn.style.fontSize = '0.7em';
              removeBtn.addEventListener('click', (e) => {
                 e.stopPropagation();
                 removeRoute(route.id);
             });
             buttonsContainer.appendChild(removeBtn);

             // Append buttons container to the route element
             routeEl.appendChild(buttonsContainer);

             chartedRoutesDropzone.appendChild(routeEl);
         });
         // Re-validate after UI update
          validateRoutesAndLairs();
     }

      function removeRoute(routeId) {
          adventurerData.routes = adventurerData.routes.filter(r => r.id !== routeId);
          updateChartedRoutesUI(); // This will re-validate implicitly
          saveData(); // Save changes
      }


     function toggleLair(routeId) {
         const route = adventurerData.routes.find(r => r.id === routeId);
         if (!route) return;

         const currentLairs = adventurerData.routes.filter(r => r.isLair).length;

         if (route.isLair) {
             // Unmark the lair
             route.isLair = false;
             hideRouteError(); // Clear potential error messages if unmarking allows validation
         } else {
             // Mark as lair, check limit
             if (currentLairs < MAX_LAIRS) {
                 route.isLair = true;
                 hideRouteError(); // Clear potential error messages if marking allows validation
             } else {
                 showRouteError(`You can only mark a maximum of ${MAX_LAIRS} Dragon's Lairs.`);
                 return; // Don't update UI if limit reached
             }
         }
         updateChartedRoutesUI(); // This will re-validate implicitly
         saveData(); // Save changes
     }

     function validateRoutesAndLairs() {
         const routeCount = adventurerData.routes.length;
         const lairCount = adventurerData.routes.filter(r => r.isLair).length;
         let errorMessage = "";
         let isValid = true;

         if (routeCount < 3 || routeCount > MAX_ROUTES) {
             errorMessage = `Please chart between 3 and ${MAX_ROUTES} routes (currently ${routeCount}).`;
             isValid = false;
         } else if (lairCount < 1 || lairCount > MAX_LAIRS) {
             // Only show lair error if route count is valid
             errorMessage = `Please mark between 1 and ${MAX_LAIRS} routes as Dragon's Lairs (currently ${lairCount}).`;
             isValid = false;
         }

         if (isValid) {
             mapWorldBtn.disabled = false;
             hideRouteError();
         } else {
             mapWorldBtn.disabled = true;
             showRouteError(errorMessage);
         }
         // Return validation status might be useful elsewhere
         return isValid;
     }

      function showRouteError(message) {
          routeError.textContent = message;
          routeError.classList.remove('hidden');
      }
      function hideRouteError() {
          routeError.textContent = '';
          routeError.classList.add('hidden');
      }


     function handleMapWorld() {
        // Re-validate just before proceeding
        if (validateRoutesAndLairs()) {
            console.log("World Mapped:", adventurerData.routes);
            saveData(); // Save route data
            showSection('onboarding-step-6');
        } else {
            console.warn("Map World button clicked, but validation failed.");
        }
     }

     function handleInvite() {
        const email = inviteEmailInput.value.trim();
        // More robust email regex (simple version)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && emailRegex.test(email)) {
            console.log(`Simulating invite to ${email}`);
            adventurerData.invited = (adventurerData.invited || 0) + 1;
            addXP(20, "Inviting a Fellow Adventurer"); // XP for inviting

            // Update UI
            inviteFeedback.textContent = `${email} has been summoned! (+20 Renown)`;
            const listItem = document.createElement('li');
            listItem.textContent = email; // Use textContent
            invitedList.appendChild(listItem);
            inviteEmailInput.value = ''; // Clear input

            // Clear feedback after a few seconds
            setTimeout(() => { inviteFeedback.textContent = ''; }, 3000);
        } else {
             inviteFeedback.textContent = "Please enter a valid email address.";
             setTimeout(() => { inviteFeedback.textContent = ''; }, 3000);
        }
     }

     function handleFinishOnboarding() {
         console.log("Onboarding Complete!");
         // Ensure latest data is saved before transitioning
         saveData();
         updateDashboardUI();
         showSection('guild-hall-container');
         showQuestLogMessage('Welcome to the Guild Hall, Adventurer!', 'success');
     }


    // --- Guild Hall Logic ---
    function handleGoToLibrary() {
        displayLibrary();
        showSection('library-container');
    }

     function handleViewInsights() {
         displayInsights();
         insightRunesDisplay.classList.remove('hidden');
     }

      function handleHideInsights() {
           insightRunesDisplay.classList.add('hidden');
      }

      function displayInsights() {
          insightList.innerHTML = ''; // Clear previous
          if (!adventurerData.insights || adventurerData.insights.length === 0) {
              insightList.innerHTML = '<li>No Insight Runes collected yet.</li>';
              return;
          }
          // Sort by newest first
          const sortedInsights = [...adventurerData.insights].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

          sortedInsights.forEach(insight => {
              const li = document.createElement('li');
              const skillName = skills[insight.skillId]?.name || 'Unknown Art';
              const dateString = new Date(insight.timestamp).toLocaleString();

              // Use textContent for safety, build HTML carefully
              const strong = document.createElement('strong');
              strong.textContent = `${skillName} Result:`;

              const outputP = document.createElement('p');
              outputP.textContent = insight.output.length > 150 ? insight.output.substring(0, 150) + '...' : insight.output;

              li.appendChild(strong);
              li.appendChild(outputP);


              if (insight.reasoning) {
                 const reasoningSmall = document.createElement('small');
                 reasoningSmall.style.display = 'block';
                 reasoningSmall.innerHTML = `<em>Reasoning: ${insight.reasoning.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</em>`; // Basic sanitization for italics
                 li.appendChild(reasoningSmall);
              }

              const inputSmall = document.createElement('small');
              inputSmall.style.display = 'block';
              inputSmall.textContent = `Input: ${insight.input.length > 50 ? insight.input.substring(0, 50) + '...' : insight.input}`;
              li.appendChild(inputSmall);


              const dateSmall = document.createElement('small');
              dateSmall.style.display = 'block';
               dateSmall.style.marginTop = '4px';
              dateSmall.textContent = `Collected: ${dateString}`;
              li.appendChild(dateSmall);

              insightList.appendChild(li);
          });
      }

    // --- Library & Learning Logic ---
     function displayLibrary() {
         scrollsAvailableContainer.innerHTML = ''; // Clear previous
         Object.values(skills).forEach(skill => {
             const scrollEl = document.createElement('div');
             scrollEl.classList.add('skill-scroll');
             scrollEl.dataset.skillId = skill.id;

             const isLearned = adventurerData.learnedSkills?.includes(skill.id);
             if (isLearned) {
                 scrollEl.classList.add('learned');
             }

             scrollEl.innerHTML = `
                 <h4>${skill.name}</h4>
                 <p>${skill.description}</p>
                 <button class="btn learn-btn" ${isLearned ? 'disabled' : ''}>
                     ${isLearned ? 'Mastered' : 'Study Scroll'}
                 </button>
             `;

             if (!isLearned) {
                 const learnButton = scrollEl.querySelector('.learn-btn');
                 if(learnButton) {
                    learnButton.addEventListener('click', () => startTutelage(skill.id));
                 }
             }
             scrollsAvailableContainer.appendChild(scrollEl);
         });
     }

     function startTutelage(skillId) {
         currentTutelageSkill = skillId;
         const skill = skills[skillId];
         if (!skill) {
            console.error("Invalid skill ID for tutelage:", skillId);
            return;
         }
         console.log(`Starting tutelage for ${skill.name}`);

         tutelageTitle.textContent = `Studying: ${skill.name}`;
         tutelageSkillName.textContent = skill.name;
         tutelageFeedback.textContent = '';
         completeTutelageBtn.disabled = true; // Must complete challenge

         // Reset challenge (example simple challenge)
         tutelageChallengeBtn.classList.remove('glow');
         tutelageChallengeBtn.disabled = false;
         // Simple challenge: click button when it glows (simulated delay)
         setTimeout(() => {
             // Check if the user is still in *this specific* tutelage session
             if (tutelageContainer.style.display !== 'none' && currentTutelageSkill === skillId) {
                 tutelageChallengeBtn.classList.add('glow');
                 tutelageFeedback.textContent = "Quickly, click the glowing rune!";
             }
         }, 1500 + Math.random() * 1500); // Random delay

         showModal('tutelage-container');
     }

     function handleTutelageChallenge() {
         if (tutelageChallengeBtn.classList.contains('glow')) {
             tutelageFeedback.textContent = "Well done! You grasp the basics.";
             tutelageChallengeBtn.classList.remove('glow');
             tutelageChallengeBtn.disabled = true; // Challenge complete
             completeTutelageBtn.disabled = false;
         } else {
              tutelageFeedback.textContent = "Not yet... wait for the glow!";
         }
     }

     function handleCompleteTutelage() {
         if (!currentTutelageSkill) return;

         const skill = skills[currentTutelageSkill];
         console.log(`Completed tutelage for ${skill.name}`);

         // Ensure array exists before pushing
         if (!adventurerData.learnedSkills) {
            adventurerData.learnedSkills = [];
         }
         if (!adventurerData.learnedSkills.includes(currentTutelageSkill)) {
            adventurerData.learnedSkills.push(currentTutelageSkill);
            addXP(skill.xpGain, `Learning ${skill.name}`);
            saveData(); // Save after learning
         } else {
            console.log("Skill already learned."); // Avoid adding XP again
         }


         hideModal('tutelage-container');
         displayLibrary(); // Update library view to show learned state

          // Prompt for Proving Ground
          promptProvingGround(currentTutelageSkill);

         currentTutelageSkill = null; // Reset after finishing
     }

     function handleCloseTutelage() {
          currentTutelageSkill = null; // Ensure we don't complete if closed early
          hideModal('tutelage-container');
     }

    // --- Skill Application (Proving Ground) ---

    function promptProvingGround(skillId) {
        const skill = skills[skillId];
        if (!skill) return;
        // Simple confirm dialog for now
        // Could be replaced with a more integrated UI prompt later
        if (confirm(`Apply ${skill.name} in the Proving Ground now?\n(You can also apply skills later)`)) {
             startProvingGround(skillId);
        } else {
             showQuestLogMessage(`You can apply ${skill.name} later when needed.`);
        }
    }


    function startProvingGround(skillId) {
        currentSkillApplying = skillId;
        const skill = skills[skillId];
        if (!skill) {
             console.error("Invalid skill ID for proving ground:", skillId);
             return;
        }
        console.log(`Entering Proving Ground for ${skill.name}`);

        provingGroundTitle.textContent = `Proving Ground: Apply ${skill.name}`;
        provingGroundSkillName.textContent = skill.name;

        // Hide all specific UIs and results first
        document.querySelectorAll('.skill-ui').forEach(ui => ui.classList.add('hidden'));
        provingGroundResults.classList.add('hidden');
        resultsReasoning.classList.add('hidden');
        resultsChoices.classList.add('hidden');
        saveInsightBtn.disabled = true;
        insightFeedback.textContent = '';


        // Show the relevant UI
        if (skillId === 'summarization') {
            applySummarizationUI.classList.remove('hidden');
            summarizationInput.value = ''; // Clear previous input
        } else if (skillId === 'foresight') {
            applyForesightUI.classList.remove('hidden');
            foresightInput.value = ''; // Clear previous input
        } else {
            console.error("No UI defined for skill:", skillId);
            resultsOutput.innerHTML = `<p>Application interface for ${skill.name} not yet implemented in this prototype.</p>`;
             provingGroundResults.classList.remove('hidden');
             // Don't show the modal if there's no UI
             // hideModal('proving-ground-container'); // Better to show the error message *in* the modal
             showModal('proving-ground-container'); // Show the modal with the error message
             return;
        }

        showModal('proving-ground-container');
    }


    function handleApplySummarization() {
        const inputText = summarizationInput.value.trim();
        if (!inputText) {
            alert("Please paste some text (runes) to summarize.");
            return;
        }

        console.log("Simulating summarization for:", inputText.substring(0, 50) + "...");
        applySummarizationBtn.disabled = true; // Prevent multiple clicks
        applySummarizationBtn.textContent = 'Summarizing...';

        // --- Simulation ---
        setTimeout(() => { // Simulate network delay/processing time
            const wordCount = inputText.split(/\s+/).length;
            let summary = `The ancient runes spoke of ${inputText.substring(0, 30)}... It seems to contain approximately ${wordCount} words. A concise summary highlights its essence. (Simulated Result)`;
            if (wordCount < 10) {
                summary = "The text is already quite brief. Perhaps focus its core meaning? (Simulated Result)";
            } else if (wordCount > 500) {
                summary = `A lengthy scripture indeed! The heart of the matter concerns ${inputText.substring(0, 40)}... Further distillation is required for true brevity. (Simulated Result - ${wordCount} words)`;
            }
            // --- End Simulation ---

            displayResults(summary, null, null, inputText);
            applySummarizationBtn.disabled = false; // Re-enable button
            applySummarizationBtn.textContent = 'Summarize';
        }, 1000); // 1 second delay
    }

     function handleApplyForesight() {
         const topic = foresightInput.value.trim();
         if (!topic) {
            alert("Please enter a topic to seek foresight on.");
            return;
         }
         console.log("Simulating foresight for topic:", topic);
          applyForesightBtn.disabled = true;
          applyForesightBtn.textContent = 'Seeking...';


         // --- Simulation ---
          setTimeout(() => {
             const possibleOutcomes = ["a surge in arcane energy", "a challenge from a rival guild", "an unexpected discovery", "a period of stable growth"];
             const reasoningHints = ["Planetary alignments suggest change.", "Competitor actions indicate pressure.", "Lost scrolls point to hidden knowledge.", "Current trends show steady progress."];
             const choices = [{ text: "Prepare Defenses", impact: "Reduces risk" }, { text: "Investigate Further", impact: "May yield greater reward" }, { text: "Maintain Course", impact: "Conserves resources" }];

             const outcome = possibleOutcomes[Math.floor(Math.random() * possibleOutcomes.length)];
             const reasoning = reasoningHints[Math.floor(Math.random() * reasoningHints.length)];
             const pathA = choices[Math.floor(Math.random() * choices.length)];
             let pathB = choices[Math.floor(Math.random() * choices.length)];
             while(pathB.text === pathA.text) { // Ensure different choices
                 pathB = choices[Math.floor(Math.random() * choices.length)];
             }

             const outputText = `The Lens of Foresight reveals whispers concerning "${topic}". Future paths may involve ${outcome}.`;
             const choiceData = {
                 A: { text: pathA.text, impact: pathA.impact },
                 B: { text: pathB.text, impact: pathB.impact }
             };
         // --- End Simulation ---

            displayResults(outputText, reasoning, choiceData, topic);
            applyForesightBtn.disabled = false;
            applyForesightBtn.textContent = 'Seek Foresight';
         }, 1500); // 1.5 second delay
     }


     function displayResults(output, reasoning, choices, inputUsed) {
          // Ensure output area exists
          if (!resultsOutput) { console.error("Results output area not found"); return; }

          // Use textContent for safety
          const outputP = document.createElement('p');
          outputP.textContent = output;
          resultsOutput.innerHTML = ''; // Clear previous content
          resultsOutput.appendChild(outputP);

          provingGroundResults.classList.remove('hidden');
          saveInsightBtn.disabled = false; // Enable saving
          saveInsightBtn.dataset.input = inputUsed; // Store input for saving
          saveInsightBtn.dataset.output = output; // Store output for saving
          saveInsightBtn.dataset.reasoning = reasoning || ""; // Store reasoning


         if (reasoning) {
              if (!reasoningText) { console.error("Reasoning text element not found"); }
              else {
                reasoningText.textContent = reasoning; // Use textContent
                resultsReasoning.classList.remove('hidden');
              }
         } else {
              resultsReasoning.classList.add('hidden');
         }

         if (choices) {
              if (!resultsChoices) { console.error("Results choices element not found"); }
              else {
                 resultsChoices.innerHTML = '<h5>Choose the Path Forward:</h5>'; // Clear previous buttons
                 const buttonA = document.createElement('button');
                 buttonA.classList.add('btn', 'btn-choice');
                 buttonA.dataset.choice = 'A';
                 buttonA.textContent = `${choices.A.text} (${choices.A.impact})`;
                 buttonA.addEventListener('click', handleChoiceSelection);

                 const buttonB = document.createElement('button');
                 buttonB.classList.add('btn', 'btn-choice');
                 buttonB.dataset.choice = 'B';
                 buttonB.textContent = `${choices.B.text} (${choices.B.impact})`;
                  buttonB.addEventListener('click', handleChoiceSelection);

                 resultsChoices.appendChild(buttonA);
                 resultsChoices.appendChild(buttonB);
                 resultsChoices.classList.remove('hidden');
              }
         } else {
             resultsChoices.classList.add('hidden');
         }
     }

     function handleChoiceSelection(event) {
         const choice = event.target.dataset.choice;
         console.log(`Adventurer chose Path ${choice}: ${event.target.textContent}`);
         // In a real app, this choice would influence game state
         showQuestLogMessage(`You chose Path ${choice} based on the Lens of Foresight.`);
         // Maybe disable choice buttons after selection
         resultsChoices.querySelectorAll('.btn-choice').forEach(btn => btn.disabled = true);
         // Maybe grant small XP for making a choice
         addXP(5, "Making a strategic choice");
     }


     function handleSaveInsight() {
         if (!currentSkillApplying) return;

         const skill = skills[currentSkillApplying];
          if (!skill) { console.error("Cannot save insight, skill data missing for", currentSkillApplying); return;}

         const input = saveInsightBtn.dataset.input || '';
         const output = saveInsightBtn.dataset.output || '';
         const reasoning = saveInsightBtn.dataset.reasoning || '';
         const timestamp = new Date().toISOString();
         const insightId = `insight-${timestamp}-${Math.random().toString(16).slice(2)}`;

         const newInsight = {
             id: insightId,
             skillId: currentSkillApplying,
             input: input,
             output: output,
             reasoning: reasoning,
             timestamp: timestamp
         };

          // Ensure insights array exists
         if (!adventurerData.insights) {
             adventurerData.insights = [];
         }

         adventurerData.insights.push(newInsight);
         console.log("Insight Rune Saved:", newInsight);
         insightFeedback.textContent = "Insight Rune captured! (+ Renown)";
         saveInsightBtn.disabled = true; // Prevent double saving

         // Grant Renown XP for first successful application of a skill
         // Check if any previous insight exists for this skill
         const previousInsightsForSkill = adventurerData.insights.filter(i => i.skillId === currentSkillApplying).length;
         if (previousInsightsForSkill <= 1) { // Only grant XP the first time (now included)
            addXP(skill.renownGain, `First application of ${skill.name}`);
             insightFeedback.textContent = `Insight Rune captured! +${skill.renownGain} Renown!`;
         } else {
             addXP(10, `Applying ${skill.name}`); // Smaller XP for repeat use
             insightFeedback.textContent = `Insight Rune captured! +10 Renown.`;
         }


         saveData();
         updateDashboardUI(); // Update insight count button

         setTimeout(() => {
              insightFeedback.textContent = "";
              // Optionally close modal after saving? Or leave it open for review?
              // hideModal('proving-ground-container');
              // currentSkillApplying = null;
         }, 3000);
     }

      function handleCloseProvingGround() {
          currentSkillApplying = null; // Reset skill being applied
          hideModal('proving-ground-container');
      }


    // --- Event Listeners ---
    // Ensure elements exist before adding listeners
    if(beginQuestBtn) beginQuestBtn.addEventListener('click', handleBeginQuest);
    if(linkLinkedinBtn) linkLinkedinBtn.addEventListener('click', handleLinkedInLink);
    if(skipLinkedinBtn) skipLinkedinBtn.addEventListener('click', handleSkipLinkedIn);
    if(storyForm) storyForm.addEventListener('submit', handleSubmitStory);
    // Note: mapWorldBtn listener added in setupRouteDragging after button is potentially enabled/disabled
    if(inviteBtn) inviteBtn.addEventListener('click', handleInvite);
    if(finishOnboardingBtn) finishOnboardingBtn.addEventListener('click', handleFinishOnboarding);

    if(goToLibraryBtn) goToLibraryBtn.addEventListener('click', handleGoToLibrary);
    if(backToGuildBtnLibrary) backToGuildBtnLibrary.addEventListener('click', () => showSection('guild-hall-container'));
    if(viewInsightsBtn) viewInsightsBtn.addEventListener('click', handleViewInsights);
    if(hideInsightsBtn) hideInsightsBtn.addEventListener('click', handleHideInsights);


    if(closeTutelageBtn) closeTutelageBtn.addEventListener('click', handleCloseTutelage);
    if(tutelageChallengeBtn) tutelageChallengeBtn.addEventListener('click', handleTutelageChallenge);
    if(completeTutelageBtn) completeTutelageBtn.addEventListener('click', handleCompleteTutelage);

    if(closeProvingGroundBtn) closeProvingGroundBtn.addEventListener('click', handleCloseProvingGround);
    if(applySummarizationBtn) applySummarizationBtn.addEventListener('click', handleApplySummarization);
    if(applyForesightBtn) applyForesightBtn.addEventListener('click', handleApplyForesight);
    if(saveInsightBtn) saveInsightBtn.addEventListener('click', handleSaveInsight);
    if(mapWorldBtn) mapWorldBtn.addEventListener('click', handleMapWorld); // Also add listener here


    // --- Initialization ---
    function initApp() {
        console.log("Initializing Adventurer's Chronicle...");
        if (loadData()) {
            console.log("Existing adventurer found. Welcome back!");
            updateDashboardUI();
            showSection('guild-hall-container');
        } else {
            console.log("New adventurer detected. Starting onboarding.");
            // Make sure default state is applied if load fails or no data
             adventurerData = {
                 name: "Adventurer", class: "", realm: "", xp: 0, title: TITLES[0],
                 routes: [], learnedSkills: [], insights: [], invited: 0, linkedIn: false
             };
            showSection('onboarding-step-1');
        }
    }

    initApp(); // Start the application

}); // End DOMContentLoaded
