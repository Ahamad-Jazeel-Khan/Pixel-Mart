import { Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import useUserInfo from "./hooks/useUserInfo";


function App() {
  const { user } = useUserInfo();

  return (
    <>
      <Navbar user={user} />


        
        <div className="bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white pt-24">
          <main className="relative">
           
            <section className="grid grid-cols-1 md:grid-cols-2 gap-10 px-10 lg:px-20 py-20 items-center">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 text-gray-300 text-sm">
                  <p>See our 17,841 reviews on</p>
                  <img className="w-24 h-6" src="/tp.png" alt="Trustpilot" />
                </div>
                <h1 className="text-5xl font-extrabold leading-tight">
                  Instant, Secure{" "}
                  <span className="text-blue-400">CS2 Skin Trading</span>
                </h1>
                <p className="text-lg text-gray-300">
                  Pixel Mart is the highest rated CS2 (CS:GO) skin trading site.
                  Trade skins instantly with the lowest fees.
                </p>

                <div className="flex gap-4 mt-4">
                  <Link to="/TradingPage  ">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50">
                      🚀 Start Trading
                    </button>
                  </Link>
                  <Link to="/market">
                    <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-2xl border border-gray-600 transition-all duration-300 hover:scale-105">
                      Explore Market
                    </button>
                  </Link>
                </div>
              </div>

              <div className="flex justify-center">
                <img
                  className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  src="/main-page-pic.png"
                  alt="Main banner"
                />
              </div>
            </section>

            
            <div className="bg-gray-700 opacity-20 h-[1px] my-16 w-4/5 mx-auto" />

           
            <section className="px-10 lg:px-20 py-16">
              <h2 className="text-4xl font-bold text-center mb-14">
                Why Choose <span className="text-blue-400">Pixel Mart</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  {
                    title: "0% Commission on Every Trade",
                    points: ["Keep 100% of your earnings.", "No hidden fees."],
                    icon: "💰",
                  },
                  {
                    title: "Negotiate Prices",
                    points: ["Message sellers directly.", "Find the best deal."],
                    icon: "🤝",
                  },
                  {
                    title: "Live Chat Feature",
                    points: ["Talk with buyers or sellers.", "Build trust instantly."],
                    icon: "💬",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center text-center shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-blue-500/30"
                  >
                    <span className="text-4xl mb-4">{item.icon}</span>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <ul className="space-y-2 text-gray-300">
                      {item.points.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

           
            <section className="px-10 lg:px-20 py-16">
              <h2 className="text-4xl font-bold text-center mb-14">
                Trending <span className="text-blue-400">Skins</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white/5 rounded-xl p-4 text-center shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <img
                      src="/skin-sample.jpeg"
                      alt="Skin"
                      className="w-full h-32 object-contain mb-3"
                    />
                    <p className="text-gray-300">AK-47 | Redline</p>
                    <p className="text-blue-400 font-bold">$12.50</p>
                  </div>
                ))}
              </div>
            </section>

           
            <section className="px-10 lg:px-20 py-16 bg-gradient-to-r from-gray-900 to-black">
              <h2 className="text-4xl font-bold text-center mb-14">
                What Our <span className="text-blue-400">Users Say</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-8">
                {[
                  {
                    user: "TraderX",
                    review:
                      "Pixel Mart made trading so easy and secure! Highly recommend.",
                  },
                  {
                    user: "SkinKing",
                    review:
                      "Best CS2 trading experience I’ve ever had. Fast and safe.",
                  },
                  {
                    user: "Nova",
                    review: "Love the design, love the marketplace. 10/10.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white/5 rounded-xl p-6 max-w-sm shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src="/avatar.png"
                        alt="user"
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-bold">{item.user}</p>
                        <p className="text-yellow-400">★★★★★</p>
                      </div>
                    </div>
                    <p className="text-gray-300">"{item.review}"</p>
                  </div>
                ))}
              </div>
            </section>

           
            <section className="px-10 lg:px-20 py-16 text-center">
              <h2 className="text-4xl font-bold mb-10">
                Our <span className="text-blue-400">Stats</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  { label: "Users Trading Now", value: "1,234" },
                  { label: "Skins Listed", value: "25,678" },
                  { label: "Trades Completed Today", value: "4,529" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white/5 rounded-xl p-8 shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <p className="text-3xl font-bold text-blue-400">
                      {stat.value}
                    </p>
                    <p className="text-gray-300">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="px-10 lg:px-20 py-20 text-center bg-gradient-to-r from-blue-500 to-blue-700">
              <h2 className="text-4xl font-extrabold text-white mb-6">
                Ready to Trade?
              </h2>
              <p className="text-gray-200 mb-8">
                Join thousands of traders already using Pixel Mart.
              </p>
              <Link to="./TradingPage">
                <button className="bg-black text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110">
                  Start Trading Now 🚀
                </button>
              </Link>
            </section>
          </main>
        </div>

        <Footer />
   
    </>
  );
}

export default App;
