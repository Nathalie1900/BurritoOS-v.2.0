//////// CONSTANTS ////////

const AppState = {
    GREEN: "Green",
    YELLOW: "Yellow",
    ORANGE: "Orange",
    RED: "Red",
    UNDEFINED: "Undefined"
};

const CheckInStep = {
    ACTIVATION: "activation",
    THINKING: "thinking",
    SAFETY: "safety",
    COMPLETE: "complete"
};

const checkInQuestions = [
    {
        id: CheckInStep.ACTIVATION,
        field: "activation",
        next: CheckInStep.THINKING,
        question: "How activated does your nervous system feel?",
        answers: [
            {
                label: "😌 Calm",
                text: "Calm",
                score: 0
            },
            {
                label: "😐 A little tense",
                text: "A little tense",
                score: 1
            },
            {
                label: "😟 Very anxious",
                text: "Very anxious",
                score: 2
            },
            {
                label: "🚨 Overwhelmed",
                text: "Overwhelmed",
                score: 3
            }
        ]
    },
    {
        id: CheckInStep.THINKING,
        field: "thinking",
        next: CheckInStep.SAFETY,
        question: "How easy is it to think clearly right now?",
        answers: [
            {
                label: "😊 Easy",
                text: "Easy",
                score: 0
            },
            {
                label: "😐 Somewhat difficult",
                text: "Somewhat difficult",
                score: 1
            },
            {
                label: "😣 Very difficult",
                text: "Very difficult",
                score: 2
            }
        ]
    },
    {
        id: CheckInStep.SAFETY,
        field: "safety",
        next: CheckInStep.COMPLETE,
        question: "Do you feel emotionally safe right now?",
        answers: [
            {
                label: "😊 Yes",
                text: "Yes",
                score: 0
            },
            {
                label: "🤔 Not sure",
                text: "Not sure",
                score: 1
            },
            {
                label: "😟 No",
                text: "No",
                score: 2
            }
        ]
    }
];


const CrisisCategory = {
    COMFORT: "Comfort",
    BODY: "Body",
    SAFETY: "Safety",
    REALITY: "Reality"
};

const crisisCategories = [
    CrisisCategory.COMFORT,
    CrisisCategory.BODY,
    CrisisCategory.SAFETY,
    CrisisCategory.REALITY
];


const OrangeCategory = {
    BODY: "Regulate Your Body",
    COGNITION: "Reduce Cognitive Load",
    STIMULATION: "Reduce Stimulation",
    CONNECTION: "Connect"
};

const orangeCategories = [
    OrangeCategory.BODY,
    OrangeCategory.COGNITION,
    OrangeCategory.STIMULATION,
    OrangeCategory.CONNECTION
];


const YellowCategory = {
    GROUNDING: "Grounding Exercises"
};

const yellowCategories = [
    YellowCategory.GROUNDING
];


//////// APP DATA ////////

