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

  const addHabit = () => {
    if (habitName.trim() === "") return;

    const newHabit = {
      id: Date.now(),
      name: habitName,
      completed: false,
      streak: 0,
    };

    setHabits([...habits, newHabit]);
    setHabitName("");
  };

  const completeHabit = (id) => {
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

  const level = Math.floor(xp / 50) + 1;

  return (
    <div className="app">
      <section className="hero">
        <h1>Heabit</h1>
        <p>Turn invisible progress into visible growth.</p>
      </section>

      <section className="character-card">
        <h2>Your Growth Character</h2>
        <div className="character">🌱</div>
        <p>Level {level}</p>
        <p>{xp} XP</p>
      </section>

      <section className="habit-form">
        <input
          type="text"
          placeholder="Enter a habit, e.g. Drink water"
          value={habitName}
          onChange={(event) => setHabitName(event.target.value)}
        />
        <button onClick={addHabit}>Add Habit</button>
      </section>

      <section className="habit-list">
        <h2>Today&apos;s Habits</h2>

        {habits.length === 0 ? (
          <p className="empty-text">No habits yet. Add your first habit.</p>
        ) : (
          habits.map((habit) => (
            <div className="habit-card" key={habit.id}>
              <div>
                <h3>{habit.name}</h3>
                <p>🔥 Streak: {habit.streak}</p>
              </div>

              <div className="habit-actions">
                <button
                  onClick={() => completeHabit(habit.id)}
                  disabled={habit.completed}
                >
                  {habit.completed ? "Completed" : "Complete"}
                </button>

                <button className="delete-btn" onClick={() => deleteHabit(habit.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

        {habits.length > 0 && (
          <button className="reset-btn" onClick={resetDay}>
            Start New Day
          </button>
        )}
      </section>
    </div>
  );
}

export default App;