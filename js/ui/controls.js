export function renderControls() {
  const controlsRoot = document.getElementById("controls-root");

  if (!controlsRoot) return;

  const runValues = [0, 1, 2, 3, 4, 6];

  controlsRoot.innerHTML = `
    <div class="space-y-6">

      <div>
        <h3 class="font-semibold mb-3">
          Runs
        </h3>

        <div class="grid grid-cols-3 md:grid-cols-6 gap-3">

          ${runValues
            .map(
              (run) => `
            <button
              data-run="${run}"
              class="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold"
            >
              ${run}
            </button>
          `,
            )
            .join("")}

        </div>
      </div>

      <div>
        <h3 class="font-semibold mb-3">
          Extras
        </h3>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">

          <button
            data-extra="wide"
            class="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg"
          >
            Wide
          </button>

          <button
            data-extra="noball"
            class="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg"
          >
            No Ball
          </button>

          <button
            data-extra="bye"
            data-runs="1"
            class="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
          >
            Bye
          </button>

          <button
            data-extra="legbye"
            data-runs="1"
            class="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg"
          >
            Leg Bye
          </button>

        </div>
      </div>

      <div>
        <h3 class="font-semibold mb-3">
            Wickets
        </h3>

        <div class="grid grid-cols-2 gap-3">

            <button data-action="wicket"
            class="bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-semibold"
            >
                Wicket
            </button>

        </div>
      </div>

    </div>
  `;
}
