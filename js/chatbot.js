document.addEventListener('DOMContentLoaded', () => {
    const chatbotContainer = document.getElementById('chatbot-container');
    const fab = document.getElementById('chatbot-fab');
    const windowEl = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close-btn');
    const messagesEl = document.getElementById('chatbot-messages');
    const questionsAreaEl = document.getElementById('chatbot-questions-area');

    if (!chatbotContainer || !fab || !windowEl || !closeBtn || !messagesEl || !questionsAreaEl) {
        console.error('Chatbot DOM elements not found!');
        return;
    }

    const welcomeMessage = "Welcome to NorthernEdge Legal Solutions! I'm here to help answer some common questions. Please select a topic below:";

    const qaPairs = [
        {
            key: 'practiceAreas',
            question: "What are your main practice areas?",
            answer: "We specialize in several key areas including Civil Litigation, Business Law & Corporate Governance, Technology Law & Cybersecurity, and General Practice. You can find more details on our <a href='/practice-areas.html' target='_blank'>Practice Areas page</a>."
        },
        {
            key: 'scheduleConsultation',
            question: "How do I schedule a consultation?",
            answer: "You can schedule a consultation by visiting our <a href='/contact.html' target='_blank'>Contact Us page</a> and filling out the inquiry form, or by calling us directly at (705) 999-3657 during office hours."
        },
        {
            key: 'officeHours',
            question: "What are your office hours?",
            answer: "Our office hours are Monday to Friday, 9:00 AM to 5:00 PM."
        },
        {
            key: 'location',
            question: "Where are you located?",
            answer: "We are located at 67 Hugill St., Sault Ste. Marie, Ontario, P6A 4E6. You can find a map and more details on our <a href='/contact.html' target='_blank'>Contact Us page</a>."
        },
        {
            key: 'clientTypes',
            question: "What kind of clients do you typically work with?",
            answer: "We typically work with businesses, professionals, and municipalities, but our firm is happy to work with any client that is the right fit for our expertise."
        },
        {
            key: 'fees',
            question: "What are your fees like?",
            answer: "We offer various fee structures depending on the nature and complexity of the legal matter. For detailed information on fees, we recommend scheduling a consultation. Please visit our <a href='/contact.html' target='_blank'>Contact Us page</a> or call us."
        },
        {
            key: 'caseDuration',
            question: "How long will my case take?",
            answer: "The duration of a legal case can vary greatly depending on many factors. We can discuss potential timelines and what to expect during an initial consultation. You can <a href='/contact.html' target='_blank'>contact us</a> to schedule one."
        },
        {
            key: 'firmDifference',
            question: "What makes your firm different?",
            answer: "NorthernEdge Legal Solutions combines deep legal expertise with a personalized, client-centered approach and leverages innovative technology to provide efficient and effective representation. We have a profound understanding of Northern Ontario's unique business environment. You can learn more about our approach on our <a href='/about.html' target='_blank'>About Us page</a>."
        }
    ];

    function openChat() {
        chatbotContainer.classList.remove('chatbot-closed');
        chatbotContainer.classList.add('chatbot-open');
        windowEl.style.display = 'flex'; // Matches CSS for open state
        setTimeout(() => { // Allow display:flex to apply before transition
            windowEl.style.opacity = '1';
            windowEl.style.transform = 'translateY(0) scale(1)';
            windowEl.style.visibility = 'visible';
        }, 10); // Small delay
        fab.style.display = 'none';
        displayWelcomeAndQuestions();
        // Announce chat window is open
        announceToScreenReader("Chat window opened. " + welcomeMessage);

    }

    function closeChat() {
        windowEl.style.opacity = '0';
        windowEl.style.transform = 'translateY(20px) scale(0.95)';
        windowEl.style.visibility = 'hidden';
        setTimeout(() => { // After transition
            windowEl.style.display = 'none';
            chatbotContainer.classList.remove('chatbot-open');
            chatbotContainer.classList.add('chatbot-closed');
            fab.style.display = 'flex';
        }, 300); // Match CSS transition duration
         // Announce chat window is closed
        announceToScreenReader("Chat window closed.");
    }

    function displayMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chatbot-message', sender === 'user' ? 'user-message' : 'bot-message');

        const p = document.createElement('p');
        p.innerHTML = text; // Use innerHTML to render links
        messageDiv.appendChild(p);

        messagesEl.appendChild(messageDiv);
        messagesEl.scrollTop = messagesEl.scrollHeight; // Scroll to bottom
    }

    function announceToScreenReader(message) {
        // Create a visually hidden live region if it doesn't exist
        let liveRegion = document.getElementById('chatbot-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'chatbot-live-region';
            liveRegion.className = 'sr-only'; // Visually hidden
            liveRegion.setAttribute('aria-live', 'assertive');
            liveRegion.setAttribute('aria-atomic', 'true');
            document.body.appendChild(liveRegion);
        }
        // Update the live region with the message
        liveRegion.textContent = message;
    }


    function displayQuestionButtons() {
        questionsAreaEl.innerHTML = ''; // Clear previous buttons/options
        qaPairs.forEach(pair => {
            const button = document.createElement('button');
            button.classList.add('chatbot-question-btn');
            button.textContent = pair.question;
            button.dataset.questionKey = pair.key;
            questionsAreaEl.appendChild(button);
        });
    }

    function displayWelcomeAndQuestions() {
        messagesEl.innerHTML = ''; // Clear previous messages
        displayMessage(welcomeMessage, 'bot');
        displayQuestionButtons();
    }

    function displayFollowUpOptions() {
        questionsAreaEl.innerHTML = ''; // Clear previous

        const askAnotherBtn = document.createElement('button');
        askAnotherBtn.classList.add('chatbot-question-btn');
        askAnotherBtn.textContent = "Ask another question";
        askAnotherBtn.addEventListener('click', displayWelcomeAndQuestions); // Reuse to show main questions
        questionsAreaEl.appendChild(askAnotherBtn);

        const endChatBtn = document.createElement('button');
        endChatBtn.classList.add('chatbot-question-btn');
        endChatBtn.style.marginTop = 'var(--space-1)'; // Add some space
        endChatBtn.textContent = "End Chat";
        endChatBtn.addEventListener('click', () => {
            displayMessage("Thank you for using our assistant!", 'bot');
            // Optionally, could hide questionsAreaEl here or disable buttons
            setTimeout(closeChat, 2000); // Close chat after a delay
        });
        questionsAreaEl.appendChild(endChatBtn);
    }

    fab.addEventListener('click', openChat);
    closeBtn.addEventListener('click', closeChat);

    questionsAreaEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('chatbot-question-btn')) {
            const key = e.target.dataset.questionKey;
            if (key) {
                const pair = qaPairs.find(p => p.key === key);
                if (pair) {
                    messagesEl.innerHTML = ''; // Clear messages before showing new Q&A
                    displayMessage(pair.question, 'user');
                    // Announce user's question
                    announceToScreenReader("You asked: " + pair.question);
                    setTimeout(() => { // Simulate bot thinking
                        displayMessage(pair.answer, 'bot');
                         // Announce bot's answer
                        announceToScreenReader("Bot answered: " + pair.answer.replace(/<[^>]*>?/gm, '')); // Strip HTML for announcement
                        displayFollowUpOptions();
                    }, 500);
                }
            }
        }
    });
});