const app = {
    version: "0.1.0",

    state: AppState.UNDEFINED,

    currentQuestion: CheckInStep.ACTIVATION,

    checkIn: {
        activation: null,
        thinking: null,
        safety: null
    },

    crisisTools: [
        {
            id: "tea",
            label: "Drink some warm tea",
            category: CrisisCategory.BODY,
            done: false
        },
        {
            id: "blanket",
            label: "Wrap yourself in the pink blanket",
            category: CrisisCategory.COMFORT,
            done: false
        },
        {
            id: "cats",
            label: "Find the cats",
            category: CrisisCategory.COMFORT,
            done: false
        },
        {
            id: "SOS",
            label: "Take SOS medication (if prescribed)",
            category: CrisisCategory.SAFETY,
            done: false
        },
        {
            id: "identity",
            label: "Read Identity Cards",
            category: CrisisCategory.REALITY,
            done: false
        }
    ],

    identityCards: [
        {
            id: "who",
            title: "Who I Am",
            text: "I am Burrito. I am safe enough to pause and take one small step."
        },
        {
            id: "characteristics",
            title: "My Characteristics",
            text: "I am competent. I am resilient. I can get through this moment."
        },
        {
            id: "reality",
            title: "Reality Check",
            text: "Feelings are real, but they are not instructions."
        }
    ],

    identityOpen: null,

    orangeTools: [
        {
            id: "water",
            label: "💧 Drink a glass of water",
            category: OrangeCategory.BODY,
            done: false
        },
        {
            id: "stretch",
            label: "🧘 Stretch for 1 minute",
            category: OrangeCategory.BODY,
            done: false
        },
        {
            id: "food",
            label: "🍎 Eat something nutritious and comforting",
            category: OrangeCategory.BODY,
            done: false
        },
        {
            id: "drink",
            label: "🍵 Drink something warm",
            category: OrangeCategory.BODY,
            done: false
        },
        {
            id: "break",
            label: "⏸️ Take a 5-minute break",
            category: OrangeCategory.COGNITION,
            done: false
        },
        {
            id: "write",
            label: "✍️ Write about how you are feeling",
            category: OrangeCategory.COGNITION,
            done: false
        },
        {
            id: "task",
            label: "🌱 Do just one little task at a time",
            category: OrangeCategory.STIMULATION,
            done: false
        },
        {
            id: "lights",
            label: "💡 Lower the lights",
            category: OrangeCategory.STIMULATION,
            done: false
        },
        {
            id: "cats",
            label: "🐈 Pet the cats",
            category: OrangeCategory.CONNECTION,
            done: false
        },
        {
            id: "people",
            label: "🫂 Sit near another person without talking",
            category: OrangeCategory.CONNECTION,
            done: false
        }
    ],

    yellowTools: [
        {
            id: "breathing",
            label: "🌿 Guided breathing",
            category: YellowCategory.GROUNDING,
            done: false
        },
        {
            id: "breaths",
            label: "🌸 Take 5 deep breaths",
            category: YellowCategory.GROUNDING,
            done: false
        },
        {
            id: "look",
            label: "👀 Look around and name 5 things you can see",
            category: YellowCategory.GROUNDING,
            done: false
        },
        {
            id: "stretch",
            label: "🤸 Stretch for 5 minutes",
            category: YellowCategory.GROUNDING,
            done: false
        }
    ],

    breathing: {
        seconds: 60,
        running: false,
        elapsed: 0,
        interval: null
    }
};


//////// HTML ELEMENT ////////

const appElement = document.getElementById("statemachine");


//////// RENDER FUNCTIONS ////////

function getStateEmoji() {
    if (app.state === AppState.GREEN) {
        return "🟢";
    }

    if (app.state === AppState.YELLOW) {
        return "🟡";
    }

    if (app.state === AppState.ORANGE) {
        return "🟠";
    }

    if (app.state === AppState.RED) {
        return "🔴";
    }

    return "🔵";
}


function renderCheckInSummary() {
    return `
        <hr>

        <h2>Latest Check-in</h2>

        <p><strong>Activation:</strong> ${app.checkIn.activation?.text ?? "-"}</p>
        <p><strong>Thinking:</strong> ${app.checkIn.thinking?.text ?? "-"}</p>
        <p><strong>Safety:</strong> ${app.checkIn.safety?.text ?? "-"}</p>
    `;
}


function renderCheckInQuestions() {
    const question = checkInQuestions.find(
        q => q.id === app.currentQuestion
    );

    if (!question) {
        return "";
    }

    let buttonsHTML = "";

    for (const answer of question.answers) {
        buttonsHTML += `
            <button onclick="answerQuestion('${answer.text}', ${answer.score})">
                ${answer.label}
            </button>

            <br><br>
        `;
    }

    return `
        <hr>

        <h3>${question.question}</h3>

        ${buttonsHTML}
    `;
}


function renderHeader() {
    const emoji = getStateEmoji();
    const totalScore = calculateCheckInScore();

    return `
        <h2>Current State</h2>

        <h1>${emoji} ${app.state}</h1>

        <p>Welcome, Burrito.</p>

        <p>
            Total Score:
            ${totalScore ?? "-"}
        </p>
    `;
}


function renderMain() {
    let html = "";

    if (app.currentQuestion === CheckInStep.COMPLETE) {
        html += renderCheckInSummary();
    }

    if (app.state === AppState.RED) {
        html += renderCrisisMode();
    }

    if (app.state === AppState.ORANGE) {
        html += renderOrangeMode();
    }

    if (app.state === AppState.YELLOW) {
        html += renderYellowMode();
    }

    if (
        app.state === AppState.GREEN &&
        app.currentQuestion === CheckInStep.COMPLETE
    ) {
        html += renderGreenMode();
    }

    else if (app.currentQuestion !== CheckInStep.COMPLETE) {
        html += renderCheckInQuestions();
    }

    return html;
}


