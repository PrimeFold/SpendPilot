import React from 'react';
import styled from 'styled-components';

const LoaderComponent = () => {
  return (
    <StyledWrapper>
      <div className="words">
        <span className="word">Analyzing...</span>
        <span className="word">Calculating...</span>
        <span className="word">Auditing...</span>
        <span className="word">Generating...</span>
        <span className="word">Analyzing...</span>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /*
    This loader is designed to be placed inside a button.
    It assumes the button has a background color of hsl(var(--primary))
    and text color of hsl(var(--primary-foreground)), which is standard
    for shadcn/ui's default button variant.
  */
  --bg-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  font-size: 1em; /* Inherit from parent button */
  font-weight: 500;
  height: 1.5em; /* Adjust based on font size */
  display: flex;
  align-items: center;
  justify-content: center;

  .words {
    overflow: hidden;
    position: relative;
    height: 100%;
  }
  .words::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      var(--bg-color) 10%,
      transparent 30%,
      transparent 70%,
      var(--bg-color) 90%
    );
    z-index: 20;
  }

  .word {
    display: block;
    height: 100%;
    color: hsl(var(--primary-foreground));
    animation: spin_4991 4s infinite;
  }

  @keyframes spin_4991 {
    10% {
      transform: translateY(-102%);
    }

    25% {
      transform: translateY(-100%);
    }

    35% {
      transform: translateY(-202%);
    }

    50% {
      transform: translateY(-200%);
    }

    60% {
      transform: translateY(-302%);
    }

    75% {
      transform: translateY(-300%);
    }

    85% {
      transform: translateY(-402%);
    }

    100% {
      transform: translateY(-400%);
    }
  }`;

export default LoaderComponent;
