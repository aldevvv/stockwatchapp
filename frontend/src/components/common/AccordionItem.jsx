import React, { useState } from 'react';

function AccordionItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion-item">
      <button className="accordion-question" onClick={toggleAccordion}>
        <span>{question}</span>
        <span className="accordion-icon">{isOpen ? '-' : '+'}</span>
      </button>
      <div className={`accordion-answer ${isOpen ? 'open' : ''}`}>
        <div className="accordion-answer-content">
          {answer}
        </div>
      </div>
    </div>
  );
}

export default AccordionItem;