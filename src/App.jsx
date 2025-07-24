import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  useLocation
} from "react-router-dom";
import { motion } from "framer-motion";

// ---------------------------------------------
// ISO content placeholder
// ---------------------------------------------
const materials = [
  {
    id: "iso27k",
    title: "ISO 27k Information Security",
    intro: [
      "The ISO27k standard is a set of ISO standards for managing the risks affecting or involving both business and personal information. It aims to help protect information assets from harm while enabling their legitimate use.",
      "The standard adopts the Plan‑Do‑Check‑Act(PDCA) cycle and emphasises continual improvement to align security controls with evolving risks.",
      "Attached is the ISO27k Handbook, refer to it for detailed clauses and explanations"
  ],
    pdf: "public/iso27k.pdf"
},
];

const quizzes = {
  organisational: [
    { q: "Which is not considered acceptable use?", choices: ["Leaking company information","Use licensed software", "Handle personal data per PDPA", "Keep devices up to date "], answer: 0 },
    { q: "How often are CISO-led threat intelligence meeting?", choices: ["Daily", "Bi-annually", "Annually", "Only after an incident"], answer: 1 },
    { q: "The primary purpose of a table-top exercise(TTX) is to:", choices: ["Helps understand the impact of various scenarios", "Reveal gaps in plan", "Identify vulnerabilities in system"], answer: 1 },
  ],
  people: [
    { q: "Which is not a remote working expectation?", choices: ["Maintain contact with supervisor", "Flexible working hours", "Avoid using public Wi-Fi", "Maintain performance standards"], answer: 1 },
  ],
  physical: [
    { q: "Secure media disposal should use:", choices: ["Regular recycling bins", "Directly deleting locally", "Approved third‑party company"], answer: 2 },
  ],
  technological: [
    { q: "Systems protection does not include:", choices: ["Keep systems protected with antivirus", "Utilize vulnerability scanning tools ", "Regularly update security tools", "Avoid multi-factor authentication"], answer: 3 },
  ],
};

const quizCategories = [
  { id: "organisational", label: "Organisational" },
  { id: "people", label: "People" },
  { id: "physical", label: "Physical" },
  { id: "technological", label: "Technological" },
];

/** ------------------------------------------------------------------
 *  Header / Navigation bar
 *  ----------------------------------------------------------------*/
function NavBar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // close dropdown on outside click
  useEffect(() => {
    const handler = () => setOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  const toggle = (e) => {
    e.stopPropagation();
    setOpen((o) => !o);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="navbar"
    >
      <Link to="/" className="logo">
        LOGO
      </Link>

      <nav className="nav-items">
        <Link
          to="/materials"
          className={`nav-link ${location.pathname.startsWith("/materials") ? "active" : ""}`}
        >
          Learning Materials
        </Link>

        {/* quizzes dropdown */}
        <div className="dropdown">
          <button onClick={toggle} className="dropdown-toggle">
            Quizzes ▾
          </button>
          {open && (
            <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
              {quizCategories.map((c) => (
                <Link
                  key={c.id}
                  to={`/quizzes/${c.id}`}
                  className="dropdown-item"
                  onClick={() => setOpen(false)}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </motion.header>
  );
}

/** ------------------------------------------------------------------
 *  Home landing (simple welcome)
 *  ----------------------------------------------------------------*/
function Home() {
  return (
    <main className="home">
      <h1>Welcome to the ISO Learning Hub</h1>
      <div className="intro">
         <p>
        The company abides by ISO27k, which is a set of internationally recognised standards for information security management. 
        </p>
        <p>
          The system reflects the company’s commitment to confidentiality, integrity, and availability of information, with clear targets set in line with ISO27k standards:
        </p>
        <ul>
          <li>Confidentiality — Ensure the protection of sensitive information from unauthorized access or disclosure - Zero incidents</li>
          <li>
            Integrity — Ensure accuracy and reliability of information by preventing unauthorized or accidental modification - Zero incidents
          </li>
          <li>Availability — Ensure that information and systems are accessible to authorized users when needed - 98% availability</li>
        </ul>
      </div>
      <h3>ISO 27001 groups its safeguards into four controls: </h3>
      <p>Organisational controls, provides the governance framework. People controls, focuses on shaping human behaviour so every worker becomes a dependable line of defence. Physical controls, secures buildings, equipment, and media to prevent unauthorised entry or damage; and Technological controls, automates protection with tools like firewalls, encryption, monitoring, and backups to keep data safe, accurate, available, and quickly recoverable after an incident.</p>
      <img src="public/controls_overview.png"></img>
      <p>Select <strong>Learning Materials</strong> or <strong>Quizzes</strong> from the navigation bar to continue learning.</p>
    </main>
  );
}

/** ------------------------------------------------------------------
 *  Materials page – list of titles only
 *  ----------------------------------------------------------------*/
function MaterialsList() {
  return (
    <main className="dashboard">
      {materials.map((m) => (
        <section key={m.id} className="card">
          <h2 className="card-title">{m.title}</h2>
          {m.intro && m.intro.map((p, i) => (
            <p key={i} className="material-paragraph">{p}</p>
          ))}

          {/* PDF embed section */}
          {m.pdf && (
          <iframe src={m.pdf} title={m.title + " PDF"} className="pdf-frame"
          />
)}

        </section>
      ))}
    </main>
  );
}

function MaterialPage() {
  return <p className="page-padding">Material not available yet.</p>;
}

/** ------------------------------------------------------------------
 *  Quiz flow (per category id)
 *  ----------------------------------------------------------------*/
function QuizPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const quiz = quizzes[category] || [];

  if (!quiz.length)
    return <p className="page-padding">Quiz not available.</p>;
  const q = quiz[step];

  const handleChoice = (choiceIdx) => {
    if (choiceIdx === q.answer) setScore((s) => s + 1);
    if (step + 1 < quiz.length) setStep(step + 1);
    else navigate(`/result/${category}/${score + (choiceIdx === q.answer ? 1 : 0)}`);
  };

  return (
    <main className="quiz-container">
      <h2 className="quiz-heading">
        {quizCategories.find((c) => c.id === category)?.label || "Quiz"}
      </h2>
      <p>
        Question {step + 1} / {quiz.length}
      </p>
      <p>{q.q}</p>
      <div className="choices-grid">
        {q.choices.map((c, idx) => (
          <button key={idx} onClick={() => handleChoice(idx)} className="btn-primary">
            {c}
          </button>
        ))}
      </div>
    </main>
  );
}

function ResultPage() {
  const { category, score } = useParams();
  const total = (quizzes[category] || []).length;
  return (
    <main className="result-page">
      <h1 className="result-title">Your Score</h1>
      <p className="result-score">
        Your score is: {score} / {total}
      </p>
      <Link to="/materials" className="link-primary">
        Back to Materials
      </Link>
    </main>
  );
}

/** ------------------------------------------------------------------
 *  App routes
 *  ----------------------------------------------------------------*/
function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/materials" element={<MaterialsList />} />
        <Route path="/material/:id" element={<MaterialPage />} />
        <Route path="/quizzes/:category" element={<QuizPage />} />
        <Route path="/result/:category/:score" element={<ResultPage />} />
        <Route path="*" element={<p className="page-padding">404 Not Found</p>} />
      </Routes>
    </Router>
  );
}

export default App;
