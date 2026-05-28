import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem("habits");
    return savedHabits ? JSON.parse(savedHabits) : [];
  });

  const [habitName, setHabitName] = useState("");

  const [xp, setXp] = useState(() => {
    return Number(localStorage.getItem("xp")) || 0;
  });

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
    localStorage.setItem("xp", xp);
  }, [habits, xp]);

  const level = Math.floor(xp / 50) + 1;
  const xpProgress = xp % 50;
  const xpToNextLevel = 50 - xpProgress;

  const getCharacter = () => {
    if (level >= 7) return "🌳";
    if (level >= 5) return "🌿";
    if (level >= 3) return "🌱";
    return "🌰";
  };

  const addHabit = () => {
    if (habitName.trim() === "") return;

    const newHabit = {
      id: Date.now(),
      name: habitName.trim(),
      completed: false,
      streak: 0,
    };

    setHabits([...habits, newHabit]);
    setHabitName("");
  };

  const completeHabit = (id) => {
    const habit = habits.find((habit) => habit.id === id);

    if (!habit || habit.completed) return;

    setHabits(
      habits.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              completed: true,
              streak: habit.streak + 1,
            }
          : habit
      )
    );

    setXp(xp + 10);
  };

  const resetDay = () => {
    setHabits(
      habits.map((habit) => ({
        ...habit,
        completed: false,
      }))
    );
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter((habit) => habit.id !== id));
  };

  return (
    <main className="app">
      <section className="hero">
        <h1>Heabit</h1>
        <p>Small actions. Visible growth.</p>
      </section>

      <section className="card growth-card">
        <p className="section-label">Your Growth</p>

        <div className="character">{getCharacter()}</div>

        <h2>Level {level}</h2>
        <p className="muted-text">{xp} XP earned</p>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(xpProgress / 50) * 100}%` }}
          ></div>
        </div>

        <p className="small-text">{xpToNextLevel} XP until next growth</p>
      </section>

      <section className="card habit-form">
        <input
          type="text"
          placeholder="Add one small habit..."
          value={habitName}
          onChange={(event) => setHabitName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") addHabit();
          }}
        />

        <button onClick={addHabit}>Add Habit</button>
      </section>

      <section className="card habit-list">
        <div className="section-header">
          <div>
            <p className="section-label">Today</p>
            <h2>Daily Habits</h2>
          </div>

          {habits.length > 0 && (
            <button className="secondary-btn" onClick={resetDay}>
              New Day
            </button>
          )}
        </div>

        {habits.length === 0 ? (
          <p className="empty-text">
            No habits yet. Start with one action you can complete today.
          </p>
        ) : (
          habits.map((habit) => (
            <div
              className={`habit-card ${habit.completed ? "completed" : ""}`}
              key={habit.id}
            >
              <div>
                <h3>{habit.name}</h3>
                <p>🔥 {habit.streak}-day streak</p>
              </div>

              <div className="habit-actions">
                <button
                  onClick={() => completeHabit(habit.id)}
                  disabled={habit.completed}
                >
                  {habit.completed ? "Done" : "+10 XP"}
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteHabit(habit.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}

export default App;