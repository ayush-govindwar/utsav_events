import React from 'react';
import Hero from './components/hero/hero';
import Events from './components/events/events';
import './App.css';
import Reviews from './components/reviews/reviews';
import Forms from './components/form/forms';
import Footer from './components/footer/footer';
import Navbar from './components/navbar/navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Events />
      <Reviews />
      <Forms />
      <Footer />
    </div>
  );
}

export default App;