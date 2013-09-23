require ["./build/js/histogram", "./build/js/job_queue", "./build/js/bower_components/promise/promise"], (Histogram, JobQueue, Promise) ->

  jobQueue = new JobQueue()
  ajax = new XMLHttpRequest();

  ajax.open("GET", "./images/images.json", true);
  ajax.responseType = "json";
  ajax.addEventListener "load", (evt) ->

    images  = ajax.response
    for imageSrc in images
      jobQueue.enqueue processImage, imageSrc

  ajax.send()

  processImage = (imageSrc) ->

    promise = new window.Promise()

    image = new Image()
    image.src = imageSrc
    image.addEventListener "load", ->

      width = image.width
      height = image.height

      elements = appendImageAndCanvasGroup(width, height)
      elements.originalImage.src = image.src

      canvas = elements.modifiedImage
      canvas.width = width
      canvas.height = height

      ctx = canvas.getContext("2d")
      ctx.drawImage(image, 0, 0, width, height)
      imageData = ctx.getImageData(0, 0, width, height)
      pixelData = imageData.data

      #draw the RGB histogram for visual reference
      histogram = new Histogram(pixelData)
      histogram.draw(elements.originalHistogram)

      ColorBalanceWorker = new Worker("./build/js/color_balance_worker.js")
      ColorBalanceWorker.addEventListener "message", (evt) =>
        modifiedPixels = evt.data

        #Draw the modified histogram too
        modifiedHistogram = new Histogram(modifiedPixels)
        modifiedHistogram.draw(elements.modifiedHistogram)

        #paint the modified image
        imageData.data.set(modifiedPixels)
        ctx.putImageData(imageData, 0, 0, 0, 0, width, height)

        #done
        promise.fulfil(true)

      ColorBalanceWorker.postMessage(pixelData)

    promise


  appendImageAndCanvasGroup = (width, height) ->

    #original iamge and modified image elements
    container = document.getElementById("container")
    div = document.createElement("div")
    container.appendChild(div)

    image = document.createElement("img")
    modifiedImage = document.createElement("canvas")
    div.appendChild(image)
    div.appendChild(modifiedImage)

    #modified image histgram and  original histogram
    div = document.createElement("div")
    container.appendChild(div)

    histogram = document.createElement("canvas")
    histogram.id = "histogram"
    histogram.width = width
    histogram.height = height
    div.appendChild(histogram)

    modifiedHistogram = document.createElement("canvas")
    modifiedHistogram.id = "histogram"
    modifiedHistogram.width = width
    modifiedHistogram.height = height
    div.appendChild(modifiedHistogram)

    return {
      "originalImage": image
      "originalHistogram": histogram
      "modifiedImage": modifiedImage
      "modifiedHistogram": modifiedHistogram
    }
