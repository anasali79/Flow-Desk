import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4
      bg-gradient-to-b from-[#F7F7DC] to-[#F2F3CF]
      dark:from-gray-900 dark:to-gray-800
    ">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left Side - Illustration */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-[28px] p-12
              shadow-[0_20px_40px_rgba(0,0,0,0.08)]
              transition-transform duration-300 hover:-translate-y-1
            ">
              <img
                src="/illustration.png"
                alt="FlowDesk illustration"
                className="w-full h-auto object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-center lg:items-start justify-center w-full">

          {/* Heading */}
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-black dark:text-white mb-3">
            Welcome to FlowDesk
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg">
            Organize work. Move faster.
          </p>

          {/* Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md
            shadow-[0_12px_30px_rgba(0,0,0,0.12)]
          ">
            <button
              type="button"
              onClick={handleContinue}
              className="
                group
                w-full bg-yellow-400 hover:bg-yellow-500
                text-black font-semibold
                py-3 px-6 rounded-2xl
                flex items-center justify-center gap-2
                transition-all duration-200
                hover:-translate-y-[1px]
                hover:shadow-[0_10px_20px_rgba(255,204,0,0.4)]
              "
            >
              <span>Continue to Dashboard</span>

              <svg
                className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              You can change everything
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
