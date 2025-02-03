!(function (modules) {
    function requireModule(moduleId) {
      if (moduleCache[moduleId]) return moduleCache[moduleId].exports;
      var moduleInstance = (moduleCache[moduleId] = {
        id: moduleId,
        loaded: false,
        exports: {},
      });
      modules[moduleId].call(
        moduleInstance.exports,
        moduleInstance,
        moduleInstance.exports,
        requireModule
      );
      moduleInstance.loaded = true;
      return moduleInstance.exports;
    }
    var moduleCache = {};
    requireModule.m = modules;
    requireModule.c = moduleCache;
    requireModule.d = function (exports, name, getter) {
      if (!requireModule.o(exports, name)) {
        Object.defineProperty(exports, name, {
          configurable: false,
          enumerable: true,
          get: getter,
        });
      }
    };
    requireModule.n = function (moduleObj) {
      var getter =
        moduleObj && moduleObj.__esModule
          ? function () {
              return moduleObj["default"];
            }
          : function () {
              return moduleObj;
            };
      requireModule.d(getter, "a", getter);
      return getter;
    };
    requireModule.o = function (object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    };
    requireModule.p = "";
    requireModule((requireModule.s = 2));
  })([
    function (module, exports, requireModule) {
      "use strict";
      var defaultConfig = {
        loader: "unity",
        maxRatio: 16 / 9,
        minRatio: 9 / 16,
        thumbnail: "https://i.poki.com/q80,w100,h100,g29251,Default.jpg",
        numScreenshots: 4,
        commentChangeTime: 5000,
        spinnerRemoveDelay: 1000,
        fullImageMaxWidth: 0.6,
        fullImageMaxHeight: 0.7,
        smallImageSizeOfFullImage: 0.8,
        animationTargetSizeOfSmallImage: 0.5,
        transitionDuration: 0.5,
        slideshowInterval: 5,
      };
      window.config.title ||
        console.error(new Error("No title on window.config"));
      var mergedConfig = Object.assign(defaultConfig, window.config);
      console.log("Config:", mergedConfig);
      exports.a = mergedConfig;
    },
    function (module, exports, requireModule) {
      "use strict";
      function handleGeneratorStep(gen, resolve, reject, nextFn, throwFn, key, arg) {
        try {
          var info = gen[key](arg),
            value = info.value;
        } catch (error) {
          return void reject(error);
        }
        info.done ? resolve(value) : Promise.resolve(value).then(nextFn, throwFn);
      }
      function asyncWrapper(innerFn) {
        return function () {
          var self = this,
            args = arguments;
          return new Promise(function (resolve, reject) {
            function nextStep(arg) {
              handleGeneratorStep(generator, resolve, reject, nextStep, throwStep, "next", arg);
            }
            function throwStep(arg) {
              handleGeneratorStep(generator, resolve, reject, nextStep, throwStep, "throw", arg);
            }
            var generator = innerFn.apply(self, args);
            nextStep(void 0);
          });
        };
      }
      function startSlideshow() {
        return initializeSlideshow.apply(this, arguments);
      }
      function initializeSlideshow() {
        return (initializeSlideshow = asyncWrapper(
          regeneratorRuntime.mark(function generatorFunction() {
            var loadedImage, imageContainer, bulletElement, screenshotFull, tempImage, createOtherBullet;
            return regeneratorRuntime.wrap(function (context) {
              for (;;)
                switch ((context.prev = context.next)) {
                  case 0:
                    slideshowElement = document.getElementById("slideshow");
                    slideshowTop = document.getElementById("slideshow-top");
                    slideshowNav = document.getElementById("slideshow-nav");
                    slideshowImages = document.getElementById("slideshow-images");
                    slideshowTop.className = "active";
                    context.prev = 5;
                    context.next = 8;
                    return loadImage(imageBasePath + "screenshots/1-small.jpg" + screenshotsVersion);
                  case 8:
                    loadedImage = context.sent;
                    context.next = 16;
                    break;
                  case 11:
                    context.prev = 11;
                    context.t0 = context.catch(5);
                    context.next = 15;
                    return loadImage(imageBasePath + "screenshots/1.jpg" + screenshotsVersion);
                  case 15:
                    loadedImage = context.sent;
                  case 16:
                    imageContainer = createImageContainer();
                    imageContainer.className = imageClass + " middle";
                    imageContainer.setAttribute("fullImageLoaded", true);
                    imageContainer.setAttribute("data-idx", 0);
                    imageContainer.appendChild(loadedImage);
                    slideshowImages.appendChild(imageContainer);
                    slideshowElement.className = "active";
                    loadedImageAspectRatio = loadedImage.width / loadedImage.height;
                    styleElement = document.createElement("style");
                    updateSlideshowStyles();
                    document.body.appendChild(styleElement);
                    window.addEventListener("resize", updateSlideshowStyles);
                    for (var bulletIndex = 0; bulletIndex <= mergedConfig.a.numScreenshots - 1; bulletIndex++) {
                      bulletElement = document.createElement("div");
                      bulletElement.className = "bullet" + (bulletIndex === 0 ? " active" : "");
                      bulletElement.setAttribute("data-idx", bulletIndex);
                      slideshowNav.appendChild(bulletElement);
                    }
                    context.next = 31;
                    return loadImage(imageBasePath + "screenshots/1.jpg" + screenshotsVersion);
                  case 31:
                    screenshotFull = context.sent;
                    imageContainer.querySelector("img").src = screenshotFull.src;
                    createOtherBullet = function (idx) {
                      var container = createImageContainer(),
                        img = new Image();
                      img.src = imageBasePath + "screenshots/" + (idx + 1) + "-small.jpg" + screenshotsVersion;
                      container.appendChild(img);
                      container.setAttribute("data-idx", idx);
                      if (idx === 1) {
                        container.className = imageClass + " right";
                      } else if (idx === mergedConfig.a.numScreenshots - 1) {
                        container.className = imageClass + " left";
                      } else {
                        container.className = imageClass + " inactive";
                      }
                      slideshowImages.appendChild(container);
                    };
                    for (var idx = 1; idx <= mergedConfig.a.numScreenshots - 1; idx++) {
                      createOtherBullet(idx);
                    }
                    scheduleSlideTransition();
                  case 36:
                  case "end":
                    return context.stop();
                }
            }, generatorFunction, null, [[5, 11]]);
          })
        )).apply(this, arguments);
      }
      function scheduleSlideTransition() {
        return transitionSlideAsync.apply(this, arguments);
      }
      function transitionSlideAsync() {
        return (transitionSlideAsync = asyncWrapper(
          regeneratorRuntime.mark(function generatorFunction() {
            var slideInterval, rightImageElement, slideIndex, startTime, fullImage, elapsedTime;
            return regeneratorRuntime.wrap(function (context) {
              for (;;)
                switch ((context.prev = context.next)) {
                  case 0:
                    slideInterval = 1000 * mergedConfig.a.slideshowInterval;
                    rightImageElement = slideshowImages.querySelector("#slideshow-images .right");
                    slideIndex = rightImageElement.getAttribute("data-idx") << 0;
                    if (!rightImageElement.getAttribute("fullImageLoaded")) {
                      context.next = 7;
                      break;
                    }
                    context.next = 16;
                    break;
                  case 7:
                    startTime = Date.now();
                    context.next = 10;
                    return loadImage(imageBasePath + "screenshots/" + (slideIndex + 1) + ".jpg" + screenshotsVersion);
                  case 10:
                    fullImage = context.sent;
                    rightImageElement.querySelector("img").src = fullImage.src;
                    rightImageElement.setAttribute("fullImageLoaded", true);
                    clearTimeout(window.slideShowMoveTransitionID);
                    clearTimeout(window.slideShowTimeoutID);
                    elapsedTime = Date.now() - startTime;
                    if (elapsedTime > slideInterval) {
                      moveToNextSlide();
                    } else {
                      window.slideShowTimeoutID = window.setTimeout(moveToNextSlide, slideInterval - elapsedTime);
                    }
                    context.next = 19;
                    break;
                  case 16:
                    clearTimeout(window.slideShowMoveTransitionID);
                    clearTimeout(window.slideShowTimeoutID);
                    window.slideShowTimeoutID = window.setTimeout(moveToNextSlide, slideInterval);
                  case 19:
                  case "end":
                    return context.stop();
                }
            }, generatorFunction);
          })
        )).apply(this, arguments);
      }
      function moveToNextSlide() {
        if (!slideshowDisabled) {
          var nextIndex = currentSlideIndex + 1;
          if (nextIndex > mergedConfig.a.numScreenshots - 1) nextIndex = 0;
          updateSlide(nextIndex);
        }
      }
      function updateSlide(newIndex) {
        currentSlideIndex = newIndex << 0;
        var prevIndex = currentSlideIndex > 0 ? currentSlideIndex - 1 : mergedConfig.a.numScreenshots - 1,
          nextIndex = currentSlideIndex < mergedConfig.a.numScreenshots - 1 ? currentSlideIndex + 1 : 0;
        Array.prototype.forEach.call(
          slideshowImages.querySelectorAll(".image"),
          function (imgElement) {
            if (imgElement.className === imageClass + " left")
              imgElement.className = imageClass + " fromLeft";
            if (imgElement.className === imageClass + " right")
              imgElement.className = imageClass + " fromRight";
            if (imgElement.className.indexOf("inactive") === -1)
              imgElement.className += " inactive";
          }
        );
        slideshowImages.querySelector('[data-idx="' + currentSlideIndex + '"]').className =
          imageClass + " middle";
        slideshowImages.querySelector('[data-idx="' + prevIndex + '"]').className =
          imageClass + " left";
        slideshowImages.querySelector('[data-idx="' + nextIndex + '"]').className =
          imageClass + " right";
        Array.prototype.forEach.call(
          slideshowNav.querySelectorAll(".bullet"),
          function (bullet, idx) {
            bullet.className = "bullet";
            if (idx === currentSlideIndex) bullet.className += " active";
          }
        );
        window.slideShowMoveTransitionID = window.setTimeout(function () {
          Array.prototype.forEach.call(
            slideshowImages.querySelectorAll(".inactive"),
            function (elem) {
              elem.className = imageClass + " inactive fromRight";
            }
          );
        }, 1000 * mergedConfig.a.transitionDuration);
        scheduleSlideTransition();
      }
      function updateSlideshowStyles() {
        var screenAspect = window.innerWidth / window.innerHeight,
          fullImageWidth = (mergedConfig.a.fullImageMaxWidth / loadedImageAspectRatio) * screenAspect,
          fullImageWidthFactor = mergedConfig.a.fullImageMaxWidth;
        if (fullImageWidth > mergedConfig.a.fullImageMaxHeight) {
          fullImageWidth = mergedConfig.a.fullImageMaxHeight;
          fullImageWidthFactor = (fullImageWidth * loadedImageAspectRatio) / screenAspect;
        }
        var smallImageSize = fullImageWidthFactor * mergedConfig.a.smallImageSizeOfFullImage,
          middleTranslate = 0.5 - fullImageWidthFactor / 2,
          targetScale = fullImageWidthFactor * mergedConfig.a.animationTargetSizeOfSmallImage,
          leftTranslate = -2 * targetScale,
          rightTranslate = 1 + targetScale,
          leftBoundary = (1 - fullImageWidthFactor) / 4 - fullImageWidthFactor / 2,
          fromLeftTranslate = 0.5 - 0.5 * fullImageWidthFactor - (smallImageSize + fullImageWidthFactor) / 2,
          rightBoundary = 1 - (1 - fullImageWidthFactor) / 4 - fullImageWidthFactor / 2,
          fromRightTranslate = 0.5 + 0.5 * smallImageSize,
          finalLeftTranslate = Math.min(leftBoundary, fromLeftTranslate),
          finalRightTranslate = Math.max(rightBoundary, fromRightTranslate);
        styleElement.innerHTML =
          "\n\t\t#slideshow-images {\n\t\t\theight: " +
          100 * fullImageWidth +
          "vh;\n\t\t}\n\t\t#slideshow-images .image {\n\t\t\ttransition-duration: " +
          mergedConfig.a.transitionDuration +
          "s;\n\t\t\twidth: " +
          100 * fullImageWidthFactor +
          "vw;\n\t\t\theight: " +
          100 * fullImageWidth +
          "vh;\n\t\t}\n\t\t#slideshow-images .middle {\n\t\t\ttransform: translateX(" +
          100 * middleTranslate +
          "vw);\n\t\t}\n\t\t#slideshow-images .left {\n\t\t\ttransform: translateX(" +
          100 * finalLeftTranslate +
          "vw) scale(" +
          mergedConfig.a.smallImageSizeOfFullImage +
          ");\n\t\t}\n\t\t#slideshow-images .right {\n\t\t\ttransform: translateX(" +
          100 * finalRightTranslate +
          "vw) scale(" +
          mergedConfig.a.smallImageSizeOfFullImage +
          ");\n\t\t}\n\t\t#slideshow-images .inactive.fromLeft {\n\t\t\ttransform: translateX(" +
          100 * leftTranslate +
          "vw) scale(" +
          mergedConfig.a.smallImageSizeOfFullImage * mergedConfig.a.animationTargetSizeOfSmallImage +
          ");\n\t\t}\n\t\t#slideshow-images .inactive.fromRight {\n\t\t\ttransform: translateX(" +
          100 * rightTranslate +
          "vw) scale(" +
          mergedConfig.a.smallImageSizeOfFullImage * mergedConfig.a.animationTargetSizeOfSmallImage +
          ");\n\t\t}\n\t";
      }
      function loadImage(srcUrl) {
        return new Promise(function (resolve, reject) {
          var img = new Image();
          img.addEventListener("load", function () {
            resolve(img);
          });
          img.addEventListener("error", function (errorEvt) {
            if (img.src.indexOf(".jpg") > 0)
              img.src = img.src.replace(".jpg", ".png");
            else reject(errorEvt);
          });
          img.src = srcUrl;
        });
      }
      function createImageContainer() {
        var container = document.createElement("div");
        container.className = imageClass;
        return container;
      }
      exports.a = startSlideshow;
      var slideshowElement,
        slideshowTop,
        slideshowNav,
        slideshowImages,
        loadedImageAspectRatio,
        styleElement,
        regeneratorModule = requireModule(10),
        regeneratorRuntime = requireModule.n(regeneratorModule),
        mergedConfig = requireModule(0),
        imageClass = "image",
        currentSlideIndex = 0,
        slideshowDisabled = false,
        screenshotsVersion = mergedConfig.a.screenshotsVersion
          ? "?v" + mergedConfig.a.screenshotsVersion
          : "",
        currentPath = window.location.pathname.substring(
          0,
          window.location.pathname.lastIndexOf("/")
        ),
        isCdnHost =
          window.location.hostname.endsWith("game-cdn.poki.com") ||
          window.location.hostname.endsWith(".poki-gdn.com"),
        imageBasePath = isCdnHost
          ? "/cdn-cgi/image/f=auto,quality=78" + currentPath + "/"
          : "";
      window.navigateNext = moveToNextSlide;
      window.removeSlideshowEventListeners = function () {
        slideshowDisabled = true;
      };
    },
    function (module, exports, requireModule) {
      module.exports = requireModule(3);
    },
    function (module, exports, requireModule) {
      "use strict";
      function createElementWithId(id) {
        var element = document.createElement("div");
        element.id = id;
        return element;
      }
      Object.defineProperty(exports, "__esModule", { value: true });
      var styleLoader = requireModule(4);
      requireModule.n(styleLoader);
      var mergedConfig = requireModule(0),
        unused = requireModule(9),
        unused2 = requireModule(1),
        extraModule = requireModule(11),
        loaderElement = createElementWithId("loader"),
        slideshowContainer = createElementWithId("slideshow"),
        slideshowTopContainer = createElementWithId("slideshow-top"),
        thumbnailImage = document.createElement("img");
      thumbnailImage.id = "thumbnail";
      thumbnailImage.alt = mergedConfig.a.title;
      thumbnailImage.title = mergedConfig.a.title;
      thumbnailImage.src = mergedConfig.a.thumbnail;
      var slideshowTopInner = createElementWithId("slideshow-top-container"),
        gameTitleElement = createElementWithId("game-title");
      gameTitleElement.innerText = mergedConfig.a.title;
      var spinnerElement = createElementWithId("progress-spinner");
      spinnerElement.innerHTML =
        '<div class="bounce0"></div><div class="bounce1"></div><div class="bounce2">';
      spinnerElement.setAttribute("class", "spinner");
      var progressContainer = createElementWithId("progress-container"),
        progressBar = createElementWithId("progress-bar"),
        progressFill = createElementWithId("progress-fill");
      progressFill.style.width = "0%";
      var progressAmount = createElementWithId("progress-amount");
      progressAmount.innerText = "0%";
      var progressComment = createElementWithId("progress-comment");
      progressComment.innerText = "Loading";
      var slideshowImagesContainer = createElementWithId("slideshow-images"),
        slideshowNav = createElementWithId("slideshow-nav"),
        gameContainer = createElementWithId("game-container"),
        gameElement = createElementWithId("game");
      loaderElement.appendChild(slideshowContainer);
      slideshowContainer.appendChild(slideshowTopContainer);
      slideshowContainer.appendChild(slideshowImagesContainer);
      slideshowContainer.appendChild(slideshowNav);
      slideshowTopContainer.appendChild(thumbnailImage);
      slideshowTopContainer.appendChild(slideshowTopInner);
      slideshowTopInner.appendChild(gameTitleElement);
      slideshowTopInner.appendChild(spinnerElement);
      slideshowTopInner.appendChild(progressContainer);
      progressContainer.appendChild(progressBar);
      progressContainer.appendChild(progressAmount);
      slideshowTopInner.appendChild(progressComment);
      progressBar.appendChild(progressFill);
      gameContainer.appendChild(gameElement);
      document.body.appendChild(loaderElement);
      document.body.appendChild(gameContainer);
    },
    function (module, exports, requireModule) {
      var cssContent = requireModule(5);
      if (typeof cssContent === "string")
        cssContent = [[module.i, cssContent, ""]];
      var options = { hmr: true };
      options.transform = void 0;
      options.insertInto = void 0;
      requireModule(7)(cssContent, options);
      if (cssContent.locals) module.exports = cssContent.locals;
    },
    function (module, exports, requireModule) {
      (exports = module.exports = requireModule(6)(false)),
        exports.push([
          module.i,
          "* {\n    margin: 0;\n    padding: 0;\n}\n\nhtml,\nbody {\n    width: 100vw;\n    height: 100vh;\n    overflow: hidden;\n    background: #002B50;\n    font-family: Torus, Arial, Helvetica, sans-serif;\n    color: #fff;\n}\n\n#game-container {\n    position: absolute !important;\n    left: 50%;\n    top: 50%;\n    display: none;\n}\n\n#game,\n#game canvas {\n    width: 100%;\n    height: 100%;\n}\n\n#loader {\n    width: 100%;\n    height: 100%;\n}\n\n#slideshow {\n    width: 100%;\n    height: 100%;\n    flex-direction: column;\n    align-items: center;\n    justify-content: space-evenly;\n    display: flex;\n    user-select: none;\n}\n\n@font-face {\n    font-family: Torus;\n    src:\n        url('//a.poki.com/fonts/torus-bold-webfont.woff2') format('woff2'),\n        url('//a.poki.com/fonts/torus-bold-webfont.woff') format('woff');\n    font-style: bold;\n    font-weight: 700;\n}\n\n#progress-spinner{\n    margin-left: 0;\n    margin-top: 0;\n    left: 0px;\n    display:none;\n    transform: translate(100%, -50%);\n    width:10vh;\n}\n#progress-spinner >div{\n    width:2vh;\n    height:2vh;\n}\n#thumbnail {\n    box-shadow: 0 1vh 2vh rgba(0, 0, 0, 0.4);\n    border-radius: 16.667%;\n}\n\n#slideshow-top {\n    display: flex;\n    margin: 2.5vh 0;\n}\n\n#slideshow-top-container {\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    flex-grow: 1;\n}\n\n#game-title, #progress-comment {\n    display: flex;\n    flex-grow: 1;\n    align-items: center;\n    font-size:2vh;\n}\n\n#progress-container {\n    display: flex;\n    align-items: center;\n    flex-grow: 1;\n    transition: 0.2s ease-out all;\n}\n\n#progress-container.done {\n    opacity: 0;\n}\n\n#progress-bar {\n    background: #fff;\n    width: 100%;\n    overflow: hidden;\n}\n\n#progress-fill {\n    background: #3CF7DC;\n    height: 100%;\n    transition: 0.2s ease-out all;\n    animation-name: fillColor;\n    animation-duration: 3.5s;\n    animation-iteration-count: infinite;\n    animation-fill-mode: both;\n}\n\n@keyframes fillColor {\n    0% {\n        background-color: #3CF7DC;\n    }\n\n    25% {\n        background-color: #FFA9BE;\n    }\n\n    50% {\n        background-color: #FFDC00;\n    }\n\n    75% {\n        background-color: #E0AEF5;\n    }\n\n    100% {\n        background-color: #3CF7DC;\n    }\n}\n\n@media (orientation: portrait) {\n    #thumbnail {\n        margin-right: 2.4vh;\n    }\n\n    #game-title h1 {\n        font-size: 2vh;\n    }\n\n    #slideshow-top {\n        width: 70vw;\n    }\n\n    #progress-bar {\n        height: 1vh;\n        border-radius: 0.5vh;\n    }\n\n    #progress-fill {\n        border-radius: 0.5vh;\n    }\n\n    #thumbnail {\n        width: 5vh;\n        height: 5vh;\n    }\n\n    #progress-amount {\n        font-size: 2vh;\n        margin-left: 1.5vh;\n        width: 3vh;\n    }\n}\n\n@media (orientation: landscape) {\n    #thumbnail {\n        margin-right: 3vh;\n    }\n\n    #game-title h1 {\n        font-size: 3vh;\n    }\n\n    #slideshow-top {\n        width: 50vw;\n    }\n\n    #progress-bar {\n        height: 1.2vh;\n        border-radius: 0.6vh;\n    }\n\n    #progress-fill {\n        border-radius: 0.6vh;\n    }\n\n    #thumbnail {\n        width: 7.5vh;\n        height: 7.5vh;\n    }\n\n    #progress-amount {\n        font-size: 2.5vh;\n        margin-left: 1.875vh;\n        width: 3.75vh;\n    }\n}\n\n#slideshow-images {\n    width: 100vw;\n    display: flex;\n    justify-content: center;\n}\n\n#slideshow-images .image {\n    position: absolute;\n    box-shadow: 0 2.4vh 3.6vh rgba(0, 0, 0, 0.4);\n    transition-property: transform;\n    transition-timing-function: ease-in-out;\n    perspective: 1000px;\n    left: 0;\n    overflow: hidden;\n}\n\n#slideshow-images .image img {\n    width: 100%;\n    height: 100%;\n}\n\n#slideshow-images .image:nth-of-type(1n) {\n    border-color: #3BE8B0;\n}\n\n#slideshow-images .image:nth-of-type(2n) {\n    border-color: #FF6D92;\n}\n\n#slideshow-images .image:nth-of-type(3n) {\n    border-color: #A177FF;\n}\n\n#slideshow-images .image:nth-of-type(4n) {\n    border-color: #FFD200;\n}\n\n#slideshow-images .left {\n    z-index: 2;\n}\n#slideshow-images .right {\n    z-index: 1;\n}\n\n#slideshow-images .middle {\n    z-index: 3;\n}\n\n#slideshow-images .left img,\n#slideshow-images .right img {\n    transform: scale(1.05);\n}\n\n#slideshow-images .left img,\n#slideshow-images .right img,\n#slideshow-images .fromLeft img,\n#slideshow-images .fromRight img {\n    filter: blur(1vh);\n}\n\n#slideshow-images .inactive {\n    display: none;\n}\n\n#slideshow-images .inactive.fromLeft,\n#slideshow-images .inactive.fromRight {\n    display: block;\n}\n\n#slideshow-nav {\n    display: flex;\n    justify-content: center;\n    margin: 2.5vh 0;\n}\n\n#slideshow-nav .bullet {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n\n#slideshow-nav .bullet:after {\n    content: '';\n    background: #fff;\n    border-radius: 0.4vh;\n    width: 0.8vh;\n    height: 0.8vh;\n}\n\n#slideshow-nav .bullet.active:after {\n    background: #009CFF;\n}\n\n#slideshow-nav .bullet {\n    width: 2.5vh;\n    height: 2.5vh;\n}\n\n#slideshow-nav .bullet:after {\n    border-radius: 50%;\n    width: 50%;\n    height: 50%;\n}\n\n#slideshow-nav,\n#slideshow-images {\n    opacity: 0;\n    transition: 0.4s all ease-out;\n    transform: translateY(2vh);\n    perspective: 1000px;\n    transition-delay: 400ms;\n}\n\n#slideshow-nav {\n    transition-delay: 600ms;\n}\n\n#slideshow.active #slideshow-images,\n#slideshow.active #slideshow-nav {\n    opacity: 1;\n    transform: translateY(0);\n}\n\n@keyframes bounceInDown {\n    from,\n    60%,\n    75%,\n    90%,\n    to {\n        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);\n    }\n    0% {\n        transform: translate3d(0, -100vh, 0);\n    }\n    40% {\n        transform: translate3d(0, 0.5vh, 0);\n    }\n    65% {\n        transform: translate3d(0, -0.2vh, 0);\n    }\n    80% {\n        transform: translate3d(0, 0.1vh, 0);\n    }\n    to {\n        transform: translate3d(0, 0, 0);\n    }\n}\n\n#slideshow-top {\n    transform: translate3d(0, -20vh, 0);\n    opacity: 0;\n}\n\n#slideshow-top.active {\n    opacity: 1;\n    transform: translate3d(0, 0, 0);\n    animation-name: bounceInDown;\n    animation-duration: 0.5s;\n}\n\n.spinner {\n    position: relative;\n    left: -9999px;\n    animation: dot-pulse 1.5s infinite linear;\n    animation-delay: .25s;\n    transform: translate(50vw, 50vh) translate(-130%, -130%);\n}\n\n.spinner:before, .spinner:after {\n    content: '';\n    display: inline-block;\n    position: absolute;\n    top: 0;\n    width: 10px;\n    height: 10px;\n    border-radius: 5px;\n}\n.spinner, .spinner:before, .spinner:after{\n    width: 10px;\n    height: 10px;\n    border-radius: 5px;\n}\n\n.spinner:before {\n    animation: dot-pulse 1.5s infinite linear;\n    animation-delay: 0s;\n    left:-20px;\n}\n\n.spinner:after {\n    animation: dot-pulse 1.5s infinite linear;\n    animation-delay: .5s;\n    left:20px;\n}\n\n@keyframes dot-pulse {\n    0% {\n      box-shadow: 9999px 0 0 -5px #FFF;\n    }\n    30% {\n      box-shadow: 9999px 0 0 2px #FFF;\n    }\n    60%,\n    100% {\n      box-shadow: 9999px 0 0 -5px #FFF;\n    }\n  }\n",
          ""
        ]);
    },
    function (module, exports, requireModule) {
      "use strict";
      function resizeGameContainer() {
        var width = window.innerWidth,
          height = window.innerHeight,
          aspectRatio = width / height;
        gameContainer.style.width = "" + width + "px";
        gameContainer.style.height = "" + height + "px";
        if (aspectRatio > mergedConfig.a.maxRatio) {
          gameContainer.style.width = "" + height * mergedConfig.a.maxRatio + "px";
        } else if (aspectRatio < mergedConfig.a.minRatio) {
          gameContainer.style.height = "" + width / mergedConfig.a.minRatio + "px";
        }
        var rect = gameContainer.getBoundingClientRect();
        gameContainer.style.marginLeft = "" + -0.5 * rect.width + "px";
        gameContainer.style.marginTop = "" + -0.5 * rect.height + "px";
      }
      function initializeGame() {
        gameContainer = document.getElementById("game-container");
        loaderContainer = document.getElementById("loader");
        progressContainer = document.getElementById("progress-container");
        progressFill = document.getElementById("progress-fill");
        progressAmount = document.getElementById("progress-amount");
        progressComment = document.getElementById("progress-comment");
        window.addEventListener("resize", resizeGameContainer);
        window.addEventListener("focus", resizeGameContainer);
        window.PokiSDK.init()
          .then(function () {
            if (window.pokiBridge)
              window.unityGame.SendMessage(window.pokiBridge, "ready");
            else window.pokiReady = true;
          })
          .catch(function () {
            if (window.pokiBridge)
              window.unityGame.SendMessage(window.pokiBridge, "adblock");
            else window.pokiAdBlock = true;
            console.info("AdBlocker active");
          });
        window.PokiSDK.setDebug(mergedConfig.a && mergedConfig.a.debug);
      }
      function onGameLoaded() {
        gameContainer.style.display = "block";
        loaderContainer.style.display = "none";
        resizeGameContainer();
        PokiSDK.gameLoadingFinished();
        window.removeSlideshowEventListeners();
        if (loadingTimeout) clearTimeout(loadingTimeout);
      }
      function onLoadingProgress(moduleObj, fractionLoaded) {
        if (moduleObj.Module) {
          var percentage = 100 * fractionLoaded;
          progressFill.style.width = "" + percentage + "%";
          progressAmount.innerHTML = "" + (percentage << 0) + "%";
          if (mergedConfig.a.fileSize)
            progressAmount.innerHTML += " of " + mergedConfig.a.fileSize + "MB";
          var progressData = { percentageDone: percentage };
          PokiSDK.gameLoadingProgress(progressData);
          if (fractionLoaded >= 1 && fContainer.className !== "done") {
            fContainer.className = "done";
            document.getElementById("progress-comment").innerHTML =
              "Preparing game...";
            document.getElementById("progress-spinner").style.display = "flex";
            if (loadingTimeout) clearTimeout(loadingTimeout);
          }
        }
      }
      function rotateLoadingComment() {
        var comments = mergedConfig.a.loadingComments || ["Loading..."];
        if (comments) {
          progressComment.innerHTML = comments[commentIndex];
          commentIndex++;
          if (commentIndex >= comments.length) commentIndex = 0;
          loadingTimeout = setTimeout(rotateLoadingComment, mergedConfig.a.commentChangeTime);
        } else {
          progressComment.innerHTML = "";
        }
      }
      function loadUnityGame() {
        (function () {
          var scriptElem = document.createElement("script");
          scriptElem.src = mergedConfig.a.unityWebglLoaderUrl;
          scriptElem.addEventListener("load", function () {
            window.unityGame = window.UnityLoader.instantiate("game", mergedConfig.a.unityWebglBuildUrl, {
              onProgress: onLoadingProgress,
              Module: { onRuntimeInitialized: onGameLoaded },
            });
          });
          document.body.appendChild(scriptElem);
        })();
        PokiSDK.gameLoadingStart();
        if (mergedConfig.a.fileSize) {
          progressAmount.innerHTML += " of " + mergedConfig.a.fileSize + "MB";
          progressAmount.style.width = "12vh";
          progressAmount.style.whiteSpace = "nowrap";
        }
        rotateLoadingComment();
      }
      function removeSpinner() {
        window.setTimeout(function () {
          var spinnerElem = document.getElementById("spinner");
          if (spinnerElem && spinnerElem.parentNode)
            spinnerElem.parentNode.removeChild(spinnerElem);
        }, mergedConfig.a.spinnerRemoveDelay);
      }
      var gameContainer,
        loaderContainer,
        progressContainer,
        progressFill,
        progressAmount,
        progressComment,
        loadingTimeout,
        mergedConfig = requireModule(0),
        slideshowModule = requireModule(1),
        commentIndex = 0;
      (function () {
        var spinnerDiv = document.createElement("div");
        spinnerDiv.setAttribute("id", "spinner");
        spinnerDiv.className = "spinner";
        document.body.appendChild(spinnerDiv);
      })();
      window.onload = function () {
        initializeGame();
        try {
          Object(requireModule(1).a)().then(function () {
            removeSpinner();
          });
        } catch (error) {
          console.info("Slideshow loading error", error);
          removeSpinner();
        }
        loadUnityGame();
      };
    },
    function (module, exports, requireModule) {
      "use strict";
      // Regenerator Runtime (transformed with renamed variables)
      function wrapGenerator(innerFn, outerFn, selfObj, tryLocsList) {
        var GeneratorPrototype =
            outerFn && outerFn.prototype instanceof GeneratorWrapper
              ? outerFn
              : GeneratorWrapper,
          generator = Object.create(GeneratorPrototype.prototype),
          context = new Context(tryLocsList || []);
        generator._invoke = makeInvokeMethod(innerFn, selfObj, context);
        return generator;
      }
      function tryCatch(fn, obj, arg) {
        try {
          return { type: "normal", arg: fn.call(obj, arg) };
        } catch (err) {
          return { type: "throw", arg: err };
        }
      }
      function GeneratorWrapper() {}
      function GeneratorFunction() {}
      function GeneratorFunctionPrototype() {}
      function defineIteratorMethods(prototype) {
        ["next", "throw", "return"].forEach(function (method) {
          prototype[method] = function (arg) {
            return this._invoke(method, arg);
          };
        });
      }
      function AsyncIterator(generator) {
        function invoke(method, arg, resolve, reject) {
          var record = tryCatch(generator[method], generator, arg);
          if (record.type !== "throw") {
            var result = record.arg,
              value = result.value;
            if (value && typeof value === "object" && Object.prototype.hasOwnProperty.call(value, "__await"))
              return Promise.resolve(value.__await).then(
                function (val) {
                  invoke("next", val, resolve, reject);
                },
                function (err) {
                  invoke("throw", err, resolve, reject);
                }
              );
            return Promise.resolve(value).then(
              function (val) {
                result.value = val;
                resolve(result);
              },
              function (err) {
                return invoke("throw", err, resolve, reject);
              }
            );
          }
          reject(record.arg);
        }
        var previousPromise;
        function enqueue(method, arg) {
          function callInvoke() {
            return new Promise(function (resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }
          return previousPromise = previousPromise
            ? previousPromise.then(callInvoke, callInvoke)
            : callInvoke();
        }
        this._invoke = enqueue;
      }
      defineIteratorMethods(GeneratorWrapper.prototype);
      GeneratorWrapper.prototype[Symbol.iterator] = function () {
        return this;
      };
      GeneratorWrapper.prototype.toString = function () {
        return "[object Generator]";
      };
      function Context(tryLocsList) {
        this.tryEntries = [{ tryLoc: "root" }];
        tryLocsList.forEach(function (loc) {
          this.tryEntries.push({ tryLoc: loc });
        }, this);
        this.reset(true);
      }
      Context.prototype.reset = function (skipTempReset) {
        this.prev = 0;
        this.next = 0;
        this.sent = this._sent = undefined;
        this.done = false;
        this.delegate = null;
        this.method = "next";
        this.arg = undefined;
        this.tryEntries.forEach(function (entry) {
          entry.completion = null;
        });
      };
      Context.prototype.stop = function () {
        this.done = true;
        var rootRecord = this.tryEntries[0];
        if (rootRecord.completion && rootRecord.completion.type === "throw")
          throw rootRecord.completion.arg;
        return this.rval;
      };
      Context.prototype.dispatchException = function (exception) {
        if (this.done) throw exception;
        var context = this;
        function handle(loc, caught) {
          context.method = "throw";
          context.arg = exception;
          context.next = loc;
          if (caught) {
            context.method = "next";
            context.arg = undefined;
          }
          return !!caught;
        }
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i],
            record = entry.completion;
          if (entry.tryLoc === "root") {
            return handle("end");
          }
          if (entry.tryLoc <= this.prev) {
            var hasCatch = Object.prototype.hasOwnProperty.call(entry, "catchLoc"),
              hasFinally = Object.prototype.hasOwnProperty.call(entry, "finallyLoc");
            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, true);
              else if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, true);
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      };
      Context.prototype.abrupt = function (type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev && Object.prototype.hasOwnProperty.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var record = entry;
            break;
          }
        }
        if (record) {
          record.completion = { type: type, arg: arg };
          this.method = "next";
          this.next = record.finallyLoc;
          return;
        }
        this.complete({ type: type, arg: arg });
      };
      Context.prototype.complete = function (record, afterLoc) {
        if (record.type === "throw") throw record.arg;
        if (record.type === "break" || record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }
      };
      Context.prototype.finish = function (finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            return;
          }
        }
      };
      Context.prototype.catch = function (tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrownValue = record.arg;
              entry.completion = null;
            }
            return thrownValue;
          }
        }
        throw new Error("illegal catch attempt");
      };
      Context.prototype.delegateYield = function (iterable, resultName, nextLoc) {
        this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc };
        if (this.method === "next") this.arg = undefined;
        return;
      };
      function values(iterable) {
        if (iterable) {
          var iteratorMethod = iterable[Symbol.iterator];
          if (iteratorMethod) return iteratorMethod.call(iterable);
          if (typeof iterable.next === "function") return iterable;
          if (!isNaN(iterable.length)) {
            var index = -1;
            return {
              next: function () {
                while (++index < iterable.length) {
                  if (Object.prototype.hasOwnProperty.call(iterable, index))
                    return { value: iterable[index], done: false };
                }
                return { value: undefined, done: true };
              },
            };
          }
        }
        return { next: function () { return { value: undefined, done: true }; } };
      }
      module.exports = {
        wrap: wrapGenerator,
        tryCatch: tryCatch,
        GeneratorFunction: GeneratorFunction,
        GeneratorFunctionPrototype: GeneratorFunctionPrototype,
        Generator: GeneratorWrapper,
        AsyncIterator: AsyncIterator,
        isGeneratorFunction: function (genFunc) {
          var ctor = typeof genFunc === "function" && genFunc.constructor;
          return ctor === GeneratorFunction || (ctor.displayName || ctor.name) === "GeneratorFunction";
        },
        mark: function (genFunc) {
          if (Object.setPrototypeOf) Object.setPrototypeOf(genFunc, GeneratorFunctionPrototype);
          else {
            genFunc.__proto__ = GeneratorFunctionPrototype;
            if (!(Symbol.toStringTag in genFunc))
              genFunc[Symbol.toStringTag] = "GeneratorFunction";
          }
          genFunc.prototype = Object.create(GeneratorWrapper.prototype);
          return genFunc;
        },
        awrap: function (arg) {
          return { __await: arg };
        },
        async: function (innerFn, outerFn, selfObj, tryLocsList) {
          var iter = new AsyncIterator(wrapGenerator(innerFn, outerFn, selfObj, tryLocsList));
          return iter._invoke("next", undefined).then(function (result) {
            return result.done ? result.value : iter._invoke("next", undefined);
          });
        },
        keys: function (obj) {
          var keys = [];
          for (var key in obj) keys.push(key);
          keys.reverse();
          return function nextKey() {
            while (keys.length) {
              var key = keys.pop();
              if (key in obj) return { value: key, done: false };
            }
            return { value: undefined, done: true };
          };
        },
        values: values,
      };
    },
    function (module, exports) {
      window.initPokiBridge = function (bridgeName) {
        if (window.pokiReady || window.pokiAdBlock)
          window.pokiReady
            ? window.unityGame.SendMessage(bridgeName, "ready")
            : window.pokiAdBlock && window.unityGame.SendMessage(bridgeName, "adblock");
        else window.pokiBridge = bridgeName;
        window.commercialBreak = function () {
          PokiSDK.commercialBreak().then(function () {
            window.unityGame.SendMessage(bridgeName, "commercialBreakCompleted");
          });
        };
        window.rewardedBreak = function () {
          PokiSDK.rewardedBreak().then(function (rewardValue) {
            window.unityGame.SendMessage(bridgeName, "rewardedBreakCompleted", rewardValue.toString());
          });
        };
      };
    },
  ]);
  