function renderCrisisMode() {
    let html = `
        <hr>

        <h2>Crisis Mode</h2>

        <p>
            You don't have to solve everything right now.
        </p>
    `;

    for (const category of crisisCategories) {
        html += `
            <h3>${category}</h3>
        `;

        const tools = app.crisisTools.filter(
            tool => tool.category === category
        );

        for (const tool of tools) {
            let doneClass = "";

            if (tool.done) {
                doneClass = "done";
            }

            html += `
                <button
                    class="crisis-button ${doneClass}"
                    onclick="toggleTool(app.crisisTools, '${tool.id}')">

                    ${tool.done ? "☑" : "☐"}
                    ${tool.label}

                </button>

                <br><br>
            `;
        }
    }

    html += `
        <button
            class="big-button"
            onclick="restartCheckIn()">

            I'm ready to check in again

        </button>
    `;

    html += renderIdentityCards();

    return html;
}


function renderIdentityCards() {
    if (app.identityOpen) {
        const card = app.identityCards.find(
            c => c.id === app.identityOpen
        );

        return `
            <hr>

            <h2>${card.title}</h2>

            <p>${card.text}</p>

            <button onclick="closeIdentityCard()">
                Back
            </button>
        `;
    }

    let html = `
        <hr>

        <h3>Identity Cards</h3>
    `;

    for (const card of app.identityCards) {
        html += `
            <button
                class="identity-card"
                onclick="openIdentityCard('${card.id}')">

                ${card.title}

            </button>

            <br><br>
        `;
    }

    return html;
}


function renderOrangeMode() {
    let html = `
        <hr>

        <h2>Regulation Mode</h2>

        <p>
            Let's slow down. You are going to be ok 🩷
        </p>
    `;

    for (const category of orangeCategories) {
        html += `
            <h3>${category}</h3>
        `;

        const tools = app.orangeTools.filter(
            tool => tool.category === category
        );

        for (const tool of tools) {
            let doneClass = "";

            if (tool.done) {
                doneClass = "done";
            }

            html += `
                <button
                    class="orange-button ${doneClass}"
                    onclick="toggleTool(app.orangeTools, '${tool.id}')">

                    ${tool.done ? "☑" : "☐"}
                    ${tool.label}

                </button>

                <br><br>
            `;
        }
    }

    html += `
        <button
            class="big-button"
            onclick="restartCheckIn()">

            I'm ready to check in again

        </button>
    `;

    return html;
}


function renderYellowMode() {
    let html = `
        <hr>

        <h2>Prevention Mode</h2>

        <p>
            Your nervous system is asking for a little attention 💛
        </p>

        <p>
            Let's slow things down 🌼
        </p>
    `;

    for (const category of yellowCategories) {
        html += `
            <h3>${category}</h3>
        `;

        const tools = app.yellowTools.filter(
            tool => tool.category === category
        );

        for (const tool of tools) {
            let doneClass = "";

            if (tool.done) {
                doneClass = "done";
            }

            html += `
                <button
                    class="yellow-button ${doneClass}"
                    onclick="toggleTool(app.yellowTools, '${tool.id}')">

                    ${tool.done ? "☑" : "☐"}
                    ${tool.label}

                </button>

                <br><br>
            `;
        }
    }

    html += renderBreathingTimer();

    html += `
        <hr>

        <button
            class="big-button"
            onclick="restartCheckIn()">

            I'm ready to check in again

        </button>
    `;

    return html;
}


function renderBreathingTimer() {
    if (!app.breathing.running) {
        return `
            <h3>🌿 Guided Breathing</h3>

            <p>60 seconds</p>

            <button onclick="startBreathing()">
                Start
            </button>
        `;
    }

    const cycle = app.breathing.elapsed % 10;

    let phase;
    let count;

    if (cycle < 4) {
        phase = "🌬️ Inhale";
        count = 4 - cycle;
    } else {
        phase = "😮‍💨 Exhale";
        count = 10 - cycle;
    }

    return `
        <h3>🌿 Guided Breathing</h3>

        <h2>${phase}</h2>

        <h1>${count}</h1>

        <button onclick="stopBreathing()">
            Stop
        </button>
    `;
}

