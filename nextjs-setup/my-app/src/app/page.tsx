"use client"

import { useState } from "react";

const task1 = () => {
  let count = 0;
  let result = 1;

  while (count < 200000000) {
    count++;
    result = result * count;
  }

  return count;
};

const task2 = () => {
  let count = 0;
  let result = 0;

  while (count < 200000000) {
    count++;
    result = result * count;
  }

  return count;
};

const task3 = () => {
  let count = 0;
  let result = 0;

  while (count < 200000000) {
    count++;
    result = result * count;
  }

  return count;
};

export default function Home() {
  const [showImage, setShowImage] = useState(false);

  const doSomething = () => {
    const rTask1 = task1();
    const rTask2 = task2();
    const rTask3 = task3();

    // Change state
    setShowImage(!showImage);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1>Hello Guys!</h1>
        <br />
        <button onClick={doSomething} title="Show or hide image button">Do Something</button>
        <br />
        {showImage && (
          <img src="https://media.istockphoto.com/id/1322123064/photo/portrait-of-an-adorable-white-cat-in-sunglasses-and-an-shirt-lies-on-a-fabric-hammock.jpg?s=612x612&w=0&k=20&c=-G6l2c4jNI0y4cenh-t3qxvIQzVCOqOYZNvrRA7ZU5o=" alt="Image of the a Cat" />
        )}
      </div>
    </main>
  );
}
