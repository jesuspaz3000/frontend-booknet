
import NavBar from "./navbar";
import Hero from "./hero";
import Popular from "./popular";
import Recommendations from "./recommendations";
import Continue from "./continue";
import TopRead from "./topRead";
import TopRecommendations from "./topRecommendations";
import NewBooks from "./newBooks";
import Dramas from "./dramas";
import Premiere from "./premiere";
import Sagas from "./sagas";
import Children from "./children";
import ScienceFiction from "./scienceFiction";
import Soon from "./soon";
import YouRead from "./youRead";
import Regional from "./regional";
import GenreBook from "./genreBook";
import Footer from "./footer";

export default function Home() {
  return (
    <div className="tw:min-h-screen">
      <NavBar />
      <Hero />
      <Popular />
      <Recommendations />
      <Continue />
      <TopRead />
      <TopRecommendations />
      <NewBooks />
      <Dramas />
      <Premiere />
      <Sagas />
      <Children />
      <ScienceFiction />
      <Soon />
      <YouRead />
      <Regional />
      <GenreBook />
      <Footer />
    </div>
  );
}