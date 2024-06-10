import './App.scss';

import StatisticsCanada from './components/StatisticsCanada';
import StatistischesBundesamt from './components/StatistischesBundesamt';
import Footer from './components/Footer';

// ---------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------
function App() {

  return (
    <div className="App">
      <header className="App-header">
        <StatisticsCanada />
        <StatistischesBundesamt />
      </header>
      <Footer />
    </div>
  );
}

export default App;