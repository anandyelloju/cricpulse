export function renderControls() {
  const controlsRoot =
    document.getElementById('controls-root');

  if (!controlsRoot) return;

  const runValues = [0, 1, 2, 3, 4, 6];

  controlsRoot.innerHTML = `
    <div class="grid grid-cols-3 md:grid-cols-6 gap-3">

      ${runValues.map(run => `
        <button
          data-run="${run}"
          class="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold"
        >
          ${run}
        </button>
      `).join('')}

    </div>
  `;
}