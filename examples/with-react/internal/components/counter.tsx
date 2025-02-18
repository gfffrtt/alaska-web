import { useState } from "react";
import { createRoot } from "react-dom/client";

const Counter = () => {
  const [count, setCount] = useState(
    () =>
      JSON.parse(document.querySelector("script[id='counter']")?.textContent!)
        .count
  );

  async function handleIncrement() {
    const response = await fetch("/increment", { method: "POST" });
    if (response.ok) {
      setCount(count + 1);
    }
  }

  async function handleDecrement() {
    const response = await fetch("/decrement", { method: "POST" });
    if (response.ok) {
      setCount(count - 1);
    }
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleDecrement}>Decrement</button>
    </div>
  );
};

createRoot(document.getElementById("counter")!).render(<Counter />);
