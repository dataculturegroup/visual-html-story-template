const ScrollManager = {

  // these hold references to helpers and rendered page elements (filled in by `initialize`)
  sections: {},

  // set up the webpage to scroll
  initialize: (sectionId) => {
    /**
     * sectionId: the HTML id of the section that contains the scrolling elements, all as `<div class="step" data-step="1">`
     * backdrops: an array of objects, each with `src` and `credit` properties
     */
    config = {
        sectionId,
        backgroundImages: [],
        section: document.getElementById(sectionId),
        scroller: undefined, // an instance of scrollama
        figure: undefined, // the figure element that holds the backdrop image/video    
        steps: undefined, // an array of all the step elements
    };
    // grab the elements on the page that are related to the scrolling
    config.figure = config.section.getElementsByTagName("figure")[0];
    config.figcaption = config.section.getElementsByTagName("figcaption")[0];
    config.steps = Array.from(config.section.getElementsByClassName("step")); // convert from HTMLCollection to Array for ease of use later
    config.backgroundImages = config.steps.map(step => ({
        src: step.getAttribute("data-image"),
        credit: step.getAttribute("data-image-credit") || ""
    }));
    config.handleStepEnter = (stepInfo) => { // stepInfo = { element, directihandle, index }
        // TODO: add an `is-active` class on the step that we switched to (and remove from all others)
        // and switch the background image to match the step content
        config.setBackdropImage(stepInfo.index);
    };
    config.handleStepExit = (stepInfo) => {
        // we don't make any transitions when a step scrolls out of view
    };
    config.setBackdropImage = (index) => {
        const image = config.figure.getElementsByTagName("img")[0];
        image.src = config.backgroundImages[index].src;
        config.figcaption.innerHTML = config.backgroundImages[index].credit;
    };
    config.handleResize = () => {
        const stepH = Math.floor(window.innerHeight * 1); // update step heights
        config.steps.forEach(step => step.style.height = stepH + "px")
        const figureWidth = window.innerWidth;
        const figureHeight = window.innerHeight;
        config.figure.style.width = figureWidth + "px";
        config.figure.style.height = figureHeight + "px";
        config.figure.style.top = "0px";
        config.figure.getElementsByClassName("wrapper")[0].style.height = figureHeight + "px";
        config.scroller.resize(); // tell scrollama to update new element dimensions
    };
    // intialize the scrollama helper
    config.scroller = scrollama();
    config.scroller.setup({
        step: `#${sectionId} .step`,
        offset: 0.9,
        debug: false
      })
      .onStepEnter(config.handleStepEnter)
      .onStepExit(config.handleStepExit);
    // setup the default view to be the right size and include first step
    ScrollManager.sections[sectionId] = config;
    config.handleResize();
    config.setBackdropImage(0); // remember: 0 means the first item in an array
  }

};