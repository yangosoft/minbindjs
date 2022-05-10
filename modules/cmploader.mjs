//@ts-check
import { Component } from "./component.mjs";

/**
 * Load a single slide
 * @param {string} slideName The name of the slide
 * @returns {Promise<Component>} The slide 
 */
async function loadComponent(slideName) {
    const response = await fetch(`./${slideName}`);
    const slide = await response.text();
    return new Component(slide);
}

/**
 * 
 * @param {string} start The name of the slide to begin with
 * @returns {Promise<Component[]>} The array of loaded slides
 */
async function loadSlides(start) {
    var next = start;
    const slides = [];
    const cycle = {};
    while (next) {
        if (!cycle[next]) {
            cycle[next] = true;
            const nextSlide = await loadComponent(next);
            slides.push(nextSlide);
            //next = nextSlide.nextSlide;
        }
        else {
            break;
        }
    }
    return slides;
}

export {loadComponent, loadSlides};