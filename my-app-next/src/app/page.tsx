'use client';

import { useEffect, useState } from "react";
import sendTextToAssistant from "./service/promptAI";

// @ts-ignore
import Row from '@catho/quantum/Grid/sub-components/Row';
// @ts-ignore
import Col from '@catho/quantum/Grid/sub-components/Col';

const addImageFilter = (
  worker: Worker,
  previewCtx: CanvasRenderingContext2D,
  image: HTMLCanvasElement,
) => {
  const imageData = previewCtx.getImageData(0, 0, image.width, image.height);

  worker.postMessage(imageData, [imageData.data.buffer]);
  worker.addEventListener('message', (d) => {
    const imageData = d.data;
    previewCtx.putImageData(imageData, 0 , 0);
  });
};

export default function Home() {
  const [teacherFeedback, setTeacherFeedback] = useState('');

  useEffect(() => {
    const worker = new Worker('http://localhost:3000/worker.js');

    const inputFileElement = document.getElementById('input');
    const preview = document.getElementById('preview') as HTMLCanvasElement;
    const previewCtx = preview.getContext('2d');

    inputFileElement?.addEventListener('change', async (e) => {
      const eventTarget = (e.target as HTMLInputElement);
      if (eventTarget && eventTarget.files) {
        const file = eventTarget.files[0];
        const imgBitMap = await createImageBitmap(file);

        preview.width = imgBitMap.width;
        preview.height = imgBitMap.height;

        if (previewCtx) {
          previewCtx.drawImage(imgBitMap, 0, 0);
          addImageFilter(worker, previewCtx, preview);
        }
      }
    });

    const test = document.getElementById("test");
    if (test) {
      test.addEventListener(
        "mouseover",
        (event) => {
          console.log('## EVENT', event.target);
        },
        false,
      );
    }
    

  }, []);

  const sendTextToTeacherIA = () => {
    const text = document.getElementById('english-teacher-text') as HTMLTextAreaElement;
    if (text) {
      sendTextToAssistant(text.value).then(async (resultAsStreaming) => {
        for await (const chunk of resultAsStreaming) {
          window.requestAnimationFrame(() => setTeacherFeedback(chunk));
        }
      });

      console.log('SEND....', text.value);
    }
  };

  return (
    <>
      <header>
        <div className="rocket-container">
          <div className="rocket">
            <img src="https://clipart-library.com/images/8TA66pjzc.png" alt="A Rocket animation slide in X axis" width="500" height="500" />
          </div>
        </div>
        <h1>Michel&#39;s playground page!</h1>
      </header>
      <main className="main-content">
        <div id="search-bar">
          <form>
            <div className="form-container">
              <label>Search for something:</label>
              <input type="text" id="example_text" />
              <label>Select something</label>
              <select name="example_select" id="example_select">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
                <option value="option4">Option 4</option>
              </select>
            </div>
          </form>
        </div>

        <div className="central">
          <div id="english-teacher">
            <h2>Give me feedback of me sentence below</h2>
            <form>
              <textarea id="english-teacher-text" rows={3} cols={50} />
              <button type="button" className="btn btn-blue" onClick={sendTextToTeacherIA}>feedback</button>
            </form>
            <div className="feedback-box">
              <div dangerouslySetInnerHTML={{__html: teacherFeedback}} />
            </div>
          </div>






          <div>
            <input type="file" accept="image/*" name="input" id="input" />
            <label htmlFor="input">Choose file</label>
            <canvas id="preview" width={400} height={400}></canvas>
          </div>


          <div>
            <ul>
              <li>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada urna vitae orci rutrum, sit amet faucibus tortor sagittis. Ut sollicitudin massa sit amet turpis ullamcorper rutrum. Cras sit amet enim non odio ultrices vulputate. Nulla facilisi. Donec vitae ligula ligula. Nam id nisi in justo ultricies viverra. Aenean ac nisl eu velit vestibulum varius. Duis euismod nec odio non facilisis. Vivamus et leo sed turpis ultricies pulvinar. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada urna vitae orci rutrum, sit amet faucibus tortor sagittis. Ut sollicitudin massa sit amet turpis ullamcorper rutrum. Cras sit amet enim non odio ultrices vulputate. Nulla facilisi. Donec vitae ligula ligula. Nam id nisi in justo ultricies viverra. Aenean ac nisl eu velit vestibulum varius. Duis euismod nec odio non facilisis. Vivamus et leo sed turpis ultricies pulvinar.</p>
                <img src="https://assets.catho.com.br/job-search-prod/public/static/images/img-company-null.svg" alt="Description of the image" width="300" height="200" />
              </li>
            </ul>
          </div>
        </div>
        <footer>
          <p>&copy; 2024 Our Company. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
