export const App = () => {
  return (
    <main className="min-h-screen p-5 bg-red-500 flex flex-col items-center gap-10">
      <div className="text-center bg-white px-10 py-4 rounded-lg space-y-2 shadow-lg">
        <h1 className="text-2xl font-semibold">
          Color Contrast Quiz
        </h1>

        <p className="text-lg">Guess the contrast ratio between the text and the background</p>
      </div>

      <div className="grow flex text-green-500 text-center text-8xl">
        <div className="m-auto">
          #00ff00
        </div>
      </div>

      <div className="grow space-x-3 text-center">
        {['a', 'b', 'c', 'd'].map((letter) => (
          <button
            key={letter}
            type="button"
            className="bg-white px-10 py-3 rounded-lg hover:bg-gray-200 outline-none focus-visible:ring-2 ring-offset-2 ring-white ring-offset-red-500"
          >
            {letter}
          </button>
        ))}
      </div>
    </main>
  )
}
