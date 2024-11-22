import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class BubblesService {

  constructor() { }

  createCircle() {
    const body = document.querySelector("#surface") as HTMLElement;

    if (body !== null) {
      const circleEl = document.createElement("span") as HTMLElement;
      circleEl.classList.add("bubble");

      let size = Math.random() * 60;
      circleEl.style.width = 20 + size + "px";
      circleEl.style.height = 20 + size + "px";
      circleEl.style.left = Math.random() * innerWidth + "px";

      body.appendChild(circleEl);

      setTimeout(() => {
        circleEl.remove();
      }, 4000);
    }
  }
}