function renderGreenMode() {
    return `
        <hr>

        <h2>Green Mode</h2>

        <p>
            Hi, Burrito 💚 Congratulations! 🌈
        </p>

        <p>
            Your nervous system seems to be in a good place today.
            Take a moment to appreciate that and enjoy being Burrito!
        </p>

        <h3>Achievement Unlocked: Stable Burrito has appeared!</h3>

        <p>Current bonuses:</p>

        <ul>
            <li>+ Clear thinking</li>
            <li>+ Better emotional regulation</li>
            <li>+ Programming skills restored</li>
            <li>+ Increased enjoyment of coffee</li>
            <li>+ Cats become even cuter</li>
        </ul>

        <h3>Today's mission:</h3>

        <ul>
            <li>☕ Drink a nice coffee.</li>
            <li>📚 Read something interesting.</li>
            <li>💻 Build something fun.</li>
            <li>🐈 Say hi to the cats.</li>
        </ul>

        <p>
            Being alive doesn't always have to be hard.
            You deserve ordinary, peaceful days too 🩷
        </p>

        <hr>

        <button
            class="big-button"
            onclick="restartCheckIn()">

            I'm ready to check in again

        </button>
    `;
}


function render() {
    appElement.innerHTML = `
        ${renderHeader()}
        ${renderMain()}
    `;
}


//////// STATE FUNCTIONS ////////

function answerQuestion(text, score) {
    const question = checkInQuestions.find(
        q => q.id === app.currentQuestion
    );

    app.checkIn[question.field] = {
        text,
        score
    };

    app.currentQuestion = question.next;

    if (app.currentQuestion === CheckInStep.COMPLETE) {
        const totalScore = calculateCheckInScore();
        const newState = determineState(totalScore);
        app.state = newState;
        saveStateResult(totalScore);
    }

    render();
}


function calculateCheckInScore() {
    if (
        !app.checkIn.activation ||
        !app.checkIn.thinking ||
        !app.checkIn.safety
    ) {
        return null;
    }

    return (
        app.checkIn.activation.score +
        app.checkIn.thinking.score +
        app.checkIn.safety.score
    );
}


function determineState(score) {
    if (score <= 1) {
        return AppState.GREEN;
    }

    if (score <= 3) {
        return AppState.YELLOW;
    }

    if (score <= 5) {
        return AppState.ORANGE;
    }

    return AppState.RED;
}


function toggleTool(toolList, toolId) {
    const tool = toolList.find(
        tool => tool.id === toolId
    );

    tool.done = !tool.done;

    render();
}


function restartCheckIn() {
    app.currentQuestion = CheckInStep.ACTIVATION;

    app.state = AppState.GREEN;

    app.checkIn = {
        crisis: null,
        activation: null,
        thinking: null,
        safety: null
    };

    for (const tool of app.crisisTools) {
        tool.done = false;
    }

    render();
}


function openIdentityCard(id) {
    app.identityOpen = id;

    render();
}


function closeIdentityCard() {
    app.identityOpen = null;

    render();
}


function startBreathing() {
    app.breathing.running = true;
    app.breathing.elapsed = 0;

    app.breathing.interval = setInterval(function () {
        app.breathing.elapsed++;
        app.breathing.seconds--;

        if (app.breathing.seconds <= 0) {
            stopBreathing();
            app.breathing.seconds = 60;
        }

        render();
    }, 1000);
}


function stopBreathing() {
    clearInterval(app.breathing.interval);

    app.breathing.running = false;
    app.breathing.interval = null;
    app.breathing.elapsed = 0;

    render();
}

//this function was created with help of an AI
async function saveStateResult(totalScore) {
    try {
        const response = await fetch("/state", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                totalScore: totalScore,
                state: app.state
            })
        });

        if (!response.ok) {
            throw new Error("Could not save assessment.");
        }

        const result = await response.json();

        console.log("Assessment saved:", result);

    } catch (error) {
        console.error("Error saving assessment:", error);
    }
}

//////// STARTUP ////////

render();
