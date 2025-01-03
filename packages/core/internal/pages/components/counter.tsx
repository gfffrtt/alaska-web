import { createSignal } from "solid-js";
import { render } from "solid-js/web";

const Counter = () => {
  const [count, setCount] = createSignal(0);

  return (
    <div class="mt-12">
      <p class="mb-5">Count: {count()}</p>
      <button
        class="border px-2 py-1 rounded-md border-black"
        onClick={() => setCount(count() + 1)}
      >
        Increment
      </button>
      <button
        class="border px-2 py-1 rounded-md border-black"
        onClick={() => setCount(count() - 1)}
      >
        Decrement
      </button>
    </div>
  );
};

render(() => <Counter />, document.getElementById("counter"));
