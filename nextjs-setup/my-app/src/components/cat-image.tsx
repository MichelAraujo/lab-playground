import React, { ReactElement, useState } from "react";

function yieldToMain () {
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  });
}

export default function CatImage(): ReactElement {
  const [pageState, setPageState] = useState({ showImage: false, loading: false });

  const task1 = async () => {
    let count = 0;
    let result = 1;
  
    while (count < 1000000) {
      count++;
      result = result * count;
    }
  
    return count;
  };
  
  const task2 = async () => {
    let count = 0;
    let result = 0;
  
    while (count < 200000000) {
      count++;
      result = result * count;
    }
  
    return count;
  };
  
  const task3 = async () => {
    let count = 0;
    let result = 0;
  
    while (count < 200000000) {
      count++;
      result = result * count;
    }
  
    return count;
  };

  const doSomething = async () => {
    const tasks = [];

    for (let i = 0; i < 10; i++) {
      const rTaskPromise = task1();
      tasks.push(rTaskPromise);
      await yieldToMain();
    }

    await Promise.all(tasks);

    window.requestAnimationFrame(() => {
      setPageState({ ...pageState, showImage: !pageState.showImage });
    });
  };

  return (
    <>
      <button onClick={doSomething} title="Show or hide image button">Do Something</button>
      <br />
      <img
        className={`${!pageState.showImage ? 'show' : 'hide'}`}
        src="http://localhost:3000/cat_img.webp"
        width={612}
        height={408}
        alt="Image of the a Cat"
        decoding="async"
      />
    </>
  );
}